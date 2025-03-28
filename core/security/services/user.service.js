import joi from "joi";
import Project from "../../../modules/taskmanagement/models/project.model.js";
import { createError } from "../../../services/errorhandling.service.js";
import loggingService from "../../../services/logging.service.js";
import Role from "../models/roles.model.js";
import mongoose from "mongoose";
import UserModel from "../models/user.model.js";
// Initialize the logger for the UserService
const logger = loggingService.getModuleLogger("UserService");

// Base schema for user validation
const baseSchema = {
  fullname: joi.string().min(3).max(30).required(),
  username: joi.string().min(3).max(30).required(),
  email: joi.string().min(3).max(100).required(),
  password: joi.string().min(3).max(30).required(),
  phoneNumber: joi.string().optional(),
  designation: joi.string().optional(),
  role: joi.string().min(3).max(30).required(),
  branch: joi.array().items(joi.string().min(3).max(30)).required(),
  isActive: joi.boolean().optional(),
  version: joi.number().default(1)
};

// Helper function to get schema by version
const getUserSchema = (version) => {
  const schemas = {
    1: joi.object(baseSchema),
    2: joi.object({ ...baseSchema, extraFieldV2: joi.string().optional() })
  };
  return schemas[version] || createError(400, "Invalid version");
};

/**
 * Fetch all users
 * Logs the operation and handles success or error responses.
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {function} next - Express next middleware function.
 * @param {object} User - User model for database interaction.
 */
export const getAllUsers = async (req, res, next, User) => {
  try {
    logger.info("Fetching all users");
    const users = await User.find();
    logger.debug("Fetched all users successfully", { count: users.length });
    res.status(200).json(users);
  } catch (error) {
    logger.error("Error fetching users", { error: error.message });
    next(createError(500, "Internal server error"));
  }
};

/**
 * Create a new user
 * Logs the operation, validates the input, and assigns permissions based on the role.
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @param {function} next - Express next middleware function
 * @param {object} User - User model for database interaction
 */
export const createUser = async (req, res, next, User) => {
  try {
    const { error, value } = getUserSchema(req.body.version || 1).validate(req.body);
    if (error) {
      logger.warn("Validation failed", {
        validationError: error.details[0].message
      });
      return next(createError(422, error.details[0].message)); // early exit
    }

    logger.info("Checking if user already exists");
    const existingUser = await User.findOne({
      $or: [
        { email: value.email.toLowerCase() },
        { username: value.username.toLowerCase() }
      ]
    });
    if (existingUser) {
      logger.warn("User already exists", {
        email: value.email,
        username: value.username
      });
      return next(createError(400, "User already exists with this username or email"));
    }

    logger.info("Fetching role for the user", { roleName: value.role });
    const role = await Role.findOne({ roleName: value.role });
    if (!role) {
      logger.warn("Role not found", { roleName: value.role });
      return next(createError(400, `Role '${value.role}' not found`));
    }

    const userData = {
      ...value,
      role: value.role, // Store role value from req.body
      permissions: role.permissions // Assign permissions directly from the role
    };

    logger.info("Creating a new user");
    const user = await new User(userData).save();

    // Create a project for the user (self-assigned tasks)
    const projectData = {
      title: "Self Assigned",
      description: "For assigning self tasks",
      assignee: [userData.username],
      owner: userData.username,
      notes: [],
      task: [],
      branch: userData.branch,
      targetDate: null
    };
    const selfAssignedProject = await new Project(projectData).save();

    logger.info("Created new user", { userId: user._id });
    logger.info("Created self assigned project for user ", {
      userId: user._id,
      projectid: selfAssignedProject._id
    });

    if (!res.headersSent) {  // ensure no further responses after sending
      res.status(201).json({ user, roleName: role.roleName, permissions: role.permissions });
    }
  } catch (error) {
    logger.error("Error creating user", { error: error.message });
    if (!res.headersSent) {
      next(createError(500, "Internal server error"));
    }
  }
};


/**
 * Get a user by ID
 * Logs the operation, checks if the user exists, and returns user data if found.
 * @param {object} req - Express request object containing the user ID in the URL parameters
 * @param {object} res - Express response object to send the response with user data or error message
 * @param {function} next - Express next middleware function to handle errors
 * @param {object} User - User model for database interaction
 * @returns {object} JSON response with the user data or an error message
 * @throws {Error} Throws an error if there's an issue with the database query or if user is not found
 */

