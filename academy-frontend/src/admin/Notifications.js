import React, { useEffect, useState } from "react";
import "../components/AdDashboard.css";
import { authFetch } from "../utils/api";
import { showToast } from "../components/Toast";
import { FaMessage } from "react-icons/fa6";
import { IoSend } from "react-icons/io5";

const notifTypes = [
  "Announcement",
  "Batch Info",
  "Holiday Notice",
  "Class Reminder",
];

const typeColors = {
  Announcement: "#6C63FF",
  "Batch Info": "#22C55E",
  "Holiday Notice": "#F59E0B",
  "Class Reminder": "#38BDF8",
};

const typeIcons = {
  Announcement: <FaMessage />,
  "Batch Info": "",
  "Holiday Notice": "",
  "Class Reminder": "",
};

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const [form, setForm] = useState({
    type: "Announcement",
    target: "All Students",
    message: "",
  });

  const fetchData = async () => {
    try {
      const notifRes = await authFetch("/api/notifications");
      const notifData = await notifRes.json();
      setNotifications([...notifData].reverse());

      const studentsRes = await authFetch("/api/students");
      const studentsData = await studentsRes.json();
      setStudents(studentsData);

      const coursesRes = await authFetch("/api/courses");
      const coursesData = await coursesRes.json();
      setCourses(coursesData);
    } catch (error) {
      console.log(error);
      showToast("Failed to load notification data. Please check backend connection.", "error");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const approvedStudents = students.filter((s) => s.status === "approved");
  const timings = [
    ...new Set(approvedStudents.map((s) => s.timing).filter(Boolean)),
  ];

  const handleSend = async () => {
    if (!form.message.trim()) {
      showToast("Please enter a notification message.", "warning");
      return;
    }

    let finalTarget = form.target;

    if (form.target === "All Students") {
      const emails = approvedStudents.map((s) => s.email).join(",");
      finalTarget = `Students:${emails}`;
    }

    try {
      const response = await authFetch("/api/notifications", {
        method: "POST",
        body: JSON.stringify({
          type: form.type,
          target: finalTarget,
          message: form.message,
        }),
      });

      if (!response.ok) {
        showToast("Failed to send notification.", "error");
        return;
      }

      await fetchData();
      setForm({ type: "Announcement", target: "All Students", message: "" });
      setShowModal(false);
      showToast("Notification sent successfully!", "success");
    } catch (error) {
      console.log(error);
      showToast("Unable to connect to backend server.", "error");
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await authFetch(
        `/api/notifications/${id}`,
        { method: "DELETE" },
      );

      if (!response.ok) {
        showToast("Failed to delete notification.", "error");
        return;
      }

      await fetchData();
      showToast("Notification deleted successfully!", "success");
    } catch (error) {
      console.log(error);
      showToast("Unable to connect to backend server.", "error");
    }
  };

  return (
    <div className="dashboard-container">
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 6,
        }}
      >
        <h2 className="page-title">Notifications</h2>
        <button
          className="admin-btn-primary"
          onClick={() => setShowModal(true)}
        >
          <IoSend /> Send Notification
        </button>
      </div>

      <p className="page-sub">Send announcements and messages to students</p>

      {notifications.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            color: "var(--muted)",
            padding: "48px",
          }}
        >
          No notifications sent yet!
        </div>
      ) : (
        notifications.map((n) => (
          <div className="notif-card-admin" key={n.id}>
            <div
              className="notif-card-icon"
              style={{ color: typeColors[n.type] || "#6C63FF" }}
            >
              {typeIcons[n.type] || "🔔"}
            </div>

            <div style={{ flex: 1 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  marginBottom: 6,
                }}
              >
                <span className="admin-badge active" style={{ fontSize: 10 }}>
                  {n.type}
                </span>
                <span style={{ fontSize: 11, color: "var(--muted)" }}>
                  → {n.target}
                </span>
                <span
                  style={{
                    fontSize: 11,
                    color: "var(--muted)",
                    marginLeft: "auto",
                  }}
                >
                  {n.time}
                </span>
              </div>

              <div
                style={{ fontSize: 13, color: "var(--text)", lineHeight: 1.5 }}
              >
                {n.message}
              </div>
            </div>

            <button
              className="admin-btn-reject"
              style={{ padding: "4px 10px" }}
              onClick={() => handleDelete(n.id)}
            >
              Delete
            </button>
          </div>
        ))
      )}

      {showModal && (
        <>
          <div className="admin-overlay" onClick={() => setShowModal(false)} />

          <div className="admin-modal">
            <h3 className="admin-modal-title">Send Notification</h3>

            <div className="admin-form-row">
              <div className="admin-form-group">
                <label>Type</label>
                <select
                  className="admin-input"
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                >
                  {notifTypes.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div className="admin-form-group">
                <label>Target</label>
                <select
                  className="admin-input"
                  value={form.target}
                  onChange={(e) => setForm({ ...form, target: e.target.value })}
                >
                  <option value="All Students">All Current Students</option>

                  <option disabled>--- Course Wise ---</option>
                  {courses.map((c) => (
                    <option key={c.id} value={`Course:${c.name}`}>
                      Course: {c.name}
                    </option>
                  ))}

                  <option disabled>--- Timing Wise ---</option>
                  {timings.map((t) => (
                    <option key={t} value={`Timing:${t}`}>
                      Timing: {t}
                    </option>
                  ))}

                  <option disabled>--- Individual Student ---</option>
                  {approvedStudents.map((s) => (
                    <option key={s.id} value={`Student:${s.email}`}>
                      Student: {s.firstName} {s.lastName}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="admin-form-group">
              <label>Message</label>
              <textarea
                className="admin-input"
                rows={4}
                placeholder="Enter notification message..."
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
              />
            </div>

            <div
              style={{
                display: "flex",
                gap: 10,
                justifyContent: "flex-end",
                marginTop: 20,
              }}
            >
              <button
                className="admin-btn-cancel"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button className="admin-btn-primary" onClick={handleSend}>
                <IoSend /> Send
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Notifications;
