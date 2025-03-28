import express from "express";
import expensesController from "../controllers/expenses.controller.js";
import loggingService from "../../../services/logging.service.js";
import { authenticateToken } from "../../../core/security/utils/jwt.utils.js";

const logger = loggingService.getModuleLogger("Expenses Routes");
const router = express.Router();

router.use(authenticateToken);

if (!expensesController || typeof expensesController !== "object") {
  logger.error("expensesController is undefined. Check your import/export.");
  throw new Error("expensesController is undefined");
}

/**
 * @swagger
 * tags:
 *   - name: modules-Expenses
 *     description: Expense management operations
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Expense:
 *       type: object
 *       required:
 *         - reportedBy
 *         - reportedTo
 *         - branchId
 *         - date
 *         - productId
 *         - description
 *         - amount
 *         - payedMode
 *         - expenseType
 *       properties:
 *         reportedBy:
 *           type: string
 *         reportedTo:
 *           type: string
 *         branchId:
 *           type: string
 *         date:
 *           type: string
 *           format: date
 *         productId:
 *           type: string
 *         description:
 *           type: string
 *         amount:
 *           type: number
 *         payedMode:
 *           type: string
 *         expenseType:
 *           type: string
 *         notes:
 *           type: string
 *           nullable: true
 */

/**
 * @swagger
 * /api/modules/expenses:
 *   get:
 *     summary: Retrieve all expenses
 *     tags: [modules-Expenses]
 *     responses:
 *       200:
 *         description: List of all expenses
 */
router.get("/", expensesController.getAll);

/**
 * @swagger
 * /api/modules/expenses/{id}:
 *   get:
 *     summary: Get an expense by ID
 *     tags: [modules-Expenses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The expense ID
 *     responses:
 *       200:
 *         description: Details of the requested expense
 *       404:
 *         description: Expense not found
 */
router.get("/:id", expensesController.getById);

/**
 * @swagger
 * /api/modules/expenses:
 *   post:
 *     summary: Create a new expense
 *     tags: [modules-Expenses]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Expense'
 *     responses:
 *       201:
 *         description: Expense created successfully
 */
router.post("/", expensesController.create);

router.put("/:id", expensesController.update);
router.delete("/:id", expensesController.delete);

export default {
  path: "/api/modules/expenses",
  router,
};
