const mongoose = require("mongoose");

const studyTaskSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true
        },
        description: {
            type: String
        },
        status: {
            type: String,
            enum: ["Pending", "In Progress", "Completed"],
            default: "Pending"
        },
        dueDate: {
            type: Date
        },
        course: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "Course"
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User"
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("StudyTask", studyTaskSchema);