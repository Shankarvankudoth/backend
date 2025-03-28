import express from "express";
import { documentController } from "../controllers/document.controller.js";
import { authenticateToken } from "../../../core/security/utils/jwt.utils.js";
import multer from "multer";
import path from "path";

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = "uploads/documents";
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// router.use(authenticateToken);

/**
 * @swagger
 * tags:
 *   - name: App Specific Modules - Documents
 *     description: Endpoints for managing documents
 */

/**
 * @swagger
 * /api/modules/documents/health:
 *   get:
 *     summary: Health check for the Documents module
 *     tags: [App Specific Modules - Documents]
 *     responses:
 *       200:
 *         description: Documents module loaded successfully
 */
router.get("/health", (req, res) => {
  res.json({ message: "Documents module loaded successfully" });
});

/**
 * @swagger
 * /api/modules/documents:
 *   post:
 *     summary: Create a new document
 *     tags: [App Specific Modules - Documents]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *               type:
 *                 type: string
 *                 example: "ID Proof"
 *     responses:
 *       201:
 *         description: Document created successfully
 */
router.post("/", upload.single("file"), documentController.create);

/**
 * @swagger
 * /api/modules/documents:
 *   get:
 *     summary: Retrieve all documents
 *     tags: [App Specific Modules - Documents]
 *     responses:
 *       200:
 *         description: A list of documents
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: The document ID
 *                   originalName:
 *                     type: string
 *                     description: Original file name uploaded
 *                   fileName:
 *                     type: string
 *                     description: The stored file name on the server
 *                   filepath:
 *                     type: string
 *                     description: Path to the stored file
 *                   type:
 *                     type: string
 *                     description: Type of the document (e.g., ID Proof, License, etc.)
 *                   mimeType:
 *                     type: string
 *                     description: MIME type of the uploaded file
 *                   version:
 *                     type: integer
 *                     description: Version of the document
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     description: Document creation timestamp
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *                     description: Document last update timestamp
 *       500:
 *         description: Internal server error
 */
router.get("/", documentController.getAll);

/**
 * @swagger
 * /api/modules/documents/{id}:
 *   get:
 *     summary: Get a document by ID
 *     tags: [App Specific Modules - Documents]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Document ID
 *     responses:
 *       200:
 *         description: Document details
 */
router.get("/:id", documentController.getById);

/**
 * @swagger
 * /api/modules/documents/{id}:
 *   put:
 *     summary: Update a document by ID
 *     tags: [App Specific Modules - Documents]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Document ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               type:
 *                 type: string
 *                 example: "Updated Type"
 *     responses:
 *       200:
 *         description: Document updated successfully
 */
router.put("/:id", documentController.updateById);

/**
 * @swagger
 * /api/modules/documents/{id}:
 *   delete:
 *     summary: Delete a document by ID
 *     tags: [App Specific Modules - Documents]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Document ID
 *     responses:
 *       200:
 *         description: Document deleted successfully
 */
router.delete("/:id", documentController.deleteById);

export default {
  path: "/api/modules/documents",
  router,
};
