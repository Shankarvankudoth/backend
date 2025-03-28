import express from "express";
import scheduleController from "../controllers/schedule.controller.js";
import { authenticateToken } from "../../../core/security/utils/jwt.utils.js";

const router = express.Router();
router.use(authenticateToken);

router.get("/", scheduleController.getAll);
router.get("/:id", scheduleController.getById);
router.post("/", scheduleController.create);
router.put("/:id", scheduleController.update);
router.delete("/:id", scheduleController.delete);

export default { path: "/api/modules/schedules", router };
