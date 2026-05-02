import { useEffect, useState } from "react";
import api from "../api";

function Courses() {
    const [courses, setCourses] = useState([]);
    const [form, setForm] = useState({
        name: "",
        description: ""
    });
    const [editingId, setEditingId] = useState(null);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const loadCourses = async () => {
        try {
            const res = await api.get("/courses");
            setCourses(res.data);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to load courses");
        }
    };

    useEffect(() => {
        loadCourses();
    }, []);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const resetForm = () => {
        setForm({
            name: "",
            description: ""
        });
        setEditingId(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        setError("");

        try {
            if (editingId) {
                await api.put(`/courses/${editingId}`, form);
                setMessage("Course updated successfully");
            } else {
                await api.post("/courses", form);
                setMessage("Course created successfully");
            }

            resetForm();
            loadCourses();
        } catch (err) {
            setError(err.response?.data?.message || "Action failed");
        }
    };

    const handleEdit = (course) => {
        setEditingId(course._id);
        setForm({
            name: course.name,
            description: course.description || ""
        });
        setMessage("");
        setError("");
    };

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm(
            "Deleting this course will also delete all study tasks assigned to it. Do you want to continue?"
        );

        if (!confirmDelete) {
            return;
        }

        try {
            const res = await api.delete(`/courses/${id}`);
            setMessage(res.data.message || "Course deleted successfully");
            loadCourses();
        } catch (err) {
            setError(err.response?.data?.message || "Delete failed");
        }
    };

    return (
        <div className="page">
            <div className="section-header">
                <div>
                    <p className="eyebrow">Course Management</p>
                    <h2>Courses</h2>
                    <p className="page-subtitle">
                        Create and manage the courses connected to your study tasks.
                    </p>
                </div>
            </div>

            <div className="two-column">
                <div className="panel-card">
                    <h3>{editingId ? "Update Course" : "Create Course"}</h3>

                    {message && <div className="success-box">{message}</div>}
                    {error && <div className="error-box">{error}</div>}

                    <form onSubmit={handleSubmit} className="auth-form">
                        <div className="form-group">
                            <label>Course Name</label>
                            <input
                                type="text"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                placeholder="Example: Web Development"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Description</label>
                            <textarea
                                name="description"
                                value={form.description}
                                onChange={handleChange}
                                placeholder="Short course description"
                            />
                        </div>

                        <button type="submit" className="full-btn">
                            {editingId ? "Update Course" : "Add Course"}
                        </button>

                        {editingId && (
                            <button type="button" className="light-btn" onClick={resetForm}>
                                Cancel Edit
                            </button>
                        )}
                    </form>
                </div>

                <div className="panel-card">
                    <h3>Course List</h3>

                    {courses.length === 0 ? (
                        <p className="empty-text">No courses created yet.</p>
                    ) : (
                        <div className="item-list">
                            {courses.map((course) => (
                                <div className="item-card" key={course._id}>
                                    <div>
                                        <h4>{course.name}</h4>
                                        <p>{course.description || "No description added."}</p>
                                    </div>

                                    <div className="item-actions">
                                        <button onClick={() => handleEdit(course)}>Edit</button>
                                        <button
                                            className="danger"
                                            onClick={() => handleDelete(course._id)}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Courses;