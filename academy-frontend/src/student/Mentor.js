import React, { useEffect, useState } from "react";
import { FaChalkboardTeacher } from "react-icons/fa";
import { authFetch } from "../utils/api";

const Mentor = () => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const [student, setStudent] = useState(null);
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const studentsResponse = await authFetch("/api/students");
        const studentsData = await studentsResponse.json();

        const freshStudent = studentsData.find(
          (s) => s.email === currentUser.Email,
        );

        if (freshStudent) {
          setStudent(freshStudent);
        }

        const mentorsResponse = await authFetch("/api/mentors");
        const mentorsData = await mentorsResponse.json();

        setMentors(mentorsData);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentUser.Email]);


  if (loading) {
    return (
      <div className="mentor-container">
        <h2 className="page-title">My Mentor</h2>
        <div className="no-mentor-card">
          <h3>Loading mentor details...</h3>
        </div>
      </div>
    );
  }

  const mentor = mentors.find((m) => m.id === student?.assignedMentor);

  if (!mentor) {
    return (
      <div className="mentor-container">
        <h2 className="page-title">My Mentor</h2>
        <div className="no-mentor-card">
          <div className="no-mentor-icon">👨<FaChalkboardTeacher /></div>
          <h3>No Mentor Assigned Yet</h3>
          <p>Admin will assign your mentor soon!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mentor-container">
      <h2 className="page-title">My Mentor</h2>
      <p className="page-sub">Your assigned mentor information</p>

      <div className="mentor-profile-card">
        <div className="mentor-profile-top">
          <div
            className="mentor-photo"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "linear-gradient(135deg, var(--accent), #A78BFA)",
              color: "#fff",
              fontSize: 28,
              fontWeight: 700,
            }}
          >
            {(mentor.name || "M").charAt(0).toUpperCase()}
          </div>

          <div>
            <h3 className="mentor-profile-name">{mentor.name || "Mentor"}</h3>
            <p className="mentor-profile-spec">
              {mentor.specialization || "Not specified"}
            </p>
            <span className="mentor-exp-badge">{mentor.experience}</span>
          </div>
        </div>

        <div className="mentor-about">
          <div className="mentor-section-label">About</div>
          <p className="mentor-about-text">{mentor.about}</p>
        </div>

        <div className="mentor-details-grid">
          <div className="mentor-detail-item">
            <div className="mentor-detail-label">Email</div>
            <div className="mentor-detail-value">{mentor.email}</div>
          </div>

          <div className="mentor-detail-item">
            <div className="mentor-detail-label">Phone</div>
            <div className="mentor-detail-value">{mentor.phone}</div>
          </div>

          <div className="mentor-detail-item">
            <div className="mentor-detail-label">Experience</div>
            <div className="mentor-detail-value">{mentor.experience}</div>
          </div>

          <div className="mentor-detail-item">
            <div className="mentor-detail-label">Specialization</div>
            <div className="mentor-detail-value">{mentor.specialization}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Mentor;
