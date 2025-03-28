import express from "express";
import feedbackController from "../controllers/feedback.controller.js";
import { authenticateToken } from "../../../core/security/utils/jwt.utils.js";

const router = express.Router();
router.use(authenticateToken);

router.get("/", feedbackController.getAll);
router.get("/:id", feedbackController.getById);
router.post("/", feedbackController.create);
router.put("/:id", feedbackController.update);
router.delete("/:id", feedbackController.delete);

export default { path: "/api/modules/feedbacks", router };
