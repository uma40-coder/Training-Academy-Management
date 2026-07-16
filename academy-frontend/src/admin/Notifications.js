import React, { useEffect, useState } from "react";
import "../components/AdDashboard.css";

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
  Announcement: "📢",
  "Batch Info": "📅",
  "Holiday Notice": "🏖️",
  "Class Reminder": "🔔",
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
      const notifRes = await fetch("http://localhost:8080/api/notifications");
      const notifData = await notifRes.json();
      setNotifications([...notifData].reverse());

      const studentsRes = await fetch("http://localhost:8080/api/students");
      const studentsData = await studentsRes.json();
      setStudents(studentsData);

      const coursesRes = await fetch("http://localhost:8080/api/courses");
      const coursesData = await coursesRes.json();
      setCourses(coursesData);
    } catch (error) {
      console.log(error);
      alert("Data load aagala. Backend check pannunga.");
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
      alert("Please enter a message!");
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/api/notifications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        alert("Notification send failed");
        return;
      }

      await fetchData();
      setForm({ type: "Announcement", target: "All Students", message: "" });
      setShowModal(false);
    } catch (error) {
      console.log(error);
      alert("Backend not connected");
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/notifications/${id}`,
        {
          method: "DELETE",
        },
      );

      if (!response.ok) {
        alert("Delete failed");
        return;
      }

      await fetchData();
    } catch (error) {
      console.log(error);
      alert("Backend not connected");
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
          📤 Send Notification
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
                  <option value="All Students">All Students</option>

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
                📤 Send
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Notifications;
