import * as paymentService from "../services/payment.service.js";
import Payment from "../models/payment.model.js";
import { createError } from "../../../services/errorhandling.service.js";
import loggingService from "../../../services/logging.service.js";

const logger = loggingService.getModuleLogger("paymentController");
const paymentController = {
  getAll: async (req, res, next) => {
    try {
      logger.info("Fetching payments");
      const payments = await paymentService.getAllPayments(Payment);
      res.status(200).json(payments);
    } catch (error) {
      logger.error("Error fetching payments:", error);
      next(error);
    }
  },

  getById: async (req, res, next) => {
    try {
      logger.info("Fetching payment by ID", { id: req.params.id });
      const payment = await paymentService.getPaymentById(req.params.id, Payment);
      if (!payment) {
        logger.error("Payment not found");
        return next(createError(404, "Payment not found"));
      }
      res.status(200).json(payment);
    } catch (error) {
      logger.error("Error fetching payment:", error);
      next(error);
    }
  },

  create: async (req, res, next) => {
    try {
      logger.info("Creating payment");
      const newPayment = await paymentService.createPayment(req.body, Payment);
      res.status(201).json(newPayment);
    } catch (error) {
      logger.error("Error creating payment:", error);
      next(error);
    }
  },

  update: async (req, res, next) => {
    try {
      logger.info("Updating payment by ID", { id: req.params.id });
      const updatedPayment = await paymentService.updatePayment(req.params.id, req.body, Payment);
      res.status(200).json(updatedPayment);
    } catch (error) {
      logger.error("Error updating payment:", error);
      next(error);
    }
  },

  delete: async (req, res, next) => {
    try {
      logger.info("Deleting payment by ID", { id: req.params.id });
      const message = await paymentService.deletePayment(req.params.id, Payment);
      res.status(200).json(message);
    } catch (error) {
      logger.error("Error deleting payment:", error);
      next(error);
    }
  },
};

export default paymentController;
