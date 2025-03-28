import Joi from "joi";
import { createError } from "../../../services/errorhandling.service.js";
import loggingService from "../../../services/logging.service.js";

const logger = loggingService.getModuleLogger("ProfileService");

// Joi validation schema
const profileSchema = Joi.object({
  type: Joi.string()
    .valid("parent", "student", "guardian", "faculty", "staff")
    .required(),
  userId: Joi.string().required(),
  studentId: Joi.array().items(Joi.string()).optional(),
  relation: Joi.string().optional(),
  firstName: Joi.string().required(),
  middleName: Joi.string().optional(),
  lastName: Joi.string().required(),
  aadharNumber: Joi.string().optional(),
  primaryNumber: Joi.string().required(),
  secondaryNumber: Joi.string().optional(),
  primaryEmail: Joi.string().email().required(),
  secondaryEmail: Joi.string().email().optional(),
  occupation: Joi.string().optional(),
  presentAddress: Joi.string().optional(),
  pincode: Joi.number().optional(),
  permanentAddress: Joi.string().optional(),
  location: Joi.array().items(Joi.string()).optional(),
  documentId: Joi.array().items(Joi.string()).optional(),
  highestQualification: Joi.string().optional(),
  skills: Joi.any().optional(),
  referenceId: Joi.string().optional(),
  salary: Joi.number().optional(),
  version: Joi.number().default(1),
});

// Get Schema based on Version
const getSchemaForVersion = (version) => {
  switch (version) {
    case 1:
      return profileSchema;
    case 2:
      return profileSchema.keys({
        extraFieldForV2: Joi.string().optional(),
      });
    case 3:
      return profileSchema.keys({
        extraFieldForV2: Joi.string().optional(),
        newFieldForV3: Joi.string().optional(),
      });
    default:
      return null;
  }
};

// Get all profiles
export const getAllProfiles = async (req, res,  Profile) => {
  try {
    logger.info("Fetching all profiles...");
    const records = await Profile.find();
    logger.info(`Fetched ${records.length} profiles successfully.`);
    res.status(200).json(records);
  } catch (error) {
    logger.error("Error fetching profiles", { error: error.message });
    throw createError(500, "Internal server error");
  }
};

// Get profile by ID
export const getProfileById = async (req, res,  Profile) => {
  try {
    logger.info(`Fetching profile with ID: ${req.params.id}`);
    const record = await Profile.findById(req.params.id);
    if (!record) {
      logger.warn(`Profile with ID ${req.params.id} not found.`);
      throw createError(404, "Profile not found");
    }
    logger.info(`Fetched profile: ${record.firstName} ${record.lastName}`);
    res.status(200).json(record);
  } catch (error) {
    logger.error(`Error fetching profile with ID: ${req.params.id}`, {
      error: error.message,
    });
    throw createError(500, "Internal server error");
  }
};

// Create a new profile
export const createProfile = async (req, res,  Profile) => {
  try {
    logger.info("Validating profile data for creation...");
    const { version = 1 } = req.body;
    const schema = getSchemaForVersion(version);

    if (!schema) {
      logger.warn("Invalid version provided for subject creation.");
      throw createError(400, "Invalid version provided");
    }

    const { error, value } = schema.validate(req.body);
    if (error) {
      logger.warn(`Validation failed: ${error.details[0].message}`);
      throw createError(422, error.details[0].message);
    }

    logger.info("Creating new profile...");
    const newRecord = new Profile(value);
    const savedRecord = await newRecord.save();
    logger.info(
      `Profile created successfully: ${savedRecord.firstName} ${savedRecord.lastName}`
    );
    res.status(201).json(savedRecord);
  } catch (error) {
    logger.error("Error creating profile", { error: error.message });
    throw createError(500, "Internal server error");
  }
};

// Update an existing profile
export const updateProfile = async (req, res,  Profile) => {
  try {
    logger.info(`Validating update data for profile ID: ${req.params.id}`);
    const { version = 1 } = req.body;
    const schema = getSchemaForVersion(version);

    if (!schema) {
      logger.warn("Invalid version provided for subject creation.");
      throw createError(400, "Invalid version provided");
    }

    const { error, value } = schema.validate(req.body);
    if (error) {
      logger.warn(`Validation failed for update: ${error.details[0].message}`);
      throw createError(422, error.details[0].message);
    }

    logger.info(`Updating profile with ID: ${req.params.id}`);
    const updatedRecord = await Profile.findByIdAndUpdate(
      req.params.id,
      value,
      { new: true }
    );
    if (!updatedRecord) {
      logger.warn(`Profile with ID ${req.params.id} not found for update.`);
      throw createError(404, "Profile not found");
    }

    logger.info(
      `Profile updated successfully: ${updatedRecord.firstName} ${updatedRecord.lastName}`
    );
    res.status(200).json(updatedRecord);
  } catch (error) {
    logger.error(`Error updating profile with ID: ${req.params.id}`, {
      error: error.message,
    });
    throw createError(500, "Internal server error");
  }
};

// Delete a profile
export const deleteProfile = async (req, res, Profile) => {
  try {
    logger.info(`Attempting to delete profile with ID: ${req.params.id}`);
    const deletedRecord = await Profile.findByIdAndDelete(req.params.id);
    if (!deletedRecord) {
      logger.warn(`Profile with ID ${req.params.id} not found for deletion.`);
      throw createError(404, "Profile not found");
    }

    logger.info(
      `Profile deleted successfully: ${deletedRecord.firstName} ${deletedRecord.lastName}`
    );
    res.status(200).json({ message: "Profile deleted successfully" });
  } catch (error) {
    logger.error(`Error deleting profile with ID: ${req.params.id}`, {
      error: error.message,
    });
    throw createError(500, "Internal server error");
  }
};