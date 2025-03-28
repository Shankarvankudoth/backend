import express from "express";
import resultsController from "../controllers/results.controller.js";
import { authenticateToken } from "../../../core/security/utils/jwt.utils.js";

const router = express.Router();
router.use(authenticateToken);

router.get("/", resultsController.getAll);
router.get("/:id", resultsController.getById);
router.post("/", resultsController.create);
router.put("/:id", resultsController.update);
router.delete("/:id", resultsController.delete);

export default { path: "/api/modules/results", router };
