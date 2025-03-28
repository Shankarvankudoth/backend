import express from "express";
import subjectController from "../controllers/subject.controller.js";
import { authenticateToken } from "../../../core/security/utils/jwt.utils.js";

const router = express.Router();
router.use(authenticateToken);

router.get("/", subjectController.getAll);
router.get("/:id", subjectController.getById);
router.post("/", subjectController.create);
router.put("/:id", subjectController.update);
router.delete("/:id", subjectController.delete);

export default { path: "/api/modules/subjects", router };
