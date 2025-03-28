// student.model.js
import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    enrolled: { type: Boolean, default: false },
    enrollmentDate: {
      type: Date,
      required: function () {
        return this.enrolled === true;
      }
    },
    firstName: { type: String, required: true },
    middleName: { type: String },
    lastName: { type: String, required: true },
    gender: { type: String },
    category: { type: String },
    aadharNumber: { type: String },
    dateOfBirth: { type: Date },
    primaryEmail: { type: String },
    secondaryEmail: { type: String },
    nationality: { type: String },
    primaryNumber: { type: String, required: true },
    school: { type: String },
    standard: { type: String },
    board: { type: String },
    documentId: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Document", default: [] }
    ],
    address: { type: String },
    notes: { type: [{ creator: String, note: String }] },
    followUpHistory: [
      {
        date: { type: Date, required: true },
        notes: { type: String },
        status: { type: String },
        nextFollowUpDate: { type: Date },
        creator: { type: String }
      }
    ],
    version: { type: Number, default: 1 }
  },
  { timestamps: true }
);

const Student = mongoose.model("Student", studentSchema);
export default Student;
