// guardian.model.js
import mongoose from "mongoose";

const guardianSchema = new mongoose.Schema(
  {
    leadId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true
    },
    relation: { type: String, required: true },
    firstName: { type: String, required: true },
    middleName: { type: String },
    lastName: { type: String, required: true },
    aadharNumber: { type: String },
    primaryNumber: { type: String, required: true },
    secondaryNumber: { type: String },
    primaryEmail: { type: String },
    secondaryEmail: { type: String },
    occupation: { type: String },
    version: { type: Number, default: 1 }
  },
  { timestamps: true }
);

const Guardian = mongoose.model("Guardian", guardianSchema);
export default Guardian;
