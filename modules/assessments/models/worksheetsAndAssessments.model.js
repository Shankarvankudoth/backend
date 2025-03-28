import mongoose from "mongoose";
const { Schema, Types } = mongoose;
//worksheetAndAssessment scheduleSchema
const WorksheetsAndAssessmentsSchema = new Schema(
  {
    // Assigner ID
    facultyId: { type: Types.ObjectId, ref: "Profile" },
    type: {
      type: String,
      enum: ["worksheet", "assessment"],
      required: true,
    },
    subject: {
      type: String,
      required: true,
    },

    batchId: {
      type: Types.ObjectId,
      ref: "Batch",
      required: true,
    },

    topic: {
      type: String,
      required: true,
    },

    givenDate: {
      type: Date,
      required: true,
    },

    targetSubmissionDate: {
      type: Date,
      required: true,
    },

    discussedDate: {
      type: Date,
    },

    passMarks: {
      type: Number,
    },

    maximumMarks: {
      type: Number,
    },

    deliveryMode: {
      type: String,
      enum: ["online", "offline"],
    },

    documentIds: [
      {
        type: Types.ObjectId,
        ref: "Document",
      },
    ],

    onlineTestId: {
      type: String,
    },

    maxQuestions: {
      type: Number,
    },

    minQuestions: {
      type: Number,
    },

    version: {
      type: Number,
      default: 1,
    },
  },
  { timestamps: true }
);

export default mongoose.model(
  "WorksheetsAndAssessments",
  WorksheetsAndAssessmentsSchema
);
