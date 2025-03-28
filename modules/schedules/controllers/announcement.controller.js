import * as announcementService from "../services/announcement.service.js";
import Announcement from "../models/announcement.model.js";
import { createError } from "../../../services/errorhandling.service.js";
import loggingService from "../../../services/logging.service.js";

const logger = loggingService.getModuleLogger("announcementController");
const announcementController = {
  getAll: async (req, res, next) => {
    try {
     logger.info("Fetching announcements");
      const announcements = await announcementService.getAllAnnouncements(Announcement);
      res.status(200).json(announcements);
    } catch (error) {
      logger.error("Error fetching announcements:", error);
      next(error);
    }
  },

  getById: async (req, res, next) => {
    try {
     logger.info("Fetching announcement by ID", { id: req.params.id });
      const announcement = await announcementService.getAnnouncementById(req.params.id, Announcement);
      if (!announcement) {
        logger.error("Announcement record not found");
        return next(createError(404, "Announcement not found"));
      }
      res.status(200).json(announcement);
    } catch (error) {
      logger.error("Error fetching announcement:", error);
      next(error);
    }
  },

  create: async (req, res, next) => {
    try {
     logger.info("Creating announcement");
      const newAnnouncement = await announcementService.createAnnouncement(req.body, Announcement);
      res.status(201).json(newAnnouncement);
    } catch (error) {
      logger.error("Error creating announcement:", error);
      next(error);
    }
  },

  update: async (req, res, next) => {
    try {
     logger.info("Updating announcement by ID", { id: req.params.id });
      const updatedAnnouncement = await announcementService.updateAnnouncement(req.params.id, req.body, Announcement);
      res.status(200).json(updatedAnnouncement);
    } catch (error) {
      logger.error("Error updating announcement:", error);
      next(error);
    }
  },

  delete: async (req, res, next) => {
    try {
     logger.info("Deleting announcement by ID", { id: req.params.id });
      const message = await announcementService.deleteAnnouncement(req.params.id, Announcement);
      res.status(200).json(message);
    } catch (error) {
      logger.error("Error deleting announcement:", error);
      next(error);
    }
  },
};

export default announcementController;
