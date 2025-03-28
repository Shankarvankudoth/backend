import {createLeave, deleteLeave, getAllLeaves,getLeaveById, updateLeave} from "../services/leave.service.js";
import Leaves from "../models/leave.model.js";
import { createError } from "../../../services/errorhandling.service.js";
import loggingService from "../../../services/logging.service.js";

const logger = loggingService.getModuleLogger("leaveController");
const leavesController = {
  getAll: async (req, res, next) => {
    try {
      logger.info("Fetching leaves");
      const leaves = await getAllLeaves(Leaves);
      res.status(200).json(leaves);
    } catch (error) {
      logger.error("Error fetching leaves:", error);
      next(error);
    }
  },

  getById: async (req, res, next) => {
    try {
      logger.info("Fetching leave by ID", { id: req.params.id });
      const leave = await getLeaveById(req.params.id, Leaves);
      if (!leave){
        logger.error("Leave record not found");
        return next(createError(404, "Leave record not found"));
      }
      res.status(200).json(leave);
    } catch (error) {
      logger.error("Error fetching leave:", error);
      next(error);
    }
  },

  create: async (req, res, next) => {
    try {
      logger.info("Creating leave");
      const newLeave = await createLeave(req.body, Leaves);
      res.status(201).json(newLeave);
    } catch (error) {
      logger.error("Error creating leave:", error);
      next(error);
    }
  },

  update: async (req, res, next) => {
    try {
      logger.info("Updating leave by ID", { id: req.params.id });
      const updatedLeave = await updateLeave(req.params.id, req.body, Leaves);
      res.status(200).json(updatedLeave);
    } catch (error) {
      logger.error("Error updating leave:", error);
      next(error);
    }
  },

  delete: async (req, res, next) => {
    try {
      logger.info("Deleting leave by ID", { id: req.params.id });
      const message = await deleteLeave(req.params.id, Leaves);
      res.status(200).json(message);
    } catch (error) {
      logger.error("Error deleting leave:", error);
      next(error);
    }
  },
};

export default leavesController;
