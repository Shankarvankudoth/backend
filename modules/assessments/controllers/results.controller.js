import {
  getAllResults,
  getResultById,
  createResult,
  updateResult,
  deleteResult,
} from "../services/results.service.js";
import Results from "../models/results.model.js";
import loggingService from "../../../services/logging.service.js";

const logger = loggingService.getModuleLogger("ResultsController");

const resultsController = {
  getAll: async (req, res, next) => {
    try {
      logger.info("Fetching all results");
      await getAllResults(req, res, Results);
    } catch (error) {
      logger.error("Error fetching results", { error });
      next(error);
    }
  },

  getById: async (req, res, next) => {
    try {
      logger.info(`Fetching result with ID: ${req.params.id}`);
      await getResultById(req, res, Results);
    } catch (error) {
      logger.error("Error fetching result by ID", { error });
      next(error);
    }
  },

  create: async (req, res, next) => {
    try {
      logger.info("Creating a new result", { data: req.body });
      await createResult(req, res,  Results);
    } catch (error) {
      logger.error("Error creating result", { error });
      next(error);
    }
  },

  update: async (req, res, next) => {
    try {
      logger.info(`Updating result with ID: ${req.params.id}`, { data: req.body });
      await updateResult(req, res,  Results);
    } catch (error) {
      logger.error("Error updating result", { error });
      next(error);
    }
  },

  delete: async (req, res, next) => {
    try {
      logger.info(`Deleting result with ID: ${req.params.id}`);
      await deleteResult(req, res,  Results);
    } catch (error) {
      logger.error("Error deleting result", { error });
      next(error);
    }
  },
};

export default resultsController;