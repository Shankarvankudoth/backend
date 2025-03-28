import express from "express";
import { userController } from "../controllers/user.controller.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Core - Security / Users
 *     description: User management operations
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - fullname
 *         - username
 *         - email
 *         - password
 *         - role
 *       properties:
 *         fullname:
 *           type: string
 *           description: Full name of the user
 *         username:
 *           type: string
 *           description: Unique username
 *         email:
 *           type: string
 *           format: email
 *           description: Unique email address
 *         password:
 *           type: string
 *           format: password
 *           description: User password (hashed)
 *         phoneNumber:
 *           type: string
 *           description: Contact number
 *         designation:
 *           type: string
 *           description: User's job title or designation
 *         role:
 *           type: string
 *           description: User role ID
 *         permissions:
 *           type: object
 *           additionalProperties:
 *             type: object
 *             additionalProperties:
 *               type: boolean
 *           description: Map of module permissions
 *         branch:
 *           type: array
 *           items:
 *             type: string
 *           description: List of assigned branches
 *         isActive:
 *           type: boolean
 *           default: true
 *         version:
 *           type: number
 *           default: 1
 */

/**
 * @swagger
 * /api/core/security/users:
 *   get:
 *     summary: Get all users
 *     tags: [Core - Security / Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server Error
 */
router.get("/", userController.getAll);


router.get("/:id/permissions", userController.getUserWithPermissionsById);

/**
 * @swagger
 * /api/core/security/users/{id}:
 *   get:
 *     summary: Get a user by ID
 *     description: Fetch a user based on their unique ID.
 *     tags: [Core - Security / Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the user to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User found successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: Unique identifier of the user
 *                 fullname:
 *                   type: string
 *                 username:
 *                   type: string
 *                 email:
 *                   type: string
 *                   format: email
 *                 phoneNumber:
 *                   type: string
 *                 role:
 *                   type: string
 *                 designation:
 *                   type: string
 *                 branch:
 *                   type: array
 *                   items:
 *                     type: string
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.get("/:id", userController.getById);

/**
 * @swagger
 * /api/core/security/users:
 *   post:
 *     summary: Create a new user
 *     tags: [Core - Security / Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullname:
 *                 type: string
 *                 description: Full name of the user
 *                 example: Priya Ranjan
 *               username:
 *                 type: string
 *                 description: Username for the user
 *                 example: priyaranjan
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email address of the user
 *                 example: priyaranjan@gmail.com
 *               password:
 *                 type: string
 *                 description: Password for the user
 *                 example: Welcome1
 *               phoneNumber:
 *                 type: string
 *                 description: Mobile number of the user
 *                 example: "9876543210"
 *               role:
 *                 type: string
 *                 description: Role assigned to the user
 *                 example: admin
 *               designation:
 *                 type: string
 *                 description: Designation of the user
 *                 example: Admin
 *               branch:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Array of branches or office locations
 *                 example: ["rajajiNagar1stBlock", "whitefield", "koramangala"]
 *             required:
 *               - fullname
 *               - username
 *               - email
 *               - password
 *               - phoneNumber
 *               - role
 *               - designation
 *               - branch
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       422:
 *         description: Validation failed
 *       500:
 *         description: Server Error
 */

router.post("/", userController.create);

/**
 * @swagger
 * /api/core/security/users/{id}:
 *   put:
 *     summary: Update a user by ID
 *     description: Updates the user data by their ID, including role and permissions if applicable.
 *     tags: [Core - Security / Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the user to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullname:
 *                 type: string
 *                 description: Full name of the user
 *                 example: Priya Ranjan
 *               username:
 *                 type: string
 *                 description: Username for the user
 *                 example: priyaranjan
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email address of the user
 *                 example: priyaranjan@gmail.com
 *               password:
 *                 type: string
 *                 description: Password for the user
 *                 example: Welcome1
 *               phoneNumber:
 *                 type: string
 *                 description: Mobile number of the user
 *                 example: "9876543210"
 *               role:
 *                 type: string
 *                 description: Role assigned to the user
 *                 example: admin
 *               designation:
 *                 type: string
 *                 description: Designation of the user
 *                 example: Admin
 *               branch:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Array of branches or office locations
 *                 example: ["rajajiNagar1stBlock", "whitefield", "koramangala"]
 *             required:
 *               - fullname
 *               - username
 *               - email
 *               - phoneNumber
 *               - role
 *               - designation
 *               - branch
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: Unique identifier of the user
 *                 fullname:
 *                   type: string
 *                 username:
 *                   type: string
 *                 email:
 *                   type: string
 *                   format: email
 *                 phoneNumber:
 *                   type: string
 *                 role:
 *                   type: string
 *                 designation:
 *                   type: string
 *                 branch:
 *                   type: array
 *                   items:
 *                     type: string
 *       400:
 *         description: Invalid input (e.g., missing or incorrect fields)
 *       401:
 *         description: Unauthorized access
 *       404:
 *         description: User not found
 *       422:
 *         description: Validation failed
 *       500:
 *         description: Internal server error
 */
router.put("/:id", userController.updateById);

/**
 * @swagger
 * /api/core/security/users/{id}:
 *   delete:
 *     summary: Soft Delete a user
 *     tags: [Core - Security / Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */
router.delete("/:id", userController.deleteById);

export default {
  path: "/api/core/security/users",
  router,
};
