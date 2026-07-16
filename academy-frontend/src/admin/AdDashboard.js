import React, { useEffect, useState } from "react";
import "../components/AdDashboard.css";

const AdDashboard = () => {
  const [students, setStudents] = useState([]);
  const [mentors, setMentors] = useState([]);
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const studentsResponse = await fetch(
          "http://localhost:8080/api/students",
        );
        const studentsData = await studentsResponse.json();

        const formattedStudents = studentsData.map((s) => ({
          id: s.id,
          Fname: s.firstName,
          Lname: s.lastName,
          Email: s.email,
          Course: s.course,
          Timing: s.timing,
          status: s.status,
        }));

        setStudents(formattedStudents);

        const mentorsResponse = await fetch(
          "http://localhost:8080/api/mentors",
        );
        const mentorsData = await mentorsResponse.json();
        setMentors(mentorsData);

        const coursesResponse = await fetch(
          "http://localhost:8080/api/courses",
        );
        const coursesData = await coursesResponse.json();
        setCourses(coursesData);
      } catch (error) {
        console.log(error);
        alert("Dashboard data load aagala. Backend check pannunga.");
      }
    };

    fetchDashboardData();
  }, []);

  const total = students.length;
  const pending = students.filter((s) => s.status === "pending").length;
  const approved = students.filter((s) => s.status === "approved").length;
  const rejected = students.filter((s) => s.status === "rejected").length;

  const stats = [
    {
      label: "Total Students",
      value: total,
      icon: "👥",
      color: "var(--accent)",
    },
    {
      label: "Pending",
      value: pending,
      icon: "⏳",
      color: "var(--warning)",
    },
    {
      label: "Approved",
      value: approved,
      icon: "✅",
      color: "var(--success)",
    },
    {
      label: "Rejected",
      value: rejected,
      icon: "❌",
      color: "var(--danger)",
    },
    {
      label: "Total Mentors",
      value: mentors.length,
      icon: "👨‍🏫",
      color: "#A78BFA",
    },
    {
      label: "Total Courses",
      value: courses.length,
      icon: "📚",
      color: "#38BDF8",
    },
  ];

  return (
    <div className="dashboard-container">
      <h2 className="page-title">Dashboard</h2>
      <p className="page-sub">Overview of all activities</p>

      <div className="admin-stat-grid">
        {stats.map((s) => (
          <div className="admin-stat-card" key={s.label}>
            <div className="admin-stat-icon">{s.icon}</div>
            <div className="admin-stat-value" style={{ color: s.color }}>
              {s.value}
            </div>
            <div className="admin-stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="admin-table-box">
        <div className="admin-table-head">
          <h3>Recent Registrations</h3>
        </div>

        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Course</th>
              <th>Timing</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {students.length === 0 ? (
              <tr>
                <td
                  colSpan="4"
                  style={{
                    textAlign: "center",
                    color: "var(--muted)",
                    padding: "24px",
                  }}
                >
                  No students registered yet
                </td>
              </tr>
            ) : (
              students
                .slice(-5)
                .reverse()
                .map((s) => (
                  <tr key={s.id}>
                    <td>
                      {s.Fname || ""} {s.Lname || ""}
                    </td>
                    <td>
                      <span className="admin-tag">{s.Course}</span>
                    </td>
                    <td style={{ color: "var(--muted)", fontSize: 12 }}>
                      {s.Timing}
                    </td>
                    <td>
                      <span className={`admin-badge ${s.status}`}>
                        {s.status}
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

export default AdDashboard;
