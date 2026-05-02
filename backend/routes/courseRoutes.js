const express = require("express");
const Course = require("../models/Course");
const StudyTask = require("../models/StudyTask");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, async (req, res) => {
    try {
        const { name, description } = req.body;

        if (!name) {
            return res.status(400).json({ message: "Course name is required" });
        }

        const course = await Course.create({
            name,
            description,
            user: req.user._id
        });

        res.status(201).json(course);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get("/", protect, async (req, res) => {
    try {
        const courses = await Course.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.json(courses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get("/:id", protect, async (req, res) => {
    try {
        const course = await Course.findOne({
            _id: req.params.id,
            user: req.user._id
        });

        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }

        res.json(course);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.put("/:id", protect, async (req, res) => {
    try {
        const course = await Course.findOne({
            _id: req.params.id,
            user: req.user._id
        });

        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }

        course.name = req.body.name || course.name;

        if (req.body.description !== undefined) {
            course.description = req.body.description;
        }

        const updatedCourse = await course.save();

        res.json(updatedCourse);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.delete("/:id", protect, async (req, res) => {
    try {
        const course = await Course.findOne({
            _id: req.params.id,
            user: req.user._id
        });

        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }

        const assignedTaskCount = await StudyTask.countDocuments({
            course: req.params.id,
            user: req.user._id
        });

        await StudyTask.deleteMany({
            course: req.params.id,
            user: req.user._id
        });

        await course.deleteOne();

        res.json({
            message:
                assignedTaskCount > 0
                    ? `Course deleted with ${assignedTaskCount} assigned study task(s)`
                    : "Course deleted"
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;