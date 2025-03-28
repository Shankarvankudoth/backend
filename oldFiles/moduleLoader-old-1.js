import fs from "fs/promises";
import path from "path";
import { pathToFileURL } from "url";
import Ajv from "ajv";
import loggingService from "../services/logging.service.js";

const logger = loggingService.getModuleLogger("ModuleLoader");
const ajv = new Ajv();

// JSON Schema for manifest validation
const manifestSchema = {
  type: "object",
  properties: {
    dependencies: { type: "array", items: { type: "string" } },
    routes: { type: "array", items: { type: "string" } }
  },
  required: ["routes"],
  additionalProperties: true
};

const validateManifest = ajv.compile(manifestSchema);

const loadedModules = new Map();

export const loadModules = async (
  app,
  baseDir,
  config,
  haltOnCriticalError = false
) => {
  const resolveDependencies = async (
    module,
    manifestCache,
    resolved = new Set(),
    stack = []
  ) => {
    if (resolved.has(module)) return;

    if (stack.includes(module)) {
      logger.error(
        `Circular dependency detected: ${stack.join(" -> ")} -> ${module}`
      );
      throw new Error(`Circular dependency detected for module "${module}"`);
    }

    const manifest = manifestCache[module];
    if (!manifest) {
      logger.error(`Manifest for module "${module}" not found.`);
      throw new Error(`Manifest for module "${module}" not found.`);
    }

    stack.push(module);

    if (manifest.dependencies) {
      for (const dependency of manifest.dependencies) {
        if (!loadedModules.has(dependency)) {
          await resolveDependencies(dependency, manifestCache, resolved, stack);
        } else {
          logger.debug(
            `Skipping already loaded dependency "${dependency}" for module "${module}"`
          );
        }
      }
    }

    stack.pop();
    resolved.add(module);
  };

  const loadManifests = async (modulesDir, modules) => {
    const manifests = {};
    await Promise.all(
      modules.map(async (module) => {
        const manifestPath = path.join(modulesDir, module, "manifest.json");
        try {
          const manifestContent = await fs.readFile(manifestPath, "utf8");
          const manifest = JSON.parse(manifestContent);

          if (!validateManifest(manifest)) {
            logger.error(
              `Invalid manifest for module "${module}":`,
              validateManifest.errors
            );
            throw new Error(`Invalid manifest for module "${module}"`);
          }

          manifests[module] = manifest;
          loadedModules.add(module);
          logger.info(`Module "${module}" registered as loaded.`);
        } catch (error) {
          logger.error(`Error loading manifest for module "${module}":`, error);
          if (haltOnCriticalError) throw error;
        }
      })
    );
    return manifests;
  };

  const registerRoutes = async (app, baseDir, module, manifest, isCore) => {
    const moduleDir = isCore
      ? path.join(baseDir, "core", module)
      : path.join(baseDir, "modules", module);

    logger.debug(`Registering routes for module "${module}"...`);
    if (!manifest.routes || manifest.routes.length === 0) {
      logger.warn(`No routes defined for module "${module}"`);
      return;
    }

    await Promise.all(
      manifest.routes.map(async (routeFile) => {
        try {
          const normalizedRouteFile = routeFile.startsWith("/")
            ? routeFile.slice(1)
            : routeFile;
          const routePath = path.join(moduleDir, normalizedRouteFile);
          const route = (await import(pathToFileURL(routePath))).default;

          app.use(route.path, route.router);
          logger.info(
            `Route "${route.path}" registered for module "${module}".`
          );
        } catch (error) {
          logger.error(
            `Error registering route "${routeFile}" for module "${module}":`,
            error
          );
          if (haltOnCriticalError) throw error;
        }
      })
    );
  };

  try {
    logger.info("Loading core modules...");
    const coreModulesDir = path.join(baseDir, "core");

    console.log("Core module sirectory fpound", coreModulesDir);

    const coreModules = await fs.readdir(coreModulesDir);
    console.log("Core modules fpound are", coreModules);

    const coreManifests = await loadManifests(coreModulesDir, coreModules);

    const resolvedCoreModules = new Set();
    await Promise.all(
      coreModules.map((module) =>
        resolveDependencies(module, coreManifests, resolvedCoreModules)
      )
    );

    await Promise.all(
      Array.from(resolvedCoreModules).map((module) =>
        registerRoutes(app, baseDir, module, coreManifests[module], true)
      )
    );

    logger.info("Loading application modules...");
    const enabledModules = config.enabledModules || [];
    const modulesDir = path.join(baseDir, "modules");
    const moduleManifests = {
      ...coreManifests,
      ...(await loadManifests(modulesDir, enabledModules))
    };

    const resolvedAppModules = new Set();
    await Promise.all(
      enabledModules.map((module) =>
        resolveDependencies(module, moduleManifests, resolvedAppModules)
      )
    );

    const appModulesToLoad = [...resolvedAppModules].filter(
      (module) => !loadedModules.has(module)
    );

    await Promise.all(
      appModulesToLoad.map((module) =>
        registerRoutes(app, baseDir, module, moduleManifests[module], false)
      )
    );

    logger.info("Module loading complete.");
  } catch (error) {
    logger.error("Critical error during module loading:", error);
    if (haltOnCriticalError) {
      throw error;
    }
  }
};


// Load a single module
const loadModule = async (app, baseDir, moduleName) => {
  try {
    const moduleDir = path.join(baseDir, "modules", moduleName);
    const manifestPath = path.join(moduleDir, "manifest.json");

    if (!fs.existsSync(manifestPath)) {
      logger.error(`Manifest not found for module "${moduleName}"`);
      return null;
    }

    const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));

    // Register routes
    if (manifest.routes) {
      for (const routeFile of manifest.routes) {
        const routePath = path.join(moduleDir, routeFile);
        const route = (await import(pathToFileURL(routePath))).default;
        app.use(route.path, route.router);
      }
    }

    // Call `init` if defined
    if (manifest.init) {
      const initModule = (await import(pathToFileURL(path.join(moduleDir, manifest.init)))).default;
      await initModule(app);
    }

    logger.info(`Module "${moduleName}" loaded successfully.`);
    return { manifest, moduleDir }; // Return module info for unloading later
  } catch (error) {
    logger.error(`Error loading module "${moduleName}":`, error);
    return null;
  }
};

// Unload a single module
const unloadModule = async (app, moduleName, moduleInstance) => {
  try {
    logger.info(`Unloading module "${moduleName}"...`);

    const { manifest, moduleDir } = moduleInstance;

    // Call `unload` if defined
    if (manifest.unload) {
      const unloadModule = (await import(pathToFileURL(path.join(moduleDir, manifest.unload)))).default;
      await unloadModule(app);
    }

    // Deregister routes
    if (manifest.routes) {
      for (const routeFile of manifest.routes) {
        const routePath = path.join(moduleDir, routeFile);
        const route = (await import(pathToFileURL(routePath))).default;

        // Logic to remove routes
        app._router.stack = app._router.stack.filter(
          (layer) => layer.name !== route.router.name
        );
      }
    }

    loadedModules.delete(moduleName);
    logger.info(`Module "${moduleName}" unloaded successfully.`);
  } catch (error) {
    logger.error(`Error unloading module "${moduleName}":`, error);
  }
};
