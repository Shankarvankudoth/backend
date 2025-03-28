import mongoose from "mongoose";
const { Schema, Types } = mongoose;

// Helper to parse arrays (e.g., "[6541,6543]")
function parseArray(value) {
  if (!value || typeof value !== "string") return [];
  try {
    return JSON.parse(value).map((v) => Types.ObjectId(v));
  } catch (e) {
    return [];
  }
}

const ClassRoomSchema = new Schema(
  {
    name: { type: String, required: true },
    branchId: { type: Types.ObjectId, ref: "Branch", required: true },

    // Array of associated batch IDs
    batchId: {
      type: [Types.ObjectId],
      ref: "Batch",
      set: parseArray
    },

    floorNumber: { type: Number, required: true },
    roomNumber: { type: String, required: true },
    studentSize: { type: Number, required: true },

    projector: { type: Boolean },
    smartBoard: { type: Boolean },

    landlineNumber: { type: String },

    biometricMachineId: { type: String },

    // Array of associated CCTV camera IDs
    ccCameras: {
      type: [String]
    },

    // Array of faculty/staff coordinators' Profile IDs
    coordinators: {
      type: [Types.ObjectId],
      ref: "Profile",
      set: parseArray
    },

    version: { type: Number, default: 1 }
  },
  { timestamps: true }
);

export default mongoose.model("ClassRoom", ClassRoomSchema);
