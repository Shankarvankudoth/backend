import mongoose from "mongoose";
const { Schema } = mongoose;

const FeeStructureSchema = new Schema(
  {
    // Academic year for fee applicability
    academicYear: { type: String, required: true },
    // Subject IDs can be provided as a single value or array. This setter normalizes the value to an array of strings.
    subjectIds: {
      type: [String],
      required: true,
      set: function (value) {
        if (Array.isArray(value)) {
          return value.map((item) => item.toString());
        }
        if (typeof value === "string") {
          // Remove brackets if present and split by comma
          value = value.replace(/[\[\]]/g, "");
          return value.split(",").map((item) => item.trim());
        }
        return value;
      }
    },
    // Standard fee amount for students; ensure that computed values are parsed to numeric form externally if necessary.
    feeAmount: { type: Number, required: true }, //Mongoose's Number type supports decimals (floating-point values) by default.
    // Optional notes field for additional details
    notes: { type: [String] },
    version: { type: Number, default: 1 }
  },
  { timestamps: true }
);

// export default mongoose.model("FeeStructure", FeeStructureSchema);

const FeeStructure = mongoose.models.FeeStructure || mongoose.model("FeeStructure", FeeStructureSchema);

export default FeeStructure;
