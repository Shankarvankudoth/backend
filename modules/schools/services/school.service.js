import Joi from "joi";
import { createError } from "../../../services/errorhandling.service.js";
import loggingService from "../../../services/logging.service.js";

const logger = loggingService.getModuleLogger("SchoolService");

// Base Joi Schema
const baseSchoolSchema = {
  name: Joi.string().required(),
  address: Joi.string().required(),
  pincode: Joi.number().required(),
  location: Joi.array().items(Joi.number()).length(2).optional(), // Latitude & Longitude
  contactNo: Joi.array().items(Joi.string().pattern(/^\d{10}$/)).min(1).required(),
  standards: Joi.array().items(Joi.number()).min(1).required(),
  boards: Joi.array().items(Joi.string()).optional(),
  version: Joi.number().default(1),
};

// Get Schema based on Version
const getSchemaForVersion = (version) => {
  switch (version) {
    case 1:
      return Joi.object(baseSchoolSchema);
    case 2:
      return Joi.object({
        ...baseSchoolSchema,
        extraFieldForV2: Joi.string().optional(),
      });
    case 3:
      return Joi.object({
        ...baseSchoolSchema,
        extraFieldForV2: Joi.string().optional(),
        newFieldForV3: Joi.string().optional(),
      });
    default:
      return null;
  }
};

// Get all schools
export const getAllSchools = async (School) => {
  try {
    logger.info("Fetching all schools...");
    return await School.find();
  } catch (error) {
    logger.error("Error fetching schools:", error);
    throw createError(500, "Failed to fetch schools");
  }
};

// Get school by ID
export const getSchoolById = async (id, School) => {
  try {
    logger.info(`Fetching school with ID: ${id}`);
    const school = await School.findById(id);
    if (!school) throw createError(404, "School not found");
    return school;
  } catch (error) {
    logger.error(`Error fetching school with ID ${id}:`, error);
    throw createError(500, "Failed to fetch school");
  }
};

// Create a school
export const createSchool = async (data, School) => {
  try {
    const version = data.version || 1;
    const schema = getSchemaForVersion(version);

    if (!schema) {
      logger.warn("Invalid version provided for school creation.");
      throw createError(400, "Invalid version provided");
    }

    const { error, value } = schema.validate(data);
    if (error) throw createError(422, error.details[0].message);

    logger.info("Creating new school...");
    const newSchool = new School(value);
    await newSchool.save();
    return newSchool;
  } catch (error) {
    logger.error("Error creating school:", error);
    throw createError(500, "Failed to create school");
  }
};

// Update a school
export const updateSchool = async (id, data, School) => {
  try {
    const version = data.version || 1;
    const schema = getSchemaForVersion(version);

    if (!schema) {
      logger.warn("Invalid version provided for school update.");
      throw createError(400, "Invalid version provided");
    }

    const { error, value } = schema.validate(data);
    if (error) throw createError(422, error.details[0].message);

    logger.info(`Updating school with ID: ${id}`);
    const updatedSchool = await School.findByIdAndUpdate(id, value, { new: true });
    if (!updatedSchool) throw createError(404, "School not found");

    return updatedSchool;
  } catch (error) {
    logger.error(`Error updating school with ID ${id}:`, error);
    throw createError(500, "Failed to update school");
  }
};

// Delete a school
export const deleteSchool = async (id, School) => {
  try {
    logger.info(`Deleting school with ID: ${id}`);
    const deletedSchool = await School.findByIdAndDelete(id);
    if (!deletedSchool) throw createError(404, "School not found");

    return { message: "School deleted successfully" };
  } catch (error) {
    logger.error(`Error deleting school with ID ${id}:`, error);
    throw createError(500, "Failed to delete school");
  }
};
