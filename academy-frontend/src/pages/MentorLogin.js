import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../components/MentorDashboard.css";

const MentorLogin = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("http://localhost:8080/api/mentors/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
        }),
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        setError(errorMessage);
        return;
      }

      const mentor = await response.json();

      localStorage.setItem("currentMentor", JSON.stringify(mentor));
      navigate("/mentordashboard");
    } catch (error) {
      console.log(error);
      setError("Backend not connected");
    }
  };

  return (
    <div className="mentor-login-wrap">
      <div className="mentor-login-card">
        <div className="mentor-login-logo">NexAcademy</div>
        <h2 className="mentor-login-title">Mentor Login</h2>
        <p className="mentor-login-sub">Access your mentor portal</p>

        <form onSubmit={handleLogin}>
          <div className="mentor-form-group">
            <label>Email</label>
            <input
              className="mentor-input"
              type="email"
              placeholder="Enter your email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
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
            />
          </div>

          {error && <div className="mentor-error">{error}</div>}

          <button type="submit" className="mentor-login-btn">
            Login
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
