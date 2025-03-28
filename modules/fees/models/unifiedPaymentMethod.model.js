import mongoose from "mongoose";
const { Schema, Types } = mongoose;

// Helper to parse date strings (e.g., "1-2-2025" or "25--02-2025")
function parseDate(value) {
  if (!value || typeof value !== "string") return value;
  // Normalize double dashes if present.
  value = value.replace(/--/g, "-");
  const parts = value.split("-");
  if (parts.length !== 3) return value;
  const day = parseInt(parts[0].trim(), 10);
  const month = parseInt(parts[1].trim(), 10);
  const year = parseInt(parts[2].trim(), 10);
  return new Date(year, month - 1, day);
}

// Helper to parse booleans from strings ("TRUE"/"FALSE")
function parseBoolean(value) {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") {
    return value.trim().toLowerCase() === "true";
  }
  return false;
}

const UnifiedPaymentMethodSchema = new Schema(
  {
    // Discriminator field to indicate which payment method the record represents.
    // Expected values: "cash", "cheque", "onlineTransactions", "netBanking", "offlineQrCode", "demandDraft"
    transactionType: {
      type: String,
      required: true,
      enum: [
        "cash",
        "cheque",
        "onlineTransactions",
        "netBanking",
        "offlineQrCode",
        "demandDraft"
      ]
    },

    // Common field(s)
    amount: { type: Number, required: true },

    // to be set by accounts department
    finalStatus: { type: String },

    // ====================
    // CASH-specific fields
    // ====================
    payeeName: { type: String }, // Used in cash, cheque, and demand draft
    payeeContact: { type: String }, // Only for cash
    receivedBy: { type: Types.ObjectId, ref: "Profile" }, // For cash, cheque  – staff receiving payment
    receiptNo: { type: String }, // Receipt id/number for temporary proof for parents

    // ====================
    // CHEQUE-specific fields
    // ====================
    chequeNumber: { type: String },
    chequeDate: { type: Date, set: parseDate },
    validDate: { type: Date, set: parseDate },
    validStatus: { type: Boolean, set: parseBoolean },
    payerBankName: { type: String }, // For cheque and demand draft (can be shared) and also for online transactions
    payerBankBranchName: { type: String }, // For cheque and demand draft
    signed: { type: Boolean, set: parseBoolean }, // Whether signed by payee
    transactionRefNo: { type: String }, // For cheque and demand draft and online transactions

    // ====================
    // ONLINE TRANSACTIONS & NET BANKING fields
    // ====================
    // In the CSV for onlineTransactions/netBanking, the column "paymentMode" is provided.
    // We'll capture that raw value here while the record’s type (transactionType) distinguishes them.
    rawPaymentMode: { type: String }, // upi,neft,imps,debit,credit,onlineqrcode,e-wallet
    payerMerchantApp: { type: String }, // Only for onlineTransactions (e.g., "phonepe", "gpay")
    initialStatus: { type: Boolean, set: parseBoolean }, // Gateway status (for onlineTransactions/netBanking)

    // ====================
    // OFFLINE QR CODE-specific fields
    // ====================
    offlineStatus: { type: String }, // Column "status" in offlineQrCode block
    offlineInitialStatus: { type: Boolean, set: parseBoolean }, // "intialStatus" from CSV for offlineQrCode

    // ====================
    // DEMAND DRAFT-specific fields
    // ====================
    draftNumber: { type: String }, // From CSV column "number"
    ddDate: { type: Date, set: parseDate }, // From CSV "date"

    // Versioning field
    version: { type: Number, default: 1 }
  },
  { timestamps: true }
);

export default mongoose.model(
  "UnifiedPaymentMethod",
  UnifiedPaymentMethodSchema
);
