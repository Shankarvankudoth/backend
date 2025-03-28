// import express from "express";
// import { studentController } from "../controllers/student.controller.js";
// import { authenticateToken } from "../../../core/security/utils/jwt.utils.js";

// const router = express.Router();

// router.use(authenticateToken);

// /**
//  * @swagger
//  * tags:
//  *   - name: App Specific Modules - Students
//  *     description: Endpoints for managing students
//  */

// /**
//  * @swagger
//  * /api/modules/students/health:
//  *   get:
//  *     summary: Health check for the Students module
//  *     tags: [App Specific Modules - Students]
//  *     responses:
//  *       200:
//  *         description: Students module loaded successfully
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 message:
//  *                   type: string
//  *                   example: Students module loaded successfully
//  */

// // for health check
// router.get("/health", (req, res) => {
//   res.json({ message: "Students module loaded successfully" });
// });

// /**
//  * @swagger
//  * /api/modules/students:
//  *   get:
//  *     summary: Get all students
//  *     tags: [App Specific Modules - Students]
//  *     responses:
//  *       200:
//  *         description: List of students
//  */
// router.get("/", studentController.getAll);

// /**
//  * @swagger
//  * /api/modules/students:
//  *   post:
//  *     summary: Create a new student
//  *     tags: [App Specific Modules - Students]
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               firstName:
//  *                 type: string
//  *                 example: John
//  *               middleName:
//  *                 type: string
//  *                 example: A
//  *               lastName:
//  *                 type: string
//  *                 example: Doe
//  *               gender:
//  *                 type: string
//  *                 example: Male
//  *               category:
//  *                 type: string
//  *                 example: General
//  *               aadharNumber:
//  *                 type: string
//  *                 example: "123456789012"
//  *               dateOfBirth:
//  *                 type: string
//  *                 format: date
//  *                 example: "2000-01-01"
//  *               primaryEmail:
//  *                 type: string
//  *                 example: john.doe@example.com
//  *               secondaryEmail:
//  *                 type: string
//  *                 example: john.alt@example.com
//  *               nationality:
//  *                 type: string
//  *                 example: Indian
//  *               primaryNumber:
//  *                 type: string
//  *                 example: "9876543210"
//  *               school:
//  *                 type: string
//  *                 example: "ABC High School"
//  *               standard:
//  *                 type: string
//  *                 example: "10th"
//  *               board:
//  *                 type: string
//  *                 example: "CBSE"
//  *               documentId:
//  *                 type: array
//  *                 items:
//  *                   type: string
//  *                 example: ["doc1", "doc2"]
//  *               address:
//  *                 type: string
//  *                 example: "123 Street, City, Country"
//  *               notes:
//  *                 type: array
//  *                 items:
//  *                   type: object
//  *                   properties:
//  *                     creator:
//  *                       type: string
//  *                       example: "Admin"
//  *                     note:
//  *                       type: string
//  *                       example: "Initial admission process completed"
//  *               followUpHistory:
//  *                 type: array
//  *                 items:
//  *                   type: object
//  *                   properties:
//  *                     date:
//  *                       type: string
//  *                       format: date
//  *                       example: "2024-02-07"
//  *                     notes:
//  *                       type: string
//  *                       example: "Follow-up call made"
//  *                     status:
//  *                       type: string
//  *                       example: "In Progress"
//  *                     nextFollowUpDate:
//  *                       type: string
//  *                       format: date
//  *                       example: "2024-02-14"
//  *                     creator:
//  *                       type: string
//  *                       example: "Admin"
//  *     responses:
//  *       201:
//  *         description: Student created successfully
//  */
// router.post("/", studentController.create);

// /**
//  * @swagger
//  * /api/modules/students/{id}:
//  *   get:
//  *     summary: Get a student by ID
//  *     tags: [App Specific Modules - Students]
//  *     parameters:
//  *       - in: path
//  *         name: id
//  *         required: true
//  *         schema:
//  *           type: string
//  *         description: Student ID
//  *     responses:
//  *       200:
//  *         description: Student details
//  */
// router.get("/:id", studentController.getById);

// /**
//  * @swagger
//  * /api/modules/students/{id}:
//  *   put:
//  *     summary: Update a student by ID
//  *     tags: [App Specific Modules - Students]
//  *     parameters:
//  *       - in: path
//  *         name: id
//  *         required: true
//  *         schema:
//  *           type: string
//  *         description: Student ID
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               firstName:
//  *                 type: string
//  *                 example: John
//  *               middleName:
//  *                 type: string
//  *                 example: A
//  *               lastName:
//  *                 type: string
//  *                 example: Doe
//  *               gender:
//  *                 type: string
//  *                 example: Male
//  *               category:
//  *                 type: string
//  *                 example: General
//  *               aadharNumber:
//  *                 type: string
//  *                 example: "123456789012"
//  *               dateOfBirth:
//  *                 type: string
//  *                 format: date
//  *                 example: "2000-01-01"
//  *               primaryEmail:
//  *                 type: string
//  *                 example: john.doe@example.com
//  *               secondaryEmail:
//  *                 type: string
//  *                 example: john.alt@example.com
//  *               nationality:
//  *                 type: string
//  *                 example: Indian
//  *               primaryNumber:
//  *                 type: string
//  *                 example: "9876543210"
//  *               school:
//  *                 type: string
//  *                 example: "ABC High School"
//  *               standard:
//  *                 type: string
//  *                 example: "10th"
//  *               board:
//  *                 type: string
//  *                 example: "CBSE"
//  *               documentId:
//  *                 type: array
//  *                 items:
//  *                   type: string
//  *                 example: ["doc1", "doc2"]
//  *               address:
//  *                 type: string
//  *                 example: "123 Street, City, Country"
//  *               notes:
//  *                 type: array
//  *                 items:
//  *                   type: object
//  *                   properties:
//  *                     creator:
//  *                       type: string
//  *                       example: "Admin"
//  *                     note:
//  *                       type: string
//  *                       example: "Initial admission process completed"
//  *               followUpHistory:
//  *                 type: array
//  *                 items:
//  *                   type: object
//  *                   properties:
//  *                     date:
//  *                       type: string
//  *                       format: date
//  *                       example: "2024-02-07"
//  *                     notes:
//  *                       type: string
//  *                       example: "Follow-up call made"
//  *                     status:
//  *                       type: string
//  *                       example: "In Progress"
//  *                     nextFollowUpDate:
//  *                       type: string
//  *                       format: date
//  *                       example: "2024-02-14"
//  *                     creator:
//  *                       type: string
//  *                       example: "Admin"
//  *     responses:
//  *       200:
//  *         description: Student updated successfully
//  */
// router.put("/:id", studentController.update);

// /**
//  * @swagger
//  * /api/modules/students/{id}:
//  *   delete:
//  *     summary: Delete a student by ID
//  *     tags: [App Specific Modules - Students]
//  *     parameters:
//  *       - in: path
//  *         name: id
//  *         required: true
//  *         schema:
//  *           type: string
//  *         description: Student ID
//  *     responses:
//  *       200:
//  *         description: Student deleted successfully
//  */
// router.delete("/:id", studentController.delete);

// export default {
//   path: "/api/modules/students",
//   router,
// };
