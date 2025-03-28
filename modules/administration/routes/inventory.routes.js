import express from "express";
import inventoryController from "../controllers/inventory.controller.js";
import { authenticateToken } from "../../../core/security/utils/jwt.utils.js";
import loggingService from "../../../services/logging.service.js";

const logger = loggingService.getModuleLogger("InventoryRoutes");
const router = express.Router();

router.use(authenticateToken);

if (!inventoryController || typeof inventoryController !== "object") {
  logger.error("inventoryController is undefined. Check your import/export.");
  throw new Error("inventoryController is undefined");
}

router.get("/", inventoryController.getAll);
router.get("/:id", inventoryController.getById);
router.post("/", inventoryController.create);
router.put("/:id", inventoryController.update);
router.delete("/:id", inventoryController.delete);

console.log("Inventory Router is successfully created.");

export default {
  path: "/api/modules/inventories",
  router,
};
