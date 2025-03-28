import Joi from "joi";
import { createError } from "../../../services/errorhandling.service.js";
import loggingService from "../../../services/logging.service.js";

const logger = loggingService.getModuleLogger("ScheduleService");

// Base Joi Schema
const baseScheduleSchema = {
  batchId: Joi.string().required(),
  classRoomsId: Joi.string().required(),
  type: Joi.string().required(), // E.g., "standard", "special", "online meeting"
  date: Joi.date().required(),
  startTime: Joi.date().required(),
  endTime: Joi.date().required(),
  breakTime: Joi.string().optional(),
  subjectId: Joi.string().required(),
  chapters: Joi.string().optional(),
  facultyId: Joi.string().optional(),
  notes: Joi.string().optional(),
  documentIds: Joi.array().items(Joi.string()).optional(),
  worksheetsAndAssessmentsId: Joi.string().optional(),
  ptmId: Joi.string().optional(),
  taskIds: Joi.array().items(Joi.string()).optional(),
  version: Joi.number().default(1),
};

// Get Schema based on Version
const getSchemaForVersion = (version) => {
  switch (version) {
    case 1:
      return Joi.object(baseScheduleSchema);
    case 2:
      return Joi.object({
        ...baseScheduleSchema,
        extraFieldForV2: Joi.string().optional(),
      });
    case 3:
      return Joi.object({
        ...baseScheduleSchema,
        extraFieldForV2: Joi.string().optional(),
        newFieldForV3: Joi.string().optional(),
      });
    default:
      return null;
  }
};

// Get all schedules
export const getAllSchedules = async (Schedule) => {
  try {
    logger.info("Fetching all schedules...");
    return await Schedule.find();
  } catch (error) {
    logger.error("Error fetching schedules:", error);
    throw createError(500, "Failed to fetch schedules");
  }
};

// Get schedule by ID
export const getScheduleById = async (id, Schedule) => {
  try {
    logger.info(`Fetching schedule with ID: ${id}`);
    const schedule = await Schedule.findById(id);
    if (!schedule) throw createError(404, "Schedule not found");
    return schedule;
  } catch (error) {
    logger.error(`Error fetching schedule with ID ${id}:`, error);
    throw createError(500, "Failed to fetch schedule");
  }
};

// Create a schedule
export const createSchedule = async (data, Schedule) => {
  try {
    const version = data.version || 1;
    const schema = getSchemaForVersion(version);

    if (!schema) {
      logger.warn("Invalid version provided for schedule creation.");
      throw createError(400, "Invalid version provided");
    }

    const { error, value } = schema.validate(data);
    if (error) throw createError(422, error.details[0].message);

    logger.info("Creating new schedule...");
    const newSchedule = new Schedule(value);
    await newSchedule.save();
    return newSchedule;
  } catch (error) {
    logger.error("Error creating schedule:", error);
    throw createError(500, "Failed to create schedule");
  }
};

// Update a schedule
export const updateSchedule = async (id, data, Schedule) => {
  try {
    const version = data.version || 1;
    const schema = getSchemaForVersion(version);

    if (!schema) {
      logger.warn("Invalid version provided for schedule update.");
      throw createError(400, "Invalid version provided");
    }

    const { error, value } = schema.validate(data);
    if (error) throw createError(422, error.details[0].message);

    logger.info(`Updating schedule with ID: ${id}`);
    const updatedSchedule = await Schedule.findByIdAndUpdate(id, value, { new: true });
    if (!updatedSchedule) throw createError(404, "Schedule not found");

    return updatedSchedule;
  } catch (error) {
    logger.error(`Error updating schedule with ID ${id}:`, error);
    throw createError(500, "Failed to update schedule");
  }
};

// Delete a schedule
export const deleteSchedule = async (id, Schedule) => {
  try {
    logger.info(`Deleting schedule with ID: ${id}`);
    const deletedSchedule = await Schedule.findByIdAndDelete(id);
    if (!deletedSchedule) throw createError(404, "Schedule not found");

    return { message: "Schedule deleted successfully" };
  } catch (error) {
    logger.error(`Error deleting schedule with ID ${id}:`, error);
    throw createError(500, "Failed to delete schedule");
  }
};
