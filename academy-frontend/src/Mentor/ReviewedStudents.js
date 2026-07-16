import React, { useEffect, useState } from "react";
import "../components/MentorDashboard.css";

const ReviewedStudents = () => {
  const currentMentor = JSON.parse(localStorage.getItem("currentMentor"));
  const [students, setStudents] = useState([]);

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

  useEffect(() => {
    fetchStudents();
  }, []);

  const reviewed = students.filter(
    (s) =>
      s.assignedMentor === currentMentor?.id &&
      s.mentorRecommendation &&
      s.status !== "inactive",
  );

  const approved = reviewed.filter(
    (s) => s.mentorRecommendation === "approved",
  );

  const rejected = reviewed.filter(
    (s) => s.mentorRecommendation === "rejected",
  );

  return (
    <div>
      <div className="mentor-page-header">
        <h2 className="page-title">Reviewed Students</h2>
        <span className="mentor-badge active">{reviewed.length} reviewed</span>
      </div>

      <p className="page-sub">
        Students you have already reviewed and recommended.
      </p>

      <div style={{ display: "flex", gap: 12, marginBottom: 24 }}>
        <span className="mentor-badge approved">
          {approved.length} Approved
        </span>
        <span className="mentor-badge rejected">
          {rejected.length} Rejected
        </span>
      </div>

      <div className="mentor-table-box">
        <div className="mentor-table-head">
          <h3>Review History</h3>
        </div>

        <table className="mentor-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Course</th>
              <th>Timing</th>
              <th>Recommendation</th>
              <th>Comment</th>
            </tr>
          </thead>

          <tbody>
            {reviewed.length === 0 ? (
              <tr>
                <td
                  colSpan="5"
                  style={{
                    textAlign: "center",
                    color: "var(--muted)",
                    padding: "32px",
                  }}
                >
                  No reviewed students yet!
                </td>
              </tr>
            ) : (
              reviewed.map((s) => (
                <tr key={s.id}>
                  <td>
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 10 }}
                    >
                      <div className="mentor-avatar">
                        {s.Fname.charAt(0).toUpperCase()}
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
                    <span className="mentor-tag">{s.Course}</span>
                  </td>

                  <td style={{ color: "var(--muted)", fontSize: 12 }}>
                    {s.Timing}
                  </td>

                  <td>
                    <span className={`mentor-badge ${s.mentorRecommendation}`}>
                      {s.mentorRecommendation === "approved"
                        ? "Approved"
                        : "Rejected"}
                    </span>
                  </td>

                  <td
                    style={{
                      color: "var(--muted)",
                      fontSize: 12,
                      maxWidth: 200,
                    }}
                  >
                    {s.mentorComment || "-"}
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

export default ReviewedStudents;
