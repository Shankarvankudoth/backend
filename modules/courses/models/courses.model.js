import mongoose from "mongoose";
const { Schema, Types } = mongoose;

const CourseSchema = new Schema(
  {
    // Optional course name
    courseName: { type: String },
    academicYear: { type: Number, required: true },//acdemic year is begining year for example 2025-2026 the value of academic year is 2025
    standard: { type: Number, required: true },
    // subjectIds stored as an array of ObjectIds referencing the Subject model.
    subjectIds: {
      type: [Types.ObjectId],
      ref: "Subject",
      required: true,
      set: function (value) {
        if (!value) return [];
        if (Array.isArray(value)) {
          return value.map((item) =>
            typeof item === "string" ? item.trim() : item
          );
        }
        if (typeof value === "string") {
          return value
            .replace(/[\[\]]/g, "")
            .split(",")
            .map((item) => item.trim())
            .filter((item) => item);
        }
        return [];
      }
    },
    // Publish date is expected to be convertible to a valid Date.
    publishDate: {
      type: Date,
      set: (v) => new Date(v)
    },
    // Fee is marked as computed; store as a number if available.
    fee: { type: Number },
    modeOfDelivery: {
      type: String,
      required: true,
      enum: ["online", "offline"]
    },

   /**  
    * documentIds for variable topics stored as an array of ObjectIds referencing the Document model.
    * if modeOfdelivery is online documnet might be related to pdf that contains how to access the course
    * document might be course curriculum
    */
   
    documentIds: {
      type: [Types.ObjectId],
      ref: "Document",
      set: function (value) {
        if (!value) return [];
        if (Array.isArray(value)) {
          return value.map((item) =>
            typeof item === "string" ? item.trim() : item
          );
        }
        if (typeof value === "string") {
          return value
            .replace(/[\[\]]/g, "")
            .split(",")
            .map((item) => item.trim())
            .filter((item) => item);
        }
        return [];
      }
    },
    // Version field for schema versioning
    version: { type: Number, default: 1 }
  },
  { timestamps: true }
);

export default mongoose.model("Course", CourseSchema);
