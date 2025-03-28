import Joi from "joi";
import { createError } from "../../../services/errorhandling.service.js";
import loggingService from "../../../services/logging.service.js";
const logger = loggingService.getModuleLogger("AdmissionService");

// Joi validation schema
const admissionSchema = Joi.object({
  dateOfAdmission: Joi.date().required(),
  studentId: Joi.string().required(),
  academicYear: Joi.number().required(),
  courseId: Joi.string().required(),
  branchId: Joi.string().required(),
  batchId: Joi.string().optional(),
  batchRollNo: Joi.number().optional(),
  noOfInstallments: Joi.number().required(),
  installmentsDates: Joi.array().items(Joi.number()).required(),
  finalFee: Joi.number().required(),
  discountApproved: Joi.boolean().optional(),
  discount: Joi.number().optional(),
  discountApprovedBy: Joi.string().optional(),
  taskIds: Joi.array().items(Joi.string()).optional(),
  schoolId: Joi.string().required(),
  standard: Joi.string().required(),
  board: Joi.string().required(),
  documentIds: Joi.array().items(Joi.string()).optional(),
  version: Joi.number().default(1),
});

// Get Schema based on Version
const getSchemaForVersion = (version) => {
  switch (version) {
    case 1:
      return admissionSchema ;
    case 2:
      return admissionSchema .keys({
        extraFieldForV2: Joi.string().optional(),
      });
    case 3:
      return admissionSchema .keys({
        extraFieldForV2: Joi.string().optional(),
        newFieldForV3: Joi.string().optional(),
      });
    default:
      return null;
  }
};

// Get all admissions
export const getAllAdmissions = async (req, res,Admission) => {
  try {
    logger.info("Fetching all admissions...");
    const admissions = await Admission.find();
    logger.info(`Fetched ${admissions.length} admissions successfully.`);
    res.status(200).json(admissions);
  } catch (error) {
    logger.error("Error fetching admissions", { error: error.message });
    throw createError(500, "Internal server error");
  }
};

// Get admission by ID
export const getAdmissionById = async (req, res,Admission) => {
  try {
    logger.info(`Fetching admission with ID: ${req.params.id}`);
    const admission = await Admission.findById(req.params.id);
    if (!admission) {
      logger.warn(`Admission with ID ${req.params.id} not found.`);
      throw createError(404, "Admission not found");
    }
    logger.info(
      `Fetched admission successfully for student ID: ${admission.studentId}`
    );
    res.status(200).json(admission);
  } catch (error) {
    logger.error(`Error fetching admission with ID: ${req.params.id}`, {
      error: error.message,
    });
    throw createError(500, "Internal server error");
  }
};

// Create admission
export const createAdmission = async (req, res,Admission) => {
  try {
    logger.info("Validating admission data for creation...");
    const { version = 1 } = req.body;
    const schema = getSchemaForVersion(version);

    if (!schema) {
      logger.warn("Invalid version provided for admission creation.");
      throw createError(400, "Invalid version provided");
    }

    const { error, value } = schema.validate(req.body);
    if (error) {
      logger.warn(`Validation failed: ${error.details[0].message}`);
      throw createError(422, error.details[0].message);
    }

    logger.info(`Creating admission for student ID: ${value.studentId}`);
    const newAdmission = new Admission(value);
    const savedAdmission = await newAdmission.save();
    logger.info(
      `Admission created successfully for student ID: ${savedAdmission.studentId}`
    );
    res.status(201).json(savedAdmission);
  } catch (error) {
    logger.error("Error creating admission", { error: error.message });
    throw createError(500, "Internal server error");
  }
};

// Update admission
export const updateAdmission = async (req, res,Admission) => {
  try {
    logger.info(`Validating update data for admission ID: ${req.params.id}`);

    const { version = 1 } = req.body;
    const schema = getSchemaForVersion(version);

    if (!schema) {
      logger.warn("Invalid version provided for admission update.");
      throw createError(400, "Invalid version provided");
    }

    const { error, value } = schema.validate(req.body);
    if (error) {
      logger.warn(`Validation failed for update: ${error.details[0].message}`);
      throw createError(422, error.details[0].message);
    }

    logger.info(`Updating admission with ID: ${req.params.id}`);
    const updatedAdmission = await Admission.findByIdAndUpdate(
      req.params.id,
      value,
      { new: true }
    );
    if (!updatedAdmission) {
      logger.warn(`Admission with ID ${req.params.id} not found for update.`);
      throw createError(404, "Admission not found");
    }

    logger.info(
      `Admission updated successfully for student ID: ${updatedAdmission.studentId}`
    );
    res.status(200).json(updatedAdmission);
  } catch (error) {
    logger.error(`Error updating admission with ID: ${req.params.id}`, {
      error: error.message,
    });
    throw createError(500, "Internal server error");
  }
};

// Delete admission
export const deleteAdmission = async (req, res,Admission) => {
  try {
    logger.info(`Attempting to delete admission with ID: ${req.params.id}`);
    const deletedAdmission = await Admission.findByIdAndDelete(req.params.id);
    if (!deletedAdmission) {
      logger.warn(`Admission with ID ${req.params.id} not found for deletion.`);
      throw createError(404, "Admission not found");
    }

    logger.info(
      `Admission deleted successfully for student ID: ${deletedAdmission.studentId}`
    );
    res.status(200).json({ message: "Admission deleted successfully" });
  } catch (error) {
    logger.error(`Error deleting admission with ID: ${req.params.id}`, {
      error: error.message,
    });
    throw createError(500, "Internal server error");
  }
};
