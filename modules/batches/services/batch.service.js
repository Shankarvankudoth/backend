import Joi from "joi";
import { createError } from "../../../services/errorhandling.service.js";
import loggingService from "../../../services/logging.service.js";

const logger = loggingService.getModuleLogger("BatchService");

// Joi validation schema
const batchSchema = Joi.object({
  courseId: Joi.string().required(),
  branchId: Joi.string().required(),
  startDate: Joi.date().required(),
  endDate: Joi.date().required(),
  academicYear: Joi.string().required(),
  classRoom: Joi.string().optional(),
  maxStudents: Joi.number().min(1).required(),
  faculty: Joi.object().optional(),
  startTime: Joi.date().required(),
  endTime: Joi.date().required(),
  batchCode: Joi.string().required(),
  coordinator: Joi.string().optional(),
  students: Joi.array().items(Joi.string()).optional(),
  documentIds: Joi.array().items(Joi.string()).optional(),
  version: Joi.number().default(1),
});

// Get Schema based on Version
const getSchemaForVersion = (version) => {
  switch (version) {
    case 1:
      return batchSchema;
    case 2:
      return batchSchema.keys({
        extraFieldForV2: Joi.string().optional(),
      });
    case 3:
      return batchSchema.keys({
        extraFieldForV2: Joi.string().optional(),
        newFieldForV3: Joi.string().optional(),
      });
    default:
      return null;
  }
};
// Fetch all batches
export const getAllBatches = async (req, res,  Batch) => {
  try {
    logger.info("Fetching all batches...");
    const records = await Batch.find();
    logger.info(`Fetched ${records.length} batches successfully.`);
    res.status(200).json(records);
  } catch (error) {
    logger.error("Error fetching batches", { error: error.message });
    throw createError(500, "Internal server error");
  }
};

// Fetch batch by ID
export const getBatchById = async (req, res,  Batch) => {
  try {
    logger.info(`Fetching batch with ID: ${req.params.id}`);
    const record = await Batch.findById(req.params.id);
    if (!record) {
      logger.warn(`Batch with ID ${req.params.id} not found.`);
      throw createError(404, "Batch not found");
    }
    res.status(200).json(record);
  } catch (error) {
    logger.error(`Error fetching batch with ID: ${req.params.id}`, {
      error: error.message,
    });
    throw createError(500, "Internal server error");
  }
};

// Create a new batch
export const createBatch = async (req, res, Batch) => {
  try {
    logger.info("Validating batch data for creation...");
    const { version = 1 } = req.body;
    const schema = getSchemaForVersion(version);

    if (!schema) {
      logger.warn("Invalid version provided for batch creation.");
      throw createError(400, "Invalid version provided");
    }

    const { error, value } = schema.validate(req.body);
    if (error) {
      logger.warn(`Validation failed: ${error.details[0].message}`);
      throw createError(422, error.details[0].message);
    }

    logger.info("Creating new batch...");
    const newRecord = new Batch(value);
    const savedRecord = await newRecord.save();
    logger.info("Batch created successfully.");
    res.status(201).json(savedRecord);
  } catch (error) {
    logger.error("Error creating batch", { error: error.message });
    throw createError(500, "Internal server error");
  }
};

// Update an existing batch
export const updateBatch = async (req, res,  Batch) => {
  try {
    logger.info(`Validating update data for batch ID: ${req.params.id}`);
    const { version = 1 } = req.body;
    const schema = getSchemaForVersion(version);

    if (!schema) {
      logger.warn("Invalid version provided for batch update.");
      throw createError(400, "Invalid version provided");
    }

    const { error, value } = schema.validate(req.body);
    if (error) {
      logger.warn(`Validation failed for update: ${error.details[0].message}`);
      throw createError(422, error.details[0].message);
    }

    logger.info(`Updating batch with ID: ${req.params.id}`);
    const updatedRecord = await Batch.findByIdAndUpdate(req.params.id, value, {
      new: true,
    });
    if (!updatedRecord) {
      logger.warn(`Batch with ID ${req.params.id} not found for update.`);
      throw createError(404, "Batch not found");
    }

    logger.info("Batch updated successfully.");
    res.status(200).json(updatedRecord);
  } catch (error) {
    logger.error(`Error updating batch with ID: ${req.params.id}`, {
      error: error.message,
    });
    throw createError(500, "Internal server error");
  }
};

// Delete a batch
export const deleteBatch = async (req, res,  Batch) => {
  try {
    logger.info(`Attempting to delete batch with ID: ${req.params.id}`);
    const deletedRecord = await Batch.findByIdAndDelete(req.params.id);
    if (!deletedRecord) {
      logger.warn(`Batch with ID ${req.params.id} not found for deletion.`);
      throw createError(404, "Batch not found");
    }

    logger.info("Batch deleted successfully.");
    res.status(200).json({ message: "Batch deleted successfully" });
  } catch (error) {
    logger.error(`Error deleting batch with ID: ${req.params.id}`, {
      error: error.message,
    });
    throw createError(500, "Internal server error");
  }
};
