import Inventory from "../models/inventory.model.js";
import {
  getAllInventory,
  getInventoryById,
  createInventory,
  updateInventory,
  deleteInventory,
} from "../services/inventory.service.js";
import loggingService from "../../../services/logging.service.js";

const logger = loggingService.getModuleLogger("InventoryController");

const inventoryController = {
  getAll: async (req, res, next) => {
    try {
      logger.info("Fetching all inventory items");
      await getAllInventory(req, res, Inventory);
    } catch (error) {
      logger.error("Error fetching inventory items", { error });
      next(error);
    }
  },

  getById: async (req, res, next) => {
    try {
      logger.info(`Fetching inventory item with ID: ${req.params.id}`);
      await getInventoryById(req, res, Inventory);
    } catch (error) {
      logger.error("Error fetching inventory item by ID", { error });
      next(error);
    }
  },

  create: async (req, res, next) => {
    try {
      logger.info("Creating a new inventory item", { data: req.body });
      await createInventory(req, res, Inventory);
    } catch (error) {
      logger.error("Error creating inventory item", { error });
      next(error);
    }
  },

  update: async (req, res, next) => {
    try {
      logger.info(`Updating inventory item with ID: ${req.params.id}`, { data: req.body });
      await updateInventory(req, res,  Inventory);
    } catch (error) {
      logger.error("Error updating inventory item", { error });
      next(error);
    }
  },

  delete: async (req, res, next) => {
    try {
      logger.info(`Deleting inventory item with ID: ${req.params.id}`);
      await deleteInventory(req, res,  Inventory);
    } catch (error) {
      logger.error("Error deleting inventory item", { error });
      next(error);
    }
  },
};

export default inventoryController;
