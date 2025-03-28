// import joi from "joi";
// import fs from "fs";
// import { createError } from "../../../services/errorhandling.service.js";
// import loggingService from "../../../services/logging.service.js";
// import Document from "../../common/models/document.model.js";

// const logger = loggingService.getModuleLogger("StudentManagementService");

// // Base Schema for Student Validation
// export const baseStudentSchema = {
//   enrolled: joi.boolean().default(false),
//   enrollmentDate: joi.date().when("enrolled", {
//     is: true,
//     then: joi.date().required(),
//     otherwise: joi.forbidden()
//   }),
//   firstName: joi.string().required(),
//   middleName: joi.string().allow("").optional(),
//   lastName: joi.string().required(),
//   gender: joi.string().allow("").optional(),
//   category: joi.string().allow("").optional(),
//   aadharNumber: joi
//     .string()
//     .pattern(/^\d{12}$/)
//     .allow("")
//     .optional(),
//   dateOfBirth: joi.date().allow(null).optional(),
//   primaryEmail: joi.string().email().allow("").optional(),
//   secondaryEmail: joi.string().email().allow("").optional(),
//   nationality: joi.string().allow("").optional(),
//   primaryNumber: joi.string().required(),
//   school: joi.string().allow("").optional(),
//   standard: joi.string().allow("").optional(),
//   board: joi.string().allow("").optional(),
//   documentId: joi.array().items(joi.string()).default([]),
//   address: joi.string().allow("").optional(),
//   notes: joi
//     .array()
//     .items(
//       joi.object({
//         _id: joi.string().allow("").optional(),
//         creator: joi.string().required(),
//         note: joi.string().required()
//       })
//     )
//     .default([]),
//   followUpHistory: joi
//     .array()
//     .items(
//       joi.object({
//         date: joi.date().required(),
//         notes: joi.string().allow("").optional(),
//         status: joi.string().allow("").optional(),
//         nextFollowUpDate: joi.date().optional(),
//         creator: joi.string().required()
//       })
//     )
//     .default([]),
//   version: joi.number().default(1)
// };

// // Function to Get Schema Based on Version
// const getStudentSchemaForVersion = (version) => {
//   switch (version) {
//     case 1:
//       return joi.object(baseStudentSchema);
//     case 2:
//       return joi.object({
//         ...baseStudentSchema,
//         extraFieldForV2: joi.string().optional() // Example additional field
//       });
//     case 3:
//       return joi.object({
//         ...baseStudentSchema,
//         extraFieldForV2: joi.string().optional(),
//         newFieldForV3: joi.string().optional() // Example new field for version 3
//       });
//     default:
//       return null; // For invalid versions
//   }
// };

// // Fetch all students
// export const getAllStudents = async (req, res, next, Student) => {
//   logger.info("Fetching all students");
//   try {
//     const data = await Student.find({});
//     logger.info("Students retrieved successfully", { count: data.length });
//     res.status(200).send(data);
//   } catch (error) {
//     logger.error("Error fetching students", { error: error.message });
//     next(createError(500, "Internal server error"));
//   }
// };

// // Create a new student
// export const createStudent = async (req, res, next, Student) => {
//   logger.info("Creating new student", { requestBody: req.body });

//   const version = req.body.version || 1;
//   const schema = getStudentSchemaForVersion(version);

//   if (!schema) {
//     return next(createError(400, "Invalid version provided"));
//   }

//   const { error, value } = schema.validate(req.body);
//   if (error) {
//     logger.warn("Validation error", { details: error.details });
//     return next(createError(422, error.details[0].message));
//   }

//   try {
//     // Check for existing primary number
//     // const existingStudent = await Student.findOne({
//     //   $or: [{ primaryNumber: value.primaryNumber }]
//     // });

//     // if (existingStudent) {
//     //   logger.warn("Duplicate student found", {
//     //     primaryNumber: value.primaryNumber
//     //   });
//     //   return next(
//     //     createError(
//     //       422,
//     //       "A student with the same primary number already exists"
//     //     )
//     //   );
//     // }

