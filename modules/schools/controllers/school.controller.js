import * as schoolService from "../services/school.service.js";
import School from "../models/school.model.js";
import { createError } from "../../../services/errorhandling.service.js";
import loggingService from "../../../services/logging.service.js";

const logger = loggingService.getModuleLogger("schoolController");
const schoolController = {
  getAll: async (req, res, next) => {
    try {
     logger.info("Fetching schools");
      const schools = await schoolService.getAllSchools(School);
      res.status(200).json(schools);
    } catch (error) {
    logger.error("Error fetching schools:", error);
      next(error);
    }
  },

  getById: async (req, res, next) => {
    try {
      logger.info("Fetching school by ID",{ id: req.params.id });
      const school = await schoolService.getSchoolById(req.params.id, School);
      if (!school){
        logger.error("School not found"); 
        return next(createError(404, "School not found"));
      }
      res.status(200).json(school);
    } catch (error) {
      logger.error("Error fetching school:", error);
      next(error);
    }
  },

  create: async (req, res, next) => {
    try {
      logger.info("Creating school");
      const newSchool = await schoolService.createSchool(req.body, School);
      res.status(201).json(newSchool);
    } catch (error) {
      logger.error("Error creating school:", error);
      next(error);
    }
  },

  update: async (req, res, next) => {
    try {
      logger.info("Updating school by ID", { id: req.params.id });
      const updatedSchool = await schoolService.updateSchool(req.params.id, req.body, School);
      res.status(200).json(updatedSchool);
    } catch (error) {
      logger.error("Error updating school:", error);
      next(error);
    }
  },

  delete: async (req, res, next) => {
    try {
      logger.info("Deleting school by ID", { id: req.params.id });
      const message = await schoolService.deleteSchool(req.params.id, School);
      res.status(200).json(message);
    } catch (error) {
      logger.error("Error deleting school:", error);
      next(error);
    }
  },
};

export default schoolController;
