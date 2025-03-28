import fs from "fs";
import path from "path";
import { pathToFileURL } from "url";
import loggingService from "../services/logging.service.js";

const logger = loggingService.getModuleLogger("ModuleLoader");

export const loadModules = async (app, baseDir, config) => {
  // Track all loaded modules (core + dependencies)
  const loadedModules = new Set();

  //   Helper function for resolving duplicate dependencies loading
  const resolveDependencies = (module, manifestCache, resolved = new Set()) => {
    if (resolved.has(module)) return;

    const manifest = manifestCache[module];
    if (!manifest) {
      logger.error(`Manifest for module "${module}" not found.`);
      throw new Error(`Manifest for module "${module}" not found.`);
    }

    if (manifest.dependencies) {
      for (const dependency of manifest.dependencies) {
        // Skip if dependency is already loaded
        if (!loadedModules.has(dependency)) {
          resolveDependencies(dependency, manifestCache, resolved);
        } else {
          logger.info(
            `Skipping already loaded dependency "${dependency}" for module "${module}"`
          );
        }
      }
    }

    resolved.add(module);
  };

  logger.info("Starting to load core modules...");

  // Load Core Modules
  const coreModulesDir = path.join(baseDir, "core");
  const coreModules = fs.readdirSync(coreModulesDir);

  const coreManifests = {};
  for (const module of coreModules) {
    const manifestPath = path.join(coreModulesDir, module, "manifest.json");
    if (fs.existsSync(manifestPath)) {
      try {
        coreManifests[module] = JSON.parse(
          fs.readFileSync(manifestPath, "utf8")
        );
        // Add to loadedModules as we process core modules
        loadedModules.add(module);
        logger.info(`Core module "${module}" registered as loaded`);
      } catch (error) {
        logger.error(
          `Error parsing manifest for core module "${module}":`,
          error
        );
      }
    }
  }

  const resolvedCoreModules = new Set();
  for (const module of coreModules) {
    try {
      resolveDependencies(module, coreManifests, resolvedCoreModules);
    } catch (error) {
      logger.error(
        `Error resolving dependencies for core module "${module}":`,
        error
      );
    }
  }

  // Register core module routes
  for (const module of resolvedCoreModules) {
    const manifest = coreManifests[module];
    if (manifest) {
      try {
        logger.info(`Registering routes for core module "${module}"...`);
        await registerRoutes(app, baseDir, module, manifest, true);
        logger.info(
          `Successfully registered routes for core module "${module}".`
        );
      } catch (error) {
        logger.error(
          `Error registering routes for core module "${module}":`,
          error
        );
      }
    }
  }

  logger.info("Starting to load application modules...");

  // Load Application Modules
  const enabledModules = config.enabledModules || [];
  const moduleManifests = { ...coreManifests }; // Include core manifests for dependency resolution

  for (const module of enabledModules) {
    const manifestPath = path.join(baseDir, "modules", module, "manifest.json");
    if (fs.existsSync(manifestPath)) {
      try {
        moduleManifests[module] = JSON.parse(
          fs.readFileSync(manifestPath, "utf8")
        );
      } catch (error) {
        logger.error(
          `Error parsing manifest for application module "${module}":`,
          error
        );
      }
    }
  }

  const resolvedAppModules = new Set();
  for (const module of enabledModules) {
    try {
      // Only resolve if not already loaded as core
      if (!loadedModules.has(module)) {
        resolveDependencies(module, moduleManifests, resolvedAppModules);
      } else {
        logger.info(`Skipping already loaded module "${module}"`);
      }
    } catch (error) {
      logger.error(
        `Error resolving dependencies for application module "${module}":`,
        error
      );
    }
  }

  // Filter out any core modules from resolved app modules
  const appModulesToLoad = [...resolvedAppModules].filter(
    (module) => !loadedModules.has(module)
  );

  // Register application module routes
  for (const module of appModulesToLoad) {
    const manifest = moduleManifests[module];
    if (manifest) {
      try {
        logger.info(`Registering routes for application module "${module}"...`);
        await registerRoutes(app, baseDir, module, manifest, false);
        logger.info(
          `Successfully registered routes for application module "${module}".`
        );
      } catch (error) {
        logger.error(
          `Error registering routes for application module "${module}":`,
          error
        );
      }
    }
  }

  logger.info("Modules loading complete.");
};

const registerRoutes = async (app, baseDir, module, manifest, isCore) => {
  const moduleDir = isCore
    ? path.join(baseDir, "core", module)
    : path.join(baseDir, "modules", module);

  logger.info(`Module type: ${isCore ? "core" : "application"}`);
  logger.info(`Base directory: ${baseDir}`);
  logger.info(`Module directory: ${moduleDir}`);

  if (!fs.existsSync(moduleDir)) {
    logger.error(`Module directory not found: ${moduleDir}`);
    return;
  }

  if (!manifest.routes) {
    logger.warn(`No routes defined in manifest for module "${module}"`);
    return;
  }

  for (const routeFile of manifest.routes) {
    try {
      // Remove leading slash if present in route file path
      const normalizedRouteFile = routeFile.startsWith("/")
        ? routeFile.slice(1)
        : routeFile;
      const routePath = path.join(moduleDir, normalizedRouteFile);
      logger.info(`Looking for route file at: ${routePath}`);

      if (!fs.existsSync(routePath)) {
        logger.error(`Route file not found: ${routePath}`);
        continue;
      }

      const route = (await import(pathToFileURL(routePath))).default;
      app.use(route.path, route.router);
      logger.info(
        `Successfully loaded route "${route.path}" for module "${module}".`
      );
    } catch (error) {
      logger.error(
        `Error loading route file "${routeFile}" for module "${module}":`,
        error
      );
    }
  }
};
