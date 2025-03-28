import * as subjectService from "../services/subject.service.js";
import Subject from "../models/subject.model.js";
import { createError } from "../../../services/errorhandling.service.js";
import loggingService from "../../../services/logging.service.js";

const logger = loggingService.getModuleLogger("subjectController");

const subjectController = {
  async getAll(req, res, next) {
    try {
      logger.info("Fetching all subjects");
      const subjects = await subjectService.getAllSubjects(Subject);
      res.status(200).json(subjects);
    } catch (error) {
      logger.error("Error fetching subjects:", error);
      next(error);
    }
  },

  async getById(req, res, next) {
    try {
      logger.info("Fetching subject by ID", { id: req.params.id });
      const subject = await subjectService.getSubjectById(req.params.id, Subject);
      if (!subject) {
        logger.error("Subject not found");
        return next(createError(404, "Subject not found"));
      }
      res.status(200).json(subject);
    } catch (error) {
      logger.error("Error fetching subject:", error);
      next(error);
    }
  },

  async create(req, res, next) {
    try {
      logger.info("Creating new subject");
      const newSubject = await subjectService.createSubject(req.body, Subject);
      res.status(201).json(newSubject);
    } catch (error) {
      logger.error("Error creating subject:", error);
      next(error);
    }
  },

  async update(req, res, next) {
    try {
      logger.info("Updating subject", { id: req.params.id, body: req.body });
      const updatedSubject = await subjectService.updateSubject(req.params.id, req.body, Subject);
      res.status(200).json(updatedSubject);
    } catch (error) {
      logger.error("Error updating subject:", error);
      next(error);
    }
  },

  async delete(req, res, next) {
    try {
      logger.info("Deleting subject", { id: req.params.id });
      const message = await subjectService.deleteSubject(req.params.id, Subject);
      res.status(200).json(message);
    } catch (error) {
      logger.error("Error deleting subject:", error);
      next(error);
    }
  },
};

export default subjectController;
