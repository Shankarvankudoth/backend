import express from "express";
import paymentController from "../controllers/payment.controller.js";
import { authenticateToken } from "../../../core/security/utils/jwt.utils.js";

const router = express.Router();
router.use(authenticateToken);

router.get("/", paymentController.getAll);
router.get("/:id", paymentController.getById);
router.post("/", paymentController.create);
router.put("/:id", paymentController.update);
router.delete("/:id", paymentController.delete);

export default { path: "/api/modules/payments", router };
