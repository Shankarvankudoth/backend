import mongoose from "mongoose";
const { Schema, Types } = mongoose;

const AttendanceSchema = new Schema(
  {
    referenceId: {
      type: Types.ObjectId,
      ref: "Profile",
      required: true,
    }, // Can be facultyId, studentAdmissionId, or any other reference

    presentOrAbsent: {
      type: String,
      enum: ["A", "P"],
      required: true,
    }, // "A" for Absent, "P" for Present

    scheduleId: {
      type: Types.ObjectId,
      ref: "Schedule",
    },

    lateBy: {
      type: Number,
      default: 0,
    }, // Late by minutes if applicable

    remarks: {
      type: String,
    }, // Reason for lateness or absence

    taskId: {
      type: Types.ObjectId,
      ref: "Task",
    },

    version: {
      type: Number,
      default: 1,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Attendance", AttendanceSchema);
