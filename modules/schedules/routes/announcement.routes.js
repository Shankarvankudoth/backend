import express from "express";
import announcementController from "../controllers/announcement.controller.js";
import { authenticateToken } from "../../../core/security/utils/jwt.utils.js";

const router = express.Router();
router.use(authenticateToken);

router.get("/", announcementController.getAll);
router.get("/:id", announcementController.getById);
router.post("/", announcementController.create);
router.put("/:id", announcementController.update);
router.delete("/:id", announcementController.delete);

export default { path: "/api/modules/announcements", router };
