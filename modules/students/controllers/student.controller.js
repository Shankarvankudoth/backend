// import {
//   getAllStudents,
//   createStudent,
//   getStudentById,
//   updateStudentById,
//   deleteStudentById
// } from "../services/student.service.js";
// import Student from "../models/student.model.js";

// export const studentController = {
//   getAll: async (req, res, next) => {
//     try {
//       await getAllStudents(req, res, next, Student);
//     } catch (error) {
//       next(error);
//     }
//   },

//   create: async (req, res, next) => {
//     try {
//       await createStudent(req, res, next, Student);
//     } catch (error) {
//       next(error);
//     }
//   },

//   getById: async (req, res, next) => {
//     try {
//       await getStudentById(req, res, next, Student);
//     } catch (error) {
//       next(error);
//     }
//   },

//   update: async (req, res, next) => {
//     try {
//       await updateStudentById(req, res, next, Student);
//     } catch (error) {
//       next(error);
//     }
//   },

//   delete: async (req, res, next) => {
//     try {
//       await deleteStudentById(req, res, next, Student);
//     } catch (error) {
//       next(error);
//     }
//   }
// };
