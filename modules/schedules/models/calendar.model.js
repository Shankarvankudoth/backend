import mongoose, { Types } from "mongoose";
const { Schema } = mongoose;

// Helper to parse date strings in "DD-MM-YYYY" or "DD/MM/YYYY" format
function parseFlexibleDate(value) {
  if (!value || typeof value !== "string") return value;
  // Determine the separator based on the presence of "/" or "-"
  const separator = value.includes("/") ? "/" : "-";
  const parts = value.split(separator);
  if (parts.length !== 3) return value;
  const day = parseInt(parts[0].trim(), 10);
  const month = parseInt(parts[1].trim(), 10);
  const year = parseInt(parts[2].trim(), 10);
  return new Date(year, month - 1, day);
}

// Helper to parse an array of numbers from a JSON string (e.g., "[9851,9852,9853,9854]")
function parseNumberArray(value) {
  if (!value || typeof value !== "string") return [];
  try {
    return JSON.parse(value).map(Number);
  } catch (e) {
    return [];
  }
}

const CalendarSchema = new Schema(
  {
    // Type of calendar entry (e.g., "general" or "special")
    type: {
      type: String,
      required: true,
      enum: ["general", "special"]
    },
    // Array of branch IDs (e.g., [9851,9852,9853,9854])
    branchIds: {
      type: [Types.ObjectId],
      ref: "Branch",
      required: true,
      set: parseNumberArray
    },
    // Optional holiday type (not provided in CSV rows but kept for flexibility)
    holidayType: { type: String },
    // Holiday date in "DD-MM-YYYY" format (or using "/" as separator)
    holidayStartDate: {
      type: Date,
      required: true,
      set: parseFlexibleDate
    },
    holidayEndDate: {
      type: Date,
      required: true,
      set: parseFlexibleDate
    },  
    // Announcement date in "DD-MM-YYYY" or "DD/MM/YYYY" format
    announcementDate: {
      type: Date,
      required: true,
      set: parseFlexibleDate
    },
    // Announcement time (if provided)
    announcementTime: { type: String },
    // Reason for holiday (e.g., "Bharat Bandh", "International Holiday", etc.)
    reasonForHoliday: {
      type: String,
      required: true
    },
    // Additional notes (optional)
    notes: { type: String },
    // Version field for schema versioning
    version: { type: Number, default: 1 }
  },
  { timestamps: true }
);

export default mongoose.model("Calendar", CalendarSchema);
