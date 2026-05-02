const express = require("express");
const StudyTask = require("../models/StudyTask");
const Course = require("../models/Course");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, async (req, res) => {
    try {
        const { title, description, status, dueDate, course } = req.body;

        if (!title || !course) {
            return res.status(400).json({ message: "Title and course are required" });
        }

        const courseExists = await Course.findOne({
            _id: course,
            user: req.user._id
        });

        if (!courseExists) {
            return res.status(404).json({ message: "Course not found" });
        }

        const studyTask = await StudyTask.create({
            title,
            description,
            status,
            dueDate,
            course,
            user: req.user._id
        });

        const populatedTask = await StudyTask.findById(studyTask._id).populate("course", "name");

        const io = req.app.get("io");
        io.emit("studyTask:created", populatedTask);

        res.status(201).json(populatedTask);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get("/", protect, async (req, res) => {
    try {
        const studyTasks = await StudyTask.find({ user: req.user._id })
            .populate("course", "name")
            .sort({ createdAt: -1 });

        res.json(studyTasks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get("/:id", protect, async (req, res) => {
    try {
        const studyTask = await StudyTask.findOne({
            _id: req.params.id,
            user: req.user._id
        }).populate("course", "name");

        if (!studyTask) {
            return res.status(404).json({ message: "Study task not found" });
        }

        res.json(studyTask);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.put("/:id", protect, async (req, res) => {
    try {
        const studyTask = await StudyTask.findOne({
            _id: req.params.id,
            user: req.user._id
        });

        if (!studyTask) {
            return res.status(404).json({ message: "Study task not found" });
        }

        if (req.body.course) {
            const courseExists = await Course.findOne({
                _id: req.body.course,
                user: req.user._id
            });

            if (!courseExists) {
                return res.status(404).json({ message: "Course not found" });
            }

            studyTask.course = req.body.course;
        }

        studyTask.title = req.body.title || studyTask.title;
        studyTask.description = req.body.description || studyTask.description;
        studyTask.status = req.body.status || studyTask.status;
        studyTask.dueDate = req.body.dueDate || studyTask.dueDate;

        await studyTask.save();

        const updatedStudyTask = await StudyTask.findById(studyTask._id).populate("course", "name");

        const io = req.app.get("io");
        io.emit("studyTask:updated", updatedStudyTask);

        res.json(updatedStudyTask);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.delete("/:id", protect, async (req, res) => {
    try {
        const studyTask = await StudyTask.findOne({
            _id: req.params.id,
            user: req.user._id
        });

        if (!studyTask) {
            return res.status(404).json({ message: "Study task not found" });
        }

        await studyTask.deleteOne();

        res.json({ message: "Study task deleted" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;