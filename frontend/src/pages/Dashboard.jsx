import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";

function Dashboard({ user }) {
    const [courses, setCourses] = useState([]);
    const [tasks, setTasks] = useState([]);

    const loadDashboardData = async () => {
        try {
            const courseRes = await api.get("/courses");
            const taskRes = await api.get("/studytasks");

            setCourses(courseRes.data);
            setTasks(taskRes.data);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        loadDashboardData();
    }, []);

    const completedTasks = tasks.filter((task) => task.status === "Completed").length;
    const inProgressTasks = tasks.filter((task) => task.status === "In Progress").length;

    return (
        <div className="page">
            <div className="dashboard-header pro-dashboard">
                <div>
                    <p className="eyebrow">Dashboard</p>
                    <h2>Welcome, {user?.name || "Student"}</h2>
                    <p className="page-subtitle">
                        Manage your courses and study tasks from one clean workspace.
                    </p>
                </div>

                <div className="dashboard-actions">
                    <Link to="/courses" className="small-dark-btn">Manage Courses</Link>
                    <Link to="/studytasks" className="small-light-btn">Manage Tasks</Link>
                </div>
            </div>

            <div className="stats-grid">
                <div className="stat-card">
                    <span>{courses.length}</span>
                    <h3>Courses</h3>
                    <p>Total courses created in your study planner.</p>
                </div>

                <div className="stat-card">
                    <span>{tasks.length}</span>
                    <h3>Study Tasks</h3>
                    <p>Total study tasks created across all courses.</p>
                </div>

                <div className="stat-card">
                    <span>{completedTasks}</span>
                    <h3>Completed</h3>
                    <p>Study tasks that have been marked as completed.</p>
                </div>
            </div>

            <div className="dashboard-panel">
                <div>
                    <h3>Current Progress</h3>
                    <p>
                        You currently have {inProgressTasks} task(s) in progress.
                        Keep updating task statuses as you complete your study work.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;