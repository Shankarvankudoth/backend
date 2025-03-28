import mongoose from "mongoose";
const { Schema, Types } = mongoose;

const EnquirySchema = new Schema(
  {
    // Student reference; '-' values are interpreted as null
    studentId: {
      type: Types.ObjectId,
      default: null,
      ref: "Profile"
    },
    // Potential joining date is optional (convert CSV date to Date)
    potentialJoiningDate: { type: Date },
    // Academic year (e.g., 2025)
    academicYear: { type: Number, required: true },
    // Category of enquiry: admission, feedback, fee, etc.
    category: { type: String, required: true },
    // Course reference; may be optional for some categories
    courseId: { type: Types.ObjectId, ref: "Course" },
    // Subjects stored as an array of strings; consider a pre-save hook or setter if transformation is needed
    subjects: { type: [String], required: true },
    // Source of enquiry e.g. pamphlet, banner; '-' is interpreted as null/empty
    source: { type: String },
    // References to users in the system (createdBy and assignedTo)
    createdBy: {
      type: Types.ObjectId,
      required: true,
      ref: "Profile"
    },
    assignedTo: {
      type: Types.ObjectId,
      required: true,
      ref: "Profile"
    },
    // Branch identifier (required)
    branchId: {
      type: Types.ObjectId,
      required: true,
      ref: "Branch"
    },
    // Task identifiers linked to the enquiry, stored as an array of numbers
    taskIds: {
      type: [Types.ObjectId],
      required: true,
      ref: "Task"
    },
    // Fee details; actualFee and confirmedFee may be null if not provided
    actualFee: { type: Number },
    confirmedFee: { type: Number },
    // Discount reason, priority and criticality are strings for additional context
    discountReason: { type: String },
    /*
     Priority and criticality must be reviewed by respective branch head so that
     the reminder notifications can be sent accordingly
    */
    priority: { type: String },
    criticality: { type: String },
    version: { type: Number, default: 1 }
  },
  { timestamps: true }
);

export default mongoose.model("Enquiry", EnquirySchema);
