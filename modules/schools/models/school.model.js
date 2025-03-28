import mongoose from "mongoose";
const { Schema } = mongoose;

const SchoolSchema = new Schema(
  {
    name: { type: String, required: true },
    address: { type: String, required: true },
    pincode: { type: Number, required: true },
    // Storing coordinates as an array of numbers (latitude, longitude) with a geospatial index
    location: { type: [Number] },
    // Array of contact numbers stored as strings for precision
    contactNo: [{ type: String, required: true }],
    // Standards offered; flexible array to cater to various academic levels
    standards: {
      type: [Number],
      required: true,
      validate: {
        validator: function (array) {
          return array.length > 0;
        },
        message: "At least one standard is required."
      }
    },
    // Boards are stored as an array of strings for multi-board affiliations
    boards: [{ type: String }],
    version: { type: Number, default: 1 }
  },
  { timestamps: true }
);

export default mongoose.model("School", SchoolSchema);
