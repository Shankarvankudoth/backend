import express from "express";
import { projectController } from "../controllers/project.controller.js";
import { authenticateToken } from "../../../core/security/utils/jwt.utils.js";
const router = express.Router();
router.use(authenticateToken);

/**
 * @swagger
 * tags:
 *   - name: App Specific Modules - Task Management / Projects
 *     description: Project management operations
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
 *     Note:
 *       type: object
 *       properties:
 *         creator:
 *           type: string
 *         note:
 *           type: string
 *           maxLength: 1000
 *     Task:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         actions:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Note'
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
 *     Project:
 *       type: object
 *       required:
 *         - title
 *         - description
 *         - assignee
 *         - branch
 *         - owner
 *         - targetDate
 *       properties:
 *         title:
 *           type: string
 *           maxLength: 200
 *         description:
 *           type: string
 *         owner:
 *           type: string
 *         assignee:
 *           type: array
 *           items:
 *             type: string
 *         branch:
 *           type: array
 *           items:
 *             type: string
 *         targetDate:
 *           type: string
 *           format: date
 *         completionDate:
 *           type: string
 *           format: date
 *         notes:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Note'
 *         task:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Task'
 *         version:
 *           type: number
 */

/**
 * @swagger
 * /api/modules/taskmanagement/projects:
 *   get:
 *     summary: Get all projects
 *     tags: [App Specific Modules - Task Management / Projects]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of projects retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Project'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get("/", projectController.getAll);

/**
 * @swagger
 * /api/modules/taskmanagement/projects:
 *   post:
 *     summary: Create a new project with tasks and assignees
 *     description: This endpoint allows you to create a new project, including tasks, assignees, and associated notes.
 *     tags: [App Specific Modules - Task Management / Projects]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: The title of the project
 *               description:
 *                 type: string
 *                 description: A description of the project
 *               owner:
 *                 type: string
 *                 description: The owner of the project (e.g., SuperAdmin)
 *               assignee:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: List of users assigned to the project
 *               branch:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: List of branches related to the project
 *               targetDate:
 *                 type: string
 *                 format: date
 *                 description: The target date for project completion
 *               notes:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     creator:
 *                       type: string
 *                       description: The creator of the note
 *                     note:
 *                       type: string
 *                       description: The content of the note
 *               version:
 *                 type: integer
 *                 description: The version of the project schema (default is 1)
 *             required:
 *               - title
 *               - owner
 *               - assignee
 *               - branch
 *               - targetDate
 *     responses:
 *       201:
 *         description: Project successfully created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 title:
 *                   type: string
 *                   description: The title of the project
 *                 description:
 *                   type: string
 *                   description: The description of the project
 *                 assignee:
 *                   type: array
 *                   items:
 *                     type: string
 *                 branch:
 *                   type: array
 *                   items:
 *                     type: string
 *                 owner:
 *                   type: string
 *                 notes:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       creator:
 *                         type: string
 *                       note:
 *                         type: string
 *                 tasks:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       title:
 *                         type: string
 *                       description:
 *                         type: string
 *                       assignee:
 *                         type: array
 *                         items:
 *                           type: string
 *                       stage:
 *                         type: string
 *                       createdDate:
 *                         type: string
 *                         format: date-time
 *                       updatedDate:
 *                         type: string
 *                         format: date-time
 *                       targetDate:
 *                         type: string
 *                         format: date
 *                       completionDate:
 *                         type: string
 *                         format: date
 *                       version:
 *                         type: integer
 *       400:
 *         description: Invalid version provided
 *       422:
 *         description: Validation error or duplication error (e.g., title must be unique)
 *       500:
 *         description: Internal server error
 */

router.post("/", projectController.create);

/**
 * @swagger
 * /api/modules/taskmanagement/projects/{id}:
 *   get:
 *     summary: Get a project by ID
 *     tags: [App Specific Modules - Task Management / Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the project to retrieve
 *     responses:
 *       200:
 *         description: Project retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Project'
 *       404:
 *         description: Project not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get("/:id", projectController.getById);

/**
 * @swagger
 * /api/modules/taskmanagement/projects/{id}:
 *   put:
 *     summary: Update a project by ID
 *     tags: [App Specific Modules - Task Management / Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the project to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: The title of the project
 *               description:
 *                 type: string
 *                 description: A description of the project
 *               owner:
 *                 type: string
 *                 description: The owner of the project (e.g., SuperAdmin)
 *               assignee:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: List of users assigned to the project
 *               branch:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: List of branches related to the project
 *               targetDate:
 *                 type: string
 *                 format: date
 *                 description: The target date for project completion
 *               notes:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     creator:
 *                       type: string
 *                       description: The creator of the note
 *                     note:
 *                       type: string
 *                       description: The content of the note
 *               version:
 *                 type: integer
 *                 description: The version of the project schema (default is 1)
 *             required:
 *               - title
 *               - owner
 *               - assignee
 *               - branch
 *               - targetDate
 *     responses:
 *       200:
 *         description: Project updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Project'
 *       400:
 *         description: Bad Request
 *       404:
 *         description: Project not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.put("/:id", projectController.updateById);

/**
 * @swagger
 * /api/modules/taskmanagement/projects/{id}:
 *   delete:
 *     summary: Delete a project by ID
 *     tags: [App Specific Modules - Task Management / Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the project to delete
 *     responses:
 *       204:
 *         description: Project deleted successfully
 *       404:
 *         description: Project not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.delete("/:id", projectController.deleteById);

// Exporting the router with the base path
export default {
  path: "/api/modules/taskmanagement/projects",
  router
};
