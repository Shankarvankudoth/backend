import Role from "../core/security/models/roles.model.js";
import loggingService from "../services/logging.service.js";

const logger = loggingService.getModuleLogger("Role Utils");

// Define all modules
const MODULES = [
  "configuration",
  "notifications",
  "search",
  "security",
  "administration",
  "admissions",
  "assessments",
  "attendance",
  "batches",
  "branches",
  "classrooms",
  "courses",
  "enquiries",
  "feedback",
  "fees",
  "monitoring",
  "reports",
  "schedules",
  "schools",
  "students",
  "subjects",
  "taskmanagement"
];

// Define default roles and their permissions
const defaultRoles = [
  {
    roleName: "owner",
    permissions: MODULES.reduce((acc, module) => {
      acc.set(
        module,
        new Map([
          ["New", true],
          ["Edit", true],
          ["Delete", true],
          ["Show", true]
        ])
      );
      return acc;
    }, new Map())
  },
  {
    roleName: "admin",
    permissions: MODULES.reduce((acc, module) => {
      acc.set(
        module,
        module === "securityManagement"
          ? new Map([
              ["New", false],
              ["Edit", false],
              ["Delete", false],
              ["Show", false]
            ])
          : new Map([
              ["New", true],
              ["Edit", true],
              ["Delete", true],
              ["Show", true]
            ])
      );
      return acc;
    }, new Map())
  },
  {
    roleName: "manager",
    permissions: MODULES.reduce((acc, module) => {
      acc.set(
        module,
        module === "securityManagement"
          ? new Map([
              ["New", false],
              ["Edit", false],
              ["Delete", false],
              ["Show", false]
            ])
          : new Map([
              ["New", true],
              ["Edit", true],
              ["Delete", false],
              ["Show", true]
            ])
      );
      return acc;
    }, new Map())
  },
  {
    roleName: "faculty",
    permissions: MODULES.reduce((acc, module) => {
      acc.set(
        module,
        module === "securityManagement"
          ? new Map([
              ["New", false],
              ["Edit", false],
              ["Delete", false],
              ["Show", false]
            ])
          : new Map([
              ["New", true],
              ["Edit", true],
              ["Delete", false],
              ["Show", true]
            ])
      );
      return acc;
    }, new Map())
  },
  {
    roleName: "staff",
    permissions: MODULES.reduce((acc, module) => {
      acc.set(
        module,
        module === "securityManagement"
          ? new Map([
              ["New", false],
              ["Edit", false],
              ["Delete", false],
              ["Show", false]
            ])
          : new Map([
              ["New", false],
              ["Edit", false],
              ["Delete", false],
              ["Show", true]
            ])
      );
      return acc;
    }, new Map())
  },
  {
    roleName: "receptionist",
    permissions: MODULES.reduce((acc, module) => {
      acc.set(
        module,
        module === "securityManagement"
          ? new Map([
              ["New", false],
              ["Edit", false],
              ["Delete", false],
              ["Show", false]
            ])
          : new Map([
              ["New", false],
              ["Edit", false],
              ["Delete", false],
              ["Show", true]
            ])
      );
      return acc;
    }, new Map())
  },
  {
    roleName: "student",
    permissions: MODULES.reduce((acc, module) => {
      acc.set(
        module,
        module === "securityManagement"
          ? new Map([
              ["New", false],
              ["Edit", false],
              ["Delete", false],
              ["Show", false]
            ])
          : module === "fees"
          ? new Map([
              ["New", true],
              ["Edit", true],
              ["Delete", false],
              ["Show", true]
            ])
          : new Map([
              ["New", false],
              ["Edit", false],
              ["Delete", false],
              ["Show", true]
            ])
      );
      return acc;
    }, new Map())
  },
  {
    roleName: "parent",
    permissions: MODULES.reduce((acc, module) => {
      acc.set(
        module,
        module === "securityManagement"
          ? new Map([
              ["New", false],
              ["Edit", false],
              ["Delete", false],
              ["Show", false]
            ])
          : module === "fees"
          ? new Map([
              ["New", true],
              ["Edit", true],
              ["Delete", false],
              ["Show", true]
            ])
          : new Map([
              ["New", false],
              ["Edit", false],
              ["Delete", false],
              ["Show", true]
            ])
      );
      return acc;
    }, new Map())
  },
  {
    roleName: "accountant",
    permissions: MODULES.reduce((acc, module) => {
      acc.set(
        module,
        module === "fees"
          ? new Map([
              ["New", true],
              ["Edit", true],
              ["Delete", false],
              ["Show", true]
            ])
          : new Map([
              ["New", false],
              ["Edit", false],
              ["Delete", false],
              ["Show", true]
            ])
      );
      return acc;
    }, new Map())
  }
];

/**
 * Saves default roles to the database.
 * If a role already exists, it updates the permissions.
 */
const saveDefaultRoles = async () => {
  logger.info("Starting to save default roles into the database...");

  try {
    for (const role of defaultRoles) {
      const existingRole = await Role.findOne({ roleName: role.roleName });

      if (existingRole) {
        logger.info(
          `Role '${role.roleName}' already exists. Updating permissions...`
        );
        existingRole.permissions = role.permissions;
        await existingRole.save();
      } else {
        logger.info(`Creating role '${role.roleName}'...`);
        const newRole = new Role(role);
        await newRole.save();
      }
    }

    logger.info("Default roles saved successfully.");
  } catch (error) {
    logger.error("Error saving default roles:", error);
    throw error;
  }
};

export default saveDefaultRoles;
