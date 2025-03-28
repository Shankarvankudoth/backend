import Joi from "joi";
import { createError } from "../../../services/errorhandling.service.js";
import loggingService from "../../../services/logging.service.js";

const logger = loggingService.getModuleLogger("LeavesService");

// Base Joi Schema
const baseLeavesSchema = {
  userId: Joi.string().required(),
  startDate: Joi.date().required(),
  endDate: Joi.date().required(),
  reason: Joi.string().required(),
  approver: Joi.array().items(Joi.string()).required(),
  approvedStatus: Joi.boolean().required(),
  taskId: Joi.string().optional(),
  version: Joi.number().default(1),
};

// Get Schema based on Version
const getSchemaForVersion = (version) => {
  switch (version) {
    case 1:
      return Joi.object(baseLeavesSchema);
    case 2:
      return Joi.object({
        ...baseLeavesSchema,
        extraFieldForV2: Joi.string().optional(),
      });
    case 3:
      return Joi.object({
        ...baseLeavesSchema,
        extraFieldForV2: Joi.string().optional(),
        newFieldForV3: Joi.string().optional(),
      });
    default:
      return null;
  }
};

// Get all leave records
export const getAllLeaves = async (Leaves) => {
  try {
    logger.info("Fetching all leaves...");
    return await Leaves.find();
  } catch (error) {
    logger.error("Error fetching leaves:", error);
    throw createError(500, "Failed to fetch leaves");
  }
};

// Get leave by ID
export const getLeaveById = async (id, Leaves) => {
  try {
    logger.info(`Fetching leave with ID: ${id}`);
    const leave = await Leaves.findById(id);
    if (!leave) throw createError(404, "Leave not found");
    return leave;
  } catch (error) {
    logger.error(`Error fetching leave with ID ${id}:`, error);
    throw createError(500, "Failed to fetch leave");
  }
};

// Create a leave record
export const createLeave = async (data, Leaves) => {
  try {
    const version = data.version || 1;
    const schema = getSchemaForVersion(version);

    if (!schema) {
      logger.warn("Invalid version provided for leave creation.");
      throw createError(400, "Invalid version provided");
    }

    const { error, value } = schema.validate(data);
    if (error) throw createError(422, error.details[0].message);

    logger.info("Creating new leave record...");
    const newLeave = new Leaves(value);
    await newLeave.save();
    return newLeave;
  } catch (error) {
    logger.error("Error creating leave record:", error);
    throw createError(500, "Failed to create leave record");
  }
};

// Update a leave record
export const updateLeave = async (id, data, Leaves) => {
  try {
    const version = data.version || 1;
    const schema = getSchemaForVersion(version);

    if (!schema) {
      logger.warn("Invalid version provided for leave update.");
      throw createError(400, "Invalid version provided");
    }

    const { error, value } = schema.validate(data);
    if (error) throw createError(422, error.details[0].message);

    logger.info(`Updating leave record with ID: ${id}`);
    const updatedLeave = await Leaves.findByIdAndUpdate(id, value, { new: true });
    if (!updatedLeave) throw createError(404, "Leave record not found");

    return updatedLeave;
  } catch (error) {
    logger.error(`Error updating leave record with ID ${id}:`, error);
    throw createError(500, "Failed to update leave record");
  }
};

// Delete a leave record
export const deleteLeave = async (id, Leaves) => {
  try {
    logger.info(`Deleting leave record with ID: ${id}`);
    const deletedLeave = await Leaves.findByIdAndDelete(id);
    if (!deletedLeave) throw createError(404, "Leave record not found");

    return { message: "Leave record deleted successfully" };
  } catch (error) {
    logger.error(`Error deleting leave record with ID ${id}:`, error);
    throw createError(500, "Failed to delete leave record");
  }
};
