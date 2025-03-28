import {
  getAllWorksheetsAndAssessments,
  getWorksheetOrAssessmentById,
  createWorksheetOrAssessment,
  updateWorksheetOrAssessment,
  deleteWorksheetOrAssessment,
} from "../services/worksheetsAndAssessments.service.js";
import loggingService from "../../../services/logging.service.js";
import WorksheetsAndAssessments from "../models/worksheetsAndAssessments.model.js"
const logger = loggingService.getModuleLogger("WorksheetsAndAssessmentsController");

const worksheetsAndAssessmentsController = {
  getAll: async (req, res, next) => {
    try {
      logger.info("Fetching all worksheets and assessments");
      await getAllWorksheetsAndAssessments(req, res,  WorksheetsAndAssessments);
    } catch (error) {
      logger.error("Error fetching worksheets and assessments", { error });
      next(error);
    }
  },

  getById: async (req, res, next) => {
    try {
      logger.info(`Fetching worksheet or assessment with ID: ${req.params.id}`);
      await getWorksheetOrAssessmentById(req, res,  WorksheetsAndAssessments);
    } catch (error) {
      logger.error("Error fetching worksheet or assessment by ID", { error });
      next(error);
    }
  },

  create: async (req, res, next) => {
    try {
      logger.info("Creating a new worksheet or assessment", { data: req.body });
      await createWorksheetOrAssessment(req, res,  WorksheetsAndAssessments);
    } catch (error) {
      logger.error("Error creating worksheet or assessment", { error });
      next(error);
    }
  },

  update: async (req, res, next) => {
    try {
      logger.info(`Updating worksheet or assessment with ID: ${req.params.id}`, { data: req.body });
      await updateWorksheetOrAssessment(req, res,  WorksheetsAndAssessments);
    } catch (error) {
      logger.error("Error updating worksheet or assessment", { error });
      next(error);
    }
  },

  delete: async (req, res, next) => {
    try {
      logger.info(`Deleting worksheet or assessment with ID: ${req.params.id}`);
      await deleteWorksheetOrAssessment(req, res,  WorksheetsAndAssessments);
    } catch (error) {
      logger.error("Error deleting worksheet or assessment", { error });
      next(error);
    }
  },
};

export default worksheetsAndAssessmentsController;
