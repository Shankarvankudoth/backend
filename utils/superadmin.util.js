import mongoose from "mongoose";
import Role from "../core/security/models/roles.model.js";
import Project from "../modules/taskmanagement/models/project.model.js";
import User from "../core/security/models/user.model.js";
import loggingService from "../services/logging.service.js";

mongoose.set("strictQuery", false);

// Initialize the logger for superAdminService
const logger = loggingService.getModuleLogger("Super Admin Creation Utility");

// Super Admin details
const superAdminDetails = {
  fullname: "Super Admin",
  username: "superadmin-isc",
  email: "superadmin@isc.guru",
  password: "Welcome1",
  phoneNumber: "9676855959",
  designation: "Super Admin",
  role: "owner",
  branch: [
    "rajajiNagar1stBlock",
    "rajajiNagar4thBlock",
    "rajajiNagarPUC",
    "malleshwaram",
    "malleshwaramPUC",
    "basaveshwarNagar",
    "basaveshwarNagarPUC",
    "nagarbhavi"
  ],
  isActive: true,
  version: 1
};

const createSuperAdmin = async () => {
  logger.info("Starting super admin creation process.");

  try {
    // Ensure the super admin role exists
    logger.debug("Checking for super admin role");
    let superAdminRole = await Role.findOne({ roleName: "owner" });

    if (!superAdminRole) {
      logger.error("Owner role not found. Creating roles...");
      // You might want to throw or create a default role here
      throw new Error("Owner role not found. Please initialize roles.");
    }

    logger.debug("Checking for existing super admin", {
      email: superAdminDetails.email,
      username: superAdminDetails.username
    });

    const existingSuperAdmin = await User.findOne({
      email: superAdminDetails.email,
    });

    if (!existingSuperAdmin) {
      logger.info("Existing Super Admin not found. Creating a new super admin.");

      // Map the branch-role associations
      const branchAndRole = superAdminDetails.branch.map(branchName => ({
        branchName,
        roleId: superAdminRole._id // Role ID reference
      }));

      // Create a new user directly with the schema structure
      const newUser = new User({
        email: superAdminDetails.email,
        username: superAdminDetails.username,
        password: superAdminDetails.password,
        roles: {
          branchAndRole: branchAndRole
        },
        isActive: superAdminDetails.isActive,
        version: superAdminDetails.version
      });

      // Debug logging
      logger.debug("User object before save:", {
        email: newUser.email,
        rolesObject: JSON.stringify(newUser.roles)
      });

      const createdSuperAdmin = await newUser.save();

      // Create a project for the user (self-assigned tasks)
      const projectData = {
        title: "Self Assigned",
        description: "For assigning self tasks",
        owner: superAdminDetails.username,
        assignee: [superAdminDetails.username],
        notes: [],
        task: [],
        branch: superAdminDetails.branch,
        targetDate: null
      };

      const selfAssignedProject = await Project(projectData).save();

      // Log success
      logger.info(`Super Admin created successfully: ${createdSuperAdmin._id}`);
      logger.info(`Self-assigned project created successfully: ${selfAssignedProject._id}`);
    } else {
      logger.info("Super Admin already exists.");
      return;
    }
  } catch (error) {
    logger.error("Error creating super admin", {
      error: error.message,
      stack: error.stack
    });
    throw error;
  }
};

export default createSuperAdmin;