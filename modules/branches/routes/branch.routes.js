import express from "express";
import branchController from "../controllers/branch.controller.js";
import { authenticateToken } from "../../../core/security/utils/jwt.utils.js";

const router = express.Router();
router.use(authenticateToken);

router.get("/", branchController.getAll);
router.get("/:id", branchController.getById);
router.post("/", branchController.create);
router.put("/:id", branchController.update);
router.delete("/:id", branchController.delete);

export default { path: "/api/modules/branches", router };
