import * as bookService from "../services/book.service.js";
import Book from "../models/book.model.js";
import { createError } from "../../../services/errorhandling.service.js";
import loggingService from "../../../services/logging.service.js";

const logger = loggingService.getModuleLogger("bookController");

const bookController = {
  async getAll(req, res, next) {
    try {
      logger.info("Fetching all books");
      const books = await bookService.getAllBooks(Book);
      res.status(200).json(books);
    } catch (error) {
      logger.error("Error fetching books:", error);
      next(error);
    }
  },

  async getById(req, res, next) {
    try {
      logger.info("Fetching book by ID", { id: req.params.id });
      const book = await bookService.getBookById(req.params.id, Book);
      if (!book) {
        logger.error("Book not found");
        return next(createError(404, "Book not found"));
      }
      res.status(200).json(book);
    } catch (error) {
      logger.error("Error fetching book:", error);
      next(error);
    }
  },

  async create(req, res, next) {
    try {
      logger.info("Creating new book");
      const newBook = await bookService.createBook(req.body, Book);
      res.status(201).json(newBook);
    } catch (error) {
      logger.error("Error creating book:", error);
      next(error);
    }
  },

  async update(req, res, next) {
    try {
      logger.info("Updating book", { id: req.params.id, body: req.body });
      const updatedBook = await bookService.updateBook(req.params.id, req.body, Book);
      res.status(200).json(updatedBook);
    } catch (error) {
      logger.error("Error updating book:", error);
      next(error);
    }
  },

  async delete(req, res, next) {
    try {
      logger.info("Deleting book", { id: req.params.id });
      const message = await bookService.deleteBook(req.params.id, Book);
      res.status(200).json(message);
    } catch (error) {
      logger.error("Error deleting book:", error);
      next(error);
    }
  },
};

export default bookController;
