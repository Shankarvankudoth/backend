import mongoose from "mongoose";
const { Schema, Types } = mongoose;

const BookSchema = new Schema(
  {
    // Auto-generated _id (ObjectId) is used as the primary identifier.
    bookName: { type: String, required: true },
    // Reference to the eBook document using ObjectId.
    ebookDocumentId: {
      type: [Types.ObjectId],
      ref: "Document"
    },
    // Reference to the cover page image document using ObjectId.
    documentId: {
      type: [Types.ObjectId],
      ref: "Document"
    },
    // Authors field accepts a comma-separated string or an array, and is normalized into an array of strings.
    authors: {
      type: [String],
      set: function (value) {
        if (Array.isArray(value)) return value;
        if (typeof value === "string") {
          return value.split(",").map((author) => author.trim());
        }
        return [];
      }
    },
    publisher: { type: String },
    // Year or edition is stored as a number.
    yearEdition: { type: Number },
    version: { type: Number, default: 1 }
  },
  { timestamps: true }
);

const Book = mongoose.model("Book", BookSchema);
export default Book;

