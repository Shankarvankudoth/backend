import express from "express";
import worksheetsAndAssessmentsController from "../controllers/worksheetsAndAssessments.controller.js";
import { authenticateToken } from "../../../core/security/utils/jwt.utils.js";

const router = express.Router();
router.use(authenticateToken);

router.get("/", worksheetsAndAssessmentsController.getAll);
router.get("/:id", worksheetsAndAssessmentsController.getById);
router.post("/", worksheetsAndAssessmentsController.create);
router.put("/:id", worksheetsAndAssessmentsController.update);
router.delete("/:id", worksheetsAndAssessmentsController.delete);

export default { path: "/api/modules/worksheetsAndAssessments", router };
