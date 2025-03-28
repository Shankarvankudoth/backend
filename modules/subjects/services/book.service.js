import Joi from "joi";
import { createError } from "../../../services/errorhandling.service.js";
import loggingService from "../../../services/logging.service.js";

const logger = loggingService.getModuleLogger("BookService");

// Base Joi Schema
const baseBookSchema = {
  bookName: Joi.string().required(),
  ebookDocumentId: Joi.array().items(Joi.string().hex().length(24)).default([]), // Allow empty array
  documentId: Joi.array().items(Joi.string().hex().length(24)).default([]), // Allow empty array
  authors: Joi.alternatives()
    .try(
      Joi.array().items(Joi.string()),
      Joi.string().custom((value) => value.split(",").map((v) => v.trim()))
    ),
  publisher: Joi.string().optional(),
  yearEdition: Joi.number().optional(),
  version: Joi.number().default(1),
};

// Get Schema based on Version
const getSchemaForVersion = (version) => {
  switch (version) {
    case 1:
      return Joi.object(baseBookSchema);
    case 2:
      return Joi.object({
        ...baseBookSchema,
        extraFieldForV2: Joi.string().optional(),
      });
    case 3:
      return Joi.object({
        ...baseBookSchema,
        extraFieldForV2: Joi.string().optional(),
        newFieldForV3: Joi.string().optional(),
      });
    default:
      return null;
  }
};

// Get all books
export const getAllBooks = async (Book) => {
  try {
    logger.info("Fetching all books...");
    return await Book.find();
  } catch (error) {
    logger.error("Error fetching books:", error);
    throw createError(500, "Failed to fetch books");
  }
};

// Get book by ID
export const getBookById = async (id, Book) => {
  try {
    logger.info(`Fetching book with ID: ${id}`);
    const book = await Book.findById(id);
    if (!book) throw createError(404, "Book not found");
    return book;
  } catch (error) {
    logger.error(`Error fetching book with ID ${id}:`, error);
    throw createError(500, "Failed to fetch book");
  }
};

// Create a book
export const createBook = async (data, Book) => {
  try {
    const version = data.version || 1;
    const schema = getSchemaForVersion(version);
    
    const { error, value } = schema.validate(data);
    if (error) {
      logger.warn("Validation error: ", error.details[0].message);
      throw createError(422, error.details[0].message);
    }

    logger.info("Creating new book...");
    const newBook = new Book(value);
    await newBook.save();
    return newBook;
  } catch (error) {
    logger.error("Error creating book:", error);
    throw createError(error.status || 500, error.message || "Failed to create book");
  }
};

// Update a book
export const updateBook = async (id, data, Book) => {
  try {
    const version = data.version || 1;
    const schema = getSchemaForVersion(version);

    const { error, value } = schema.validate(data);
    if (error) {
      logger.warn("Validation error: ", error.details[0].message);
      throw createError(422, error.details[0].message);
    }

    logger.info(`Updating book with ID: ${id}`);
    const updatedBook = await Book.findByIdAndUpdate(id, value, { new: true });
    if (!updatedBook) throw createError(404, "Book not found");

    return updatedBook;
  } catch (error) {
    logger.error(`Error updating book with ID ${id}:`, error);
    throw createError(error.status || 500, error.message || "Failed to update book");
  }
};

// Delete a book
export const deleteBook = async (id, Book) => {
  try {
    logger.info(`Deleting book with ID: ${id}`);
    const deletedBook = await Book.findByIdAndDelete(id);
    if (!deletedBook) throw createError(404, "Book not found");

    return { message: "Book deleted successfully" };
  } catch (error) {
    logger.error(`Error deleting book with ID ${id}:`, error);
    throw createError(500, "Failed to delete book");
  }
};