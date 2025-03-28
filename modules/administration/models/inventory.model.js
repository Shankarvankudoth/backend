// import mongoose, { Types } from "mongoose";
// const { Schema } = mongoose;

// // Helper to parse date strings in "DD-MM-YYYY" format
// function parseDate(value) {
//   if (!value || typeof value !== "string") return value;
//   const parts = value.split("-");
//   if (parts.length !== 3) return value;
//   const day = parseInt(parts[0].trim(), 10);
//   const month = parseInt(parts[1].trim(), 10);
//   const year = parseInt(parts[2].trim(), 10);
//   return new Date(year, month - 1, day);
// }

// // Helper to parse an array of numbers from a JSON string (e.g., "[1068]")
// function parseNumberArray(value) {
//   if (!value || typeof value !== "string") return [];
//   try {
//     return JSON.parse(value).map((v) => Number(v));
//   } catch (e) {
//     return [];
//   }
// }

// const InventorySchema = new Schema(
//   {
//     // Fields from the products CSV (matched via productId)
//     productName: { type: String, required: true }, // e.g., "switches", "dustbins"
//     productType: { type: String, required: true }, // e.g., "9A switches", "10ltr dustbins"
//     productCompanyName: { type: String, required: true }, // e.g., "anchor switches", "supreme dustbins"
//     category: { type: String, required: true }, // e.g., "electrical", "household"
//     purchasedDate: { type: Date, required: true, set: parseDate }, // e.g., "15-01-2025"
//     cost: { type: Number, required: true }, // e.g., 50, 120
//     quantity: { type: Number, required: true }, // e.g., 150, 100
//     reorderLevel: { type: Number, required: true }, // e.g., 40, 10
//     // Embedded vendor details from the vendors CSV
//     vendor: {
//       name: { type: String, required: true }, // e.g., "sri sai electronics", "lakshmi householders"
//       department: { type: String, required: true } // e.g., "electrical(fans,lights)", "houseneeds[cleaning liquids,mops]"
//     },
//     purchaseOrderNumber: { type: String, required: true }, // e.g., "PO-1001", "PO-1002"
//     status: { type: Boolean, required: true, default: true }, // e.g., TRUE
//     documentIds: { // e.g., [1068], [1075]
//       type: [Types.ObjectId],
//       ref: "Document",
//       set: parseArray,
//     },
//     version: { type: Number, default: 1 }
//   },
//   { timestamps: true }
// );

// export default mongoose.model("Inventory", InventorySchema);


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

// Helper to parse an array of ObjectIds from a JSON string (e.g., '["60d5ec49b48f8e001c5b9a6b"]')
function parseArray(value) {
  if (!value || typeof value !== "string") return [];
  try {
    return JSON.parse(value).map((v) => new Types.ObjectId(v));
  } catch (e) {
    return [];
  }
}

const InventorySchema = new Schema(
  {
    productName: { type: String, required: true }, // e.g., "switches", "dustbins"
    productType: { type: String, required: true }, // e.g., "9A switches", "10ltr dustbins"
    productCompanyName: { type: String, required: true }, // e.g., "anchor switches", "supreme dustbins"
    category: { type: String, required: true }, // e.g., "electrical", "household"
    purchasedDate: { type: Date, required: true, set: parseDate }, // e.g., "15-01-2025"
    cost: { type: Number, required: true }, // e.g., 50, 120
    quantity: { type: Number, required: true }, // e.g., 150, 100
    reorderLevel: { type: Number, required: true }, // e.g., 40, 10
    
    // Embedded vendor details from the vendors CSV
    vendor: {
      name: { type: String, required: true }, // e.g., "sri sai electronics", "lakshmi householders"
      department: { type: String, required: true } // e.g., "electrical(fans,lights)", "houseneeds[cleaning liquids,mops]"
    },

    purchaseOrderNumber: { type: String, required: true }, // e.g., "PO-1001", "PO-1002"
    status: { type: Boolean, required: true, default: true }, // e.g., TRUE

    // Document references
    documentIds: {
      type: [Types.ObjectId],
      ref: "Document",
      set: parseArray,
    },

    version: { type: Number, default: 1 }
  },
  { timestamps: true }
);

export default mongoose.model("Inventory", InventorySchema);
