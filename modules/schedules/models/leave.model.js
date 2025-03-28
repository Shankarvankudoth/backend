import mongoose from "mongoose";
const { Schema, Types } = mongoose;

const LeavesSchema = new Schema(
  {
    userId: {
      type: Types.ObjectId,
      ref: "Profile",
      required: true
    },

    startDate: {
      type: Date,
      required: true
    },

    endDate: {
      type: Date,
      required: true
    },

    reason: {
      type: String,
      required: true
    },

    approver: {
      type: [Types.ObjectId],
      ref: "Profile",
      required: true
    },

    approvedStatus: {
      type: Boolean,
      required: true
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

export default mongoose.model("Leaves", LeavesSchema);
