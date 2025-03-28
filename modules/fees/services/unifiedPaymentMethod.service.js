import Joi from "joi";
import { createError } from "../../../services/errorhandling.service.js";
import loggingService from "../../../services/logging.service.js";

const logger = loggingService.getModuleLogger("UnifiedPaymentService");

// Joi Validation Schema for Unified Payment Method
const baseUnifiedPaymentSchema = {
  transactionType: Joi.string()
    .valid(
      "cash",
      "cheque",
      "onlineTransactions",
      "netBanking",
      "offlineQrCode",
      "demandDraft"
    )
    .required(),
  amount: Joi.number().required(),
  finalStatus: Joi.string().optional().allow(null),
  payeeName: Joi.string().optional().allow(null),
  payeeContact: Joi.string().optional().allow(null),
  receivedBy: Joi.string().optional().allow(null),
  receiptNo: Joi.string().optional().allow(null),
  chequeNumber: Joi.string().optional().allow(null),
  chequeDate: Joi.string().optional().allow(null), // Accepts "dd-mm-yyyy" format
  validDate: Joi.string().optional().allow(null),
  validStatus: Joi.boolean().optional(),
  payerBankName: Joi.string().optional().allow(null),
  payerBankBranchName: Joi.string().optional().allow(null),
  signed: Joi.boolean().optional(),
  transactionRefNo: Joi.string().optional().allow(null),
  rawPaymentMode: Joi.string().optional().allow(null),
  payerMerchantApp: Joi.string().optional().allow(null),
  initialStatus: Joi.boolean().optional(),
  offlineStatus: Joi.string().optional().allow(null),
  offlineInitialStatus: Joi.boolean().optional(),
  draftNumber: Joi.string().optional().allow(null),
  ddDate: Joi.string().optional().allow(null),
  version: Joi.number().default(1),
};

const getSchemaForVersion = (version) => {
  switch (version) {
    case 1:
      return Joi.object(baseUnifiedPaymentSchema);
    case 2:
      return Joi.object({
        ...baseUnifiedPaymentSchema,
        extraFieldForV2: Joi.string().optional(),
      });
    case 3:
      return Joi.object({
        ...baseUnifiedPaymentSchema,
        extraFieldForV2: Joi.string().optional(),
        newFieldForV3: Joi.string().optional(),
      });
    default:
      return null;
  }
};

export const getAllUnifiedPayments = async (UnifiedPaymentMethod) => {
  try {
    logger.info("Fetching all unified payments...");
    const payments = await UnifiedPaymentMethod.find();
    logger.info(`Fetched ${payments.length} payments successfully.`);
    return payments;
  } catch (error) {
    logger.error("Error fetching unified payments:", error);
    throw createError(500, "Failed to fetch unified payments");
  }
};

export const getUnifiedPaymentById = async (id, UnifiedPaymentMethod) => {
  try {
    logger.info(`Fetching unified payment with ID: ${id}`);
    const payment = await UnifiedPaymentMethod.findById(id);
    if (!payment) {
      logger.warn(`Unified payment with ID ${id} not found.`);
      throw createError(404, "Unified payment not found");
    }
    logger.info(`Unified payment with ID ${id} fetched successfully.`);
    return payment;
  } catch (error) {
    logger.error(`Error fetching unified payment with ID ${id}:`, error);
    throw createError(500, "Failed to fetch unified payment");
  }
};

export const createUnifiedPayment = async (data, UnifiedPaymentMethod) => {
  try {
    const version = data.version || 1;
    const schema = getSchemaForVersion(version);
    if (!schema) {
      logger.warn("Invalid version provided for unified payment creation.");
      throw createError(400, "Invalid version provided");
    }
    logger.info("Validating unified payment data for creation...");
    const { error, value } = schema.validate(data);
    if (error) {
      logger.warn(`Validation failed: ${error.details[0].message}`);
      throw createError(422, error.details[0].message);
    }
    logger.info("Creating new unified payment...");
    const newPayment = new UnifiedPaymentMethod(value);
    await newPayment.save();
    logger.info("Unified payment created successfully.");
    return newPayment;
  } catch (error) {
    logger.error("Error creating unified payment:", error);
    throw createError(500, "Failed to create unified payment");
  }
};

export const updateUnifiedPayment = async (id, data, UnifiedPaymentMethod) => {
  try {
    logger.info(`Validating update data for unified payment ID: ${id}`);
    const version = data.version || 1;
    const schema = getSchemaForVersion(version);
    if (!schema) {
      logger.warn("Invalid version provided for unified payment update.");
      throw createError(400, "Invalid version provided");
    }
    const { error, value } = schema.validate(data);
    if (error) {
      logger.warn(`Validation failed: ${error.details[0].message}`);
      throw createError(422, error.details[0].message);
    }
    logger.info(`Updating unified payment with ID: ${id}`);
    const updatedPayment = await UnifiedPaymentMethod.findByIdAndUpdate(
      id,
      value,
      { new: true }
    );
    if (!updatedPayment) {
      logger.warn(`Unified payment with ID ${id} not found for update.`);
      throw createError(404, "Unified payment not found");
    }
    logger.info(`Unified payment with ID ${id} updated successfully.`);
    return updatedPayment;
  } catch (error) {
    logger.error(`Error updating unified payment with ID ${id}:`, error);
    throw createError(500, "Failed to update unified payment");
  }
};

export const deleteUnifiedPayment = async (id, UnifiedPaymentMethod) => {
  try {
    logger.info(`Attempting to delete unified payment with ID: ${id}`);
    const deletedPayment = await UnifiedPaymentMethod.findByIdAndDelete(id);
    if (!deletedPayment) {
      logger.warn(`Unified payment with ID ${id} not found for deletion.`);
      throw createError(404, "Unified payment not found");
    }
    logger.info(`Unified payment with ID ${id} deleted successfully.`);
    return { message: "Unified payment deleted successfully" };
  } catch (error) {
    logger.error(`Error deleting unified payment with ID ${id}:`, error);
    throw createError(500, "Failed to delete unified payment");
  }
};
