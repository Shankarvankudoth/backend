import mongoose from "mongoose";
const { Schema, Types } = mongoose;

// Helper to parse JSON strings (for subjects and students arrays)
function parseJson(value) {
  if (!value || typeof value !== "string") return {};
  try {
    return JSON.parse(value);
  } catch (e) {
    return {};
  }
}

function parseArray(value) {
  if (!value || typeof value !== "string") return [];
  try {
    return JSON.parse(value).map((v) => Number(v));
  } catch (e) {
    return [];
  }
}

const BatchSchema = new Schema(
  {
    courseId: { type: Types.ObjectId, ref: "Course", required: true },
    branchId: { type: Types.ObjectId, ref: "Branch", required: true },

    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    academicYear: { type: String, required: true },

    classRoom: { type: Types.ObjectId, ref: "ClassRoom" },
    maxStudents: { type: Number, required: true, default: 25 },

    // Faculty object where keys are subjects and values are Profile IDs
    /*
    this is an json object as below 
    {
    "MATHEMATICS":4103,
    "SCIENCE":4114,
    }
    */

    faculty: {
      type: Map,
      of: Types.ObjectId,
      ref: "Profile",
      set: parseJson,
    },

    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },

    batchCode: { type: String, required: true },

    coordinator: { type: Types.ObjectId, ref: "Profile" },

    // Array of students' Profile IDs
    students: {
      type: [Types.ObjectId],
      ref: "Profile",
      set: parseArray,
    },

    /**
     * Array of document IDs associated with the batch
     * documents will be related to batch specific information
     */
    documentIds: {
      type: [Types.ObjectId],
      ref: "Document",
      set: parseArray,
    },

    version: { type: Number, default: 1 },
  },
  { timestamps: true }
);

export default mongoose.model("Batch", BatchSchema);
