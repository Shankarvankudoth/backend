import {
  getAllBranches,
  getBranchById,
  createBranch,
  updateBranch,
  deleteBranch,
} from "../services/branch.service.js";
import Branch from "../models/branch.model.js";
import loggingService from "../../../services/logging.service.js";

const logger = loggingService.getModuleLogger("BranchController");

const branchController = {
  getAll: async (req, res, next) => {
    try {
      logger.info("Fetching all branches");
      await getAllBranches(req, res, Branch);
    } catch (error) {
      logger.error("Error fetching branches", { error });
      next(error);
    }
  },

  getById: async (req, res, next) => {
    try {
      logger.info(`Fetching branch with ID: ${req.params.id}`);
      await getBranchById(req, res, Branch);
    } catch (error) {
      logger.error("Error fetching branch by ID", { error });
      next(error);
    }
  },

  create: async (req, res, next) => {
    try {
      logger.info("Creating a new branch", { data: req.body });
      await createBranch(req, res, Branch);
    } catch (error) {
      logger.error("Error creating branch", { error });
      next(error);
    }
  },

  update: async (req, res, next) => {
    try {
      logger.info(`Updating branch with ID: ${req.params.id}`, {
        data: req.body,
      });
      await updateBranch(req, res, Branch);
    } catch (error) {
      logger.error("Error updating branch", { error });
      next(error);
    }
  },

  delete: async (req, res, next) => {
    try {
      logger.info(`Deleting branch with ID: ${req.params.id}`);
      await deleteBranch(req, res, Branch);
    } catch (error) {
      logger.error("Error deleting branch", { error });
      next(error);
    }
  },
};

export default branchController;
