// taskController.js
import {
  getTaskById,
  createTask,
  updateTaskById,
  updateTasksWhenDragged
} from "../services/task.service.js";
import Project from "../models/project.model.js";

export const taskController = {
  getById: async (req, res, next) => {
    try {
      logger.info("Fetching task by ID", { id: req.params.id });
      await getTaskById(req, res, next, Project);
    } catch (error) {
      logger.error("Error fetching task:", error);
      next(error);
    }
  },

  create: async (req, res, next) => {
    try {
      logger.info("Creating task");
      await createTask(req, res, next, Project);
    } catch (error) {
      logger.error("Error creating task:", error);
      next(error);
    }
  },

  updateById: async (req, res, next) => {
    try {
      logger.info("Updating task by ID", { id: req.params.id });
      await updateTaskById(req, res, next, Project);
    } catch (error) {
      logger.error("Error updating task:", error);
      next(error);
    }
  },

  updateDragged: async (req, res, next) => {
    try {
      logger.info("Updating task when dragged");
      await updateTasksWhenDragged(req, res, next, Project);
    } catch (error) {
      logger.error("Error updating task when dragged:", error);
      next(error);
    }
  }
};
