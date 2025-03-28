// const mongoose = require('mongoose');

// <<<<<<< HEAD
// const SchoolSchema = new mongoose.Schema(
//   {
//     schoolName: {
//       type: String,
//       required: true,
//     },
//     schoolAddress: {
//       type: String,
//       required: true,
//     },
//     schoolPincode: {
//       type: Number,
//       required: true,
//     },
//     schoolLocation: {
//       type: [Number],
//       required: true,
//     },
//     schoolContactNo: {
//       type: [Number],
//       required: true,
//     },
//     schoolStandards: {
//       type: [Number],
//       required: true,
//     },
//     schoolBoards: {
//       type: [String],
//       required: true,
//     },
//     version: {
//       type: Number,
//       default: 1,
//     },
// =======
// const schoolSchema = new mongoose.Schema({
//   schoolId: {
//     type: Number,
//     unique: true,
//     required: true
// >>>>>>> 372a8ba3fe4a759d60d1b2f60f9f31f3be3dcf0e
//   },
//   schoolName: {
//     type: String,
//     required: true
//   },
//   schoolAddress: {
//     type: String,
//     required: true
//   },
//   schoolPincode: {
//     type: Number,
//     required: true
//   },
//   schoolLocation: {
//     type: {
//       type: String,
//       enum: ['Point'], // Enforcing GeoJSON format
//       default: 'Point'
//     },
//     coordinates: {
//       type: [Number],
//       required: true
//     }
//   },
//   schoolContactNo: {
//     type: String,
//     required: true
//   },
//   schoolStandards: {
//     type: [Number],
//     required: true
//   },
//   schoolBoards: {
//     type: [String],
//     required: true,
//     enum: ['SSLC', 'ICSE', 'CBSE', 'SSC'] // Add more if needed
//   }
// }, {
//   timestamps: true
// });

// // Adding geospatial index
// schoolSchema.index({ schoolLocation: '2dsphere' });

// const School = mongoose.model('School', schoolSchema);

// module.exports = { School };
