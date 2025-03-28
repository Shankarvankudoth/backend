import mongoose from "mongoose";
const { Schema, Types } = mongoose;

const AdmissionSchema = new Schema(
  {
    // Date of admission: expects "D-M-YYYY" format (e.g., "12-1-2025")
    dateOfAdmission: {
      type: Date,
      required: true,
      set: function (value) {
        if (typeof value === "string") {
          const parts = value.split("-"); // [day, month, year]
          return new Date(parts[2], parts[1] - 1, parts[0]);
        }
        return value;
      }
    },
    // Student reference (converted to ObjectId)
    studentId: { type: Types.ObjectId, ref: "Profile", required: true },
    // Academic year stored as string (e.g., "2025-2026")
    academicYear: { type: Number, required: true },
    // Course reference
    courseId: { type: Types.ObjectId, ref: "Course", required: true },
    // Branch reference
    branchId: { type: Types.ObjectId, ref: "Branch", required: true },
    // Batch reference
    batchId: { type: Types.ObjectId, ref: "Batch"},
    // Roll number within the batch
    batchRollNo: { type: Number },
    // Number of installments (e.g., 2, 3)
    noOfInstallments: { type: Number, required: true },
    // Installment dates stored as an array of strings; CSV values like "[March, September]" are normalized
    installmentsDates: {
      type: [Number],
      required: true,
      set: function (value) {
        if (!value) return [];
        if (Array.isArray(value)) return value;
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
    // Final fee amount for the admission
    finalFee: { type: Number, required: true },
    // Whether a discount was approved
    discountApproved: { type: Boolean },
    // Discount percentage (stored as number, e.g., 10 for "10%") with a setter to remove '%' if provided
    discount: {
      type: Number,
      set: function (value) {
        if (typeof value === "string") {
          return parseFloat(value.replace("%", "").trim());
        }
        return value;
      }
    },
    //the one whose approves the discount from organization
    discountApprovedBy: { type: Types.ObjectId, ref: "User" },
    // Task IDs referenced as an array of ObjectIds
    taskIds: {
      type: [Types.ObjectId],
      ref: "Task",
      set: function (value) {
        if (!value) return [];
        if (Array.isArray(value)) return value;
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
    // School reference
    schoolId: { type: Types.ObjectId, ref: "School", required: true },
    // Standard value (e.g., "PUC 1", "IX")
    standard: { type: String, required: true },
    // Board (e.g., "intermediate", "ICSE", "CBSE")
    board: { type: String, required: true },
    /**
     *   Document IDs (e.g., supporting documents) stored as an array of ObjectIds
     *   we have to notedown the documents that are submitted by the student like document related to aadhar card,
        previous school documents,student photo etc
     *  */
    documentIds: {
      type: [Types.ObjectId],
      ref: "Document",
      set: function (value) {
        if (!value) return [];
        if (Array.isArray(value)) return value;
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

export default mongoose.model("Admission", AdmissionSchema);
