import express from "express";
import marksCardController from "../controllers/marksCard.controller.js";
import { authenticateToken } from "../../../core/security/utils/jwt.utils.js";

const router = express.Router();
router.use(authenticateToken);

router.get("/", marksCardController.getAll);
router.get("/:id", marksCardController.getById);
router.post("/", marksCardController.create);
router.put("/:id", marksCardController.update);
router.delete("/:id", marksCardController.delete);

export default { path: "/api/modules/marksCard", router };
