import express from "express";
import profileController from "../controllers/profile.controller.js";
import { authenticateToken } from "../../../core/security/utils/jwt.utils.js";

const router = express.Router();
router.use(authenticateToken);

router.get("/", profileController.getAll);
router.get("/:id", profileController.getById);
router.post("/", profileController.create);
router.put("/:id", profileController.update);
router.delete("/:id", profileController.delete);

export default { path: "/api/modules/profiles", router };
