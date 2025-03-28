import express from "express";
import { taskController } from "../controllers/task.controller.js";
import { authenticateToken } from "../../../core/security/utils/jwt.utils.js";

const router = express.Router();
router.use(authenticateToken);

/**
 * @swagger
 * tags:
 *   - name: App Specific Modules - Task Management / Tasks
 *     description: Task management operations within projects
 */

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     Task:
 *       type: object
 *       required:
 *         - title
 *         - description
 *       properties:
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         assignee:
 *           type: array
 *           items:
 *             type: string
 *         creator:
 *           type: string
 *         order:
 *           type: number
 *         stage:
 *           type: string
 *         index:
 *           type: number
 *         createdDate:
 *           type: string
 *           format: date-time
 *         updatedDate:
 *           type: string
 *           format: date-time
 *         targetDate:
 *           type: string
 *           format: date
 *         completionDate:
 *           type: string
 *           format: date
 *         version:
 *           type: number
 */

/**
 * @swagger
 * /api/modules/taskmanagement/projects/{id}/tasks/{taskId}:
 *   get:
 *     summary: Get a task by project ID and task ID
 *     tags: [App Specific Modules - Task Management / Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the project
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the task
 *     responses:
 *       200:
 *         description: Task retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       404:
 *         description: Task or project not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get("/:id/tasks/:taskId", taskController.getById);

/**
 * @swagger
 * /api/modules/taskmanagement/projects/{id}/tasks/{taskId}:
 *   put:
 *     summary: Update a task by project ID and task ID
 *     tags: [App Specific Modules - Task Management / Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the project
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the task to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               assignee:
 *                 type: array
 *                 items:
 *                   type: string
 *               creator:
 *                 type: string
 *               stage:
 *                 type: string
 *               targetDate:
 *                 type: string
 *                 format: date
 *               completionDate:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: Task updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       400:
 *         description: Bad Request
 *       404:
 *         description: Task or project not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */

router.put("/:id/tasks/:taskId", taskController.updateById);

/**
 * @swagger
 * /api/modules/taskmanagement/projects/{id}/tasks/{taskId}:
 *   delete:
 *     summary: Delete a task by project ID and task ID
 *     tags: [App Specific Modules - Task Management / Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the project
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the task to delete
 *     responses:
 *       204:
 *         description: Task deleted successfully
 *       404:
 *         description: Task or project not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.delete("/:id/tasks/:taskId", taskController.updateById);

/**
 * @swagger
 * /api/modules/taskmanagement/projects/{id}/tasks:
 *   post:
 *     summary: Create a new task in the project
 *     tags: [App Specific Modules - Task Management / Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the project
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               assignee:
 *                 type: array
 *                 items:
 *                   type: string
 *               creator:
 *                 type: string
 *               stage:
 *                 type: string
 *               targetDate:
 *                 type: string
 *                 format: date
 *               completionDate:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Task created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       400:
 *         description: Bad Request
 *       404:
 *         description: Project not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.post("/:id/tasks", taskController.create);

router.put("/:id/tasks", taskController.updateDragged);

export default {
  path: "/api/modules/taskmanagement/projects",
  router,
};
