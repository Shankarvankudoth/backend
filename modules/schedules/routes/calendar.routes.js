import express from "express";
import calendarController from "../controllers/calendar.controller.js";
import { authenticateToken } from "../../../core/security/utils/jwt.utils.js";

const router = express.Router();
router.use(authenticateToken);

router.get("/", calendarController.getAll);
router.get("/:id", calendarController.getById);
router.post("/", calendarController.create);
router.put("/:id", calendarController.update);
router.delete("/:id", calendarController.delete);

export default { path: "/api/modules/calendar", router };
