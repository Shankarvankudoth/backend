import express from "express";
import feeStructureController from "../controllers/feeStructure.controller.js";
import { authenticateToken } from "../../../core/security/utils/jwt.utils.js";

const router = express.Router();
router.use(authenticateToken);

router.get("/", feeStructureController.getAll);
router.get("/:id", feeStructureController.getById);
router.post("/", feeStructureController.create);
router.put("/:id", feeStructureController.update);
router.delete("/:id", feeStructureController.delete);

export default { path: "/api/modules/fees", router };
