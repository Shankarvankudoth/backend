import {
  getAllAttendance,
  getAttendanceById,
  createAttendance,
  updateAttendance,
  deleteAttendance,
} from "../services/attendance.service.js";
import Attendance from "../models/attendance.model.js";
import loggingService from "../../../services/logging.service.js";

const logger = loggingService.getModuleLogger("AttendanceController");

const attendanceController = {
  getAll: async (req, res, next) => {
    try {
      logger.info("Fetching all attendance records");
      await getAllAttendance(req, res, Attendance);
    } catch (error) {
      logger.error("Error fetching attendance records", { error });
      next(error);
    }
  },

  getById: async (req, res, next) => {
    try {
      logger.info(`Fetching attendance record with ID: ${req.params.id}`);
      await getAttendanceById(req, res, Attendance);
    } catch (error) {
      logger.error("Error fetching attendance record by ID", { error });
      next(error);
    }
  },

  create: async (req, res, next) => {
    try {
      logger.info("Creating a new attendance record", { data: req.body });
      await createAttendance(req, res, Attendance);
    } catch (error) {
      logger.error("Error creating attendance record", { error });
      next(error);
    }
  },

  update: async (req, res, next) => {
    try {
      logger.info(`Updating attendance record with ID: ${req.params.id}`, {
        data: req.body,
      });
      await updateAttendance(req, res, Attendance);
    } catch (error) {
      logger.error("Error updating attendance record", { error });
      next(error);
    }
  },

  delete: async (req, res, next) => {
    try {
      logger.info(`Deleting attendance record with ID: ${req.params.id}`);
      await deleteAttendance(req, res, Attendance);
    } catch (error) {
      logger.error("Error deleting attendance record", { error });
      next(error);
    }
  },
};

export default attendanceController;
