import * as invoiceService from "../services/invoice.service.js";
import Invoice from "../models/invoice.model.js";
import { createError } from "../../../services/errorhandling.service.js";
import loggingService from "../../../services/logging.service.js";

const logger = loggingService.getModuleLogger("invoiceController");
const invoiceController = {
  getAll: async (req, res, next) => {
    try {
      logger.info("Fetching invoices");
      const invoices = await invoiceService.getAllInvoices(Invoice);
      res.status(200).json(invoices);
    } catch (error) {
      logger.error("Error fetching invoices:", error);
      next(error);
    }
  },

  getById: async (req, res, next) => {
    try {
      logger.info("Fetching invoice by ID", { id: req.params.id });
      const invoice = await invoiceService.getInvoiceById(req.params.id, Invoice);
      if (!invoice) {
        logger.error("Invoice not found");
        return next(createError(404, "Invoice not found"));
      }
      res.status(200).json(invoice);
    } catch (error) {
      logger.error("Error fetching invoice:", error);
      next(error);
    }
  },

  create: async (req, res, next) => {
    try {
      logger.info("Creating invoice");
      const newInvoice = await invoiceService.createInvoice(req.body, Invoice);
      res.status(201).json(newInvoice);
    } catch (error) {
      logger.error("Error creating invoice:", error);
      next(error);
    }
  },

  update: async (req, res, next) => {
    try {
      logger.info("Updating invoice by ID", { id: req.params.id });
      const updatedInvoice = await invoiceService.updateInvoice(req.params.id, req.body, Invoice);
      res.status(200).json(updatedInvoice);
    } catch (error) {
      logger.error("Error updating invoice:", error);
      next(error);
    }
  },

  delete: async (req, res, next) => {
    try {
      logger.info("Deleting invoice by ID", { id: req.params.id });
      const message = await invoiceService.deleteInvoice(req.params.id, Invoice);
      res.status(200).json(message);
    } catch (error) {
      logger.error("Error deleting invoice:", error);
      next(error);
    }
  },
};

export default invoiceController;
