// import express from "express";
// import { guardianController } from "../controllers/gaurdian.controller.js";
// import { authenticateToken } from "../../../core/security/utils/jwt.utils.js";

// const router = express.Router();

// router.use(authenticateToken);

// /**
//  * @swagger
//  * tags:
//  *   - name: App Specific Modules - Students/Guardians
//  *     description: Endpoints for managing guardians
//  */

// /**
//  * @swagger
//  * /api/modules/guardians/health:
//  *   get:
//  *     summary: Health check for the Guardians in Students module
//  *     tags: [App Specific Modules - Students/Guardians]
//  *     responses:
//  *       200:
//  *         description: Guardians in Students module loaded successfully
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 message:
//  *                   type: string
//  *                   example: Guardians in Students module loaded successfully
//  */

// // for health check
// router.get("/health", (req, res) => {
//   res.json({ message: "Guardians in Students module loaded successfully" });
// });

// /**
//  * @swagger
//  * /api/modules/students/guardians:
//  *   get:
//  *     summary: Get all guardians
//  *     tags: [App Specific Modules - Students/Guardians]
//  *     responses:
//  *       200:
//  *         description: A list of guardians
//  */
// router.get("/", guardianController.getAll);

// /**
//  * @swagger
//  * /api/modules/students/guardians:
//  *   post:
//  *     summary: Create a new guardian
//  *     tags: [App Specific Modules - Students/Guardians]
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               leadId:
//  *                 type: string
//  *               relation:
//  *                 type: string
//  *               firstName:
//  *                 type: string
//  *               middleName:
//  *                 type: string
//  *               lastName:
//  *                 type: string
//  *               aadharNumber:
//  *                 type: string
//  *               primaryNumber:
//  *                 type: string
//  *               secondaryNumber:
//  *                 type: string
//  *               primaryEmail:
//  *                 type: string
//  *               occupation:
//  *                 type: string
//  *               version:
//  *                 type: string
//  *     responses:
//  *       201:
//  *         description: Guardian created successfully
//  */
// router.post("/", guardianController.create);

// /**
//  * @swagger
//  * /api/modules/students/guardians/{id}:
//  *   get:
//  *     summary: Get a guardian by ID
//  *     tags: [App Specific Modules - Students/Guardians]
//  *     parameters:
//  *       - in: path
//  *         name: id
//  *         required: true
//  *         schema:
//  *           type: string
//  *     responses:
//  *       200:
//  *         description: Guardian details
//  */
// router.get("/:id", guardianController.getById);

// /**
//  * @swagger
//  * /api/modules/students/guardians/{id}:
//  *   put:
//  *     summary: Update a guardian by ID
//  *     tags: [App Specific Modules - Students/Guardians]
//  *     parameters:
//  *       - in: path
//  *         name: id
//  *         required: true
//  *         schema:
//  *           type: string
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               leadId:
//  *                 type: string
//  *               relation:
//  *                 type: string
//  *               firstName:
//  *                 type: string
//  *               middleName:
//  *                 type: string
//  *               lastName:
//  *                 type: string
//  *               aadharNumber:
//  *                 type: string
//  *               primaryNumber:
//  *                 type: string
//  *               secondaryNumber:
//  *                 type: string
//  *               primaryEmail:
//  *                 type: string
//  *               occupation:
//  *                 type: string
//  *               version:
//  *                 type: string
//  *     responses:
//  *       200:
//  *         description: Guardian updated successfully
//  */
// router.put("/:id", guardianController.update);

// /**
//  * @swagger
//  * /api/modules/students/guardians/{id}:
//  *   delete:
//  *     summary: Delete a guardian by ID
//  *     tags: [App Specific Modules - Students/Guardians]
//  *     parameters:
//  *       - in: path
//  *         name: id
//  *         required: true
//  *         schema:
//  *           type: string
//  *     responses:
//  *       200:
//  *         description: Guardian deleted successfully
//  */
// router.delete("/:id", guardianController.delete);

// /**
//  * @swagger
//  * /api/modules/students/guardians/student/{studentId}:
//  *   get:
//  *     summary: Get guardians by student ID
//  *     tags: [App Specific Modules - Students/Guardians]
//  *     parameters:
//  *       - in: path
//  *         name: studentId
//  *         required: true
//  *         schema:
//  *           type: string
//  *     responses:
//  *       200:
//  *         description: List of guardians for the student
//  */
// router.get("/student/:studentId", guardianController.getByStudentId);

// export default {
//   path: "/api/modules/students/guardians",
//   router,
// };