export const getUserById = async (req, res, next, User) => {
  try {
    const { id } = req.params;
    logger.info("Fetching user by ID", { userId: req.params.id });

    const user = await User.findById(id);
    
    if (!user) {
      logger.warn("User not found", { userId: req.params.id });
      return next(createError(404, "User not found"));
    }

    logger.info("User fetched successfully", { userId: req.params.id });
    res.status(200).json({ message: "User fetched successfully", user });
    } catch (error) {
    logger.error("Error deleting user", { error: error.message });
    next(createError(500, "Internal server error"));
  }
}
export const getUserWithPermissionsById =  async(req, res,User)=>{
  const { id } = req.params; // User ID from URL

  try {
    // Aggregation pipeline to get the user with role permissions
    const userWithPermissions = await UserModel.aggregate([
      {
        $match: {
          _id: new  mongoose.Types.ObjectId(id) // Match the user by ID
        }
      },
      {
        $unwind: "$roles.branchAndRole" // Unwind the branchAndRole array
      },
      {
        $lookup: {
          from: "roles", // The collection name of the Role model
          localField: "roles.branchAndRole.roleId", // Local field (roleId)
          foreignField: "_id", // Foreign field (Role _id)
          as: "roleDetails" // The name of the array to store the role details
        }
      },
      {
        $unwind: "$roleDetails" // Unwind the roleDetails array to work with the role data directly
      },
      {
        $project: {
          _id: 1,
          email: 1,
          isActive: 1,
          roles: {
            branchName: "$roles.branchAndRole.branchName", // Keep branchName from the original role
            roleId: "$roles.branchAndRole.roleId", // Keep roleId from the original role
            roleName: "$roleDetails.roleName", // Add roleName from the Role model
            permissions: "$roleDetails.permissions" // Add permissions from the Role model
          },
          version: 1,
          createdAt: 1,
          updatedAt: 1
        }
      },
      {
        $group: {
          _id: "$_id", // Group by the user _id to return the result as one document per user
          email: { $first: "$email" },
          isActive: { $first: "$isActive" },
          roles: { $push: "$roles" }, // Push each role's data (branchName, roleId, roleName, permissions)
          version: { $first: "$version" },
          createdAt: { $first: "$createdAt" },
          updatedAt: { $first: "$updatedAt" }
        }
      }
    ]);

    if (userWithPermissions.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({
      message: 'User fetched successfully',
      user: userWithPermissions[0]
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
    }
  };



/**
 * Update a user by ID
 * Logs the operation, validates input, and updates role and permissions.
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @param {function} next - Express next middleware function
 * @param {object} User - User model for database interaction
 */
export const updateUserById = async (req, res, next, User) => {
  try {
    logger.info("Fetching user for update", { userId: req.params.id });
    const user = await User.findById(req.params.id);
    if (!user) {
      logger.warn("User not found", { userId: req.params.id });
      return next(createError(404, "User not found"));
    }

    const { error, value } = getUserSchema(req.body.version || 1).validate(
      req.body
    );
    if (error) {
      logger.warn("Validation failed", {
        validationError: error.details[0].message
      });
      return next(createError(422, error.details[0].message));
    }

    if (value.role && value.role !== user.role) {
      logger.info("Updating role and permissions for user", {
        userId: req.params.id
      });
      const role = await Role.findOne({ roleName: value.role });
      if (!role) {
        logger.warn("Role not found", { roleName: value.role });
        return next(createError(400, `Role '${value.role}' not found`));
      }
      value.permissions = role.permissions;
    }

    const updatedUser = await User.findByIdAndUpdate(req.params.id, value, {
      new: true
    });
    logger.info("User updated successfully", { userId: req.params.id });
    res.status(200).json(updatedUser);
  } catch (error) {
    logger.error("Error updating user", { error: error.message });
    next(createError(500, "Internal server error"));
  }
};

/**
 * Soft delete a user by ID
 * Logs the operation and marks the user as inactive.
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @param {function} next - Express next middleware function
 * @param {object} User - User model for database interaction
 */
export const deleteUserById = async (req, res, next, User) => {
  try {
    logger.info("Fetching user for deletion", { userId: req.params.id });
    const user = await User.findById(req.params.id);
    if (!user) {
      logger.warn("User not found", { userId: req.params.id });
      return next(createError(404, "User not found"));
    }
    user.isActive = false;
    await user.save();
    logger.info("User soft-deleted successfully", { userId: req.params.id });
    res.status(200).json({ message: "User successfully soft deleted" });
  } catch (error) {
    logger.error("Error deleting user", { error: error.message });
    next(createError(500, "Internal server error"));
  }
};
