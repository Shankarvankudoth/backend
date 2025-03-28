import {
  getAllAdmissions,
  getAdmissionById,
  createAdmission,
  updateAdmission,
  deleteAdmission,
} from "../services/admission.service.js";
import Admission from "../models/admission.model.js";
import loggingService from "../../../services/logging.service.js";

const logger = loggingService.getModuleLogger("AdmissionController");

const admissionController = {
  getAll: async (req, res, next) => {
    try {
      logger.info("Fetching all admissions");
      await getAllAdmissions(req, res, Admission);
    } catch (error) {
      logger.error("Error fetching admissions", { error });
      next(error);
    }
  },

  getById: async (req, res, next) => {
    try {
      logger.info(`Fetching admission with ID: ${req.params.id}`);
      await getAdmissionById(req, res, Admission);
    } catch (error) {
      logger.error("Error fetching admission by ID", { error });
      next(error);
    }
  },

  create: async (req, res, next) => {
    try {
      logger.info("Creating a new admission", { data: req.body });
      await createAdmission(req, res, Admission);
    } catch (error) {
      logger.error("Error creating admission", { error });
      next(error);
    }
  },

  update: async (req, res, next) => {
    try {
      logger.info(`Updating admission with ID: ${req.params.id}`, {
        data: req.body,
      });
      await updateAdmission(req, res, Admission);
    } catch (error) {
      logger.error("Error updating admission", { error });
      next(error);
    }
  },

  delete: async (req, res, next) => {
    try {
      logger.info(`Deleting admission with ID: ${req.params.id}`);
      await deleteAdmission(req, res, Admission);
    } catch (error) {
      logger.error("Error deleting admission", { error });
      next(error);
    }
  },
};

export default admissionController;
