import express from "express";
import unifiedPaymentMethodController from "../controllers/unifiedPaymentMethod.controller.js";
import { authenticateToken } from "../../../core/security/utils/jwt.utils.js";

const router = express.Router();
router.use(authenticateToken);

router.get("/", unifiedPaymentMethodController.getAll);
router.get("/:id", unifiedPaymentMethodController.getById);
router.post("/", unifiedPaymentMethodController.create);
router.put("/:id", unifiedPaymentMethodController.update);
router.delete("/:id", unifiedPaymentMethodController.delete);

export default { path: "/api/modules/unifiedPayments", router };
