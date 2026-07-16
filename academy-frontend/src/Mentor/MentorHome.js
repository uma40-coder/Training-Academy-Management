import React, { useEffect, useState } from "react";
import "../components/MentorDashboard.css";

const MentorHome = () => {
  const currentMentor = JSON.parse(localStorage.getItem("currentMentor"));
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/students");
        const data = await response.json();

        const formatted = data.map((s) => ({
          id: s.id,
          Fname: s.firstName,
          Lname: s.lastName,
          Email: s.email,
          Course: s.course,
          Timing: s.timing,
          status: s.status,
          assignedMentor: s.assignedMentor,
          mentorRecommendation: s.mentorRecommendation,
          mentorComment: s.mentorComment,
        }));

        setStudents(formatted);
      } catch (error) {
        console.log(error);
        alert("Students load aagala. Backend check pannunga.");
      }
    };

    fetchStudents();
  }, []);

  const myStudents = students.filter(
    (s) => s.assignedMentor === currentMentor?.id && s.status !== "inactive",
  );

  const pending = myStudents.filter((s) => !s.mentorRecommendation);
  const reviewed = myStudents.filter((s) => s.mentorRecommendation);
  const approved = myStudents.filter(
    (s) => s.mentorRecommendation === "approved",
  );
  const rejected = myStudents.filter(
    (s) => s.mentorRecommendation === "rejected",
  );

  const stats = [
    {
      label: "Total Assigned",
      value: myStudents.length,
      icon: "👥",
      color: "var(--accent)",
    },
    {
      label: "Pending Review",
      value: pending.length,
      icon: "⏳",
      color: "var(--warning)",
    },
    {
      label: "Reviewed",
      value: reviewed.length,
      icon: "✅",
      color: "var(--success)",
    },
    {
      label: "Approved",
      value: approved.length,
      icon: "🎉",
      color: "var(--success)",
    },
    {
      label: "Rejected",
      value: rejected.length,
      icon: "❌",
      color: "var(--danger)",
    },
  ];

  return (
    <div>
      <div className="mentor-page-header">
        <h2 className="page-title">Dashboard</h2>
      </div>

      <p className="page-sub">
        Welcome back, {currentMentor?.name}! Here's your overview.
      </p>

      <div className="mentor-stat-grid">
        {stats.map((s) => (
          <div className="mentor-stat-card" key={s.label}>
            <div className="mentor-stat-icon">{s.icon}</div>
            <div className="mentor-stat-value" style={{ color: s.color }}>
              {s.value}
            </div>
            <div className="mentor-stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="mentor-table-box">
        <div className="mentor-table-head">
          <h3>My Students</h3>
          <span className="mentor-badge active">{myStudents.length} total</span>
        </div>

        <table className="mentor-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Course</th>
              <th>Timing</th>
              <th>Review Status</th>
            </tr>
          </thead>

          <tbody>
            {myStudents.length === 0 ? (
              <tr>
                <td
                  colSpan="4"
                  style={{
                    textAlign: "center",
                    color: "var(--muted)",
                    padding: "32px",
                  }}
                >
                  No students assigned yet!
                </td>
              </tr>
            ) : (
              myStudents.map((s) => (
                <tr key={s.id}>
                  <td>
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 10 }}
                    >
                      <div className="mentor-avatar">
                        {(s.Fname || "S").charAt(0).toUpperCase()}
                      </div>
                      {s.Fname} {s.Lname}
                    </div>
                  </td>

                  <td>
                    <span className="mentor-tag">{s.Course}</span>
                  </td>

                  <td style={{ color: "var(--muted)", fontSize: 12 }}>
                    {s.Timing}
                  </td>

                  <td>
                    <span
                      className={`mentor-badge ${
                        s.mentorRecommendation || "pending"
                      }`}
                    >
                      {s.mentorRecommendation
                        ? s.mentorRecommendation
                        : "Pending Review"}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MentorHome;
