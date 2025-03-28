import Joi from "joi";
import { createError } from "../../../services/errorhandling.service.js";
import loggingService from "../../../services/logging.service.js";

const logger = loggingService.getModuleLogger("FeeStructureService");

// Joi Validation Schema for FeeStructure
const baseFeeStructureSchema = {
  academicYear: Joi.string().required(),
  subjectIds: Joi.array().items(Joi.string()).required(),
  feeAmount: Joi.number().required(),
  notes: Joi.array().items(Joi.string()).optional(),
  version: Joi.number().default(1),
};

// Get Schema based on Version
const getFeeStructureSchemaForVersion = (version) => {
  switch (version) {
    case 1:
      return Joi.object(baseFeeStructureSchema);
    case 2:
      return Joi.object({
        ...baseFeeStructureSchema,
        extraFieldForV2: Joi.string().optional(),
      });
    case 3:
      return Joi.object({
        ...baseFeeStructureSchema,
        extraFieldForV2: Joi.string().optional(),
        newFieldForV3: Joi.string().optional(),
      });
    default:
      return null;
  }
};

// Get All FeeStructures
export const getAllFeeStructures = async (FeeStructure) => {
  try {
    logger.info("Fetching all FeeStructures...");
    const feeStructures = await FeeStructure.find();
    logger.info(`Fetched ${feeStructures.length} FeeStructures successfully.`);
    return feeStructures;
  } catch (error) {
    logger.error("Error fetching FeeStructures:", error);
    throw createError(500, "Failed to fetch FeeStructures");
  }
};

// Get FeeStructure by ID
export const getFeeStructureById = async (id, FeeStructure) => {
  try {
    logger.info(`Fetching FeeStructure with ID: ${id}`);
    const feeStructure = await FeeStructure.findById(id);

    if (!feeStructure) {
      logger.warn(`FeeStructure with ID ${id} not found.`);
      throw createError(404, "FeeStructure not found");
    }

    logger.info(`FeeStructure with ID ${id} fetched successfully.`);
    return feeStructure;
  } catch (error) {
    logger.error(`Error fetching FeeStructure with ID ${id}:`, error);
    throw createError(500, "Failed to fetch FeeStructure");
  }
};

// Create FeeStructure
export const createFeeStructure = async (data, FeeStructure) => {
  try {
    const version = data.version || 1;
    const schema = getFeeStructureSchemaForVersion(version);

    if (!schema) {
      logger.warn("Invalid version provided for FeeStructure creation.");
      throw createError(400, "Invalid version provided");
    }

    logger.info("Validating FeeStructure data for creation...");
    const { error, value } = schema.validate(data);

    if (error) {
      logger.warn(`Validation failed: ${error.details[0].message}`);
      throw createError(422, error.details[0].message);
    }

    logger.info("Creating new FeeStructure...");
    const newFeeStructure = new FeeStructure(value);
    await newFeeStructure.save();
    logger.info("FeeStructure created successfully.");

    return newFeeStructure;
  } catch (error) {
    logger.error("Error creating FeeStructure:", error);
    throw createError(500, "Failed to create FeeStructure");
  }
};

// Update FeeStructure
export const updateFeeStructure = async (id, data, FeeStructure) => {
  try {
    logger.info(`Validating update data for FeeStructure ID: ${id}`);

    const version = data.version || 1;
    const schema = getFeeStructureSchemaForVersion(version);

    if (!schema) {
      logger.warn("Invalid version provided for FeeStructure update.");
      throw createError(400, "Invalid version provided");
    }

    const { error, value } = schema.validate(data);
    if (error) {
      logger.warn(`Validation failed: ${error.details[0].message}`);
      throw createError(422, error.details[0].message);
    }

    logger.info(`Updating FeeStructure with ID: ${id}`);
    const updatedFeeStructure = await FeeStructure.findByIdAndUpdate(id, value, { new: true });

    if (!updatedFeeStructure) {
      logger.warn(`FeeStructure with ID ${id} not found for update.`);
      throw createError(404, "FeeStructure not found");
    }

    logger.info(`FeeStructure with ID ${id} updated successfully.`);
    return updatedFeeStructure;
  } catch (error) {
    logger.error(`Error updating FeeStructure with ID ${id}:`, error);
    throw createError(500, "Failed to update FeeStructure");
  }
};

// Delete FeeStructure
export const deleteFeeStructure = async (id, FeeStructure) => {
  try {
    logger.info(`Attempting to delete FeeStructure with ID: ${id}`);
    const deletedFeeStructure = await FeeStructure.findByIdAndDelete(id);

    if (!deletedFeeStructure) {
      logger.warn(`FeeStructure with ID ${id} not found for deletion.`);
      throw createError(404, "FeeStructure not found");
    }

    logger.info(`FeeStructure with ID ${id} deleted successfully.`);
    return { message: "FeeStructure deleted successfully" };
  } catch (error) {
    logger.error(`Error deleting FeeStructure with ID ${id}:`, error);
    throw createError(500, "Failed to delete FeeStructure");
  }
};
