import Role from "../models/roles.model.js";
import loggingService from "../../../services/logging.service.js";

const logger = loggingService.getModuleLogger("RolesService");

export const getAllRoles = async () => {
  try {
    return await Role.find();
  } catch (error) {
    logger.error("Error fetching roles:", error);
    throw error;
  }
};

export const createRole = async (data) => {
  try {
    const role = new Role(data);
    return await role.save();
  } catch (error) {
    logger.error("Error creating role:", error);
    throw error;
  }
};

export const getRoleById = async (id) => {
  try {
    return await Role.findById(id);
  } catch (error) {
    logger.error(`Error fetching role ${id}:`, error);
    throw error;
  }
};

export const updateRoleById = async (id, data) => {
  try {
    return await Role.findByIdAndUpdate(id, data, { new: true });
  } catch (error) {
    logger.error(`Error updating role ${id}:`, error);
    throw error;
  }
};

export const deleteRoleById = async (id) => {
  try {
    return await Role.findByIdAndDelete(id);
  } catch (error) {
    logger.error(`Error deleting role ${id}:`, error);
    throw error;
  }
};

export const getSpecificPermission = async (
  roleId,
  moduleName,
  permissionName
) => {
  try {
    const role = await Role.findById(roleId);
    if (!role) throw new Error("Role not found");

    const modulePerms = role.permissions.get(moduleName);
    if (!modulePerms) throw new Error("Module not found");

    const permission = modulePerms.get(permissionName);
    if (permission === undefined) throw new Error("Permission not found");

    return { [permissionName]: permission };
  } catch (error) {
    logger.error("Error getting specific permission:", error);
    throw error;
  }
};

export const addSpecificPermission = async (
  roleId,
  moduleName,
  permissionName,
  value
) => {
  try {
    const role = await Role.findById(roleId);
    if (!role) throw new Error("Role not found");

    // Ensure permissions is a Map
    if (!(role.permissions instanceof Map)) {
      role.permissions = new Map(Object.entries(role.permissions || {}));
    }

    // Create module if it doesn't exist
    if (!role.permissions.has(moduleName)) {
      role.permissions.set(moduleName, new Map());
    }

    // Add/Update the specific permission
    role.permissions.get(moduleName).set(permissionName, value);

    // Convert Map to plain object for proper MongoDB storage
    const permissionsObject = {};
    for (const [module, modulePermissions] of role.permissions) {
      permissionsObject[module] = Object.fromEntries(modulePermissions);
    }
    role.permissions = permissionsObject;

    return await role.save();
  } catch (error) {
    logger.error("Error adding specific permission:", error);
    throw error;
  }
};


export const updatePermissions = async (id, permissions) => {
  try {
    const role = await Role.findById(id);
    if (!role) throw new Error("Role not found");

    Object.entries(permissions).forEach(([module, perms]) => {
      if (!role.permissions.has(module)) {
        role.permissions.set(module, new Map());
      }
      Object.entries(perms).forEach(([perm, value]) => {
        role.permissions.get(module).set(perm, value);
      });
      role.markModified(`permissions.${module}`);
    });

    return await role.save();
  } catch (error) {
    logger.error(`Error updating permissions for role ${id}:`, error);
    throw error;
  }
};

/**
 * Add multiple permissions to multiple modules in a role.
 * @param {string} roleId - Role ID.
 * @param {Object} modulesPermissions - Object containing module names and their associated permissions.
 * @returns {Promise<Object>} Updated role.
 */
export const addMultiplePermissions = async (roleId, modulesPermissions) => {
  try {
    const role = await Role.findById(roleId);
    if (!role) throw new Error("Role not found");

    // Iterate through modules and permissions to update
    for (const [moduleName, permissions] of Object.entries(
      modulesPermissions
    )) {
      if (!role.permissions.has(moduleName)) {
        role.permissions.set(moduleName, new Map());
      }

      Object.entries(permissions).forEach(([permission, value]) => {
        role.permissions.get(moduleName).set(permission, value);
      });
      role.markModified(`permissions.${moduleName}`);
    }

    return await role.save();
  } catch (error) {
    logger.error("Error adding multiple permissions:", error);
    throw error;
  }
};

/**
 * Delete multiple permissions from a module in a role.
 * @param {string} roleId - Role ID.
 * @param {string} moduleName - Module name.
 * @param {Array<string>} permissions - Permissions to delete, e.g., ["read", "write"].
 * @returns {Promise<Object>} Updated role.
 */
export const deleteMultiplePermissions = async (
  roleId,
  moduleName,
  permissions
) => {
  try {
    const role = await Role.findById(roleId);
    if (!role) throw new Error("Role not found");

    const modulePerms = role.permissions.get(moduleName);
    if (!modulePerms) throw new Error("Module not found");

    permissions.forEach((permission) => {
      modulePerms.delete(permission);
    });

    if (modulePerms.size === 0) {
      role.permissions.delete(moduleName);
    } else {
      role.markModified(`permissions.${moduleName}`);
    }

    return await role.save();
  } catch (error) {
    logger.error("Error deleting multiple permissions:", error);
    throw error;
  }
};

export const getModulePermissions = async (id, moduleName) => {
  try {
    const role = await Role.findById(id);
    if (!role) throw new Error("Role not found");
    return role.permissions.get(moduleName) || new Map();
  } catch (error) {
    logger.error(`Error fetching module permissions:`, error);
    throw error;
  }
};

export const updateSpecificPermission = async (
  roleId,
  moduleName,
  permissionName,
  value
) => {
  try {
    const role = await Role.findById(roleId);
    if (!role) throw new Error("Role not found");

    // Ensure permissions is a Map
    if (!(role.permissions instanceof Map)) {
      role.permissions = new Map(Object.entries(role.permissions || {}));
    }

    // Create module if it doesn't exist
    if (!role.permissions.has(moduleName)) {
      role.permissions.set(moduleName, new Map());
    }

    const modulePerms = role.permissions.get(moduleName);
    modulePerms.set(permissionName, value);

    // Convert Map to plain object for MongoDB
    const permissionsObject = {};
    for (const [module, modulePermissions] of role.permissions) {
      permissionsObject[module] = Object.fromEntries(modulePermissions);
    }
    role.permissions = permissionsObject;

    // Mark as modified
    role.markModified('permissions');

    return await role.save();
  } catch (error) {
    logger.error("Error updating specific permission:", error);
    throw error;
  }
};

export const deleteSpecificPermission = async (
  roleId,
  moduleName,
  permissionName
) => {
  try {
    const role = await Role.findById(roleId);
    if (!role) throw new Error("Role not found");

    // Ensure permissions is a Map
    if (!(role.permissions instanceof Map)) {
      role.permissions = new Map(Object.entries(role.permissions || {}));
    }

    // Check if module exists
    if (!role.permissions.has(moduleName)) {
      throw new Error("Module not found");
    }

    const modulePerms = role.permissions.get(moduleName);
    
    // Delete the specific permission
    modulePerms.delete(permissionName);

    // If module has no permissions, remove the module
    if (modulePerms.size === 0) {
      role.permissions.delete(moduleName);
    }

    // Convert Map to plain object for MongoDB
    const permissionsObject = {};
    for (const [module, modulePermissions] of role.permissions) {
      permissionsObject[module] = Object.fromEntries(modulePermissions);
    }
    role.permissions = permissionsObject;

    // Mark permissions as modified
    role.markModified('permissions');

    return await role.save();
  } catch (error) {
    logger.error("Error deleting specific permission:", error);
    throw error;
  }
};