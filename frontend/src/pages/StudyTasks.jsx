import { useEffect, useState } from "react";
const socket = io(import.meta.env.VITE_SOCKET_URL || "http://localhost:5000");import api from "../api";

function StudyTasks() {
    const [tasks, setTasks] = useState([]);
    const [courses, setCourses] = useState([]);

    const [form, setForm] = useState({
        title: "",
        description: "",
        status: "Pending",
        dueDate: "",
        course: ""
    });

    const [editingId, setEditingId] = useState(null);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const currentUser = JSON.parse(localStorage.getItem("user"));

    const loadCourses = async () => {
        try {
            const res = await api.get("/courses");
            setCourses(res.data);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to load courses");
        }
    };

    const loadTasks = async () => {
        try {
            const res = await api.get("/studytasks");
            setTasks(res.data);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to load study tasks");
        }
    };

    useEffect(() => {
        loadCourses();
        loadTasks();
    }, []);

    useEffect(() => {
        const socket = io("http://localhost:5000");

        socket.on("studyTask:created", (newTask) => {
            if (newTask.user && currentUser?._id && newTask.user !== currentUser._id) {
                return;
            }

            setTasks((prevTasks) => {
                const exists = prevTasks.some((task) => task._id === newTask._id);

                if (exists) {
                    return prevTasks;
                }

                return [newTask, ...prevTasks];
            });
        });

        socket.on("studyTask:updated", (updatedTask) => {
            if (updatedTask.user && currentUser?._id && updatedTask.user !== currentUser._id) {
                return;
            }

            setTasks((prevTasks) =>
                prevTasks.map((task) =>
                    task._id === updatedTask._id ? updatedTask : task
                )
            );
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const resetForm = () => {
        setForm({
            title: "",
            description: "",
            status: "Pending",
            dueDate: "",
            course: ""
        });
        setEditingId(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        setError("");

        if (!form.course) {
            setError("Please select a course");
            return;
        }

        try {
            if (editingId) {
                await api.put(`/studytasks/${editingId}`, form);
                setMessage("Study task updated successfully");
            } else {
                await api.post("/studytasks", form);
                setMessage("Study task created successfully");
            }

            resetForm();
            loadTasks();
        } catch (err) {
            setError(err.response?.data?.message || "Action failed");
        }
    };

    const handleEdit = (task) => {
        setEditingId(task._id);

        setForm({
            title: task.title,
            description: task.description || "",
            status: task.status,
            dueDate: task.dueDate ? task.dueDate.substring(0, 10) : "",
            course: task.course?._id || task.course
        });

        setMessage("");
        setError("");
    };

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this study task?");

        if (!confirmDelete) {
            return;
        }

        try {
            await api.delete(`/studytasks/${id}`);
            setMessage("Study task deleted successfully");
            loadTasks();
        } catch (err) {
            setError(err.response?.data?.message || "Delete failed");
        }
    };

    const getStatusClass = (status) => {
        if (status === "Completed") {
            return "status completed";
        }

        if (status === "In Progress") {
            return "status progress";
        }

        return "status pending";
    };

    return (
        <div className="page">
            <div className="section-header">
                <div>
                    <p className="eyebrow">Task Management</p>
                    <h2>Study Tasks</h2>
                    <p className="page-subtitle">
                        Create, update, track, and manage your study tasks in real time.
                    </p>
                </div>
            </div>

            <div className="two-column">
                <div className="panel-card">
                    <h3>{editingId ? "Update Study Task" : "Create Study Task"}</h3>

                    {message && <div className="success-box">{message}</div>}
                    {error && <div className="error-box">{error}</div>}

                    <form onSubmit={handleSubmit} className="auth-form">
                        <div className="form-group">
                            <label>Task Title</label>
                            <input
                                type="text"
                                name="title"
                                value={form.title}
                                onChange={handleChange}
                                placeholder="Example: Study React components"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Description</label>
                            <textarea
                                name="description"
                                value={form.description}
                                onChange={handleChange}
                                placeholder="Short task description"
                            />
                        </div>

                        <div className="form-group">
                            <label>Course</label>
                            <select
                                name="course"
                                value={form.course}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select course</option>
                                {courses.map((course) => (
                                    <option key={course._id} value={course._id}>
                                        {course.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Status</label>
                            <select
                                name="status"
                                value={form.status}
                                onChange={handleChange}
                            >
                                <option value="Pending">Pending</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Completed">Completed</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Due Date</label>
                            <input
                                type="date"
                                name="dueDate"
                                value={form.dueDate}
                                onChange={handleChange}
                            />
                        </div>

                        <button type="submit" className="full-btn">
                            {editingId ? "Update Study Task" : "Add Study Task"}
                        </button>

                        {editingId && (
                            <button type="button" className="light-btn" onClick={resetForm}>
                                Cancel Edit
                            </button>
                        )}
                    </form>
                </div>

                <div className="panel-card">
                    <h3>Study Task List</h3>

                    {tasks.length === 0 ? (
                        <p className="empty-text">No study tasks created yet.</p>
                    ) : (
                        <div className="item-list">
                            {tasks.map((task) => (
                                <div className="task-card" key={task._id}>
                                    <div className="task-top">
                                        <div>
                                            <h4>{task.title}</h4>
                                            <p>{task.description || "No description added."}</p>
                                        </div>

                                        <span className={getStatusClass(task.status)}>
                                            {task.status}
                                        </span>
                                    </div>

                                    <div className="task-meta">
                                        <span>
                                            Course: {task.course?.name || "No course"}
                                        </span>

                                        <span>
                                            Due:{" "}
                                            {task.dueDate
                                                ? new Date(task.dueDate).toLocaleDateString()
                                                : "No date"}
                                        </span>
                                    </div>

                                    <div className="item-actions">
                                        <button onClick={() => handleEdit(task)}>Edit</button>
                                        <button className="danger" onClick={() => handleDelete(task._id)}>
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

export default StudyTasks;