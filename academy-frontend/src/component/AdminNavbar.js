// AdminNavbar.js
import React from "react";
import "../components/StudentDashboard.css"; // ← same CSS reuse!

const AdminNavbar = ({ sidebarOpen, setSidebarOpen }) => {
  return (
    <header className="stud-navbar">
      {" "}
      {/* ← same class! */}
      <div className="navbar-left">
        <button
          className="burger-btn"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          ☰
        </button>
        <h3 className="user-logo">NexAcademy</h3>
        <span className="admin-tag">Admin Panel</span>
      </div>
      <div className="navbar-right">
        <div className="navbar-user">
          <div className="user-logo">A</div>
          <div>
            <div className="user-name">Admin</div>
            <div className="user-course">Administrator</div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminNavbar;
