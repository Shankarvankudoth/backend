import Joi from "joi";
import { createError } from "../../../services/errorhandling.service.js";
import loggingService from "../../../services/logging.service.js";

const logger = loggingService.getModuleLogger("FeedbackService");

// Joi Validation Schema for Feedback
const baseFeedbackSchema = {
  givenById: Joi.string().required(),
  feedbackTitle: Joi.string().required(),
  category: Joi.string().optional(),
  feedbackDescription: Joi.string().required(),
  referenceId: Joi.string().required(),
  aboutId: Joi.string().required(),
  aboutModel: Joi.string()
    .valid("Worksheet", "Assessment", "Subject", "Schedule", "Attendance", "PTM", "Profile")
    .required(),
  createdBy: Joi.string().required(),
  assignedTo: Joi.string().optional(),
  taskIds: Joi.array().items(Joi.string()).optional(),
  feedbackStatus: Joi.string().valid("open", "closed", "cancelled", "onHold").default("open"),
  reviewedBy: Joi.string().optional(),
  priority: Joi.string().optional(),
  criticality: Joi.string().optional(),
  notes: Joi.array().items(Joi.string()).optional(),
  version: Joi.number().default(1),
};

// Get Schema based on Version
const getFeedbackSchemaForVersion = (version) => {
  switch (version) {
    case 1:
      return Joi.object(baseFeedbackSchema);
    case 2:
      return Joi.object({
        ...baseFeedbackSchema,
        extraFieldForV2: Joi.string().optional(),
      });
    case 3:
      return Joi.object({
        ...baseFeedbackSchema,
        extraFieldForV2: Joi.string().optional(),
        newFieldForV3: Joi.string().optional(),
      });
    default:
      return null;
  }
};

// Get All Feedbacks
export const getAllFeedbacks = async (Feedback) => {
  try {
    logger.info("Fetching all feedbacks...");
    const feedbacks = await Feedback.find();
    logger.info(`Fetched ${feedbacks.length} feedbacks successfully.`);
    return feedbacks;
  } catch (error) {
    logger.error("Error fetching feedbacks:", error);
    throw createError(500, "Failed to fetch feedbacks");
  }
};

// Get Feedback by ID
export const getFeedbackById = async (id, Feedback) => {
  try {
    logger.info(`Fetching feedback with ID: ${id}`);
    const feedback = await Feedback.findById(id);

    if (!feedback) {
      logger.warn(`Feedback with ID ${id} not found.`);
      throw createError(404, "Feedback not found");
    }

    logger.info(`Feedback with ID ${id} fetched successfully.`);
    return feedback;
  } catch (error) {
    logger.error(`Error fetching feedback with ID ${id}:`, error);
    throw createError(500, "Failed to fetch feedback");
  }
};

// Create Feedback
export const createFeedback = async (data, Feedback) => {
  try {
    const version = data.version || 1;
    const schema = getFeedbackSchemaForVersion(version);

    if (!schema) {
      logger.warn("Invalid version provided for Feedback creation.");
      throw createError(400, "Invalid version provided");
    }

    logger.info("Validating Feedback data for creation...");
    const { error, value } = schema.validate(data);

    if (error) {
      logger.warn(`Validation failed: ${error.details[0].message}`);
      throw createError(422, error.details[0].message);
    }

    logger.info("Creating new Feedback...");
    const newFeedback = new Feedback(value);
    await newFeedback.save();
    logger.info("Feedback created successfully.");

    return newFeedback;
  } catch (error) {
    logger.error("Error creating Feedback:", error);
    throw createError(500, "Failed to create Feedback");
  }
};

// Update Feedback
export const updateFeedback = async (id, data, Feedback) => {
  try {
    logger.info(`Validating update data for Feedback ID: ${id}`);

    const version = data.version || 1;
    const schema = getFeedbackSchemaForVersion(version);

    if (!schema) {
      logger.warn("Invalid version provided for Feedback update.");
      throw createError(400, "Invalid version provided");
    }

    const { error, value } = schema.validate(data);
    if (error) {
      logger.warn(`Validation failed: ${error.details[0].message}`);
      throw createError(422, error.details[0].message);
    }

    logger.info(`Updating Feedback with ID: ${id}`);
    const updatedFeedback = await Feedback.findByIdAndUpdate(id, value, { new: true });

    if (!updatedFeedback) {
      logger.warn(`Feedback with ID ${id} not found for update.`);
      throw createError(404, "Feedback not found");
    }

    logger.info(`Feedback with ID ${id} updated successfully.`);
    return updatedFeedback;
  } catch (error) {
    logger.error(`Error updating Feedback with ID ${id}:`, error);
    throw createError(500, "Failed to update Feedback");
  }
};

// Delete Feedback
export const deleteFeedback = async (id, Feedback) => {
  try {
    logger.info(`Attempting to delete Feedback with ID: ${id}`);
    const deletedFeedback = await Feedback.findByIdAndDelete(id);

    if (!deletedFeedback) {
      logger.warn(`Feedback with ID ${id} not found for deletion.`);
      throw createError(404, "Feedback not found");
    }

    logger.info(`Feedback with ID ${id} deleted successfully.`);
    return { message: "Feedback deleted successfully" };
  } catch (error) {
    logger.error(`Error deleting Feedback with ID ${id}:`, error);
    throw createError(500, "Failed to delete Feedback");
  }
};
