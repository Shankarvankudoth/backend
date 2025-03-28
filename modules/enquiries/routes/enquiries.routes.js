import express from "express";
import enquiryController from "../controllers/enquiries.controller.js";
import { authenticateToken } from "../../../core/security/utils/jwt.utils.js";

const router = express.Router();
router.use(authenticateToken);

router.get("/", enquiryController.getAll);
router.get("/:id", enquiryController.getById);
router.post("/", enquiryController.create);
router.put("/:id", enquiryController.update);
router.delete("/:id", enquiryController.delete);

export default { path: "/api/modules/enquiries", router };
