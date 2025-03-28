import mongoose from "mongoose";
const { Schema, Types } = mongoose;

const ResultsSchema = new Schema(
  {
    worksheetOrAssessmentId: {
      type: Types.ObjectId,
      ref: "WorksheetsAndAssessments",
      required: true
    },

    studentId: {
      type: Types.ObjectId,
      ref: "Profile",
      required: true
    },

    submittedDate: {
      type: Date,
      required: true
    },

    discussion: {
      type: String
    },

    marksObtained: {
      type: Number,
      required: true
    },

    grade: {
      type: String
    },

    passed: {
      type: Boolean,
      required: true
    },

    remarks: {
      type: String
    },

    feedback: {
      type: String
    },

    notes: {
      type: String
    },

    taskId: {
      type: Types.ObjectId,
      ref: "Task"
    },

    version: {
      type: Number,
      default: 1
    }
  },
  { timestamps: true }
);

export default mongoose.model("Results", ResultsSchema);
