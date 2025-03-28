import express from "express";
import { whatsappController } from "../controllers/whatsapp.controller.js";
import { emailController } from "../controllers/email.controller.js";
import loggingService from "../../../services/logging.service.js";

const logger = loggingService.getModuleLogger("NotificationRoutes");
const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Core - Notifications
 *     description: Endpoints for handling notifications via WhatsApp and Email
 */

/**
 * @swagger
 * /api/core/notification/health:
 *   get:
 *     summary: Health check for the notification module
 *     tags: [Core - Notifications]
 *     responses:
 *       200:
 *         description: Notification module is working
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Notification module loaded successfully
 */
router.get("/health", (req, res) => {
  res.json({ message: "Notification module loaded successfully" });
});

/**
 * @swagger
 * /api/core/notification/whatsapp:
 *   post:
 *     summary: Send a WhatsApp message
 *     tags: [Core - Notifications]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               recipient:
 *                 type: string
 *                 description: Recipient's phone number
 *                 example: "+1234567890"
 *               message:
 *                 type: string
 *                 description: The message to send
 *                 example: "Hello, this is a test message."
 *     responses:
 *       200:
 *         description: WhatsApp message queued successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message
 *                   example: "WhatsApp notification queued successfully."
 *                 jobId:
 *                   type: string
 *                   description: Job ID for the queued message
 *                   example: "abc123"
 *       400:
 *         description: Validation failed due to missing recipient or message
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Recipient and message are required."
 *       500:
 *         description: Internal server error occurred
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "An unexpected error occurred."
 */
router.post("/whatsapp", (req, res, next) => {
  logger.info("POST /whatsapp endpoint hit.");
  whatsappController.sendMessage(req, res, next);
});

/**
 * @swagger
 * /api/core/notification/email:
 *   post:
 *     summary: Queue an email for sending
 *     tags: [Core - Notifications]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               to:
 *                 type: string
 *                 description: Recipient's email address
 *                 example: "example@example.com"
 *               subject:
 *                 type: string
 *                 description: Subject of the email
 *                 example: "Test Email"
 *               text:
 *                 type: string
 *                 description: Plain text content of the email
 *                 example: "This is a test email."
 *     responses:
 *       200:
 *         description: Email notification queued successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Email notification queued successfully."
 *                 jobId:
 *                   type: string
 *                   example: "job1234"
 *       400:
 *         description: Bad Request - Validation failed (missing recipient or content).
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Recipient and email content (text or HTML) are required."
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Internal server error occurred while processing the request."
 */
router.post("/email", (req, res, next) => {
  logger.info("POST /email endpoint hit.");
  emailController.sendEmail(req, res, next);
});

export default {
  path: "/api/core/notification",
  router,
};
