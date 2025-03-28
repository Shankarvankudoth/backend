import mongoose from "mongoose";
const { Schema, Types } = mongoose;

// Helper function to normalize paymentMode values
function mapPaymentMode(value) {
  if (!value) return value;
  const lower = value.toLowerCase();
  if (lower === "dd" || lower === "demanddraft") return "demandDraft";
  if (lower === "cheque" || lower === "check") return "cheque";
  if (lower === "upi" || lower === "onlineqrcode" || lower === "online")
    return "onlineTransactions";
  if (lower === "cash") return "cash";
  if (
    lower.includes("debit") ||
    lower.includes("credit") ||
    lower === "imps" ||
    lower === "neft"
  )
    return "netBanking";
  if (lower === "offlineqrcode") return "offlineQrCode";
  return lower;
}

const PaymentSchema = new Schema(
  {
    // Reference to Student document
    studentId: { type: Types.ObjectId, ref: "Profile", required: true },
    // Payment date parsed from "dd-mm-yyyy" format
    paymentDate: {
      type: Date,
      required: true,
      set: function (value) {
        if (typeof value === "string") {
          const parts = value.split("-"); // [day, month, year]
          return new Date(parts[2], parts[1] - 1, parts[0]);
        }
        return value;
      },
    },
    // Reference to Admission document
    admissionId: { type: Types.ObjectId, ref: "Admission", required: true },
    // Payment amount
    amount: { type: Number, required: true },
    // Payment type (e.g., initialPayment, SecondInstallment, etc.)
    type: { type: String, required: true },
    // Payment mode is normalized to one of the allowed values.
    /*
      enum: [
        "cash",
        "cheque",
        "onlineTransactions",
        "netBanking",
        "offlineQrCode",
        "demandDraft"
      ],
      only these to be used in 
    */
    paymentMode: {
      type: String,
      required: true,
      set: mapPaymentMode,
    },
    // Dynamic reference to the transaction document based on paymentMode.
    paymentRef: { type: Types.ObjectId, refPath: "paymentMode" },
    // Branch bank remittance identifier (as a string)
    remittanceId: { type: String },
    // Final status updated by the accounts team (e.g., SUCCESS(1), FAILURE(0))
    finalStatus: { type: Number, required: true },
    // Pending fee amount
    pendingFee: { type: Number, required: true },
    //this will be used to track the invoice generated for the payment and orderId will be String example:'order_${Date.now()}'
    orderId: { type: String, required: true },
    // Invoice reference; a custom setter ignores "-" values from CSV.
    invoiceId: {
      type: Types.ObjectId,
      ref: "Invoice",
      set: function (value) {
        if (
          typeof value === "string" &&
          (value.trim() === "-" || value.trim() === "")
        ) {
          return undefined;
        }
        return value;
      },
    },
    // Client source (e.g., website, app)
    client: { type: String, required: true },
    // Tally status updated by the accounts team
    tallyStatus: { type: String },
    // Proof document reference (to a Document)
    proofId: { type: Types.ObjectId, ref: "Document" },
    // Version field for schema versioning
    version: { type: Number, default: 1 },
  },
  { timestamps: true }
);

export default mongoose.model("Payment", PaymentSchema);
