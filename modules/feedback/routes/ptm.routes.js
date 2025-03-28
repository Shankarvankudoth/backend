import express from "express";
import ptmController from "../controllers/ptm.controller.js";
import { authenticateToken } from "../../../core/security/utils/jwt.utils.js";

const router = express.Router();
router.use(authenticateToken);

router.get("/", ptmController.getAll);
router.get("/:id", ptmController.getById);
router.post("/", ptmController.create);
router.put("/:id", ptmController.update);
router.delete("/:id", ptmController.delete);

export default { path: "/api/modules/ptm", router };
