// projectController.js
import {
  getAllProjects,
  createProject,
  getProjectById,
  updateProjectById,
  deleteProjectById
} from "../services/project.service.js";
import User from "../../../core/security/models/user.model.js";
import Project from "../models/project.model.js";

export const projectController = {
  getAll: async (req, res, next) => {
    try {
      logger.info("Fetching projects");
      await getAllProjects(req, res, next, Project);
    } catch (error) {
      logger.error("Error fetching projects:", error);
      next(error);
    }
  },

  create: async (req, res, next) => {
    try {
      logger.info("Creating project");
      await createProject(req, res, next, Project, User);
    } catch (error) {
      logger.error("Error creating project:", error);
      next(error);
    }
  },

  getById: async (req, res, next) => {
    try {
      logger.info("Fetching project by ID", { id: req.params.id });
      await getProjectById(req, res, next, Project);
    } catch (error) {
      logger.error("Error fetching project:", error);
      next(error);
    }
  },

  updateById: async (req, res, next) => {
    try {
      logger.info("Updating project by ID", { id: req.params.id });
      await updateProjectById(req, res, next, Project);
    } catch (error) {
      logger.error("Error updating project:", error);
      next(error);
    }
  },

  deleteById: async (req, res, next) => {
    try {
      logger.info("Deleting project by ID", { id: req.params.id });
      await deleteProjectById(req, res, next, Project);
    } catch (error) {
      logger.error("Error deleting project:", error);
      next(error);
    }
  }
};
