import Joi from "joi";
import { createError } from "../../../services/errorhandling.service.js";
import loggingService from "../../../services/logging.service.js";

const logger = loggingService.getModuleLogger("PaymentService");

// Joi Validation Schema for Payment
const basePaymentSchema = {
  studentId: Joi.string().required(),
  paymentDate: Joi.string().required(), // Accepts "dd-mm-yyyy" format
  admissionId: Joi.string().required(),
  amount: Joi.number().required(),
  type: Joi.string().required(),
  paymentMode: Joi.string()
    .valid("cash", "cheque", "onlineTransactions", "netBanking", "offlineQrCode", "demandDraft")
    .required(),
  paymentRef: Joi.string().optional().allow(null),
  remittanceId: Joi.string().optional().allow(null),
  finalStatus: Joi.number().valid(0, 1).required(),
  pendingFee: Joi.number().required(),
  orderId: Joi.string().required(),
  invoiceId: Joi.string().optional().allow(null),
  client: Joi.string().required(),
  tallyStatus: Joi.string().optional().allow(null),
  proofId: Joi.string().optional().allow(null),
  version: Joi.number().default(1),
};

// Get Schema based on Version
const getPaymentSchemaForVersion = (version) => {
  switch (version) {
    case 1:
      return Joi.object(basePaymentSchema);
    case 2:
      return Joi.object({
        ...basePaymentSchema,
        extraFieldForV2: Joi.string().optional(),
      });
    case 3:
      return Joi.object({
        ...basePaymentSchema,
        extraFieldForV2: Joi.string().optional(),
        newFieldForV3: Joi.string().optional(),
      });
    default:
      return null;
  }
};

// Get All Payments
export const getAllPayments = async (Payment) => {
  try {
    logger.info("Fetching all payments...");
    const payments = await Payment.find();
    logger.info(`Fetched ${payments.length} payments successfully.`);
    return payments;
  } catch (error) {
    logger.error("Error fetching payments:", error);
    throw createError(500, "Failed to fetch payments");
  }
};

// Get Payment by ID
export const getPaymentById = async (id, Payment) => {
  try {
    logger.info(`Fetching payment with ID: ${id}`);
    const payment = await Payment.findById(id);

    if (!payment) {
      logger.warn(`Payment with ID ${id} not found.`);
      throw createError(404, "Payment not found");
    }

    logger.info(`Payment with ID ${id} fetched successfully.`);
    return payment;
  } catch (error) {
    logger.error(`Error fetching payment with ID ${id}:`, error);
    throw createError(500, "Failed to fetch payment");
  }
};

// Create Payment
export const createPayment = async (data, Payment) => {
  try {
    const version = data.version || 1;
    const schema = getPaymentSchemaForVersion(version);

    if (!schema) {
      logger.warn("Invalid version provided for payment creation.");
      throw createError(400, "Invalid version provided");
    }

    logger.info("Validating payment data for creation...");
    const { error, value } = schema.validate(data);

    if (error) {
      logger.warn(`Validation failed: ${error.details[0].message}`);
      throw createError(422, error.details[0].message);
    }

    logger.info("Creating new payment...");
    const newPayment = new Payment(value);
    await newPayment.save();
    logger.info("Payment created successfully.");

    return newPayment;
  } catch (error) {
    logger.error("Error creating payment:", error);
    throw createError(500, "Failed to create payment");
  }
};

// Update Payment
export const updatePayment = async (id, data, Payment) => {
  try {
    logger.info(`Validating update data for payment ID: ${id}`);

    const version = data.version || 1;
    const schema = getPaymentSchemaForVersion(version);

    if (!schema) {
      logger.warn("Invalid version provided for payment update.");
      throw createError(400, "Invalid version provided");
    }

    const { error, value } = schema.validate(data);
    if (error) {
      logger.warn(`Validation failed: ${error.details[0].message}`);
      throw createError(422, error.details[0].message);
    }

    logger.info(`Updating payment with ID: ${id}`);
    const updatedPayment = await Payment.findByIdAndUpdate(id, value, { new: true });

    if (!updatedPayment) {
      logger.warn(`Payment with ID ${id} not found for update.`);
      throw createError(404, "Payment not found");
    }

    logger.info(`Payment with ID ${id} updated successfully.`);
    return updatedPayment;
  } catch (error) {
    logger.error(`Error updating payment with ID ${id}:`, error);
    throw createError(500, "Failed to update payment");
  }
};

// Delete Payment
export const deletePayment = async (id, Payment) => {
  try {
    logger.info(`Attempting to delete payment with ID: ${id}`);
    const deletedPayment = await Payment.findByIdAndDelete(id);

    if (!deletedPayment) {
      logger.warn(`Payment with ID ${id} not found for deletion.`);
      throw createError(404, "Payment not found");
    }

    logger.info(`Payment with ID ${id} deleted successfully.`);
    return { message: "Payment deleted successfully" };
  } catch (error) {
    logger.error(`Error deleting payment with ID ${id}:`, error);
    throw createError(500, "Failed to delete payment");
  }
};
