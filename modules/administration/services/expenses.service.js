import joi from "joi";
import { createError } from "../../../services/errorhandling.service.js";
import loggingService from "../../../services/logging.service.js";

const logger = loggingService.getModuleLogger("ExpensesService");

// Joi validation schema for expenses
const expenseSchema = joi.object({
  reportedBy: joi.string().required(),
  reportedTo: joi.string().required(),
  branchId: joi.string().required(),
  date: joi.date().required(),
  productId: joi.string().required(),
  description: joi.string().required(),
  amount: joi.number().required(),
  payedMode: joi.string().required(),
  expenseType: joi.string().required(),
  notes: joi.string().optional(),
  documentId: joi.string().optional(),
  version: joi.number().default(1),
});

// Get Schema based on Version
const getSchemaForVersion = (version) => {
  switch (version) {
    case 1:
      return expenseSchema;
    case 2:
      return expenseSchema.keys({
        extraFieldForV2: joi.string().optional(),
      });
    case 3:
      return expenseSchema.keys({
        extraFieldForV2: joi.string().optional(),
        newFieldForV3: joi.string().optional(),
      });
    default:
      return null;
  }
};

// Get all expenses
export const getAllExpenses = async (Expenses, req, res) => {
  try {
    logger.info("Fetching all expenses");
    const expenses = await Expenses.find();
    res.status(200).json(expenses);
  } catch (error) {
    logger.error("Error fetching expenses", { error: error.message });
    throw createError(500, "Internal server error");
  }
};

// Get expense by ID
export const getExpenseById = async (Expenses, req, res) => {
  try {
    logger.info("Fetching expense", { expenseId: req.params.id });
    const expense = await Expenses.findById(req.params.id);
    if (!expense) {
      throw createError(404, "Expense not found");
    }
    res.status(200).json(expense);
  } catch (error) {
    logger.error("Error fetching expense", { error: error.message });
    throw createError(500, "Internal server error");
  }
};

// Create a new expense
export const createExpense = async (Expenses, req, res) => {
  try {
    const { version = 1 } = req.body;
    const schema = getSchemaForVersion(version);

    if (!schema) {
      logger.warn("Invalid version provided for expense creation.");
      throw createError(400, "Invalid version provided");
    }

    const { error, value } = schema.validate(req.body);
    if (error) {
      throw createError(422, error.details[0].message);
    }

    logger.info("Creating a new expense");
    const newExpense = new Expenses(value);
    const savedExpense = await newExpense.save();
    res.status(201).json(savedExpense);
  } catch (error) {
    logger.error("Error creating expense", { error: error.message });
    throw createError(500, "Internal server error");
  }
};

// Update an expense
export const updateExpense = async (Expenses, req, res) => {
  try {
    const { version = 1 } = req.body;
    const schema = getSchemaForVersion(version);

    if (!schema) {
      logger.warn("Invalid version provided for expense update.");
      throw createError(400, "Invalid version provided");
    }

    const { error, value } = schema.validate(req.body);
    if (error) {
      throw createError(422, error.details[0].message);
    }

    logger.info("Updating expense", { expenseId: req.params.id });
    const expense = await Expenses.findById(req.params.id);
    if (!expense) {
      throw createError(404, "Expense not found");
    }

    const updatedExpense = await Expenses.findByIdAndUpdate(req.params.id, value, { new: true });
    res.status(200).json(updatedExpense);
  } catch (error) {
    logger.error("Error updating expense", { error: error.message });
    throw createError(500, "Internal server error");
  }
};

// Delete an expense
export const deleteExpense = async (Expenses, req, res) => {
  try {
    logger.info("Deleting expense", { expenseId: req.params.id });
    const deletedExpense = await Expenses.findByIdAndDelete(req.params.id);
    if (!deletedExpense) {
      throw createError(404, "Expense not found");
    }
    res.status(200).json({ message: "Expense deleted successfully" });
  } catch (error) {
    logger.error("Error deleting expense", { error: error.message });
    throw createError(500, "Internal server error");
  }
};
