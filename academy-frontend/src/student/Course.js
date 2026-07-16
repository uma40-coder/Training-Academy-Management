import React, { useEffect, useState } from "react";

const Course = () => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const [student, setStudent] = useState(null);
  const [course, setCourse] = useState(null);
  const [mentor, setMentor] = useState(null);

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

        setStudent(freshStudent);

        const coursesResponse = await fetch(
          "http://localhost:8080/api/courses",
        );
        const coursesData = await coursesResponse.json();

        const selectedCourse = coursesData.find(
          (c) => c.name === freshStudent?.course,
        );

        setCourse(selectedCourse);

        const mentorsResponse = await fetch(
          "http://localhost:8080/api/mentors",
        );
        const mentorsData = await mentorsResponse.json();

        const assignedMentor = mentorsData.find(
          (m) => m.id === freshStudent?.assignedMentor,
        );

        setMentor(assignedMentor);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [currentUser.Email]);

  if (!student) {
    return (
      <div className="dashboard-container">
        <h2 className="page-title">My Course</h2>
        <p className="page-sub">Loading course details...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <h2 className="page-title">My Course</h2>
      <p className="page-sub">Your enrolled course details</p>

      <div className="dash-cards">
        <div className="dash-card">
          <div className="dash-card-icon">📚</div>
          <div className="dash-card-label">Course</div>
          <div className="dash-card-value">{student.course}</div>
        </div>

        <div className="dash-card">
          <div className="dash-card-icon">⏳</div>
          <div className="dash-card-label">Duration</div>
          <div className="dash-card-value">
            {course ? course.duration : "TBD"}
          </div>
        </div>

        <div className="dash-card">
          <div className="dash-card-icon">💰</div>
          <div className="dash-card-label">Fee</div>
          <div className="dash-card-value">
            {course ? `₹${course.fee}` : "TBD"}
          </div>
        </div>

        <div className="dash-card">
          <div className="dash-card-icon">👨‍🏫</div>
          <div className="dash-card-label">Mentor</div>
          <div className="dash-card-value">
            {mentor ? mentor.name : "Not Assigned"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Course;
