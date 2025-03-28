import mongoose from "mongoose";
const { Schema, Types } = mongoose;

// Helper to parse date strings in "DD-MM-YYYY" format
function parseDate(value) {
  if (!value || typeof value !== "string") return value;
  const parts = value.split("-");
  if (parts.length !== 3) return value;
  const day = parseInt(parts[0].trim(), 10);
  const month = parseInt(parts[1].trim(), 10);
  const year = parseInt(parts[2].trim(), 10);
  return new Date(year, month - 1, day);
}

const AnnouncementSchema = new Schema(
  {
    announcementTitle: { type: String, required: true },
    // createdId refers to the user (or profile) who created the announcement.
    createdId: { type: Types.ObjectId, ref: "Profile", required: true },
    description: { type: String, required: true },
    dateOfAnnouncement: { type: Date, required: true, set: parseDate },
    status: { type: Boolean, required: true },
    version: { type: Number, default: 1 }
  },
  { timestamps: true }
);

export default mongoose.model("Announcement", AnnouncementSchema);
