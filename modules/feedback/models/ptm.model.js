import mongoose from "mongoose";
const { Schema, Types } = mongoose;

const PTMSchema = new Schema(
  {
    branchId: {
      type: Types.ObjectId,
      ref: "Branch",
      required: true
    },

    classroomId: {
      type: Types.ObjectId,
      ref: "Classroom",
      required: true
    },

    startTime: {
      type: String,
      required: true
    },

    endTime: {
      type: String,
      required: true
    },

    coordinatorId: {
      type: Types.ObjectId,
      ref: "Profile",
      required: true
    },

    studentId: {
      type: Types.ObjectId,
      ref: "Profile",
      required: true
    },

    mode: {
      type: String,
      enum: ["online", "offline"],
      required: true
    },

    taskId: {
      type: Types.ObjectId,
      ref: "Task"
    },

    type: {
      type: String,
      required: true
    },

    feedbackId: {
      type: Types.ObjectId,
      ref: "Feedback",
      required: true
    },

    version: {
      type: Number,
      default: 1
    }
  },
  { timestamps: true }
);

export default mongoose.model("PTM", PTMSchema);
