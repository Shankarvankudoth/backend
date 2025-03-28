import mongoose from "mongoose";

const enquirySchema = new mongoose.Schema(
  {
    leadId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true
    },
    potentialJoiningDate: { type: Date },
    academicYear: { type: String },
    typeOfEnquiry: { type: String, required: true },
    course: { type: String },
    subject: { type: [String],default: [] },
    source: { type: String },
    creator: { type: String },
    assignedTo: { type: String },
    actualFee: { type: Number },
    confirmedFee: { type: Number },
    discountReason: { type: String },
    version: { type: Number, default: 1 }
  },
  { timestamps: true }
);

const Enquiry = mongoose.model("Enquiry", enquirySchema);
export default Enquiry;
