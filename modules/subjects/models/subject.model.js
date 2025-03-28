import mongoose from "mongoose";
const { Schema, Types } = mongoose;

const SubjectSchema = new Schema(
  {
    // Subject Code (e.g., "8-CBSE-Math")
    subjectCode: { type: String, required: true },

    // Subject Name (e.g., Maths, Physics, Social)
    subjectName: { type: String, required: true },

    // Standard/Class (e.g., 8, 9, etc.)
    standard: { type: Number, required: true },

    // Education Board (e.g., CBSE, ICSE)
    board: { type: String, required: true },

    // Chapter names stored as an array of strings
    chapterNames: {
      type: [String],
      required: true,
      set: function (value) {
        if (Array.isArray(value)) return value;
        if (typeof value === "string") {
          return value
            .replace(/[\[\]]/g, "")
            .split(",")
            .map((chapter) => chapter.trim());
        }
        return [];
      }
    },

    // Document IDs related to chapters (Array of ObjectIds)
    documentIds: [
      {
        type: Types.ObjectId,
        ref: "Document"
      }
    ],

    // Reference Book Document IDs (Array of ObjectIds)
    referenceBookIds: [
      {
        type: Types.ObjectId,
        ref: "Document"
      }
    ],
    version: { type: Number, default: 1 }
  },
  { timestamps: true }
);

export default mongoose.model("Subject", SubjectSchema);
