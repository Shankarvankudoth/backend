import {
  getAllBatches,
  getBatchById,
  createBatch,
  updateBatch,
  deleteBatch,
} from "../services/batch.service.js";
import Batch from "../models/batch.model.js";
import loggingService from "../../../services/logging.service.js";

const logger = loggingService.getModuleLogger("BatchController");

const batchController = {
  getAll: async (req, res, next) => {
    try {
      logger.info("Fetching all batches");
      await getAllBatches(req, res,  Batch);
    } catch (error) {
      logger.error("Error fetching batches", { error });
      next(error);
    }
  },

  getById: async (req, res, next) => {
    try {
      logger.info(`Fetching batch with ID: ${req.params.id}`);
      await getBatchById(req, res,Batch);
    } catch (error) {
      logger.error("Error fetching batch by ID", { error });
      next(error);
    }
  },

  create: async (req, res, next) => {
    try {
      logger.info("Creating a new batch", { data: req.body });
      await createBatch(req, res, Batch);
    } catch (error) {
      logger.error("Error creating batch", { error });
      next(error);
    }
  },

  update: async (req, res, next) => {
    try {
      logger.info(`Updating batch with ID: ${req.params.id}`, { data: req.body });
      await updateBatch(req, res,  Batch);
    } catch (error) {
      logger.error("Error updating batch", { error });
      next(error);
    }
  },

  delete: async (req, res, next) => {
    try {
      logger.info(`Deleting batch with ID: ${req.params.id}`);
      await deleteBatch(req, res, Batch);
    } catch (error) {
      logger.error("Error deleting batch", { error });
      next(error);
    }
  },
};

export default batchController;