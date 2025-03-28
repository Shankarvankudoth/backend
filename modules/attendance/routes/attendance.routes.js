import express from "express";
import attendanceController from "../controllers/attendance.controller.js";
import { authenticateToken } from "../../../core/security/utils/jwt.utils.js";

const router = express.Router();
router.use(authenticateToken);

router.get("/", attendanceController.getAll);
router.get("/:id", attendanceController.getById);
router.post("/", attendanceController.create);
router.put("/:id", attendanceController.update);
router.delete("/:id", attendanceController.delete);

export default { path: "/api/modules/attendance", router };
