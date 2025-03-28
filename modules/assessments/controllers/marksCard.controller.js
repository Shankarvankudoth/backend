import {
    getAllMarksCards,
    getMarksCardById,
    createMarksCard,
    updateMarksCard,
    deleteMarksCard,
  } from "../services/marksCard.service.js";
  import MarksCard from "../models/marksCard.model.js";
  import loggingService from "../../../services/logging.service.js";
  
  const logger = loggingService.getModuleLogger("marksCardController");
  
  const marksCardController = {
    getAll: async (req, res, next) => {
      try {
        logger.info("Fetching all marks cards");
        await getAllMarksCards(req, res, MarksCard);
      } catch (error) {
        logger.error("Error fetching marks cards", { error });
        next(error);
      }
    },
  
    getById: async (req, res, next) => {
      try {
        logger.info(`Fetching marks card with ID: ${req.params.id}`);
        await getMarksCardById(req, res, MarksCard);
      } catch (error) {
        logger.error("Error fetching marks card by ID", { error });
        next(error);
      }
    },
  
    create: async (req, res, next) => {
      try {
        logger.info("Creating a new marks card", { data: req.body });
        await createMarksCard(req, res, MarksCard);
      } catch (error) {
        logger.error("Error creating marks card", { error });
        next(error);
      }
    },
  
    update: async (req, res, next) => {
      try {
        logger.info(`Updating marks card with ID: ${req.params.id}`, { data: req.body });
        await updateMarksCard(req, res, MarksCard);
      } catch (error) {
        logger.error("Error updating marks card", { error });
        next(error);
      }
    },
  
    delete: async (req, res, next) => {
      try {
        logger.info(`Deleting marks card with ID: ${req.params.id}`);
        await deleteMarksCard(req, res, MarksCard);
      } catch (error) {
        logger.error("Error deleting marks card", { error });
        next(error);
      }
    },
  };
  
  export default marksCardController;
  