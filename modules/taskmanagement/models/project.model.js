import mongoose from "mongoose";

const project = new mongoose.Schema(
  {
    title: String,
    description: String,
    owner: String,
    assignee: [String],
    branch: [String],
    targetDate: { type: Date },
    completionDate: { type: Date },
    notes: [{ creator: String, note: String }],
    task: [
      {
        title: String,
        description: String,
        actions: [{ creator: String, note: String }],
        assignee: [String],
        creator: String,
        order: Number,
        stage: String,
        index: Number,
        createdDate: { type: Date, default: Date.now },
        updatedDate: { type: Date },
        targetDate: { type: Date },
        completionDate: { type: Date },
        documentId: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Document",
            default: [],
          },
        ],
        version: {
          type: Number,
          default: 1
        }
      }
    ],
    version: {
      type: Number,
      default: 1
    }
  },
  { timestamps: true }
);



export default mongoose.model("Project", project);
