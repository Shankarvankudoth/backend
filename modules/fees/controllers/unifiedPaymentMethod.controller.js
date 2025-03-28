import * as unifiedPaymentService from "../services/unifiedPaymentMethod.service.js";
import UnifiedPaymentMethod from "../models/unifiedPaymentMethod.model.js";
import { createError } from "../../../services/errorhandling.service.js";
import loggingService from "../../../services/logging.service.js";

const logger = loggingService.getModuleLogger("unifiedPaymentMethodController");
const unifiedPaymentMethodController = {
  getAll: async (req, res, next) => {
    try {
      logger.info("Fetching unified payments");
      const payments = await unifiedPaymentService.getAllUnifiedPayments(UnifiedPaymentMethod);
      res.status(200).json(payments);
    } catch (error) {
      logger.error("Error fetching unified payments:", error);
      next(error);
    }
  },

  getById: async (req, res, next) => {
    try {
      logger.info("Fetching unified payment by ID", { id: req.params.id });
      const payment = await unifiedPaymentService.getUnifiedPaymentById(req.params.id, UnifiedPaymentMethod);
      if (!payment) {
        logger.error("Unified payment not found");
        return next(createError(404, "Unified payment not found"));
      }
      res.status(200).json(payment);
    } catch (error) {
      logger.error("Error fetching unified payment:", error);
      next(error);
    }
  },

  create: async (req, res, next) => {
    try {
      logger.info("Creating unified payment");
      const newPayment = await unifiedPaymentService.createUnifiedPayment(req.body, UnifiedPaymentMethod);
      res.status(201).json(newPayment);
    } catch (error) {
      logger.error("Error creating unified payment:", error);
      next(error);
    }
  },

  update: async (req, res, next) => {
    try {
      logger.info("Updating unified payment by ID", { id: req.params.id });
      const updatedPayment = await unifiedPaymentService.updateUnifiedPayment(req.params.id, req.body, UnifiedPaymentMethod);
      res.status(200).json(updatedPayment);
    } catch (error) {
      logger.error("Error updating unified payment:", error);
      next(error);
    }
  },

  delete: async (req, res, next) => {
    try {
      logger.info("Deleting unified payment by ID", { id: req.params.id });
      const message = await unifiedPaymentService.deleteUnifiedPayment(req.params.id, UnifiedPaymentMethod);
      res.status(200).json(message);
    } catch (error) {
      logger.error("Error deleting unified payment:", error);
      next(error);
    }
  },
};

export default unifiedPaymentMethodController;
