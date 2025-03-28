import * as enquiryService from "../services/enquiries.service.js";
import Enquiry from "../models/enquiries.model.js";

import loggingService from "../../../services/logging.service.js";

const logger = loggingService.getModuleLogger("EnquiryController");
const enquiryController = {
  getAll: async (req, res, next) => {
    try {
      logger.info("Fetching enquiries");
      const enquiries = await enquiryService.getAllEnquiries(Enquiry);
      res.status(200).json(enquiries);
    } catch (error) {
      logger.error("Error fetching enquiries:", error);
      next(error);
    }
  },

  getById: async (req, res, next) => {
    try {
      logger.info("Fetching enquiry by ID", { id: req.params.id });
      const enquiry = await enquiryService.getEnquiryById(req.params.id, Enquiry);
      if (!enquiry) {
        logger.error("Enquiry not found");
        return next(createError(404, "Enquiry not found"));}
      res.status(200).json(enquiry);
    } catch (error) {
      logger.error("Error fetching enquiry:", error);
      next(error);
    }
  },

  create: async (req, res, next) => {
    try {
      logger.info("Creating enquiry");
      const newEnquiry = await enquiryService.createEnquiry(req.body, Enquiry);
      res.status(201).json(newEnquiry);
    } catch (error) {
      logger.error("Error creating enquiry:", error);
      next(error);
    }
  },

  update: async (req, res, next) => {
    try {
      logger.info("Updating enquiry by ID", { id: req.params.id });
      const updatedEnquiry = await enquiryService.updateEnquiry(req.params.id, req.body, Enquiry);
      res.status(200).json(updatedEnquiry);
    } catch (error) {
      logger.error("Error updating enquiry:", error);
      next(error);
    }
  },

  delete: async (req, res, next) => {
    try {
      logger.info("Deleting enquiry by ID", { id: req.params.id });
      const message = await enquiryService.deleteEnquiry(req.params.id, Enquiry);
      res.status(200).json(message);
    } catch (error) {
      logger.error("Error deleting enquiry:", error);
      next(error);
    }
  },
};

export default enquiryController;
