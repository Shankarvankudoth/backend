import express from "express";
import admissionController from "../controllers/admission.controller.js";
import { authenticateToken } from "../../../core/security/utils/jwt.utils.js";

const router = express.Router();
router.use(authenticateToken);

router.get("/", admissionController.getAll);
router.get("/:id", admissionController.getById);
router.post("/", admissionController.create);
router.put("/:id", admissionController.update);
router.delete("/:id", admissionController.delete);

export default { path: "/api/modules/admissions", router };
