import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../components/AdminLogin.css";
import { saveAuth } from "../utils/auth";

const AdminLogin = () => {
  const navigate = useNavigate();

  const [adminData, setAdminData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setAdminData({
      ...adminData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: adminData.email,
          password: adminData.password,
          role: "admin",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Invalid admin credentials");
        return;
      }

      // Store JWT + user info
      saveAuth("admin", {
        token: data.token,
        role: data.role,
        name: data.name,
        email: data.email,
        id: data.id,
      });

      navigate("/admindashboard");
    } catch (err) {
      setError("Cannot connect to server. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-container">
      <div className="admin-orb-1"></div>
      <div className="admin-orb-2"></div>

      <div className="admin-login-card">
        <Link to="/" style={{ display: "inline-flex", alignItems: "center", gap: 6, textDecoration: "none", color: "#7C6FFF", fontWeight: 600, fontSize: 13, marginBottom: 16 }}>
          ← Back to Home
        </Link>
        <h2 className="admin-login-title">Admin Login</h2>
        <p className="admin-login-sub">Access NexAcademy administration panel</p>

        <form onSubmit={handleLogin} autoComplete="off">
          {/* Anti-autofill dummy inputs */}
          <input type="text" name="fake_email_prevent_autofill" style={{ display: "none" }} tabIndex="-1" aria-hidden="true" />
          <input type="password" name="fake_password_prevent_autofill" style={{ display: "none" }} tabIndex="-1" aria-hidden="true" />

          <div className="admin-input-group">
            <label>Email</label>
            <input
              className="admin-input"
              type="email"
              name="email"
              value={adminData.email}
              onChange={handleChange}
              placeholder="Enter Email"
              readOnly
              onFocus={(e) => e.target.removeAttribute("readonly")}
              autoComplete="new-password"
              required
            />
          </div>

          <div className="admin-input-group">
            <label>Password</label>
            <input
              className="admin-input"
              type="password"
              name="password"
              value={adminData.password}
              onChange={handleChange}
              placeholder="Enter Password"
              readOnly
              onFocus={(e) => e.target.removeAttribute("readonly")}
              autoComplete="new-password"
              required
            />
          </div>

          {error && <div className="admin-login-error">{error}</div>}

          <button type="submit" className="admin-login-btn" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="admin-demo">Admin Portal Access</div>
      </div>
    </div>
  );
};

export default AdminLogin;
