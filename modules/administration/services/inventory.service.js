import Joi from "joi";
import { createError } from "../../../services/errorhandling.service.js";
import loggingService from "../../../services/logging.service.js";

const logger = loggingService.getModuleLogger("InventoryService");

// Joi validation schema
const inventorySchema = Joi.object({
  productName: Joi.string().required(),
  productType: Joi.string().required(),
  productCompanyName: Joi.string().required(),
  category: Joi.string().required(),
  purchasedDate: Joi.date().required(),
  cost: Joi.number().required(),
  quantity: Joi.number().required(),
  reorderLevel: Joi.number().required(),
  vendor: Joi.object({
    name: Joi.string().required(),
    department: Joi.string().required(),
  }).required(),
  purchaseOrderNumber: Joi.string().required(),
  status: Joi.boolean().default(true),
  documentIds: Joi.array().items(Joi.string()),
  version: Joi.number().default(1),
});

// Get Schema based on Version
const getSchemaForVersion = (version) => {
  switch (version) {
    case 1:
      return inventorySchema;
    case 2:
      return inventorySchema.keys({
        extraFieldForV2: Joi.string().optional(),
      });
    case 3:
      return inventorySchema.keys({
        extraFieldForV2: Joi.string().optional(),
        newFieldForV3: Joi.string().optional(),
      });
    default:
      return null;
  }
};

// Get all inventory items
export const getAllInventory = async (req, res, Inventory) => {
  try {
    logger.info("Fetching all inventory items...");
    const items = await Inventory.find();
    logger.info(`Fetched ${items.length} inventory items successfully.`);
    res.status(200).json(items);
  } catch (error) {
    logger.error("Error fetching inventory", { error: error.message });
    throw createError(500, "Internal server error");
  }
};

// Get inventory item by ID
export const getInventoryById = async (req, res, Inventory) => {
  try {
    logger.info(`Fetching inventory item with ID: ${req.params.id}`);
    const item = await Inventory.findById(req.params.id);
    if (!item) {
      logger.warn(`Inventory item with ID ${req.params.id} not found.`);
      throw createError(404, "Inventory item not found");
    }
    logger.info(`Fetched inventory item successfully: ${item.productName}`);
    res.status(200).json(item);
  } catch (error) {
    logger.error(`Error fetching inventory item with ID: ${req.params.id}`, {
      error: error.message,
    });
    throw createError(500, "Internal server error");
  }
};

// Create inventory item
export const createInventory = async (req, res, Inventory) => {
  try {
    const { version = 1 } = req.body;
    const schema = getSchemaForVersion(version);

    if (!schema) {
      logger.warn("Invalid version provided for inventory creation.");
      throw createError(400, "Invalid version provided");
    }

    const { error, value } = schema.validate(req.body);

    logger.info("Validating inventory data for creation...");
    if (error) {
      logger.warn(`Validation failed: ${error.details[0].message}`);
      throw createError(422, error.details[0].message);
    }

    logger.info("Creating new inventory item...");
    const newItem = new Inventory(value);
    const savedItem = await newItem.save();
    logger.info(
      `Inventory item created successfully: ${savedItem.productName}`
    );
    res.status(201).json(savedItem);
  } catch (error) {
    logger.error("Error creating inventory item", { error: error.message });
    throw createError(500, "Internal server error");
  }
};

// Update inventory item
export const updateInventory = async (req, res, Inventory) => {
  try {
    const { version = 1 } = req.body;
    const schema = getSchemaForVersion(version);

    if (!schema) {
      logger.warn("Invalid version provided for inventory update.");
      throw createError(400, "Invalid version provided");
    }

    const { error, value } = schema.validate(req.body);

    logger.info(`Validating update data for inventory ID: ${req.params.id}`);
    if (error) {
      logger.warn(`Validation failed for update: ${error.details[0].message}`);
      throw createError(422, error.details[0].message);
    }

    logger.info(`Updating inventory item with ID: ${req.params.id}`);
    const updatedItem = await Inventory.findByIdAndUpdate(
      req.params.id,
      value,
      { new: true }
    );
    if (!updatedItem) {
      logger.warn(
        `Inventory item with ID ${req.params.id} not found for update.`
      );
      throw createError(404, "Inventory item not found");
    }

    logger.info(
      `Inventory item updated successfully: ${updatedItem.productName}`
    );
    res.status(200).json(updatedItem);
  } catch (error) {
    logger.error(`Error updating inventory item with ID: ${req.params.id}`, {
      error: error.message,
    });
    throw createError(500, "Internal server error");
  }
};

// Delete inventory item
export const deleteInventory = async (req, res, Inventory) => {
  try {
    logger.info(
      `Attempting to delete inventory item with ID: ${req.params.id}`
    );
    const deletedItem = await Inventory.findByIdAndDelete(req.params.id);
    if (!deletedItem) {
      logger.warn(
        `Inventory item with ID ${req.params.id} not found for deletion.`
      );
      throw createError(404, "Inventory item not found");
    }

    logger.info(
      `Inventory item deleted successfully: ${deletedItem.productName}`
    );
    res.status(200).json({ message: "Inventory item deleted successfully" });
  } catch (error) {
    logger.error(`Error deleting inventory item with ID: ${req.params.id}`, {
      error: error.message,
    });
    throw createError(500, "Internal server error");
  }
};
