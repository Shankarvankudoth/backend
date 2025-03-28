import mongoose, { version } from "mongoose";
const { Schema, Types } = mongoose;

// Helper to parse course and staff arrays (e.g., "[9001,9002,9003]")
function parseArray(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value; // Ensure it's an array

  try {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed)) {
      return parsed.map((v) => (typeof v === "number" ? v : new Types.ObjectId(v)));
    }
    return [];
  } catch (e) {
    return [];
  }
}

const BranchSchema = new Schema(
  {
    branchName: { type: String, required: true },
    address: { type: String, required: true },
    primaryContact: { type: String, required: true },
    secondaryContact: { type: String },
    branchCode: { type: String, required: true },
    zipCode: { type: String },

    // Storing coordinates as an array [latitude, longitude]
    location: { type: [Number] },

    url: { type: String }, // Branch URL or identifier

    // Array of course IDs
    coursesOffered: {
      type: [Types.ObjectId],
      ref: "Course",
      set: parseArray
    },

    imageUrl: { type: String }, // Image reference

    // References to staff who manage the branch
    head: { type: Types.ObjectId, ref: "Profile" },
    managers: { type: [Types.ObjectId], ref: "Profile", set: parseArray },

    /**
     *   Document ID (optional field)
     * documents could  be related to branch specific information
     *  This field can be used to store a reference to a document
      */
    documentId: { type: Types.ObjectId, ref: "Document" },

  /** 
   * Accounts related to the branch
   * */ 
    accounts: [
      {
        accountNumber: { type: String, required: true },
        bankName: { type: String, required: true },
        ifscCode: { type: String, required: true },
        // CCAvenue specific details
        merchantId: { type: String, required: true },
        accessCode: { type: String, required: true },
        workingKey: { type: String, required: true }
        //placeholder hdfc smartgateway specific details
        
      }
    ],
    version: { type: Number, default: 1 }
  },
  { timestamps: true }
);

export default mongoose.model("Branch", BranchSchema);
