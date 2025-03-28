// import {
//   getAllGuardians,
//   createGuardian,
//   getGuardianById,
//   updateGuardianById,
//   deleteGuardianById,
//   getGuardiansByStudentId
// } from "../services/guardian.service.js";
// import Guardian from "../models/guardian.model.js";

// export const guardianController = {
//   getAll: async (req, res, next) => {
//     try {
//       await getAllGuardians(req, res, next, Guardian);
//     } catch (error) {
//       next(error);
//     }
//   },

//   create: async (req, res, next) => {
//     try {
//       await createGuardian(req, res, next, Guardian);
//     } catch (error) {
//       next(error);
//     }
//   },

//   getById: async (req, res, next) => {
//     try {
//       await getGuardianById(req, res, next, Guardian);
//     } catch (error) {
//       next(error);
//     }
//   },

//   update: async (req, res, next) => {
//     try {
//       await updateGuardianById(req, res, next, Guardian);
//     } catch (error) {
//       next(error);
//     }
//   },

//   delete: async (req, res, next) => {
//     try {
//       await deleteGuardianById(req, res, next, Guardian);
//     } catch (error) {
//       next(error);
//     }
//   },

//   getByStudentId: async (req, res, next) => {
//     try {
//       await getGuardiansByStudentId(req, res, next, Guardian);
//     } catch (error) {
//       next(error);
//     }
//   }
// };
