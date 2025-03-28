import mongoose from "mongoose";
const { Schema, Types } = mongoose;

const FeedbackSchema = new Schema(
  {
    givenById: {
      type: Types.ObjectId,
      ref: "Profile",
      required: true,
    },
    feedbackTitle: { type: String, required: true },
    // category can be anything like "Academic", "Non-Academic", "General","complaints"..etc
    category: {
      type: String,
    },
    feedbackDescription: {
      type: String,
      required: true,
    },

    /**
     * refrenceId and refrence model are dynamically related to other models Profile
     * this is about person whose is been targeted or who is been refrerred
     */

    referenceId: {
      type: Types.ObjectId,
      ref: "Profile",
      required: true,
    },

    /**
     *for which aboutId and aboutModel are dynamically related to other models like Worksheet,
      Assessment,Subject,Schedule,Attendance,PTM,Profile
     */

    aboutId: {
      type: Types.ObjectId,
      refPath: "aboutModel",
      required: true,
    },
    // Need confirmation from ravee sir reagarding about id as it may refere to anything as below and more
    aboutModel: {
      type: String,
      required: true,
      enum: [
        "Worksheet",
        "Assessment",
        "Subject",
        "Schedule",
        "Attendance",
        "PTM",
        "Profile",
      ],
    },
    createdBy: {
      type: Types.ObjectId,
      ref: "Profile",
      required: true,
    },
    assignedTo: {
      type: Types.ObjectId,
      ref: "Profile",
    },
    taskIds: {
      type: [Types.ObjectId],
      ref: "Task",
    },
    feedbackStatus: {
      type: String,
      enum: ["open", "closed", "cancelled", "onHold"],
      default: "open",
    },
    reviewedBy: {
      type: Types.ObjectId,
      ref: "Profile",
    },
    priority: {
      type: String,
    },
    criticality: {
      type: String,
    },
    notes: {
      type: [String],
    },
    version: {
      type: Number,
      default: 1,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Feedback", FeedbackSchema);
