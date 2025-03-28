import Joi from "joi";
import { createError } from "../../../services/errorhandling.service.js";
import loggingService from "../../../services/logging.service.js";

const logger = loggingService.getModuleLogger("CalendarService");

// Base Joi Validation Schema
const baseCalendarSchema = {
  type: Joi.string().valid("general", "special").required(),
  branchIds: Joi.array().items(Joi.string().regex(/^[0-9a-fA-F]{24}$/)).required(),
  holidayType: Joi.string().optional(),
  holidayStartDate: Joi.string().required(),
  holidayEndDate: Joi.string().required(),
  announcementDate: Joi.string().required(),
  announcementTime: Joi.string().optional(),
  reasonForHoliday: Joi.string().required(),
  notes: Joi.string().optional(),
  version: Joi.number().default(1),
};

// Get Schema based on Version
const getSchemaForVersion = (version) => {
  switch (version) {
    case 1:
      return Joi.object(baseCalendarSchema);
    case 2:
      return Joi.object({
        ...baseCalendarSchema,
        extraFieldForV2: Joi.string().optional(),
      });
    case 3:
      return Joi.object({
        ...baseCalendarSchema,
        extraFieldForV2: Joi.string().optional(),
        newFieldForV3: Joi.string().optional(),
      });
    default:
      return null;
  }
};

// Fetch all calendar entries
export const getAllCalendarEntries = async (Calendar) => {
  try {
    logger.info("Fetching all calendar entries...");
    return await Calendar.find();
  } catch (error) {
    logger.error("Error fetching calendar entries:", error);
    throw createError(500, "Failed to fetch calendar entries");
  }
};

// Fetch calendar entry by ID
export const getCalendarEntryById = async (id, Calendar) => {
  try {
    logger.info(`Fetching calendar entry with ID: ${id}`);
    const entry = await Calendar.findById(id);
    if (!entry) throw createError(404, "Calendar entry not found");
    return entry;
  } catch (error) {
    logger.error(`Error fetching calendar entry with ID ${id}:`, error);
    throw createError(500, "Failed to fetch calendar entry");
  }
};

// Create a new calendar entry
export const createCalendarEntry = async (data, Calendar) => {
  try {
    const version = data.version || 1;
    const schema = getSchemaForVersion(version);

    if (!schema) {
      logger.warn("Invalid version provided for calendar entry creation.");
      throw createError(400, "Invalid version provided");
    }

    const { error, value } = schema.validate(data);
    if (error) throw createError(422, error.details[0].message);

    logger.info("Creating new calendar entry...");
    const newEntry = new Calendar(value);
    await newEntry.save();
    return newEntry;
  } catch (error) {
    logger.error("Error creating calendar entry:", error);
    throw createError(500, "Failed to create calendar entry");
  }
};

// Update calendar entry
export const updateCalendarEntry = async (id, data, Calendar) => {
  try {
    const version = data.version || 1;
    const schema = getSchemaForVersion(version);

    if (!schema) {
      logger.warn("Invalid version provided for calendar entry update.");
      throw createError(400, "Invalid version provided");
    }

    const { error, value } = schema.validate(data);
    if (error) throw createError(422, error.details[0].message);

    logger.info(`Updating calendar entry with ID: ${id}`);
    const updatedEntry = await Calendar.findByIdAndUpdate(id, value, { new: true });
    if (!updatedEntry) throw createError(404, "Calendar entry not found");

    return updatedEntry;
  } catch (error) {
    logger.error(`Error updating calendar entry with ID ${id}:`, error);
    throw createError(500, "Failed to update calendar entry");
  }
};

// Delete calendar entry
export const deleteCalendarEntry = async (id, Calendar) => {
  try {
    logger.info(`Deleting calendar entry with ID: ${id}`);
    const deletedEntry = await Calendar.findByIdAndDelete(id);
    if (!deletedEntry) throw createError(404, "Calendar entry not found");

    return { message: "Calendar entry deleted successfully" };
  } catch (error) {
    logger.error(`Error deleting calendar entry with ID ${id}:`, error);
    throw createError(500, "Failed to delete calendar entry");
  }
};
