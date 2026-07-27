import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../components/MentorDashboard.css";
import { saveAuth } from "../utils/auth";

const MentorLogin = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
          role: "mentor",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Login failed");
        return;
      }

      // Store JWT + mentor info
      saveAuth("mentor", {
        token: data.token,
        role: data.role,
        name: data.name,
        email: data.email,
        id: data.id,
      });

      // Backward compat: keep currentMentor for dashboard pages
      localStorage.setItem(
        "currentMentor",
        JSON.stringify({
          id: data.id,
          name: data.name,
          email: data.email,
          token: data.token,
        })
      );

      navigate("/mentordashboard");
    } catch (err) {
      console.log(err);
      setError("Cannot connect to server. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mentor-login-wrap">
      <div className="mentor-orb-1"></div>
      <div className="mentor-orb-2"></div>

      <div className="mentor-login-card">
        <Link to="/" style={{ display: "inline-flex", alignItems: "center", gap: 6, textDecoration: "none", color: "#7C6FFF", fontWeight: 600, fontSize: 13, marginBottom: 16 }}>
          ← Back to Home
        </Link>
        <div className="mentor-login-logo">NexAcademy</div>
        <h2 className="mentor-login-title">Mentor Login</h2>
        <p className="mentor-login-sub">Access your mentor portal</p>

        <form onSubmit={handleLogin} autoComplete="off">
          {/* Anti-autofill dummy inputs */}
          <input type="text" name="fake_email_prevent_autofill" style={{ display: "none" }} tabIndex="-1" aria-hidden="true" />
          <input type="password" name="fake_password_prevent_autofill" style={{ display: "none" }} tabIndex="-1" aria-hidden="true" />

          <div className="mentor-form-group">
            <label>Email</label>
            <input
              className="mentor-input"
              type="email"
              placeholder="Enter your email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              readOnly
              onFocus={(e) => e.target.removeAttribute("readonly")}
              autoComplete="new-password"
              required
            />
          </div>

          <div className="mentor-form-group">
            <label>Password</label>
            <input
              className="mentor-input"
              type="password"
              placeholder="Enter password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              readOnly
              onFocus={(e) => e.target.removeAttribute("readonly")}
              autoComplete="new-password"
              required
            />
          </div>

          {error && <div className="mentor-error">{error}</div>}

          <button type="submit" className="mentor-login-btn" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="mentor-login-hint">
          Default password: <strong>Mentor@123</strong>
        </div>
      </div>
    </div>
  );
};

export default MentorLogin;
