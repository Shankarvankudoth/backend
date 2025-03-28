// import joi from "joi";
// import { createError } from "../../../services/errorhandling.service.js";
// import loggingService from "../../../services/logging.service.js";
// import mongoose from "mongoose";

// const logger = loggingService.getModuleLogger("GuardianManagementService");

// // Base schema for version control
// const baseGuardianSchema = {
//   leadId: joi.any(), // Allow MongoDB ObjectId for populated field
//   relation: joi.string().required(),
//   firstName: joi.string().required(),
//   middleName: joi.string().allow("").optional(),
//   lastName: joi.string().required(),
//   aadharNumber: joi.string().allow("").optional(),
//   primaryNumber: joi.string().required(),
//   secondaryNumber: joi.string().allow("").optional(),
//   primaryEmail: joi.string().email().allow("").optional(),
//   secondaryEmail: joi.string().email().allow("").optional(),
//   occupation: joi.string().allow("").optional(),
//   version: joi.number().default(1)
// };

// const getGuardianSchemaForVersion = (version) => {
//   switch (version) {
//     case 1:
//       return joi.object(baseGuardianSchema);
//     case 2:
//       return joi.object({
//         ...baseGuardianSchema,
//         additionalFieldForV2: joi.string().optional()
//       });
//     case 3:
//       return joi.object({
//         ...baseGuardianSchema,
//         additionalFieldForV2: joi.string().optional(),
//         anotherNewFieldForV3: joi.string().optional()
//       });
//     default:
//       return joi.object(baseGuardianSchema); // Default to version 1 if not specified
//   }
// };

// export const getAllGuardians = async (req, res, next, Guardian) => {
//   logger.info("Fetching all guardians");

//   try {
//     const guardians = await Guardian.find({})
//       .populate("leadId", "firstName lastName")
//       .lean();

//     // Apply version control before sending response
//     const versionedGuardians = guardians
//       .map((guardian) => {
//         const schema = getGuardianSchemaForVersion(guardian.version || 1);
//         const { error, value } = schema.validate(guardian, {
//           stripUnknown: true
//         });

//         if (error) {
//           logger.warn("Validation error in versioned response", {
//             guardianId: guardian._id,
//             details: error.details
//           });
//           return null;
//         }
//         return Object.assign({ ...value, _id: guardian._id });
//       })
//       .filter(Boolean);

//     logger.info("Guardians retrieved successfully", {
//       count: versionedGuardians.length
//     });
//     res.status(200).json(versionedGuardians);
//   } catch (error) {
//     logger.error("Error fetching guardians", { error: error.message });
//     next(createError(500, "Internal server error"));
//   }
// };

// export const createGuardian = async (req, res, next, Guardian) => {
//   logger.info("Creating new guardian", { requestBody: req.body });

//   const schema = getGuardianSchemaForVersion(req.body.version || 1);
//   const { error, value } = schema.validate(req.body);
//   if (error) return next(createError(422, error.details[0].message));

//   try {
//     if (!mongoose.Types.ObjectId.isValid(value.leadId)) {
//       return next(createError(422, "Invalid student ID format"));
//     }

//     const newGuardian = new Guardian(value);
//     const guardianData = await newGuardian.save();
//     const populatedGuardian = await Guardian.findById(guardianData._id)
//       .populate("leadId", "firstName lastName")
//       .lean();

//     res.status(201).json(populatedGuardian);
//   } catch (e) {
//     logger.error("Error while creating guardian", { error: e.message });
//     if (e.code === 11000) return next(createError(422, "Duplicate entry"));
//     return next(createError(500, "Internal server error"));
//   }
// };

// export const updateGuardianById = async (req, res, next, Guardian) => {
//   logger.info("Updating guardian", {
//     guardianId: req.params.id,
//     updateData: req.body
//   });

//   if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
//     return next(createError(422, "Invalid guardian ID format"));
//   }

//   try {
//     const updatedGuardian = await Guardian.findByIdAndUpdate(
//       req.params.id,
//       { $set: req.body },
//       { new: true }
//     )
//       .populate("leadId", "firstName lastName")
//       .lean();

//     if (!updatedGuardian) {
//       return next(createError(404, "Guardian not found"));
//     }

//     res.status(200).json(updatedGuardian);
//   } catch (error) {
//     logger.error("Error updating guardian", { error: error.message });
//     if (error.code === 11000) {
//       return next(createError(422, "Duplicate entry"));
//     }
//     next(createError(500, "Internal server error"));
//   }
// };

// export const getGuardianById = async (req, res, next, Guardian) => {
//   logger.info("Fetching guardian by ID", { guardianId: req.params.id });

//   if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
//     return next(createError(422, "Invalid guardian ID format"));
//   }

//   try {
//     const guardianData = await Guardian.findById(req.params.id)
//       .populate("leadId", "firstName lastName")
//       .lean();

//     if (!guardianData) return next(createError(404, "Guardian not found"));
//     res.status(200).json(guardianData);
//   } catch (error) {
//     logger.error("Error fetching guardian by ID", { error: error.message });
//     next(createError(500, "Internal server error"));
//   }
// };

// export const getGuardiansByStudentId = async (req, res, next, Guardian) => {
//   logger.info("Fetching guardians by student ID", {
//     studentId: req.params.studentId
//   });

//   if (!req.params.studentId) {
//     logger.warn("Student ID not provided");
//     return next(createError(422, "Student ID is required"));
//   }

//   try {
//     if (!mongoose.Types.ObjectId.isValid(req.params.studentId)) {
//       logger.warn("Invalid student ID format");
//       return next(createError(422, "Invalid student ID format"));
//     }

//     const studentId = new mongoose.Types.ObjectId(req.params.studentId);

//     const guardians = await Guardian.find({ leadId: studentId })
//       .populate("leadId", "firstName lastName")
//       .lean();

//     if (!guardians || guardians.length === 0) {
//       logger.warn("No guardians found for the student ID");
//       return next(createError(404, "No guardians found"));
//     }

//     logger.info("Guardians retrieved successfully", {
//       count: guardians.length
//     });

//     return res.status(200).json(guardians);
//   } catch (error) {
//     logger.error("Error fetching guardians by student ID", {
//       error: error.message,
//       stack: error.stack
//     });
//     return next(createError(500, "Internal server error"));
//   }
// };

// export const deleteGuardianById = async (req, res, next, Guardian) => {
//   logger.info("Deleting guardian", { guardianId: req.params.id });

//   if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
//     return next(createError(422, "Invalid guardian ID format"));
//   }

//   try {
//     const deletedGuardian = await Guardian.findByIdAndDelete(
//       req.params.id
//     ).lean();
//     if (!deletedGuardian) return next(createError(404, "Guardian not found"));
//     res.status(200).json({ message: "Guardian deleted successfully" });
//   } catch (error) {
//     logger.error("Error deleting guardian", { error: error.message });
//     next(createError(500, "Internal server error"));
//   }
// };
