import Joi from "joi";
import { createError } from "../../../services/errorhandling.service.js";
import loggingService from "../../../services/logging.service.js";

const logger = loggingService.getModuleLogger("InvoiceService");

// Joi Validation Schema for Invoice
const baseInvoiceSchema = {
  paymentId: Joi.string().required(),
  invoiceNumber: Joi.string().required(),
  date: Joi.string().required(),
  amount: Joi.number().required(),
  studentId: Joi.string().required(),
  paidById: Joi.string().required(),
  documentId: Joi.string().required(),
  version: Joi.number().default(1),
};

// Get Schema based on Version
const getInvoiceSchemaForVersion = (version) => {
  switch (version) {
    case 1:
      return Joi.object(baseInvoiceSchema);
    case 2:
      return Joi.object({
        ...baseInvoiceSchema,
        extraFieldForV2: Joi.string().optional(),
      });
    case 3:
      return Joi.object({
        ...baseInvoiceSchema,
        extraFieldForV2: Joi.string().optional(),
        newFieldForV3: Joi.string().optional(),
      });
    default:
      return null;
  }
};

// Get All Invoices
export const getAllInvoices = async (Invoice) => {
  try {
    logger.info("Fetching all invoices...");
    const invoices = await Invoice.find();
    logger.info(`Fetched ${invoices.length} invoices successfully.`);
    return invoices;
  } catch (error) {
    logger.error("Error fetching invoices:", error);
    throw createError(500, "Failed to fetch invoices");
  }
};

// Get Invoice by ID
export const getInvoiceById = async (id, Invoice) => {
  try {
    logger.info(`Fetching invoice with ID: ${id}`);
    const invoice = await Invoice.findById(id);

    if (!invoice) {
      logger.warn(`Invoice with ID ${id} not found.`);
      throw createError(404, "Invoice not found");
    }

    logger.info(`Invoice with ID ${id} fetched successfully.`);
    return invoice;
  } catch (error) {
    logger.error(`Error fetching invoice with ID ${id}:`, error);
    throw createError(500, "Failed to fetch invoice");
  }
};

// Create Invoice
export const createInvoice = async (data, Invoice) => {
  try {
    const version = data.version || 1;
    const schema = getInvoiceSchemaForVersion(version);

    if (!schema) {
      logger.warn("Invalid version provided for invoice creation.");
      throw createError(400, "Invalid version provided");
    }

    logger.info("Validating invoice data for creation...");
    const { error, value } = schema.validate(data);

    if (error) {
      logger.warn(`Validation failed: ${error.details[0].message}`);
      throw createError(422, error.details[0].message);
    }

    logger.info("Creating new invoice...");
    const newInvoice = new Invoice(value);
    await newInvoice.save();
    logger.info("Invoice created successfully.");

    return newInvoice;
  } catch (error) {
    logger.error("Error creating invoice:", error);
    throw createError(500, "Failed to create invoice");
  }
};

// Update Invoice
export const updateInvoice = async (id, data, Invoice) => {
  try {
    logger.info(`Validating update data for invoice ID: ${id}`);

    const version = data.version || 1;
    const schema = getInvoiceSchemaForVersion(version);

    if (!schema) {
      logger.warn("Invalid version provided for invoice update.");
      throw createError(400, "Invalid version provided");
    }

    const { error, value } = schema.validate(data);
    if (error) {
      logger.warn(`Validation failed: ${error.details[0].message}`);
      throw createError(422, error.details[0].message);
    }

    logger.info(`Updating invoice with ID: ${id}`);
    const updatedInvoice = await Invoice.findByIdAndUpdate(id, value, { new: true });

    if (!updatedInvoice) {
      logger.warn(`Invoice with ID ${id} not found for update.`);
      throw createError(404, "Invoice not found");
    }

    logger.info(`Invoice with ID ${id} updated successfully.`);
    return updatedInvoice;
  } catch (error) {
    logger.error(`Error updating invoice with ID ${id}:`, error);
    throw createError(500, "Failed to update invoice");
  }
};

// Delete Invoice
export const deleteInvoice = async (id, Invoice) => {
  try {
    logger.info(`Attempting to delete invoice with ID: ${id}`);
    const deletedInvoice = await Invoice.findByIdAndDelete(id);

    if (!deletedInvoice) {
      logger.warn(`Invoice with ID ${id} not found for deletion.`);
      throw createError(404, "Invoice not found");
    }

    logger.info(`Invoice with ID ${id} deleted successfully.`);
    return { message: "Invoice deleted successfully" };
  } catch (error) {
    logger.error(`Error deleting invoice with ID ${id}:`, error);
    throw createError(500, "Failed to delete invoice");
  }
};