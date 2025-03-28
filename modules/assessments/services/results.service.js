import Joi from "joi";
import { createError } from "../../../services/errorhandling.service.js";
import loggingService from "../../../services/logging.service.js";

const logger = loggingService.getModuleLogger("ResultsService");

// Joi validation schema
const resultsSchema = Joi.object({
  worksheetOrAssessmentId: Joi.string().required(),
  studentId: Joi.string().required(),
  submittedDate: Joi.date().required(),
  discussion: Joi.string().optional(),
  marksObtained: Joi.number().required(),
  grade: Joi.string().optional(),
  passed: Joi.boolean().required(),
  remarks: Joi.string().optional(),
  feedback: Joi.string().optional(),
  notes: Joi.string().optional(),
  taskId: Joi.string().optional(),
  version: Joi.number().default(1),
});

// Get Schema based on Version
const getSchemaForVersion = (version) => {
  switch (version) {
    case 1:
      return resultsSchema;
    case 2:
      return resultsSchema.keys({
        extraFieldForV2: Joi.string().optional(),
      });
    case 3:
      return resultsSchema.keys({
        extraFieldForV2: Joi.string().optional(),
        newFieldForV3: Joi.string().optional(),
      });
    default:
      return null;
  }
};

// Get all results
export const getAllResults = async (req, res, Results) => {
  try {
    logger.info("Fetching all results...");
    const results = await Results.find();
    logger.info(`Fetched ${results.length} results successfully.`);
    res.status(200).json(results);
  } catch (error) {
    logger.error("Error fetching results", { error: error.message });
    throw createError(500, "Internal server error");
  }
};

// Get result by ID
export const getResultById = async (req, res, Results) => {
  try {
    logger.info(`Fetching result with ID: ${req.params.id}`);
    const result = await Results.findById(req.params.id);
    if (!result) {
      logger.warn(`Result with ID ${req.params.id} not found.`);
      throw createError(404, "Result not found");
    }
    logger.info(
      `Fetched result successfully for student ID: ${result.studentId}`
    );
    res.status(200).json(result);
  } catch (error) {
    logger.error(`Error fetching result with ID: ${req.params.id}`, {
      error: error.message,
    });
    throw createError(500, "Internal server error");
  }
};

// Create result
export const createResult = async (req, res, Results) => {
  try {
    logger.info("Validating result data for creation...");
    const { version = 1 } = req.body;
    const schema = getSchemaForVersion(version);

    if (!schema) {
      logger.warn("Invalid version provided for result creation.");
      throw createError(400, "Invalid version provided");
    }

    const { error, value } = schema.validate(req.body);
    if (error) {
      logger.warn(`Validation failed: ${error.details[0].message}`);
      throw createError(422, error.details[0].message);
    }

    logger.info(`Creating result for student ID: ${value.studentId}`);
    const newResult = new Results(value);
    const savedResult = await newResult.save();
    logger.info(
      `Result created successfully for student ID: ${savedResult.studentId}`
    );
    res.status(201).json(savedResult);
  } catch (error) {
    logger.error("Error creating result", { error: error.message });
    throw createError(500, "Internal server error");
  }
};

// Update result
export const updateResult = async (req, res, Results) => {
  try {
    logger.info(`Validating update data for result ID: ${req.params.id}`);
    const { version = 1 } = req.body;
    const schema = getSchemaForVersion(version);

    if (!schema) {
      logger.warn("Invalid version provided for result update.");
      throw createError(400, "Invalid version provided");
    }

    const { error, value } = schema.validate(req.body);
    if (error) {
      logger.warn(`Validation failed for update: ${error.details[0].message}`);
      throw createError(422, error.details[0].message);
    }

    logger.info(`Updating result with ID: ${req.params.id}`);
    const updatedResult = await Results.findByIdAndUpdate(
      req.params.id,
      value,
      { new: true }
    );
    if (!updatedResult) {
      logger.warn(`Result with ID ${req.params.id} not found for update.`);
      throw createError(404, "Result not found");
    }

    logger.info(
      `Result updated successfully for student ID: ${updatedResult.studentId}`
    );
    res.status(200).json(updatedResult);
  } catch (error) {
    logger.error(`Error updating result with ID: ${req.params.id}`, {
      error: error.message,
    });
    throw createError(500, "Internal server error");
  }
};

// Delete result
export const deleteResult = async (req, res, Results) => {
  try {
    logger.info(`Attempting to delete result with ID: ${req.params.id}`);
    const deletedResult = await Results.findByIdAndDelete(req.params.id);
    if (!deletedResult) {
      logger.warn(`Result with ID ${req.params.id} not found for deletion.`);
      throw createError(404, "Result not found");
    }

    logger.info(
      `Result deleted successfully for student ID: ${deletedResult.studentId}`
    );
    res.status(200).json({ message: "Result deleted successfully" });
  } catch (error) {
    logger.error(`Error deleting result with ID: ${req.params.id}`, {
      error: error.message,
    });
    throw createError(500, "Internal server error");
  }
};