//     const newStudent = new Student(value);
//     const studentData = await newStudent.save();
//     logger.info("Student created successfully", { studentId: studentData._id });
//     res.status(201).send(studentData);
//   } catch (e) {
//     logger.error("Error while creating student", { error: e.message });

//     if (e.code === 11000) {
//       const field = Object.keys(e.keyPattern)[0];
//       return next(createError(422, `${field} already exists`));
//     }
//     return next(createError(500, "Internal server error"));
//   }
// };

// // Fetch a student by ID
// export const getStudentById = async (req, res, next, Student) => {
//   logger.info("Fetching student by ID", { studentId: req.params.id });

//   if (!req.params.id) {
//     return next(createError(422, "ID is required"));
//   }

//   try {
//     const studentData = await Student.findById(req.params.id).populate(
//       "documentId"
//     );

//     if (!studentData) {
//       return next(createError(404, "Student not found"));
//     }

//     logger.info("Student retrieved successfully", { studentId: req.params.id });
//     res.status(200).json(studentData);
//   } catch (error) {
//     logger.error("Error fetching student by ID", { error: error.message });
//     next(createError(500, "Internal server error"));
//   }
// };

// // Update a student by ID
// export const updateStudentById = async (req, res, next, Student) => {
//   logger.info("Updating student", {
//     studentId: req.params.id,
//     updateData: req.body
//   });

//   try {
//     const student = await Student.findById(req.params.id);
//     if (!student) {
//       return next(createError(404, "Student not found"));
//     }

//     // Prevent updating Aadhar Number or Primary Email to existing values
//     // if (req.body.aadharNumber || req.body.primaryEmail) {
//     //   const existingStudent = await Student.findOne({
//     //     _id: { $ne: req.params.id },
//     //     $or: [
//     //       { aadharNumber: req.body.aadharNumber },
//     //       { primaryEmail: req.body.primaryEmail }
//     //     ]
//     //   });

//     //   if (existingStudent) {
//     //     return next(createError(422, "Aadhar Number or Email already exists"));
//     //   }
//    // }

//     // Update only the provided fields
//     const updatedStudent = await Student.findByIdAndUpdate(
//       req.params.id,
//       { $set: req.body }, // No validation, direct update
//       { new: true }
//     );

//     if (!updatedStudent) {
//       return next(createError(404, "Student not found"));
//     }

//     logger.info("Student updated successfully", { studentId: req.params.id });
//     res.status(200).send(updatedStudent);
//   } catch (error) {
//     logger.error("Error updating student", { error: error.message });
//     next(createError(500, "Internal server error"));
//   }
// };

// export const deleteStudentById = async (req, res, next, Student) => {
//   logger.info("Deleting student", { studentId: req.params.id });

//   try {
//     // Find the student first to get associated document IDs
//     const student = await Student.findById(req.params.id);

//     if (!student) {
//       return next(createError(404, "Student not found"));
//     }

//     // Delete associated documents from the database
//     if (student.documentId && student.documentId.length > 0) {
//       const documents = await Document.find({
//         _id: { $in: student.documentId }
//       });

//       // Delete files from disk
//       documents.forEach((doc) => {
//         if (doc.filepath) {
      
//           fs.unlink(doc.filepath, (err) => {
//             if (err) {
//               logger.error(`Failed to delete file: ${doc.filepath}`, {
//                 error: err.message
//               });
//             } else {
//               logger.info(`File deleted: ${doc.filepath}`);
//             }
//           });
//         }
//       });

//       // Delete documents from the database
//       await Document.deleteMany({ _id: { $in: student.documentId } });
//     }

//     // Now delete the student
//     await Student.findByIdAndDelete(req.params.id);

//     logger.info("Student and associated documents deleted successfully", {
//       studentId: req.params.id
//     });
//     res.status(200).send({
//       message: "Student and associated documents deleted successfully"
//     });
//   } catch (error) {
//     logger.error("Error deleting student", { error: error.message });
//     next(createError(500, "Internal server error"));
//   }
// };
