// AdminNavbar.js
import React from "react";
import { FaBell } from "react-icons/fa";
import "../components/StudentDashboard.css"; // ← same CSS reuse!

const AdminNavbar = () => {
  return (
    <header className="stud-navbar">
      {" "}
      {/* ← same class! */}
      <div className="navbar-left">
        <h3 className="user-logo">NexAcademy</h3>
        <span className="admin-tag">Admin Panel</span>
      </div>
      <div className="navbar-right">
        <button className="navbar-icon-btn">
          <FaBell />
        </button>
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
