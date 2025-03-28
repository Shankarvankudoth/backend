import {getCalendarEntryById, getAllCalendarEntries, createCalendarEntry, updateCalendarEntry, deleteCalendarEntry} from "../services/calendar.service.js";
import Calendar from "../models/calendar.model.js";
import { createError } from "../../../services/errorhandling.service.js";
import loggingService from "../../../services/logging.service.js";

const logger = loggingService.getModuleLogger("calendarController");
const calendarController = {
  getAll: async (req, res, next) => {
    try {
      logger.info("Fetching calendars");
      const entries = await getAllCalendarEntries(Calendar);
      res.status(200).json(entries);
    } catch (error) {
      logger.error("Error fetching calendar Entries:", error);
      next(error);
    }
  },

  getById: async (req, res, next) => {
    try {
      logger.info("Fetching calendar by ID", { id: req.params.id });
      const entry = await getCalendarEntryById(req.params.id, Calendar);
      if (!entry){
        logger.error("Calendar record not found");
        return next(createError(404, "Calendar entry not found"));
      }
      res.status(200).json(entry);
    } catch (error) {
      logger.error("Error fetching calendar Entry:", error);
      next(error);
    }
  },

  create: async (req, res, next) => {
    try {
      logger.info("Creating calendar");
      const newEntry = await createCalendarEntry(req.body, Calendar);
      res.status(201).json(newEntry);
    } catch (error) {
      logger.error("Error creating calendar Entry:", error);
      next(error);
    }
  },

  update: async (req, res, next) => {
    try {
      logger.info("Updating calendar by ID", { id: req.params.id });
      const updatedEntry = await updateCalendarEntry(req.params.id, req.body, Calendar);
      res.status(200).json(updatedEntry);
    } catch (error) {
      logger.error("Error updating calendar Entry:", error);
      next(error);
    }
  },

  delete: async (req, res, next) => {
    try {
      logger.info("Deleting calendar by ID", { id: req.params.id });
      const message = await deleteCalendarEntry(req.params.id, Calendar);
      res.status(200).json(message);
    } catch (error) {
      logger.error("Error deleting calendar Entry:", error);
      next(error);
    }
  },
};

export default calendarController;