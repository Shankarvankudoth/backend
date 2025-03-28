import Joi from "joi";
import { createError } from "../../../services/errorhandling.service.js";
import loggingService from "../../../services/logging.service.js";

const logger = loggingService.getModuleLogger("CourseService");

// Joi Validation Schema
const courseSchema = Joi.object({
  courseName: Joi.string().optional(),
  academicYear: Joi.number().required(),
  standard: Joi.number().required(),
  subjectIds: Joi.array().items(Joi.string()).required(),
  publishDate: Joi.date().optional(),
  fee: Joi.number().optional(),
  modeOfDelivery: Joi.string().valid("online", "offline").required(),
  documentIds: Joi.array().items(Joi.string()).optional(),
  version: Joi.number().default(1),
});

// Get Schema based on Version
const getSchemaForVersion = (version) => {
  switch (version) {
    case 1:
      return courseSchema;
    case 2:
      return courseSchema.keys({
        extraFieldForV2: Joi.string().optional(),
      });
    case 3:
      return courseSchema.keys({
        extraFieldForV2: Joi.string().optional(),
        newFieldForV3: Joi.string().optional(),
      });
    default:
      return null;
  }
};

// Get All Courses
export const getAllCourses = async (req, res,Course) => {
  try {
    logger.info("Fetching all courses...");
    const courses = await Course.find();
    logger.info(`Fetched ${courses.length} courses successfully.`);
    res.status(200).json(courses);
  } catch (error) {
    logger.error("Error fetching courses", { error: error.message });
    throw createError(500, "Internal server error");
  }
};

// Get Course by ID
export const getCourseById = async (req, res,Course) => {
  try {
    logger.info(`Fetching course with ID: ${req.params.id}`);
    const course = await Course.findById(req.params.id);
    if (!course) {
      logger.warn(`Course with ID ${req.params.id} not found.`);
      throw createError(404, "Course not found");
    }
    logger.info(`Fetched course: ${course.courseName || "Unnamed Course"}`);
    res.status(200).json(course);
  } catch (error) {
    logger.error(`Error fetching course with ID: ${req.params.id}`, {
      error: error.message,
    });
    throw createError(500, "Internal server error");
  }
};

// Create Course
export const createCourse = async (req, res,Course) => {
  try {
    logger.info("Validating course data for creation...");
    const { version = 1 } = req.body;
    const schema = getSchemaForVersion(version);

    if (!schema) {
      logger.warn("Invalid version provided for course creation.");
      throw createError(400, "Invalid version provided");
    }

    const { error, value } = schema.validate(req.body);
    if (error) {
      logger.warn(`Validation failed: ${error.details[0].message}`);
      throw createError(422, error.details[0].message);
    }

    logger.info("Creating new course...");
    const newCourse = new Course(value);
    const savedCourse = await newCourse.save();
    logger.info(
      `Course created successfully: ${
        savedCourse.courseName || "Unnamed Course"
      }`
    );
    res.status(201).json(savedCourse);
  } catch (error) {
    logger.error("Error creating course", { error: error.message });
    throw createError(500, "Internal server error");
  }
};

// Update Course
export const updateCourse = async (req, res,Course) => {
  try {
    logger.info(`Validating update data for course ID: ${req.params.id}`);
    const { version = 1 } = req.body;
    const schema = getSchemaForVersion(version);

    if (!schema) {
      logger.warn("Invalid version provided for course update.");
      throw createError(400, "Invalid version provided");
    }

    const { error, value } = schema.validate(req.body);
    if (error) {
      logger.warn(`Validation failed for update: ${error.details[0].message}`);
      throw createError(422, error.details[0].message);
    }

    logger.info(`Updating course with ID: ${req.params.id}`);
    const updatedCourse = await Course.findByIdAndUpdate(req.params.id, value, {
      new: true,
    });
    if (!updatedCourse) {
      logger.warn(`Course with ID ${req.params.id} not found for update.`);
      throw createError(404, "Course not found");
    }

    logger.info(
      `Course updated successfully: ${
        updatedCourse.courseName || "Unnamed Course"
      }`
    );
    res.status(200).json(updatedCourse);
  } catch (error) {
    logger.error(`Error updating course with ID: ${req.params.id}`, {
      error: error.message,
    });
    throw createError(500, "Internal server error");
  }
};

// Delete Course
export const deleteCourse = async (req, res,Course) => {
  try {
    logger.info(`Attempting to delete course with ID: ${req.params.id}`);
    const deletedCourse = await Course.findByIdAndDelete(req.params.id);
    if (!deletedCourse) {
      logger.warn(`Course with ID ${req.params.id} not found for deletion.`);
      throw createError(404, "Course not found");
    }

    logger.info(
      `Course deleted successfully: ${
        deletedCourse.courseName || "Unnamed Course"
      }`
    );
    res.status(200).json({ message: "Course deleted successfully" });
  } catch (error) {
    logger.error(`Error deleting course with ID: ${req.params.id}`, {
      error: error.message,
    });
    throw createError(500, "Internal server error");
  }
};
