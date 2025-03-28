import {
  getAllProfiles,
  getProfileById,
  createProfile,
  updateProfile,
  deleteProfile,
} from "../services/profile.service.js";
import Profile from "../models/profile.model.js";
import loggingService from "../../../services/logging.service.js";

const logger = loggingService.getModuleLogger("ProfileController");

const profileController = {
  getAll: async (req, res, next) => {
    try {
      logger.info("Fetching all profiles");
      await getAllProfiles(req, res, Profile);
    } catch (error) {
      logger.error(`Error fetching all profiles: ${error.message}`);
      next(error);
    }
  },

  getById: async (req, res, next) => {
    try {
      logger.info(`Fetching profile with ID: ${req.params.id}`);
      await getProfileById(req, res, Profile);
    } catch (error) {
      logger.error(
        `Error fetching profile with ID ${req.params.id}: ${error.message}`
      );
      next(error);
    }
  },

  create: async (req, res, next) => {
    try {
      logger.info("Creating a new profile");
      await createProfile(req, res, Profile);
    } catch (error) {
      logger.error(`Error creating profile: ${error.message}`);
      next(error);
    }
  },

  update: async (req, res, next) => {
    try {
      logger.info(`Updating profile with ID: ${req.params.id}`);
      await updateProfile(req, res, Profile);
    } catch (error) {
      logger.error(
        `Error updating profile with ID ${req.params.id}: ${error.message}`
      );
      next(error);
    }
  },

  delete: async (req, res, next) => {
    try {
      logger.info(`Deleting profile with ID: ${req.params.id}`);
      await deleteProfile(req, res, Profile);
    } catch (error) {
      logger.error(
        `Error deleting profile with ID ${req.params.id}: ${error.message}`
      );
      next(error);
    }
  },
};

export default profileController;
