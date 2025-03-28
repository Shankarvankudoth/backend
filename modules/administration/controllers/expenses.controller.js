import Expenses from "../models/expenses.model.js";
import {
  getAllExpenses,
  getExpenseById,
  createExpense,
  updateExpense,
  deleteExpense,
} from "../services/expenses.service.js";
import loggingService from "../../../services/logging.service.js";

const logger = loggingService.getModuleLogger("ExpensesController");

const expensesController = {
  getAll: async (req, res, next) => {
    try {
      logger.info("Fetching all expenses");
      await getAllExpenses(Expenses, req, res);
    } catch (error) {
      logger.error("Error fetching expenses", { error });
      next(error);
    }
  },

  getById: async (req, res, next) => {
    try {
      logger.info(`Fetching expense with ID: ${req.params.id}`);
      await getExpenseById(Expenses, req, res);
    } catch (error) {
      logger.error("Error fetching expense by ID", { error });
      next(error);
    }
  },

  create: async (req, res, next) => {
    try {
      logger.info("Creating a new expense", { data: req.body });
      await createExpense(Expenses, req, res);
    } catch (error) {
      logger.error("Error creating expense", { error });
      next(error);
    }
  },

  update: async (req, res, next) => {
    try {
      logger.info(`Updating expense with ID: ${req.params.id}`, { data: req.body });
      await updateExpense(Expenses, req, res);
    } catch (error) {
      logger.error("Error updating expense", { error });
      next(error);
    }
  },

  delete: async (req, res, next) => {
    try {
      logger.info(`Deleting expense with ID: ${req.params.id}`);
      await deleteExpense(Expenses, req, res);
    } catch (error) {
      logger.error("Error deleting expense", { error });
      next(error);
    }
  },
};

export default expensesController;
