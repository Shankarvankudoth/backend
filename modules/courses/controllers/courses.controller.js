import {
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
} from "../services/courses.service.js";
import Course from "../models/courses.model.js";
import loggingService from "../../../services/logging.service.js";

const logger = loggingService.getModuleLogger("CourseController");

const courseController = {
  getAll: async (req, res, next) => {
    try {
      logger.info("Fetching all courses");
      await getAllCourses(req, res, Course);
    } catch (error) {
      logger.error(`Error fetching all courses: ${error.message}`);
      next(error);
    }
  },

  getById: async (req, res, next) => {
    try {
      logger.info(`Fetching course with ID: ${req.params.id}`);
      await getCourseById(req, res, Course);
    } catch (error) {
      logger.error(
        `Error fetching course with ID ${req.params.id}: ${error.message}`
      );
      next(error);
    }
  },

  create: async (req, res, next) => {
    try {
      logger.info("Creating a new course");
      await createCourse(req, res, Course);
    } catch (error) {
      logger.error(`Error creating course: ${error.message}`);
      next(error);
    }
  },

  update: async (req, res, next) => {
    try {
      logger.info(`Updating course with ID: ${req.params.id}`);
      await updateCourse(req, res, Course);
    } catch (error) {
      logger.error(
        `Error updating course with ID ${req.params.id}: ${error.message}`
      );
      next(error);
    }
  },

  delete: async (req, res, next) => {
    try {
      logger.info(`Deleting course with ID: ${req.params.id}`);
      await deleteCourse(req, res, Course);
    } catch (error) {
      logger.error(
        `Error deleting course with ID ${req.params.id}: ${error.message}`
      );
      next(error);
    }
  },
};

export default courseController;
