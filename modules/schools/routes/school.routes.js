import express from "express";
import schoolController from "../controllers/school.controller.js";
import { authenticateToken } from "../../../core/security/utils/jwt.utils.js";

const router = express.Router();
router.use(authenticateToken);

router.get("/", schoolController.getAll);
router.get("/:id", schoolController.getById);
router.post("/", schoolController.create);
router.put("/:id", schoolController.update);
router.delete("/:id", schoolController.delete);

export default { path: "/api/modules/schools", router };
