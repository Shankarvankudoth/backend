import mongoose from "mongoose";
const { Schema, Types } = mongoose;

const ExpensesSchema = new Schema(
  {
    reportedBy: {
      type: Types.ObjectId,
      ref: "Profile",
      required: true
    },

    reportedTo: {
      type: Types.ObjectId,
      ref: "Profile",
      required: true
    },

    branchId: {
      type: Types.ObjectId,
      ref: "Branch",
      required: true
    },

    date: {
      type: Date,
      required: true
    },

    productId: {
      type: Types.ObjectId,
      ref: "Iventory",
      required: true
    },

    description: {
      type: String,
      required: true
    },

    amount: {
      type: Number,
      required: true
    },

    payedMode: {
      type: String,
      required: true
    },
// for which expense is made like "stationary", "furniture", "rent","salary","travel", "accomidation" ...etc.
    expenseType: {
      type: String,
      required: true
    },
    notes: {
      type: String
    },

    documentId: {
      type: Types.ObjectId,
      ref: "Document"
    },

    version: {
      type: Number,
      default: 1
    }
  },
  { timestamps: true }
);

export default mongoose.model("Expenses", ExpensesSchema);
