import * as ptmService from "../services/ptm.service.js";
import PTM from "../models/ptm.model.js";
import { createError } from "../../../services/errorhandling.service.js";
import loggingService from "../../../services/logging.service.js";

const logger = loggingService.getModuleLogger("FeedbackController");

const ptmController = {
  getAll: async (req, res, next) => {
    try {
      logger.info("Fetching PTM's");
      const ptms = await ptmService.getAllPTMs(PTM);
      res.status(200).json(ptms);
    } catch (error) {
      logger.error("Error fetching PTM's:", error);
      next(error);
    }
  },

  getById: async (req, res, next) => {
    try {
      logger.info("Fetching PTM by ID", { id: req.params.id });
      const ptm = await ptmService.getPTMById(req.params.id, PTM);
      if (!ptm) {
        logger.error("PTM not found");
        return next(createError(404, "PTM not found"));
      }
      res.status(200).json(ptm);
    } catch (error) {
      logger.error("Error fetching PTM:", error);
      next(error);
    }
  },

  create: async (req, res, next) => {
    try {
      logger.info("Creating PTM");
      const newPTM = await ptmService.createPTM(req.body, PTM);
      res.status(201).json(newPTM);
    } catch (error) {
      logger.error("Error creating PTM:", error);
      next(error);
    }
  },

  update: async (req, res, next) => {
    try {
      logger.info("Updating PTM by ID", { id: req.params.id });
      const updatedPTM = await ptmService.updatePTM(req.params.id, req.body, PTM);
      res.status(200).json(updatedPTM);
    } catch (error) {
      logger.error("Error updating PTM:", error);
      next(error);
    }
  },

  delete: async (req, res, next) => {
    try {
      logger.info("Deleting PTM by ID", { id: req.params.id });
      const message = await ptmService.deletePTM(req.params.id, PTM);
      res.status(200).json(message);
    } catch (error) {
      logger.error("Error deleting PTM:", error);
      next(error);
    }
  },
};

export default ptmController;
