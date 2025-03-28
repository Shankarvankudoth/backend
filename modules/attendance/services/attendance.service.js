import Joi from "joi";
import { createError } from "../../../services/errorhandling.service.js";
import loggingService from "../../../services/logging.service.js";

const logger = loggingService.getModuleLogger("AttendanceService");

// Joi validation schema
const attendanceSchema = Joi.object({
  referenceId: Joi.string().required(),
  presentOrAbsent: Joi.string().valid("A", "P").required(),
  scheduleId: Joi.string().optional(),
  lateBy: Joi.number().min(0).optional(),
  remarks: Joi.string().optional(),
  taskId: Joi.string().optional(),
  version: Joi.number().default(1),
});

// Get Schema based on Version
const getSchemaForVersion = (version) => {
  switch (version) {
    case 1:
      return attendanceSchema;
    case 2:
      return attendanceSchema.keys({
        extraFieldForV2: Joi.string().optional(),
      });
    case 3:
      return attendanceSchema.keys({
        extraFieldForV2: Joi.string().optional(),
        newFieldForV3: Joi.string().optional(),
      });
    default:
      return null;
  }
};

// Fetch all attendance records
export const getAllAttendance = async (req, res, Attendance) => {
  try {
    logger.info("Fetching all attendance records...");
    const records = await Attendance.find();
    logger.info(`Fetched ${records.length} attendance records successfully.`);
    res.status(200).json(records);
  } catch (error) {
    logger.error("Error fetching attendance records", { error: error.message });
    throw createError(500, "Internal server error");
  }
};

// Fetch attendance by ID
export const getAttendanceById = async (req, res, Attendance) => {
  try {
    logger.info(`Fetching attendance record with ID: ${req.params.id}`);
    const record = await Attendance.findById(req.params.id);
    if (!record) {
      logger.warn(`Attendance record with ID ${req.params.id} not found.`);
      throw createError(404, "Attendance record not found");
    }
    res.status(200).json(record);
  } catch (error) {
    logger.error(`Error fetching attendance record with ID: ${req.params.id}`, {
      error: error.message,
    });
    throw createError(500, "Internal server error");
  }
};

// Create a new attendance record
export const createAttendance = async (req, res, Attendance) => {
  try {
    logger.info("Validating attendance data for creation...");
    const { version = 1 } = req.body;
    const schema = getSchemaForVersion(version);

    if (!schema) {
      logger.warn("Invalid version provided for attendance creation.");
      throw createError(400, "Invalid version provided");
    }

    const { error, value } = schema.validate(req.body);
    if (error) {
      logger.warn(`Validation failed: ${error.details[0].message}`);
      throw createError(422, error.details[0].message);
    }

    logger.info("Creating new attendance record...");
    const newRecord = new Attendance(value);
    const savedRecord = await newRecord.save();
    logger.info("Attendance record created successfully.");
    res.status(201).json(savedRecord);
  } catch (error) {
    logger.error("Error creating attendance record", { error: error.message });
    throw createError(500, "Internal server error");
  }
};

// Update an attendance record
export const updateAttendance = async (req, res, Attendance) => {
  try {
    logger.info(
      `Validating update data for attendance record ID: ${req.params.id}`
    );
    const { version = 1 } = req.body;
    const schema = getSchemaForVersion(version);

    if (!schema) {
      logger.warn("Invalid version provided for attendance update.");
      throw createError(400, "Invalid version provided");
    }

    const { error, value } = schema.validate(req.body);
    if (error) {
      logger.warn(`Validation failed for update: ${error.details[0].message}`);
      throw createError(422, error.details[0].message);
    }

    logger.info(`Updating attendance record with ID: ${req.params.id}`);
    const updatedRecord = await Attendance.findByIdAndUpdate(
      req.params.id,
      value,
      { new: true }
    );
    if (!updatedRecord) {
      logger.warn(
        `Attendance record with ID ${req.params.id} not found for update.`
      );
      throw createError(404, "Attendance record not found");
    }

    logger.info("Attendance record updated successfully.");
    res.status(200).json(updatedRecord);
  } catch (error) {
    logger.error(`Error updating attendance record with ID: ${req.params.id}`, {
      error: error.message,
    });
    throw createError(500, "Internal server error");
  }
};

// Delete an attendance record
export const deleteAttendance = async (req, res, Attendance) => {
  try {
    logger.info(
      `Attempting to delete attendance record with ID: ${req.params.id}`
    );
    const deletedRecord = await Attendance.findByIdAndDelete(req.params.id);
    if (!deletedRecord) {
      logger.warn(
        `Attendance record with ID ${req.params.id} not found for deletion.`
      );
      throw createError(404, "Attendance record not found");
    }

    logger.info("Attendance record deleted successfully.");
    res.status(200).json({ message: "Attendance record deleted successfully" });
  } catch (error) {
    logger.error(`Error deleting attendance record with ID: ${req.params.id}`, {
      error: error.message,
    });
    throw createError(500, "Internal server error");
  }
};
