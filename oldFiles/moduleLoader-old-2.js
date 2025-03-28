import fs from "fs/promises";
import path from "path";
import { pathToFileURL } from "url";
import Ajv from "ajv";
import loggingService from "../services/logging.service.js";

const logger = loggingService.getModuleLogger("ModuleLoader");
const ajv = new Ajv();

const manifestSchema = {
  type: "object",
  properties: {
    name: { type: "string" },
    version: { type: "string" },
    description: { type: "string" },
    dependencies: { type: "array", items: { type: "string" } },
    routes: { type: "array", items: { type: "string" } }
  },
  required: ["routes"],
  additionalProperties: false
};

const validateManifest = ajv.compile(manifestSchema);

const activeModules = new Map();

const loadModules = async (
  app,
  baseDir,
  config,
  haltOnCriticalError = false
) => {
  const loadedModules = new Set();

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

    const registeredRoutes = [];

    await Promise.all(
      manifest.routes.map(async (routeFile) => {
        try {
          const normalizedRouteFile = routeFile.startsWith("/")
            ? routeFile.slice(1)
            : routeFile;
          const routePath = path.join(moduleDir, normalizedRouteFile);
          const route = (await import(pathToFileURL(routePath))).default;

          app.use(route.path, route.router);
          registeredRoutes.push(route.path);
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

    activeModules.set(module, { manifest, registeredRoutes });
  };

  const unregisterModule = async (app, module) => {
    const moduleInfo = activeModules.get(module);
    if (!moduleInfo) {
      logger.warn(`Module "${module}" is not currently active.`);
      return;
    }

    logger.info(`Unregistering module "${module}"...`);

    for (const routePath of moduleInfo.registeredRoutes) {
      app._router.stack = app._router.stack.filter(
        (layer) => !(layer.route && layer.route.path === routePath)
      );
      logger.info(`Route "${routePath}" unregistered for module "${module}".`);
    }

    activeModules.delete(module);
  };

  try {
    logger.info("Loading core modules...");
    const coreModulesDir = path.join(baseDir, "core");
    const coreModules = await fs.readdir(coreModulesDir);
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

  return { unregisterModule };
};

export { loadModules };
