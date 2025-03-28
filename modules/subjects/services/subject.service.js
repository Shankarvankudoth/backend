import Joi from "joi";
import { createError } from "../../../services/errorhandling.service.js";
import loggingService from "../../../services/logging.service.js";

const logger = loggingService.getModuleLogger("SubjectService");

// Base Joi Schema
const baseSubjectSchema = {
  subjectCode: Joi.string().required(),
  subjectName: Joi.string().required(),
  standard: Joi.number().required(),
  board: Joi.string().required(),
  chapterNames: Joi.alternatives().try(
    Joi.array().items(Joi.string()).min(1).required(),
    Joi.string().custom((value, helpers) => {
      try {
        const parsed = JSON.parse(value);
        if (Array.isArray(parsed) && parsed.every((v) => typeof v === "string")) {
          return parsed;
        }
        return helpers.error("Invalid chapterNames format");
      } catch {
        return helpers.error("Invalid chapterNames format");
      }
    })
  ),
  documentIds: Joi.array().items(Joi.string().regex(/^[0-9a-fA-F]{24}$/)).optional(),
  referenceBookIds: Joi.array().items(Joi.string().regex(/^[0-9a-fA-F]{24}$/)).optional(),
  version: Joi.number().default(1),
};

// Get Schema based on Version
const getSchemaForVersion = (version) => {
  switch (version) {
    case 1:
      return Joi.object(baseSubjectSchema);
    case 2:
      return Joi.object({
        ...baseSubjectSchema,
        extraFieldForV2: Joi.string().optional(),
      });
    case 3:
      return Joi.object({
        ...baseSubjectSchema,
        extraFieldForV2: Joi.string().optional(),
        newFieldForV3: Joi.string().optional(),
      });
    default:
      return null;
  }
};

// Get all subjects
export const getAllSubjects = async (Subject) => {
  try {
    logger.info("Fetching all subjects...");
    return await Subject.find();
  } catch (error) {
    logger.error("Error fetching subjects:", error);
    throw createError(500, "Failed to fetch subjects");
  }
};

// Get subject by ID
export const getSubjectById = async (id, Subject) => {
  try {
    logger.info(`Fetching subject with ID: ${id}`);
    const subject = await Subject.findById(id);
    if (!subject) throw createError(404, "Subject not found");
    return subject;
  } catch (error) {
    logger.error(`Error fetching subject with ID ${id}:`, error);
    throw createError(500, "Failed to fetch subject");
  }
};

// Create a subject
export const createSubject = async (data, Subject) => {
  try {
    const version = data.version || 1;
    const schema = getSchemaForVersion(version);

    if (!schema) {
      logger.warn("Invalid version provided for subject creation.");
      throw createError(400, "Invalid version provided");
    }

    const { error, value } = schema.validate(data);
    if (error) throw createError(422, error.details[0].message);

    logger.info("Creating new subject...");
    const newSubject = new Subject(value);
    await newSubject.save();
    return newSubject;
  } catch (error) {
    logger.error("Error creating subject:", error);
    throw createError(500, "Failed to create subject");
  }
};

// Update a subject
export const updateSubject = async (id, data, Subject) => {
  try {
    const version = data.version || 1;
    const schema = getSchemaForVersion(version);

    if (!schema) {
      logger.warn("Invalid version provided for subject update.");
      throw createError(400, "Invalid version provided");
    }

    const { error, value } = schema.validate(data);
    if (error) throw createError(422, error.details[0].message);

    logger.info(`Updating subject with ID: ${id}`);
    const updatedSubject = await Subject.findByIdAndUpdate(id, value, { new: true });
    if (!updatedSubject) throw createError(404, "Subject not found");

    return updatedSubject;
  } catch (error) {
    logger.error(`Error updating subject with ID ${id}:`, error);
    throw createError(500, "Failed to update subject");
  }
};

// Delete a subject
export const deleteSubject = async (id, Subject) => {
  try {
    logger.info(`Deleting subject with ID: ${id}`);
    const deletedSubject = await Subject.findByIdAndDelete(id);
    if (!deletedSubject) throw createError(404, "Subject not found");

    return { message: "Subject deleted successfully" };
  } catch (error) {
    logger.error(`Error deleting subject with ID ${id}:`, error);
    throw createError(500, "Failed to delete subject");
  }
};
