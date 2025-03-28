import mongoose from "mongoose";
const { Schema, Types } = mongoose;

// Helper to parse arrays (e.g., "[1041,1042]")
function parseArray(value) {
  if (!value || typeof value !== "string") return [];
  try {
    return JSON.parse(value).map((v) => Types.ObjectId(v));
  } catch (e) {
    return [];
  }
}

const ScheduleSchema = new Schema(
  {
    batchId: { type: Types.ObjectId, ref: "Batch", required: true },
    classRoomsId: { type: Types.ObjectId, ref: "ClassRoom", required: true },

    type: { type: String, required: true }, // E.g., "standard", "special","online meeting" etc.
    date: { type: Date, required: true },

    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    breakTime: { type: String }, // Optional break time in format "09:00-09:30"

    subjectId: { type: Types.ObjectId, ref: "Subject", required: true },

    chapters: { type: String }, // Auto-populate from subjects collection if needed.

    facultyId: { type: Types.ObjectId, ref: "Profile" }, // Faculty teaching the session

    notes: { type: String }, // Optional notes about the session
/**
 * documentIds (optional field)
 */
    documentIds: {
      type: [Types.ObjectId],
      ref: "Document",
      set: parseArray
    },

    worksheetsAndAssessmentsId: {
      type: Types.ObjectId,
      ref: "WorksheetsAndAssessments"
    },

    ptmId: {
      type: Types.ObjectId,
      ref: "PTM"
    },

    taskIds: {
      type: [Types.ObjectId],
      ref: "Task",
      set: parseArray
    },

    version: { type: Number, default: 1 }
  },
  { timestamps: true }
);

export default mongoose.model("Schedule", ScheduleSchema);
