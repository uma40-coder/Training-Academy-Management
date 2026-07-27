import React, { useEffect, useState } from "react";
import "../components/MentorDashboard.css";
import { authFetch } from "../utils/api";
import { showToast } from "../components/Toast";

const NewStudents = () => {
  const currentMentor = JSON.parse(localStorage.getItem("currentMentor"));

  const [students, setStudents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [recommendation, setRecommendation] = useState("");
  const [comment, setComment] = useState("");

  const fetchStudents = async () => {
    try {
      const response = await authFetch("/api/students");
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
      showToast("Failed to load student list. Please check backend connection.", "error");
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const newStudents = students.filter(
    (s) =>
      s.assignedMentor === currentMentor?.id &&
      !s.mentorRecommendation &&
      s.status !== "inactive",
  );

  const openReview = (student) => {
    setSelectedStudent(student);
    setRecommendation("");
    setComment("");
    setShowModal(true);
  };

  const submitReview = async () => {
    if (!recommendation) {
      showToast("Please select an Approve or Reject recommendation.", "warning");
      return;
    }

    if (!comment.trim()) {
      showToast("Please enter a review comment.", "warning");
      return;
    }

    try {
      const response = await authFetch(
        `/api/students/${selectedStudent.id}/mentor-review`,
        {
          method: "PUT",
          body: JSON.stringify({
            mentorRecommendation: recommendation,
            mentorComment: comment,
          }),
        },
      );

      if (!response.ok) {
        showToast("Failed to submit student review.", "error");
        return;
      }

      await fetchStudents();
      setShowModal(false);
      showToast(`Review submitted successfully for ${selectedStudent.Fname}!`, "success");
    } catch (error) {
      console.log(error);
      showToast("Unable to connect to backend server.", "error");
    }
  };

  return (
    <div>
      <div className="mentor-page-header">
        <h2 className="page-title">New Students</h2>
        <span className="mentor-badge pending">
          {newStudents.length} pending
        </span>
      </div>

      <p className="page-sub">
        Review and recommend students assigned to you by admin.
      </p>

      <div className="mentor-table-box">
        <div className="mentor-table-head">
          <h3>Pending Review</h3>
        </div>

        <table className="mentor-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Course</th>
              <th>Timing</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {newStudents.length === 0 ? (
              <tr>
                <td
                  colSpan="5"
                  style={{
                    textAlign: "center",
                    color: "var(--muted)",
                    padding: "32px",
                  }}
                >
                  No pending students to review!
                </td>
              </tr>
            ) : (
              newStudents.map((s) => (
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
                      </div>
                    </div>
                  </td>

                  <td style={{ color: "var(--muted)", fontSize: 12 }}>
                    {s.Email}
                  </td>

                  <td>
                    <span className="mentor-tag">{s.Course}</span>
                  </td>

                  <td style={{ color: "var(--muted)", fontSize: 12 }}>
                    {s.Timing}
                  </td>

                  <td>
                    <button
                      className="mentor-btn-primary"
                      style={{ padding: "6px 14px", fontSize: 12 }}
                      onClick={() => openReview(s)}
                    >
                      Review
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <>
          <div className="mentor-overlay" onClick={() => setShowModal(false)} />

          <div className="mentor-modal">
            <h3 className="mentor-modal-title">Review Student</h3>

            <div
              style={{
                background: "var(--surface)",
                borderRadius: 10,
                padding: "14px 16px",
                marginBottom: 20,
              }}
            >
              <div style={{ fontWeight: 600, marginBottom: 4 }}>
                {selectedStudent?.Fname} {selectedStudent?.Lname}
              </div>
              <div style={{ fontSize: 12, color: "var(--muted)" }}>
                {selectedStudent?.Course} - {selectedStudent?.Timing}
              </div>
              <div style={{ fontSize: 12, color: "var(--muted)" }}>
                {selectedStudent?.Email}
              </div>
            </div>

            <div className="mentor-form-group" style={{ marginBottom: 16 }}>
              <label>Recommendation</label>

              <div
                className={`review-option ${
                  recommendation === "approved" ? "selected-approve" : ""
                }`}
                onClick={() => setRecommendation("approved")}
              >
                Approve - Student is suitable
              </div>

              <div
                className={`review-option ${
                  recommendation === "rejected" ? "selected-reject" : ""
                }`}
                onClick={() => setRecommendation("rejected")}
              >
                Reject - Not suitable / Batch full
              </div>
            </div>

            <div className="mentor-form-group">
              <label>Comment</label>
              <textarea
                className="mentor-input"
                rows={3}
                placeholder="e.g. Suitable for Full Stack batch. Can join Morning batch."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
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
                className="mentor-btn-cancel"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>

              <button className="mentor-btn-primary" onClick={submitReview}>
                Submit Review
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default NewStudents;
