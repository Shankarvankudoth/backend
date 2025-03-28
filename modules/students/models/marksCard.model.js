import mongoose from "mongoose";
const { Schema, Types } = mongoose;

// Define a sub-schema for subject marks
const SubjectMarksSchema = new Schema({
  name: { type: String, required: true },
  marksObtained: { type: Number, required: true },
  maxMarks: { type: Number },
  result: { type: String },
  grade: { type: String }
});

/*
this should be taken when a student is admitted only
*/

// Main schema for reference results
const MarksCardSchema = new Schema(
  {
    profileId: {
      type: Types.ObjectId,
      required: true,
      ref: "Profile"
    },
    batchId: {
      type: Types.ObjectId,
      required: true,
      ref: "Batch"
    },
    admissionId: {
      type: Types.ObjectId,
      required: true,
      ref: "Admission"
    },
    schoolId: {
      type: Types.ObjectId,
      required: true,
      ref: "School"
    },
    standard: { type: Number, required: true },
    board: { type: String, required: true },
    // 'marks' stored as a Map to handle dynamic subjects (e.g., mathematics, science)
    marks: {
      type: Map,
      of: SubjectMarksSchema,
      required: true
    },
    // Converting provided date string (e.g., "2-25-2025") to a Date object
    dateOfReport: { type: Date },
    // Documents associated with the result
    documentsId: [{ type: Types.ObjectId, ref: "Document" }],
    version: { type: Number, default: 1 }
  },
  { timestamps: true }
);

export default mongoose.model("MarksCard", MarksCardSchema);
