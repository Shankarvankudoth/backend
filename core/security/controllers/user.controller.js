import {
  getAllUsers,
  createUser,
  getUserById,
  updateUserById,
  deleteUserById,
  getUserWithPermissionsById
} from "../services/user.service.js";
import User from "../models/user.model.js"
import loggingService from "../../../services/logging.service.js";

const logger = loggingService.getModuleLogger("UserController");

export const userController = {
  getAll: async (req, res, next) => {
    try {
      logger.info("Controller: Fetching all users");
      await getAllUsers(req, res, next, User);
    } catch (error) {
      logger.error("Controller: Error fetching users", { error: error.message });
      next(error);
    }
  },

  create: async (req, res, next) => {
    try {
      logger.info("Controller: Creating a new user");
      await createUser(req, res, next, User);
    } catch (error) {
      logger.error("Controller: Error creating user", { error: error.message });
      next(error);
    }
  },

  getById: async (req, res, next) => {
    try {
      logger.info("Controller: Fetching user by ID", { userId: req.params.id });
      await getUserById(req, res, next, User);
    } catch (error) {
      logger.error("Controller: Error fetching user by ID", { error: error.message });
      next(error);
    }
  },
  getUserWithPermissionsById:async(req,res,next)  => {
    try{
      logger.info("Controller: Fetching user with permissions by ID", { userId: req.params.id });
      await getUserWithPermissionsById(req, res, next, User);
    }catch(error){
      logger.error("Controller: Error fetching user with permissions by ID", { error: error.message });
      next(error);
    }

  },

  updateById: async (req, res, next) => {
    try {
      logger.info("Controller: Updating user", { userId: req.params.id });
      await updateUserById(req, res, next, User);
    } catch (error) {
      logger.error("Controller: Error updating user", { error: error.message });
      next(error);
    }
  },

  deleteById: async (req, res, next) => {
    try {
      logger.info("Controller: Deleting user", { userId: req.params.id });
      await deleteUserById(req, res, next, User);
    } catch (error) {
      logger.error("Controller: Error deleting user", { error: error.message });
      next(error);
    }
  }
};