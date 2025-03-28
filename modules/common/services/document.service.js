import { createError } from "../../../services/errorhandling.service.js";
import loggingService from "../../../services/logging.service.js";
import multer from "multer";
import path from "path";
import Document from "../models/document.model.js";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const logger = loggingService.getModuleLogger("DocumentManagementService");
const uploadPath = path.join(__dirname, "../../../uploads/documents");

if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
  logger.info(`Created upload directory: ${uploadPath}`);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const fileExtension = path.extname(file.originalname);
    const baseName = path.basename(file.originalname, fileExtension);
    const uniqueTimestamp = Date.now();
    const generatedFileName = `${baseName}-${uniqueTimestamp}${fileExtension}`;

    req.fileGeneratedName = generatedFileName;
    req.originalFileName = file.originalname;
    cb(null, generatedFileName);
  }
});

const upload = multer({ storage });
export const getAllDocuments = async (req, res) => {
  try {
    const documents = await Document.find();
    res.status(200).json(documents);
  } catch (error) {
    logger.error("Error fetching documents", { error: error.message });
    res.status(500).json({ message: "Internal server error" });
  }
};

export const createDocument = async (req, res) => {
  if (!req.file || !req.body.type) {
    logger.warn("Missing file or type in request");
    throw createError(400, "File and document type are required");
  }

  try {
    const newDocument = new Document({
      originalName: req.file.originalname,
      fileName: req.file.filename,
      filepath: path.join(uploadPath, req.file.filename),
      type: req.body.type,
      mimeType: req.file.mimetype,
      version: 1
    });

    const savedDocument = await newDocument.save();
    logger.info("Document created successfully", { documentId: savedDocument._id });
    res.status(201).json(savedDocument);
  } catch (error) {
    logger.error("Error saving document", { error: error.message });
    throw createError(500, "Internal server error");
  }
};

export const getDocumentById = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);
    if (!document) {
      logger.warn("Document not found", { documentId: req.params.id });
      throw createError(404, "Document not found");
    }
    res.status(200).json(document);
  } catch (error) {
    logger.error("Error fetching document", { error: error.message });
    throw createError(500, "Internal server error");
  }
};

export const updateDocumentById = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);
    if (!document) {
      logger.warn("Document not found for update", { documentId: req.params.id });
      throw createError(404, "Document not found");
    }

    document.type = req.body.type || document.type;
    document.version += 1;
    const updatedDocument = await document.save();

    logger.info("Document updated successfully", { documentId: req.params.id });
    res.status(200).json(updatedDocument);
  } catch (error) {
    logger.error("Error updating document", { error: error.message });
    throw createError(500, "Internal server error");
  }
};

export const deleteDocumentById = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);
    if (!document) {
      logger.warn("Document not found for deletion", { documentId: req.params.id });
      throw createError(404, "Document not found");
    }

    const filePath = path.join(uploadPath, document.fileName);
    if (fs.existsSync(filePath)) {
      try {
        await fs.promises.unlink(filePath);
        logger.info("File deleted successfully from filesystem", { absoluteFilePath: filePath });
      } catch (fsError) {
        logger.error("Error deleting file from filesystem", { error: fsError.message, absoluteFilePath: filePath });
        throw createError(500, "Error deleting file from filesystem");
      }
    }

    await document.deleteOne();
    logger.info("Document deleted successfully from database", { documentId: req.params.id });

    res.status(200).json({
      message: "Document deleted successfully",
      details: {
        documentId: req.params.id,
        fileName: document.fileName
      }
    });
  } catch (error) {
    logger.error("Error in delete document operation", { error: error.message, documentId: req.params.id });
    throw createError(500, "Internal server error");
  }
};
