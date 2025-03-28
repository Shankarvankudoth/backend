import express from "express";

const router = express.Router();
// Swagger documentation for the /health route
/**
 * @swagger
 * tags:
 *   - name: App Specific Modules - Task Management
 *     description: Task management operations within projects
 */
/**
 * @swagger
 * /api/modules/taskmanagement/health:
 *   get:
 *     summary: Get health status of the Task Management module
 *     description: Returns a success message when the Task Management module is loaded.
 *     tags: [App Specific Modules - Task Management]
 *     responses:
 *       200:
 *         description: Task Management module loaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Task Management module loaded successfully
 */
// for health check
router.get("/health", (req, res) => {
  res.json({ message: "Task Management module loaded successfully" });
});

export default {
  path: "/api/modules/taskmanagement",
  router
};
