import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";

function Login({ setUser }) {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        email: "",
        password: ""
    });

    const [error, setError] = useState("");

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const res = await api.post("/auth/login", form);

            localStorage.setItem("token", res.data.token);
            localStorage.setItem("user", JSON.stringify(res.data));

            setUser(res.data);
            navigate("/dashboard");
        } catch (err) {
            setError(err.response?.data?.message || "Login failed");
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <p className="eyebrow">Welcome back</p>
                <h2>Login to your account</h2>
                <p className="auth-subtitle">
                    Continue managing your courses and study tasks.
                </p>

                {error && <div className="error-box">{error}</div>}

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            placeholder="Enter your email"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            placeholder="Enter your password"
                            required
                        />
                    </div>

                    <button type="submit" className="full-btn">
                        Login
                    </button>
                </form>

                <p className="auth-footer">
                    Do not have an account? <Link to="/signup">Create account</Link>
                </p>
            </div>
        </div>
    );
}

export default Login;