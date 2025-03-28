import mongoose from "mongoose";
import { Types } from "mongoose";
const SubjectSchema = new mongoose.Schema({
    //Marks Obtained in each subject
    marksObtained: { type: Number, required: true },
    maxMarks: { type: Number, required: true },
    result: { type: String, enum: ["PASS", "FAIL"], required: true },
    grade: { type: String, required: true },
});

const ReportSchema = new mongoose.Schema({
    studentId: {
        type: Types.ObjectId,
        ref: "Profile",
        required: true
    },
    batchId: {
        type: Types.ObjectId,
        ref: "Batch",
        required: true,
    },
    admissionId: { type: Types.ObjectId, ref: "Admission", required: true },
    // School reference
    schoolId: { type: Types.ObjectId, ref: "School", required: true },
    // Standard value (e.g., "PUC1 or PUC2", "IX")
    standard: { type: String, required: true },
    board: { type: String, required: true },

    /**
     * Sample JSON
     * "marks": {
                "mathematics": {
                "marksObtained": 45,
                "maxMarks": 100,
                "result": "PASS",
                "grade": "B+"
                },
                "science": {
                "marksObtained": 55,
                "maxMarks": 100,
                "result": "PASS",
                "grade": "B+"
                }
            },
     */
    marks: {
        type: Map,
        of: SubjectSchema,
        required: true
    },
    dateOfReport: { type: Date, required: true },
    documentsId: [{ type: Number, required: true }],
});

const Report = mongoose.model("MarksCard", ReportSchema);

export default Report;