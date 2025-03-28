import * as feeStructureService from "../services/feeStructure.service.js";
import FeeStructure from "../models/feeStructure.model.js";
import { createError } from "../../../services/errorhandling.service.js";
import loggingService from "../../../services/logging.service.js";

const logger = loggingService.getModuleLogger("feeStructureController");

const feeStructureController = {
  getAll: async (req, res, next) => {
    try {
      logger.info("Fetching FeeStructures");
      const feeStructures = await feeStructureService.getAllFeeStructures(FeeStructure);
      res.status(200).json(feeStructures);
    } catch (error) {
      logger.error("Error fetching FeeStructures:", error);
      next(error);
    }
  },

  getById: async (req, res, next) => {
    try {
      logger.info("Fetching FeeStructure by ID", { id: req.params.id });
      const feeStructure = await feeStructureService.getFeeStructureById(req.params.id, FeeStructure);
      if (!feeStructure) {
        logger.error("FeeStructure not found");
        return next(createError(404, "FeeStructure not found"));
      }
      res.status(200).json(feeStructure);
    } catch (error) {
      logger.error("Error fetching FeeStructure:", error);
      next(error);
    }
  },

  create: async (req, res, next) => {
    try {
      logger.info("Creating FeeStructure");
      const newFeeStructure = await feeStructureService.createFeeStructure(req.body, FeeStructure);
      res.status(201).json(newFeeStructure);
    } catch (error) {
      logger.error("Error creating FeeStructure:", error);
      next(error);
    }
  },

  update: async (req, res, next) => {
    try {
      logger.info("Updating FeeStructure by ID", { id: req.params.id });
      const updatedFeeStructure = await feeStructureService.updateFeeStructure(req.params.id, req.body, FeeStructure);
      res.status(200).json(updatedFeeStructure);
    } catch (error) {
      logger.error("Error updating FeeStructure:", error);
      next(error);
    }
  },

  delete: async (req, res, next) => {
    try {
      logger.info("Deleting FeeStructure by ID", { id: req.params.id });
      const message = await feeStructureService.deleteFeeStructure(req.params.id, FeeStructure);
      res.status(200).json(message);
    } catch (error) {
      logger.error("Error deleting FeeStructure:", error);
      next(error);
    }
  },
};

export default feeStructureController;
