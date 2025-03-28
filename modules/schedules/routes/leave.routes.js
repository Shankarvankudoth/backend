import express from "express";
import leavesController from "../controllers/leave.controller.js";
import { authenticateToken } from "../../../core/security/utils/jwt.utils.js";

const router = express.Router();
router.use(authenticateToken);

router.get("/", leavesController.getAll);
router.get("/:id", leavesController.getById);
router.post("/", leavesController.create);
router.put("/:id", leavesController.update);
router.delete("/:id", leavesController.delete);

export default { path: "/api/modules/leaves", router };
