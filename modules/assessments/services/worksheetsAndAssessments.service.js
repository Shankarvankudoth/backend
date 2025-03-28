import Joi from "joi";
import { createError } from "../../../services/errorhandling.service.js";
import loggingService from "../../../services/logging.service.js";

const logger = loggingService.getModuleLogger(
  "WorksheetsAndAssessmentsService"
);

// Joi validation schema
const worksheetsAndAssessmentsSchema = Joi.object({
  facultyId: Joi.string().optional(),
  type: Joi.string().valid("worksheet", "assessment").required(),
  subject: Joi.string().required(),
  batchId: Joi.string().required(),
  topic: Joi.string().required(),
  givenDate: Joi.date().required(),
  targetSubmissionDate: Joi.date().required(),
  discussedDate: Joi.date().optional(),
  passMarks: Joi.number().optional(),
  maximumMarks: Joi.number().optional(),
  deliveryMode: Joi.string().valid("online", "offline").optional(),
  documentIds: Joi.array().items(Joi.string()).optional(),
  onlineTestId: Joi.string().optional(),
  maxQuestions: Joi.number().optional(),
  minQuestions: Joi.number().optional(),
  version: Joi.number().default(1),
});

// Get Schema based on Version
const getSchemaForVersion = (version) => {
  switch (version) {
    case 1:
      return  worksheetsAndAssessmentsSchema;
    case 2:
      return  worksheetsAndAssessmentsSchema.keys({
        extraFieldForV2: Joi.string().optional(),
      });
    case 3:
      return  worksheetsAndAssessmentsSchema.keys({
        extraFieldForV2: Joi.string().optional(),
        newFieldForV3: Joi.string().optional(),
      });
    default:
      return null;
  }
};

// Get all worksheets and assessments
export const getAllWorksheetsAndAssessments = async (req, res, WorksheetsAndAssessments) => {
  try {
    logger.info("Fetching all worksheets and assessments...");
    const records = await WorksheetsAndAssessments.find();
    logger.info(
      `Fetched ${records.length} worksheets and assessments successfully.`
    );
    res.status(200).json(records);
  } catch (error) {
    logger.error("Error fetching worksheets and assessments", {
      error: error.message,
    });
    throw createError(500, "Internal server error");
  }
};

// Get worksheet or assessment by ID
export const getWorksheetOrAssessmentById = async (req, res, WorksheetsAndAssessments) => {
  try {
    logger.info(`Fetching worksheet or assessment with ID: ${req.params.id}`);
    const record = await WorksheetsAndAssessments.findById(req.params.id);
    if (!record) {
      logger.warn(
        `Worksheet or assessment with ID ${req.params.id} not found.`
      );
      throw createError(404, "Worksheet or assessment not found");
    }
    logger.info(
      `Successfully fetched worksheet or assessment with ID: ${req.params.id}`
    );
    res.status(200).json(record);
  } catch (error) {
    logger.error(
      `Error fetching worksheet or assessment with ID: ${req.params.id}`,
      { error: error.message }
    );
    throw createError(500, "Internal server error");
  }
};

// Create a new worksheet or assessment
export const createWorksheetOrAssessment = async (req, res, WorksheetsAndAssessments) => {
  try {
    logger.info("Validating worksheet or assessment data for creation...");
    const { version = 1 } = req.body;
    const schema = getSchemaForVersion(version);

    if (!schema) {
      logger.warn("Invalid version provided for subject creation.");
      throw createError(400, "Invalid version provided");
    }

    const { error, value } = schema.validate(req.body);
    if (error) {
      logger.warn(`Validation failed: ${error.details[0].message}`);
      throw createError(422, error.details[0].message);
    }

    logger.info(`Creating new worksheet or assessment of type: ${value.type}`);
    const newRecord = new WorksheetsAndAssessments(value);
    const savedRecord = await newRecord.save();
    logger.info(
      `Worksheet or assessment created successfully with ID: ${savedRecord._id}`
    );
    res.status(201).json(savedRecord);
  } catch (error) {
    logger.error("Error creating worksheet or assessment", {
      error: error.message,
    });
    throw createError(500, "Internal server error");
  }
};

// Update an existing worksheet or assessment
export const updateWorksheetOrAssessment = async (req, res, WorksheetsAndAssessments) => {
  try {
    logger.info(
      `Validating update data for worksheet or assessment ID: ${req.params.id}`
    );
    const { version = 1 } = req.body;
    const schema = getSchemaForVersion(version);

    if (!schema) {
      logger.warn("Invalid version provided for subject creation.");
      throw createError(400, "Invalid version provided");
    }

    const { error, value } = schema.validate(req.body);
    if (error) {
      logger.warn(`Validation failed: ${error.details[0].message}`);
      throw createError(422, error.details[0].message);
    }

    logger.info(`Updating worksheet or assessment with ID: ${req.params.id}`);
    const updatedRecord = await WorksheetsAndAssessments.findByIdAndUpdate(
      req.params.id,
      value,
      { new: true }
    );
    if (!updatedRecord) {
      logger.warn(
        `Worksheet or assessment with ID ${req.params.id} not found.`
      );
      throw createError(404, "Worksheet or assessment not found");
    }

    logger.info(
      `Worksheet or assessment updated successfully with ID: ${updatedRecord._id}`
    );
    res.status(200).json(updatedRecord);
  } catch (error) {
    logger.error(
      `Error updating worksheet or assessment with ID: ${req.params.id}`,
      { error: error.message }
    );
    throw createError(500, "Internal server error");
  }
};

// Delete a worksheet or assessment
export const deleteWorksheetOrAssessment = async (req, res, WorksheetsAndAssessments) => {
  try {
    logger.info(
      `Attempting to delete worksheet or assessment with ID: ${req.params.id}`
    );
    const deletedRecord = await WorksheetsAndAssessments.findByIdAndDelete(
      req.params.id
    );
    if (!deletedRecord) {
      logger.warn(
        `Worksheet or assessment with ID ${req.params.id} not found.`
      );
      throw createError(404, "Worksheet or assessment not found");
    }

    logger.info(
      `Worksheet or assessment deleted successfully with ID: ${deletedRecord._id}`
    );
    res
      .status(200)
      .json({ message: "Worksheet or assessment deleted successfully" });
  } catch (error) {
    logger.error(
      `Error deleting worksheet or assessment with ID: ${req.params.id}`,
      { error: error.message }
    );
    throw createError(500, "Internal server error");
  }
};
