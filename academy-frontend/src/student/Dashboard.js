import React, { useEffect, useState } from "react";

const Dashboard = () => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const [student, setStudent] = useState(null);
  const [mentors, setMentors] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const studentsResponse = await fetch(
          "http://localhost:8080/api/students",
        );
        const studentsData = await studentsResponse.json();

        const freshStudent = studentsData.find(
          (s) => s.email === currentUser.Email,
        );

        if (freshStudent) {
          const formattedUser = {
            id: freshStudent.id,
            Fname: freshStudent.firstName,
            Lname: freshStudent.lastName,
            Email: freshStudent.email,
            Phone: freshStudent.phone,
            Course: freshStudent.course,
            Timing: freshStudent.timing,
            status: freshStudent.status,
            assignedMentor: freshStudent.assignedMentor,
            mentorRecommendation: freshStudent.mentorRecommendation,
            mentorComment: freshStudent.mentorComment,
          };

          setStudent(formattedUser);
          localStorage.setItem("currentUser", JSON.stringify(formattedUser));
        }

        const mentorsResponse = await fetch(
          "http://localhost:8080/api/mentors",
        );
        const mentorsData = await mentorsResponse.json();
        setMentors(mentorsData);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [currentUser.Email]);

  if (!student) {
    return (
      <div className="dashboard-container">
        <div className="pending-card">
          <h2 className="pending-title">Loading...</h2>
        </div>
      </div>
    );
  }

  const assignedMentor = mentors.find((m) => m.id === student.assignedMentor);

  if (student.status === "pending") {
    return (
      <div className="dashboard-container">
        <div className="pending-card">
          <div className="pending-icon">...</div>
          <h2 className="pending-title">Application Pending</h2>
          <p className="pending-msg">
            Hi <strong>{student.Fname}</strong>! Your application is under
            review.
          </p>
          <p className="pending-sub">
            Admin will approve your application soon.
          </p>
        </div>
      </div>
    );
  }

  if (student.status === "rejected") {
    return (
      <div className="dashboard-container">
        <div className="pending-card">
          <h2 className="pending-title">Application Rejected</h2>
          <p className="pending-msg">
            Hi <strong>{student.Fname}</strong>, your application was rejected.
          </p>
        </div>
      </div>
    );
  }

  if (student.status === "inactive") {
    return (
      <div className="dashboard-container">
        <div className="pending-card">
          <h2 className="pending-title">Account Inactive</h2>
          <p className="pending-msg">Please contact admin.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {student.mentorRecommendation ? (
        <div className="notification-card">
          <span className="notification-icon">🔔</span>
          <span>
            Mentor review: {student.mentorRecommendation}.{" "}
            {student.mentorComment}
          </span>
        </div>
      ) : assignedMentor ? (
        <div className="notification-card">
          <span className="notification-icon">👨‍🏫</span>
          <span>
            Your mentor is assigned: {assignedMentor.name}. Review is pending.
          </span>
        </div>
      ) : (
        <div
          className="notification-card"
          style={{
            background: "var(--accent-soft)",
            borderColor: "var(--accent)",
          }}
        >
          <span className="notification-icon">⏳</span>
          <span>
            Your application is approved! Waiting for mentor assignment.
          </span>
        </div>
      )}
      <div className="dash-cards">
        <div className="dash-card">
          <div className="dash-card-icon">📚</div>
          <div className="dash-card-label">Course</div>
          <div className="dash-card-value">{student.Course}</div>
        </div>

        <div className="dash-card">
          <div className="dash-card-icon">⏰</div>
          <div className="dash-card-label">Batch</div>
          <div className="dash-card-value">{student.Timing || "TBD"}</div>
        </div>

        <div className="dash-card">
          <div className="dash-card-icon">✅</div>
          <div className="dash-card-label">Status</div>
          <div className="dash-card-value approved">{student.status}</div>
        </div>

        <div className="dash-card">
          <div className="dash-card-icon">👨‍🏫</div>
          <div className="dash-card-label">Mentor</div>
          <div className="dash-card-value">
            {assignedMentor ? assignedMentor.name : "Not Assigned"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
