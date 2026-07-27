import React, { useEffect, useState } from "react";
import "../components/StudentDashboard.css";
import { FaBell } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { authFetch } from "../utils/api";

const Navbar = ({ sidebarOpen, setSidebarOpen }) => {
  const [showNotif, setShowNotif] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [student, setStudent] = useState(null);

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  useEffect(() => {
    const fetchData = async () => {
      try {
        const studentsResponse = await authFetch("/api/students");
        const studentsData = await studentsResponse.json();

        const freshStudent = studentsData.find(
          (s) => s.email === currentUser.Email,
        );

        setStudent(freshStudent);

        const notificationsResponse = await authFetch("/api/notifications");
        const notificationsData = await notificationsResponse.json();

        setNotifications(notificationsData);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [currentUser.Email]);

  const isForThisStudent = (notification) => {
    if (!student) return false;

    const target = notification.target;
    if (!target) return false;

    const studEmail = (student.email || "").trim().toLowerCase();

    // Direct student target (e.g. Student:email@example.com)
    if (target.toLowerCase() === `student:${studEmail}`) {
      return true;
    }

    // Multiple student target (e.g. Students:a@gmail.com,b@gmail.com)
    if (target.toLowerCase().startsWith("students:")) {
      const emails = target
        .slice(9)
        .split(",")
        .map((e) => e.trim().toLowerCase());
      return emails.includes(studEmail);
    }

    // Broadcasts for active/approved students only
    if (student.status === "approved") {
      if (target === "All Students") {
        return true;
      }
      if (target === `Course:${student.course}`) {
        return true;
      }
      if (target === `Timing:${student.timing}`) {
        return true;
      }
    }

    return false;
  };

  const visibleNotifications = notifications
    .filter(isForThisStudent)
    .slice()
    .reverse();

  const userEmailKey = (student?.email || currentUser?.Email || "user").trim().toLowerCase();
  const readKey = `read_notifications_${userEmailKey}`;
  const readIds = JSON.parse(localStorage.getItem(readKey)) || [];

  const unreadNotifications = visibleNotifications.filter(
    (n) => !readIds.includes(n.id),
  );

  const handleBellClick = () => {
    setShowNotif(!showNotif);

    const ids = visibleNotifications.map((n) => n.id);
    localStorage.setItem(readKey, JSON.stringify(ids));
  };

  const stud_avatar = (currentUser?.Fname || "S").charAt(0).toUpperCase();

  function initCap(str) {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }

  return (
    <header className="stud-navbar">
      <div className="navbar-left">
        <button
          className="burger-btn"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          ☰
        </button>
        <h3>nexacademy</h3>
      </div>

      <div className="navbar-right">
        <button className="navbar-icon-btn" onClick={handleBellClick}>
          <FaBell />
          {unreadNotifications.length > 0 && (
            <span className="notif-dot"></span>
          )}
        </button>

        {showNotif && (
          <div className="notif-overlay" onClick={() => setShowNotif(false)} />
        )}

        {showNotif && (
          <div className="notif-popup">
            <h4>
              <span>Notifications</span>
              <button className="notif-close-btn" onClick={() => setShowNotif(false)}>
                <IoClose />
              </button>
            </h4>

            <div className="notif-list">
              {visibleNotifications.length === 0 ? (
                <div className="notif-item" style={{ color: "var(--muted)", textAlign: "center" }}>
                  No notifications yet
                </div>
              ) : (
                visibleNotifications.map((n) => (
                  <div className="notif-item" key={n.id}>
                    <div style={{ fontWeight: "600", marginBottom: "4px" }}>{n.message}</div>
                    <div
                      style={{
                        fontSize: 11,
                        color: "var(--muted)",
                        marginTop: 4,
                      }}
                    >
                      {n.type} • {n.time}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        <div className="navbar-user">
          <div className="user-logo">{stud_avatar}</div>

          <div>
            <div className="user-name">
              {initCap(currentUser?.Fname) + " " + initCap(currentUser?.Lname)}
            </div>
            <div className="user-course">{currentUser?.Course}</div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
