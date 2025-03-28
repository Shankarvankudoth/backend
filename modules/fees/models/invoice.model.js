import mongoose, { Types } from "mongoose";
const { Schema } = mongoose;

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

const InvoiceSchema = new Schema(
  {
    paymentId: { type: Types.ObjectId, ref: "Payment", required: true },
    invoiceNumber: { type: String, required: true },
    date: { type: Date, required: true, set: parseDate },
    amount: { type: Number, required: true },
    studentId: { type: Types.ObjectId, ref: "Profile", required: true },
    paidById: { type: Types.ObjectId, ref: "Profile", required: true },
    /**
     * soft copy of invoice generated by system
     * documentId is the reference to the Document model where the invoice is stored.   
     */
    documentId: { type: Types.ObjectId, ref: "Document", required: true },
    version: { type: Number, default: 1 }
  },
  { timestamps: true }
);

export default mongoose.model("Invoice", InvoiceSchema);
