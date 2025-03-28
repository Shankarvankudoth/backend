import {
  getAllClassRooms,
  getClassRoomById,
  createClassRoom,
  updateClassRoom,
  deleteClassRoom,
} from "../services/classroom.service.js";
import ClassRoom from "../models/classRoom.model.js";
import loggingService from "../../../services/logging.service.js";

const logger = loggingService.getModuleLogger("ClassRoomController");

const classRoomController = {
  getAll: async (req, res, next) => {
    try {
      logger.info("Fetching all classrooms");
      await getAllClassRooms(req, res, ClassRoom);
    } catch (error) {
      logger.error("Error fetching classrooms", { error });
      next(error);
    }
  },

  getById: async (req, res, next) => {
    try {
      logger.info(`Fetching classroom with ID: ${req.params.id}`);
      await getClassRoomById(req, res, ClassRoom);
    } catch (error) {
      logger.error("Error fetching classroom by ID", { error });
      next(error);
    }
  },

  create: async (req, res, next) => {
    try {
      logger.info("Creating a new classroom", { data: req.body });
      await createClassRoom(req, res, ClassRoom);
    } catch (error) {
      logger.error("Error creating classroom", { error });
      next(error);
    }
  },

  update: async (req, res, next) => {
    try {
      logger.info(`Updating classroom with ID: ${req.params.id}`, {
        data: req.body,
      });
      await updateClassRoom(req, res, ClassRoom);
    } catch (error) {
      logger.error("Error updating classroom", { error });
      next(error);
    }
  },

  delete: async (req, res, next) => {
    try {
      logger.info(`Deleting classroom with ID: ${req.params.id}`);
      await deleteClassRoom(req, res, ClassRoom);
    } catch (error) {
      logger.error("Error deleting classroom", { error });
      next(error);
    }
  },
};

export default classRoomController;
