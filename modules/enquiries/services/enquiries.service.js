import Joi from "joi";
import { createError } from "../../../services/errorhandling.service.js";
import loggingService from "../../../services/logging.service.js";

const logger = loggingService.getModuleLogger("EnquiryService");

// Joi Validation Schema for Enquiry
const baseEnquirySchema = {
  studentId: Joi.string().allow(null),
  potentialJoiningDate: Joi.date().optional(),
  academicYear: Joi.number().required(),
  category: Joi.string().required(),
  courseId: Joi.string().optional(),
  subjects: Joi.array().items(Joi.string()).required(),
  source: Joi.string().optional(),
  createdBy: Joi.string().required(),
  assignedTo: Joi.string().required(),
  branchId: Joi.string().required(),
  taskIds: Joi.array().items(Joi.string()).required(),
  actualFee: Joi.number().optional(),
  confirmedFee: Joi.number().optional(),
  discountReason: Joi.string().optional(),
  priority: Joi.string().optional(),
  criticality: Joi.string().optional(),
  version: Joi.number().default(1),
};

// Get Schema based on Version
const getEnquirySchemaForVersion = (version) => {
  switch (version) {
    case 1:
      return Joi.object(baseEnquirySchema);
    case 2:
      return Joi.object({
        ...baseEnquirySchema,
        extraFieldForV2: Joi.string().optional(), // Example additional field for version 2
      });
    case 3:
      return Joi.object({
        ...baseEnquirySchema,
        extraFieldForV2: Joi.string().optional(),
        newFieldForV3: Joi.string().optional(), // Example new field for version 3
      });
    default:
      return null; // Invalid version
  }
};

// Get All Enquiries
export const getAllEnquiries = async (Enquiry) => {
  logger.info("Fetching all enquiries...");
  return await Enquiry.find();
};

// Get Enquiry by ID
export const getEnquiryById = async (id, Enquiry) => {
  logger.info(`Fetching enquiry with ID: ${id}`);
  return await Enquiry.findById(id);
};

// Create Enquiry
export const createEnquiry = async (data, Enquiry) => {
  const version = data.version || 1;
  const schema = getEnquirySchemaForVersion(version);
  
  if (!schema) {
    throw createError(400, "Invalid version provided");
  }

  logger.info("Validating enquiry data for creation...");
  const { error, value } = schema.validate(data);
  
  if (error) {
    logger.warn(`Validation failed: ${error.details[0].message}`);
    throw createError(422, error.details[0].message);
  }

  logger.info("Creating new enquiry...");
  const newEnquiry = new Enquiry(value);
  return await newEnquiry.save();
};

// Update Enquiry
export const updateEnquiry = async (id, data, Enquiry) => {
  logger.info(`Validating update data for enquiry ID: ${id}`);

  const version = data.version || 1;
  const schema = getEnquirySchemaForVersion(version);

  if (!schema) {
    throw createError(400, "Invalid version provided");
  }

  const { error, value } = schema.validate(data);
  if (error) {
    logger.warn(`Validation failed: ${error.details[0].message}`);
    throw createError(422, error.details[0].message);
  }

  logger.info(`Updating enquiry with ID: ${id}`);
  const updatedEnquiry = await Enquiry.findByIdAndUpdate(id, value, { new: true });

  if (!updatedEnquiry) {
    logger.warn(`Enquiry with ID ${id} not found for update.`);
    throw createError(404, "Enquiry not found");
  }

  return updatedEnquiry;
};

// Delete Enquiry
export const deleteEnquiry = async (id, Enquiry) => {
  logger.info(`Attempting to delete enquiry with ID: ${id}`);
  const deletedEnquiry = await Enquiry.findByIdAndDelete(id);

  if (!deletedEnquiry) {
    logger.warn(`Enquiry with ID ${id} not found for deletion.`);
    throw createError(404, "Enquiry not found");
  }

  return { message: "Enquiry deleted successfully" };
};
