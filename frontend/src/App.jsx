import { useState } from "react";
import { Routes, Route, Link, Navigate, useNavigate } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Courses from "./pages/Courses";
import StudyTasks from "./pages/StudyTasks";

function Home() {
    return (
        <div className="hero">
            <div className="hero-content">
                <p className="eyebrow">Study Planner App</p>
                <h1>Organize your courses and study tasks with confidence.</h1>
                <p className="hero-text">
                    A clean full-stack study management system with authentication,
                    course management, task tracking, and real-time updates.
                </p>

                <div className="hero-actions">
                    <Link to="/login" className="btn primary">Login</Link>
                    <Link to="/signup" className="btn secondary">Create Account</Link>
                </div>
            </div>
        </div>
    );
}

function ProtectedRoute({ user, children }) {
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return children;
}

function App() {
    const navigate = useNavigate();

    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem("user");
        return savedUser ? JSON.parse(savedUser) : null;
    });

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
        navigate("/");
    };

    return (
        <>
            <nav className="navbar">
                <Link to="/" className="logo">StudyPlanner</Link>

                <div className="nav-links">
                    {user && <Link to="/dashboard">Dashboard</Link>}
                    {user && <Link to="/courses">Courses</Link>}
                    {user && <Link to="/studytasks">Study Tasks</Link>}

                    {!user && <Link to="/login" className="nav-login">Login</Link>}

                    {user && (
                        <button onClick={logout} className="nav-button">
                            Logout
                        </button>
                    )}
                </div>
            </nav>

            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login setUser={setUser} />} />
                <Route path="/signup" element={<Signup setUser={setUser} />} />

                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute user={user}>
                            <Dashboard user={user} />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/courses"
                    element={
                        <ProtectedRoute user={user}>
                            <Courses />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/studytasks"
                    element={
                        <ProtectedRoute user={user}>
                            <StudyTasks />
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </>
    );
}

export default App;