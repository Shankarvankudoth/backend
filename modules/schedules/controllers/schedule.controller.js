import * as scheduleService from "../services/schedule.service.js";
import Schedule from "../models/schedule.model.js";
import { createError } from "../../../services/errorhandling.service.js";
import loggingService from "../../../services/logging.service.js";

const logger = loggingService.getModuleLogger("schedulesController");
const scheduleController = {
  getAll: async (req, res, next) => {
    try {
      const schedules = await scheduleService.getAllSchedules(Schedule);
      res.status(200).json(schedules);
    } catch (error) {
      next(error);
    }
  },

  getById: async (req, res, next) => {
    try {
      const schedule = await scheduleService.getScheduleById(req.params.id, Schedule);
      if (!schedule) return next(createError(404, "Schedule not found"));
      res.status(200).json(schedule);
    } catch (error) {
      next(error);
    }
  },

  create: async (req, res, next) => {
    try {
      const newSchedule = await scheduleService.createSchedule(req.body, Schedule);
      res.status(201).json(newSchedule);
    } catch (error) {
      next(error);
    }
  },

  update: async (req, res, next) => {
    try {
      const updatedSchedule = await scheduleService.updateSchedule(req.params.id, req.body, Schedule);
      res.status(200).json(updatedSchedule);
    } catch (error) {
      next(error);
    }
  },

  delete: async (req, res, next) => {
    try {
      const message = await scheduleService.deleteSchedule(req.params.id, Schedule);
      res.status(200).json(message);
    } catch (error) {
      next(error);
    }
  },
};

export default scheduleController;
