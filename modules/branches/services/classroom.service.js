import Joi from "joi";
import { createError } from "../../../services/errorhandling.service.js";
import loggingService from "../../../services/logging.service.js";

const logger = loggingService.getModuleLogger("ClassRoomService");

// Joi Validation Schema
const classRoomSchema = Joi.object({
  name: Joi.string().required(),
  branchId: Joi.string().required(),
  batchId: Joi.array().items(Joi.string()).optional(),
  floorNumber: Joi.number().required(),
  roomNumber: Joi.string().required(),
  studentSize: Joi.number().required(),
  projector: Joi.boolean().optional(),
  smartBoard: Joi.boolean().optional(),
  landlineNumber: Joi.string().optional(),
  biometricMachineId: Joi.string().optional(),
  ccCameras: Joi.array().items(Joi.string()).optional(),
  coordinators: Joi.array().items(Joi.string()).optional(),
  version: Joi.number().default(1),
});

// Get Schema based on Version
const getSchemaForVersion = (version) => {
  switch (version) {
    case 1:
      return classRoomSchema;
    case 2:
      return classRoomSchema.keys({
        extraFieldForV2: Joi.string().optional(),
      });
    case 3:
      return classRoomSchema.keys({
        extraFieldForV2: Joi.string().optional(),
        newFieldForV3: Joi.string().optional(),
      });
    default:
      return null;
  }
};

// Get All ClassRooms
export const getAllClassRooms = async (req, res,  ClassRoom) => {
  try {
    logger.info("Fetching all classrooms...");
    const classRooms = await ClassRoom.find();
    logger.info(`Fetched ${classRooms.length} classrooms successfully.`);
    res.status(200).json(classRooms);
  } catch (error) {
    logger.error("Error fetching classrooms", { error: error.message });
    throw createError(500, "Internal server error");
  }
};

// Get ClassRoom by ID
export const getClassRoomById = async (req, res, ClassRoom) => {
  try {
    logger.info(`Fetching classroom with ID: ${req.params.id}`);
    const classRoom = await ClassRoom.findById(req.params.id);
    if (!classRoom) {
      logger.warn(`Classroom with ID ${req.params.id} not found.`);
      throw createError(404, "Classroom not found");
    }
    logger.info(`Fetched classroom: ${classRoom.name}`);
    res.status(200).json(classRoom);
  } catch (error) {
    logger.error(`Error fetching classroom with ID: ${req.params.id}`, {
      error: error.message,
    });
    throw createError(500, "Internal server error");
  }
};

// Create ClassRoom
export const createClassRoom = async (req, res,  ClassRoom) => {
  try {
    logger.info("Validating classroom data for creation...");
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

    logger.info("Creating new classroom...");
    const newClassRoom = new ClassRoom(value);
    const savedClassRoom = await newClassRoom.save();
    logger.info(`Classroom created successfully: ${savedClassRoom.name}`);
    res.status(201).json(savedClassRoom);
  } catch (error) {
    logger.error("Error creating classroom", { error: error.message });
    throw createError(500, "Internal server error");
  }
};

// Update ClassRoom
export const updateClassRoom = async (req, res,  ClassRoom) => {
  try {
    logger.info(`Validating update data for classroom ID: ${req.params.id}`);
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

    logger.info(`Updating classroom with ID: ${req.params.id}`);
    const updatedClassRoom = await ClassRoom.findByIdAndUpdate(
      req.params.id,
      value,
      { new: true }
    );
    if (!updatedClassRoom) {
      logger.warn(`Classroom with ID ${req.params.id} not found for update.`);
      throw createError(404, "Classroom not found");
    }

    logger.info(`Classroom updated successfully: ${updatedClassRoom.name}`);
    res.status(200).json(updatedClassRoom);
  } catch (error) {
    logger.error(`Error updating classroom with ID: ${req.params.id}`, {
      error: error.message,
    });
    throw createError(500, "Internal server error");
  }
};

// Delete ClassRoom
export const deleteClassRoom = async (req, res,  ClassRoom) => {
  try {
    logger.info(`Attempting to delete classroom with ID: ${req.params.id}`);
    const deletedClassRoom = await ClassRoom.findByIdAndDelete(req.params.id);
    if (!deletedClassRoom) {
      logger.warn(`Classroom with ID ${req.params.id} not found for deletion.`);
      throw createError(404, "Classroom not found");
    }

    logger.info(`Classroom deleted successfully: ${deletedClassRoom.name}`);
    res.status(200).json({ message: "Classroom deleted successfully" });
  } catch (error) {
    logger.error(`Error deleting classroom with ID: ${req.params.id}`, {
      error: error.message,
    });
    throw createError(500, "Internal server error");
  }
};
