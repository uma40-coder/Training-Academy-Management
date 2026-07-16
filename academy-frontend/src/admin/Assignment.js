import React, { useEffect, useState } from "react";
import "../components/AdDashboard.css";

const Assignment = () => {
  const [students, setStudents] = useState([]);
  const [mentors, setMentors] = useState([]);
  const [filter, setFilter] = useState("All");

  const fetchStudents = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/students");
      const data = await response.json();

      const formatted = data.map((s) => ({
        id: s.id,
        Fname: s.firstName,
        Lname: s.lastName,
        Email: s.email,
        Phone: s.phone,
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

  const fetchMentors = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/mentors");
      const data = await response.json();
      setMentors(data);
    } catch (error) {
      console.log(error);
      alert("Mentors load aagala. Backend check pannunga.");
    }
  };

  useEffect(() => {
    fetchStudents();
    fetchMentors();
  }, []);

  const approvedStudents = students.filter((s) => s.status === "approved");

  const filtered = approvedStudents.filter((s) => {
    if (filter === "Assigned") return s.assignedMentor;
    if (filter === "Unassigned") return !s.assignedMentor;
    return true;
  });

  const colors = [
    "#6C63FF",
    "#22C55E",
    "#F59E0B",
    "#EF4444",
    "#38BDF8",
    "#A78BFA",
  ];

  const getInitials = (name) => `${name}`.charAt(0).toUpperCase();

  const assignMentor = async (student, mentorId) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/students/${student.id}/assign-mentor`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            assignedMentor: mentorId ? Number(mentorId) : null,
          }),
        },
      );

      if (!response.ok) {
        alert("Mentor assign failed");
        return;
      }

      await fetchStudents();

      const currentUser = JSON.parse(localStorage.getItem("currentUser"));
      if (currentUser && currentUser.Email === student.Email) {
        localStorage.setItem(
          "currentUser",
          JSON.stringify({
            ...currentUser,
            assignedMentor: mentorId ? Number(mentorId) : null,
          }),
        );
      }
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
        <h2 className="page-title">Mentor Assignment</h2>
        <span className="admin-badge active">
          {approvedStudents.length} approved students
        </span>
      </div>

      <p className="page-sub">Assign mentors to approved students</p>

      <div className="filter-tabs" style={{ marginBottom: 20 }}>
        {["All", "Assigned", "Unassigned"].map((f) => (
          <button
            key={f}
            className={`filter-tab ${filter === f ? "active" : ""}`}
            onClick={() => setFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="admin-table-box">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Student</th>
              <th>Course</th>
              <th>Assigned Mentor</th>
              <th>Status</th>
              <th>Mentor Review</th>
            </tr>
          </thead>

          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td
                  colSpan="5"
                  style={{
                    textAlign: "center",
                    color: "var(--muted)",
                    padding: "32px",
                  }}
                >
                  {filter === "Assigned"
                    ? "No assigned students yet!"
                    : filter === "Unassigned"
                      ? "All students assigned!"
                      : "No approved students yet!"}
                </td>
              </tr>
            ) : (
              filtered.map((s, i) => {
                const assignedMentor = mentors.find(
                  (m) => m.id === s.assignedMentor,
                );

                return (
                  <tr key={s.id}>
                    <td>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                        }}
                      >
                        <div
                          className="admin-avatar"
                          style={{ background: colors[i % colors.length] }}
                        >
                          {getInitials(`${s.Fname}`)}
                        </div>

                        <div>
                          <div style={{ fontWeight: 600 }}>
                            {s.Fname} {s.Lname}
                          </div>
                          <div style={{ fontSize: 11, color: "var(--muted)" }}>
                            {s.Email}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td>
                      <span className="admin-tag">{s.Course}</span>
                    </td>

                    <td>
                      <select
                        className="admin-select"
                        value={s.assignedMentor || ""}
                        onChange={(e) => assignMentor(s, e.target.value)}
                      >
                        <option value="">Select Mentor</option>
                        {mentors.map((m) => (
                          <option key={m.id} value={m.id}>
                            {m.name} ({m.specialization})
                          </option>
                        ))}
                      </select>
                    </td>

                    <td>
                      {assignedMentor ? (
                        <span className="admin-badge approved">Assigned</span>
                      ) : (
                        <span className="admin-badge pending">Unassigned</span>
                      )}
                    </td>

                    <td>
                      {s.mentorRecommendation === "approved" ? (
                        <div>
                          <span className="admin-badge approved">Approved</span>
                          <div
                            style={{
                              fontSize: 11,
                              color: "var(--muted)",
                              marginTop: 4,
                            }}
                          >
                            {s.mentorComment || ""}
                          </div>
                        </div>
                      ) : s.mentorRecommendation === "rejected" ? (
                        <div>
                          <span className="admin-badge rejected">Rejected</span>
                          <div
                            style={{
                              fontSize: 11,
                              color: "var(--muted)",
                              marginTop: 4,
                            }}
                          >
                            {s.mentorComment || ""}
                          </div>
                        </div>
                      ) : (
                        <span className="admin-badge pending">Pending</span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Assignment;
