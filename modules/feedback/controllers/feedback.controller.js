/*

import * as feedbackService from "../services/feedback.service.js";
import Feedback from "../models/feedback.model.js";
import { createError } from "../../../services/errorhandling.service.js";

const feedbackController = {
  getAll: async (req, res, next) => {
    try {
      const feedbacks = await feedbackService.getAllFeedbacks(Feedback);
      res.status(200).json(feedbacks);
    } catch (error) {
      next(error);
    }
  },

  getById: async (req, res, next) => {
    try {
      const feedback = await feedbackService.getFeedbackById(req.params.id, Feedback);
      if (!feedback) return next(createError(404, "Feedback not found"));
      res.status(200).json(feedback);
    } catch (error) {
      next(error);
    }
  },

  create: async (req, res, next) => {
    try {
      const newFeedback = await feedbackService.createFeedback(req.body, Feedback);
      res.status(201).json(newFeedback);
    } catch (error) {
      next(error);
    }
  },

  update: async (req, res, next) => {
    try {
      const updatedFeedback = await feedbackService.updateFeedback(req.params.id, req.body, Feedback);
      res.status(200).json(updatedFeedback);
    } catch (error) {
      next(error);
    }
  },

  delete: async (req, res, next) => {
    try {
      const message = await feedbackService.deleteFeedback(req.params.id, Feedback);
      res.status(200).json(message);
    } catch (error) {
      next(error);
    }
  },
};

export default feedbackController;
*/

import * as feedbackService from "../services/feedback.service.js";
import Feedback from "../models/feedback.model.js";
import { createError } from "../../../services/errorhandling.service.js";
import loggingService from "../../../services/logging.service.js";

const logger = loggingService.getModuleLogger("FeedbackController");

const feedbackController = {
  getAll: async (req, res, next) => {
    try {
      logger.info("Fetching all feedback entries");
      const feedbacks = await feedbackService.getAllFeedbacks(Feedback);
      res.status(200).json(feedbacks);
    } catch (error) {
      logger.error(`Error fetching all feedbacks: ${error.message}`);
      next(error);
    }
  },

  getById: async (req, res, next) => {
    try {
      logger.info(`Fetching feedback with ID: ${req.params.id}`);
      const feedback = await feedbackService.getFeedbackById(req.params.id, Feedback);
      if (!feedback) {
        logger.warn(`Feedback not found with ID: ${req.params.id}`);
        return next(createError(404, "Feedback not found"));
      }
      res.status(200).json(feedback);
    } catch (error) {
      logger.error(`Error fetching feedback with ID ${req.params.id}: ${error.message}`);
      next(error);
    }
  },

  create: async (req, res, next) => {
    try {
      logger.info("Creating a new feedback entry");
      const newFeedback = await feedbackService.createFeedback(req.body, Feedback);
      res.status(201).json(newFeedback);
    } catch (error) {
      logger.error(`Error creating feedback: ${error.message}`);
      next(error);
    }
  },

  update: async (req, res, next) => {
    try {
      logger.info(`Updating feedback with ID: ${req.params.id}`);
      const updatedFeedback = await feedbackService.updateFeedback(req.params.id, req.body, Feedback);
      res.status(200).json(updatedFeedback);
    } catch (error) {
      logger.error(`Error updating feedback with ID ${req.params.id}: ${error.message}`);
      next(error);
    }
  },

  delete: async (req, res, next) => {
    try {
      logger.info(`Deleting feedback with ID: ${req.params.id}`);
      const message = await feedbackService.deleteFeedback(req.params.id, Feedback);
      res.status(200).json(message);
    } catch (error) {
      logger.error(`Error deleting feedback with ID ${req.params.id}: ${error.message}`);
      next(error);
    }
  },
};

export default feedbackController;
