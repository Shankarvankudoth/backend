import mongoose from "mongoose";

const SchoolSchema = new mongoose.Schema(
  {
    schoolName: {
      type: String,
      required: true,
    },
    schoolAddress: {
      type: String,
      required: true,
    },
    schoolPincode: {
      type: Number,
      required: true,
    },
    schoolLocation: {
      type: [Number],
      required: true,
    },
    schoolContactNo: {
      type: [Number],
      required: true,
    },
    schoolStandards: {
      type: [Number],
      required: true,
    },
    schoolBoards: {
      type: [String],
      required: true,
    },
    version: {
      type: Number,
      default: 1,
    },
  },
  {
    timestamps: true,
  }
);

const Schools = mongoose.model("School", SchoolSchema);
export default Schools;
