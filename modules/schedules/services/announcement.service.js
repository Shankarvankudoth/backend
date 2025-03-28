import Joi from "joi";
import { createError } from "../../../services/errorhandling.service.js";
import loggingService from "../../../services/logging.service.js";

const logger = loggingService.getModuleLogger("AnnouncementService");

// Base Joi Validation Schema
const baseAnnouncementSchema = {
  announcementTitle: Joi.string().required(),
  createdId: Joi.string().required(),
  description: Joi.string().required(),
  dateOfAnnouncement: Joi.string().required(),
  status: Joi.boolean().required(),
  version: Joi.number().default(1),
};

// Get Schema based on Version
const getSchemaForVersion = (version) => {
  switch (version) {
    case 1:
      return Joi.object(baseAnnouncementSchema);
    case 2:
      return Joi.object({
        ...baseAnnouncementSchema,
        extraFieldForV2: Joi.string().optional(),
      });
    case 3:
      return Joi.object({
        ...baseAnnouncementSchema,
        extraFieldForV2: Joi.string().optional(),
        newFieldForV3: Joi.string().optional(),
      });
    default:
      return null;
  }
};

// Get all announcements
export const getAllAnnouncements = async (Announcement) => {
  try {
    logger.info("Fetching all announcements...");
    return await Announcement.find();
  } catch (error) {
    logger.error("Error fetching announcements:", error);
    throw createError(500, "Failed to fetch announcements");
  }
};

// Get an announcement by ID
export const getAnnouncementById = async (id, Announcement) => {
  try {
    logger.info(`Fetching announcement with ID: ${id}`);
    const announcement = await Announcement.findById(id);
    if (!announcement) throw createError(404, "Announcement not found");
    return announcement;
  } catch (error) {
    logger.error(`Error fetching announcement with ID ${id}:`, error);
    throw createError(500, "Failed to fetch announcement");
  }
};

// Create an announcement
export const createAnnouncement = async (data, Announcement) => {
  try {
    const version = data.version || 1;
    const schema = getSchemaForVersion(version);

    if (!schema) {
      logger.warn("Invalid version provided for announcement creation.");
      throw createError(400, "Invalid version provided");
    }

    const { error, value } = schema.validate(data);
    if (error) throw createError(422, error.details[0].message);

    logger.info("Creating new announcement...");
    const newAnnouncement = new Announcement(value);
    await newAnnouncement.save();
    return newAnnouncement;
  } catch (error) {
    logger.error("Error creating announcement:", error);
    throw createError(500, "Failed to create announcement");
  }
};

// Update an announcement
export const updateAnnouncement = async (id, data, Announcement) => {
  try {
    const version = data.version || 1;
    const schema = getSchemaForVersion(version);

    if (!schema) {
      logger.warn("Invalid version provided for announcement update.");
      throw createError(400, "Invalid version provided");
    }

    const { error, value } = schema.validate(data);
    if (error) throw createError(422, error.details[0].message);

    logger.info(`Updating announcement with ID: ${id}`);
    const updatedAnnouncement = await Announcement.findByIdAndUpdate(id, value, { new: true });
    if (!updatedAnnouncement) throw createError(404, "Announcement not found");

    return updatedAnnouncement;
  } catch (error) {
    logger.error(`Error updating announcement with ID ${id}:`, error);
    throw createError(500, "Failed to update announcement");
  }
};

// Delete an announcement
export const deleteAnnouncement = async (id, Announcement) => {
  try {
    logger.info(`Deleting announcement with ID: ${id}`);
    const deletedAnnouncement = await Announcement.findByIdAndDelete(id);
    if (!deletedAnnouncement) throw createError(404, "Announcement not found");

    return { message: "Announcement deleted successfully" };
  } catch (error) {
    logger.error(`Error deleting announcement with ID ${id}:`, error);
    throw createError(500, "Failed to delete announcement");
  }
};
