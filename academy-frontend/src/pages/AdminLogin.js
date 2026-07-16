import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../components/AdminLogin.css"

const AdminLogin = () => {
  const navigate = useNavigate();

  // Form state
  const [adminData, setAdminData] = useState({
    email: "",
    password: "",
  });

  // Temporary admin account
  const admin = {
    email: "admin@nexacademy.com",
    password: "NexAdmin@2026",
  };

  // Input change
  const handleChange = (e) => {
    setAdminData({
      ...adminData,
      [e.target.name]: e.target.value,
    });
  };

  // Login check
  const handleLogin = (e) => {
    e.preventDefault();

    if (
      adminData.email === admin.email &&
      adminData.password === admin.password
    ) 
    {
      localStorage.setItem("adminAuth", "true"); // ← add pannunga
      navigate("/admindashboard");
    }
     else {
      alert("Invalid Admin Credentials");
    }
  };

return (
  <div className="admin-login-container">
    <div className="admin-login-card">
      <h2 className="admin-login-title">Admin Login</h2>

      <p className="admin-login-sub">Access NexAcademy administration panel</p>

      <form onSubmit={handleLogin}>
        <div className="admin-input-group">
          <label>Email</label>

          <input
            className="admin-input"
            type="email"
            name="email"
            value={adminData.email}
            onChange={handleChange}
            placeholder="Enter Email"
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
          />
        </div>

        <button type="submit" className="admin-login-btn">
          Login
        </button>
      </form>

      <div className="admin-demo">Admin Portal Access</div>
    </div>
  </div>
);
};

export default AdminLogin;
