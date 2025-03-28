import Joi from "joi";
import { createError } from "../../../services/errorhandling.service.js";
import loggingService from "../../../services/logging.service.js";

const logger = loggingService.getModuleLogger("MarksCardService");

// Joi validation schema
const marksCardSchema = Joi.object({
  studentId: Joi.string().required(),
  batchId: Joi.string().required(),
  admissionId: Joi.string().required(),
  schoolId: Joi.string().required(),
  standard: Joi.string().required(),
  board: Joi.string().required(),
  marks: Joi.object()
    .pattern(
      Joi.string(),
      Joi.object({
        marksObtained: Joi.number().required(),
        maxMarks: Joi.number().required(),
        result: Joi.string().valid("PASS", "FAIL").required(),
        grade: Joi.string().required(),
      })
    )
    .required(),
  dateOfReport: Joi.date().required(),
  documentsId: Joi.array().items(Joi.string().required()).required(),
  version: Joi.number().default(1),
});

// Get Schema based on Version
const getSchemaForVersion = (version) => {
  switch (version) {
    case 1:
      return marksCardSchema;
    case 2:
      return marksCardSchema.keys({
        extraFieldForV2: Joi.string().optional(),
      });
    case 3:
      return marksCardSchema.keys({
        extraFieldForV2: Joi.string().optional(),
        newFieldForV3: Joi.string().optional(),
      });
    default:
      return null;
  }
};

// Get all marks cards
export const getAllMarksCards = async (req, res, MarksCard) => {
  try {
    logger.info("Fetching all marks cards...");
    const marksCards = await MarksCard.find();
    logger.info(`Fetched ${marksCards.length} marks cards successfully.`);
    res.status(200).json(marksCards);
  } catch (error) {
    logger.error("Error fetching marks cards", { error: error.message });
    throw createError(500, "Internal server error");
  }
};

// Get marks card by ID
export const getMarksCardById = async (req, res, MarksCard) => {
  try {
    logger.info(`Fetching marks card with ID: ${req.params.id}`);
    const marksCard = await MarksCard.findById(req.params.id);
    if (!marksCard) {
      logger.warn(`Marks card with ID ${req.params.id} not found.`);
      throw createError(404, "Marks card not found");
    }
    logger.info(`Fetched marks card successfully for student ID: ${marksCard.studentId}`);
    res.status(200).json(marksCard);
  } catch (error) {
    logger.error(`Error fetching marks card with ID: ${req.params.id}`, {
      error: error.message,
    });
    throw createError(500, "Internal server error");
  }
};

// Create marks card
export const createMarksCard = async (req, res, MarksCard) => {
  try {
    logger.info("Validating marks card data for creation...");
    const { version = 1 } = req.body;
    const schema = getSchemaForVersion(version);

    if (!schema) {
      logger.warn("Invalid version provided for marks card creation.");
      throw createError(400, "Invalid version provided");
    }

    const { error, value } = schema.validate(req.body);
    if (error) {
      logger.warn(`Validation failed: ${error.details[0].message}`);
      throw createError(422, error.details[0].message);
    }

    logger.info(`Creating marks card for student ID: ${value.studentId}`);
    const newMarksCard = new MarksCard(value);
    const savedMarksCard = await newMarksCard.save();
    logger.info(`Marks card created successfully for student ID: ${savedMarksCard.studentId}`);
    res.status(201).json(savedMarksCard);
  } catch (error) {
    logger.error("Error creating marks card", { error: error.message });
    throw createError(500, "Internal server error");
  }
};

// Update marks card
export const updateMarksCard = async (req, res, MarksCard) => {
  try {
    logger.info(`Validating update data for marks card ID: ${req.params.id}`);
    const { version = 1 } = req.body;
    const schema = getSchemaForVersion(version);

    if (!schema) {
      logger.warn("Invalid version provided for marks card update.");
      throw createError(400, "Invalid version provided");
    }

    const { error, value } = schema.validate(req.body);
    if (error) {
      logger.warn(`Validation failed for update: ${error.details[0].message}`);
      throw createError(422, error.details[0].message);
    }

    logger.info(`Updating marks card with ID: ${req.params.id}`);
    const updatedMarksCard = await MarksCard.findByIdAndUpdate(req.params.id, value, { new: true });
    if (!updatedMarksCard) {
      logger.warn(`Marks card with ID ${req.params.id} not found for update.`);
      throw createError(404, "Marks card not found");
    }

    logger.info(`Marks card updated successfully for student ID: ${updatedMarksCard.studentId}`);
    res.status(200).json(updatedMarksCard);
  } catch (error) {
    logger.error(`Error updating marks card with ID: ${req.params.id}`, { error: error.message });
    throw createError(500, "Internal server error");
  }
};

// Delete marks card
export const deleteMarksCard = async (req, res, MarksCard) => {
  try {
    logger.info(`Attempting to delete marks card with ID: ${req.params.id}`);
    const deletedMarksCard = await MarksCard.findByIdAndDelete(req.params.id);
    if (!deletedMarksCard) {
      logger.warn(`Marks card with ID ${req.params.id} not found for deletion.`);
      throw createError(404, "Marks card not found");
    }

    logger.info(`Marks card deleted successfully for student ID: ${deletedMarksCard.studentId}`);
    res.status(200).json({ message: "Marks card deleted successfully" });
  } catch (error) {
    logger.error(`Error deleting marks card with ID: ${req.params.id}`, { error: error.message });
    throw createError(500, "Internal server error");
  }
};
