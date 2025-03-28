import Joi from "joi";
import { createError } from "../../../services/errorhandling.service.js";
import loggingService from "../../../services/logging.service.js";

const logger = loggingService.getModuleLogger("PTMService");

// Joi Validation Schema for PTM
const basePTMSchema = {
  branchId: Joi.string().required(),
  classroomId: Joi.string().required(),
  startTime: Joi.string().required(),
  endTime: Joi.string().required(),
  coordinatorId: Joi.string().required(),
  studentId: Joi.string().required(),
  mode: Joi.string().valid("online", "offline").required(),
  taskId: Joi.string().optional(),
  type: Joi.string().required(),
  feedbackId: Joi.string().required(),
  version: Joi.number().default(1),
};

// Get Schema based on Version
const getPTMSchemaForVersion = (version) => {
  switch (version) {
    case 1:
      return Joi.object(basePTMSchema);
    case 2:
      return Joi.object({
        ...basePTMSchema,
        extraFieldForV2: Joi.string().optional(),
      });
    case 3:
      return Joi.object({
        ...basePTMSchema,
        extraFieldForV2: Joi.string().optional(),
        newFieldForV3: Joi.string().optional(),
      });
    default:
      return null;
  }
};

// Get All PTMs
export const getAllPTMs = async (PTM) => {
  try {
    logger.info("Fetching all PTMs...");
    const ptms = await PTM.find();
    logger.info(`Fetched ${ptms.length} PTMs successfully.`);
    return ptms;
  } catch (error) {
    logger.error("Error fetching PTMs:", error);
    throw createError(500, "Failed to fetch PTMs");
  }
};

// Get PTM by ID
export const getPTMById = async (id, PTM) => {
  try {
    logger.info(`Fetching PTM with ID: ${id}`);
    const ptm = await PTM.findById(id);

    if (!ptm) {
      logger.warn(`PTM with ID ${id} not found.`);
      throw createError(404, "PTM not found");
    }

    logger.info(`PTM with ID ${id} fetched successfully.`);
    return ptm;
  } catch (error) {
    logger.error(`Error fetching PTM with ID ${id}:`, error);
    throw createError(500, "Failed to fetch PTM");
  }
};

// Create PTM
export const createPTM = async (data, PTM) => {
  try {
    const version = data.version || 1;
    const schema = getPTMSchemaForVersion(version);

    if (!schema) {
      logger.warn("Invalid version provided for PTM creation.");
      throw createError(400, "Invalid version provided");
    }

    logger.info("Validating PTM data for creation...");
    const { error, value } = schema.validate(data);

    if (error) {
      logger.warn(`Validation failed: ${error.details[0].message}`);
      throw createError(422, error.details[0].message);
    }

    logger.info("Creating new PTM...");
    const newPTM = new PTM(value);
    await newPTM.save();
    logger.info("PTM created successfully.");

    return newPTM;
  } catch (error) {
    logger.error("Error creating PTM:", error);
    throw createError(500, "Failed to create PTM");
  }
};

// Update PTM
export const updatePTM = async (id, data, PTM) => {
  try {
    logger.info(`Validating update data for PTM ID: ${id}`);

    const version = data.version || 1;
    const schema = getPTMSchemaForVersion(version);

    if (!schema) {
      logger.warn("Invalid version provided for PTM update.");
      throw createError(400, "Invalid version provided");
    }

    const { error, value } = schema.validate(data);
    if (error) {
      logger.warn(`Validation failed: ${error.details[0].message}`);
      throw createError(422, error.details[0].message);
    }

    logger.info(`Updating PTM with ID: ${id}`);
    const updatedPTM = await PTM.findByIdAndUpdate(id, value, { new: true });

    if (!updatedPTM) {
      logger.warn(`PTM with ID ${id} not found for update.`);
      throw createError(404, "PTM not found");
    }

    logger.info(`PTM with ID ${id} updated successfully.`);
    return updatedPTM;
  } catch (error) {
    logger.error(`Error updating PTM with ID ${id}:`, error);
    throw createError(500, "Failed to update PTM");
  }
};

// Delete PTM
export const deletePTM = async (id, PTM) => {
  try {
    logger.info(`Attempting to delete PTM with ID: ${id}`);
    const deletedPTM = await PTM.findByIdAndDelete(id);

    if (!deletedPTM) {
      logger.warn(`PTM with ID ${id} not found for deletion.`);
      throw createError(404, "PTM not found");
    }

    logger.info(`PTM with ID ${id} deleted successfully.`);
    return { message: "PTM deleted successfully" };
  } catch (error) {
    logger.error(`Error deleting PTM with ID ${id}:`, error);
    throw createError(500, "Failed to delete PTM");
  }
};
