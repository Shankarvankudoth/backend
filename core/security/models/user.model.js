import mongoose from "mongoose";
const { Schema, Types } = mongoose;

const BranchRoleSchema = new Schema({
  branchName: { type: String, required: true },
  roleId: { type: Types.ObjectId, required: true, ref: "Role" }
});

const RolesSchema = new Schema({
  branchAndRole: { type: [BranchRoleSchema], required: true }
});

const UserSchema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    // Leverage a nested subdocument to capture multi-branch role associations.
    roles: { type: RolesSchema, required: true },
    isActive: { type: Boolean, default: true },
    version: { type: Number, default: 1 }
  },
  { timestamps: true }
);

export default mongoose.model("User", UserSchema);
