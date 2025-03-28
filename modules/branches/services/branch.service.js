import Joi from "joi";
import { createError } from "../../../services/errorhandling.service.js";
import loggingService from "../../../services/logging.service.js";

const logger = loggingService.getModuleLogger("BranchService");

// Joi validation schema
const branchSchema = Joi.object({
  branchName: Joi.string().required(),
  address: Joi.string().required(),
  primaryContact: Joi.string().required(),
  secondaryContact: Joi.string().optional(),
  branchCode: Joi.string().required(),
  zipCode: Joi.string().optional(),
  location: Joi.array().items(Joi.number()).optional(),
  url: Joi.string().optional(),
  coursesOffered: Joi.array().items(Joi.string()).optional(),
  imageUrl: Joi.string().optional(),
  head: Joi.string().optional(),
  managers: Joi.array().items(Joi.string()).optional(),
  documentId: Joi.string().optional(),
  accounts: Joi.array()
    .items(
      Joi.object({
        accountNumber: Joi.string().required(),
        bankName: Joi.string().required(),
        ifscCode: Joi.string().required(),
        merchantId: Joi.string().required(),
        accessCode: Joi.string().required(),
        workingKey: Joi.string().required(),
      })
    )
    .optional(),
  version: Joi.number().default(1),
});

// Get Schema based on Version
const getSchemaForVersion = (version) => {
  switch (version) {
    case 1:
      return branchSchema;
    case 2:
      return branchSchema.keys({
        extraFieldForV2: Joi.string().optional(),
      });
    case 3:
      return branchSchema.keys({
        extraFieldForV2: Joi.string().optional(),
        newFieldForV3: Joi.string().optional(),
      });
    default:
      return null;
  }
};

// Get all branches
export const getAllBranches = async (req, res,  Branch) => {
  try {
    logger.info("Fetching all branches...");
    const records = await Branch.find();
    logger.info(`Fetched ${records.length} branches successfully.`);
    res.status(200).json(records);
  } catch (error) {
    logger.error("Error fetching branches", { error: error.message });
    throw createError(500, "Internal server error");
  }
};

// Get branch by ID
export const getBranchById = async (req, res, Branch) => {
  try {
    logger.info(`Fetching branch with ID: ${req.params.id}`);
    const record = await Branch.findById(req.params.id);
    if (!record) {
      logger.warn(`Branch with ID ${req.params.id} not found.`);
      throw createError(404, "Branch not found");
    }
    res.status(200).json(record);
  } catch (error) {
    logger.error(`Error fetching branch with ID: ${req.params.id}`, {
      error: error.message,
    });
    throw createError(500, "Internal server error");
  }
};

// Create a new branch
export const createBranch = async (req, res,  Branch) => {
  try {
    logger.info("Validating branch data for creation...");
    const { version = 1 } = req.body;
    const schema = getSchemaForVersion(version);

    if (!schema) {
      logger.warn("Invalid version provided for branch creation.");
      throw createError(400, "Invalid version provided");
    }

    const { error, value } = schema.validate(req.body);
    if (error) {
      logger.warn(`Validation failed: ${error.details[0].message}`);
      throw createError(422, error.details[0].message);
    }

    logger.info("Creating new branch...");
    const newRecord = new Branch(value);
    const savedRecord = await newRecord.save();
    logger.info(`Branch created successfully: ${savedRecord.branchName}`);
    res.status(201).json(savedRecord);
  } catch (error) {
    logger.error("Error creating branch", { error: error.message });
    throw createError(500, "Internal server error");
  }
};

// Update an existing branch
export const updateBranch = async (req, res,  Branch) => {
  try {
    logger.info(`Validating update data for branch ID: ${req.params.id}`);
    const { version = 1 } = req.body;
    const schema = getSchemaForVersion(version);

    if (!schema) {
      logger.warn("Invalid version provided for branch update.");
      throw createError(400, "Invalid version provided");
    }

    const { error, value } = schema.validate(req.body);
    if (error) {
      logger.warn(`Validation failed for update: ${error.details[0].message}`);
      throw createError(422, error.details[0].message);
    }

    logger.info(`Updating branch with ID: ${req.params.id}`);
    const updatedRecord = await Branch.findByIdAndUpdate(req.params.id, value, {
      new: true,
    });
    if (!updatedRecord) {
      logger.warn(`Branch with ID ${req.params.id} not found for update.`);
      throw createError(404, "Branch not found");
    }

    logger.info(`Branch updated successfully: ${updatedRecord.branchName}`);
    res.status(200).json(updatedRecord);
  } catch (error) {
    logger.error(`Error updating branch with ID: ${req.params.id}`, {
      error: error.message,
    });
    throw createError(500, "Internal server error");
  }
};

// Delete a branch
export const deleteBranch = async (req, res,  Branch) => {
  try {
    logger.info(`Attempting to delete branch with ID: ${req.params.id}`);
    const deletedRecord = await Branch.findByIdAndDelete(req.params.id);
    if (!deletedRecord) {
      logger.warn(`Branch with ID ${req.params.id} not found for deletion.`);
      throw createError(404, "Branch not found");
    }

    logger.info(`Branch deleted successfully: ${deletedRecord.branchName}`);
    res.status(200).json({ message: "Branch deleted successfully" });
  } catch (error) {
    logger.error(`Error deleting branch with ID: ${req.params.id}`, {
      error: error.message,
    });
    throw createError(500, "Internal server error");
  }
};
