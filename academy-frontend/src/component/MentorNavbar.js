import React from "react";
import "../components/MentorDashboard.css";

const MentorNavbar = ({ sidebarOpen, setSidebarOpen }) => {
  const currentMentor = JSON.parse(localStorage.getItem("currentMentor"));
  const avatar = currentMentor?.name?.charAt(0).toUpperCase();

  return (
    <header className="mentor-navbar">
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 15,
        }}
      >
        <button
          className="burger-btn"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          ☰
        </button>

        <span className="mentor-logo">NexAcademy</span>
        <span className="mentor-tag">Mentor Portal</span>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <div className="navbar-user">
          <div
            className="mentor-avatar"
            style={{ width: 32, height: 32, fontSize: 13 }}
          >
            {avatar}
          </div>

          <div>
            <div className="user-name">{currentMentor?.name}</div>
            <div className="user-course">{currentMentor?.specialization}</div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default MentorNavbar;
