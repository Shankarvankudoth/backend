import express from "express";
import batchController from "../controllers/batch.controller.js";
import { authenticateToken } from "../../../core/security/utils/jwt.utils.js";

const router = express.Router();
router.use(authenticateToken);

router.get("/", batchController.getAll);
router.get("/:id", batchController.getById);
router.post("/", batchController.create);
router.put("/:id", batchController.update);
router.delete("/:id", batchController.delete);

export default { path: "/api/modules/batches", router };
