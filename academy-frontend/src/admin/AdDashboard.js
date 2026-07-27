import React, { useEffect, useState } from "react";
import "../components/AdDashboard.css";
import { authFetch } from "../utils/api";
import { showToast } from "../components/Toast";
import { FaChalkboardTeacher } from "react-icons/fa";
import { PiStudentBold } from "react-icons/pi";
import { FaBook } from "react-icons/fa6";


const AdDashboard = () => {
  const [students, setStudents] = useState([]);
  const [mentors, setMentors] = useState([]);
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const studentsResponse = await authFetch("/api/students");
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

        const mentorsResponse = await authFetch("/api/mentors");
        const mentorsData = await mentorsResponse.json();
        setMentors(mentorsData);

        const coursesResponse = await authFetch("/api/courses");
        const coursesData = await coursesResponse.json();
        setCourses(coursesData);
      } catch (error) {
        console.log(error);
        showToast("Failed to load dashboard data. Please check backend connection.", "error");
      }
    };

    fetchDashboardData();
  }, []);

  const total = students.length;
  const pending = students.filter((s) => s.status === "pending").length;
  const approved = students.filter((s) => s.status === "approved").length;
  const rejected = students.filter((s) => s.status === "rejected").length;

  const totalStatusVal = approved + pending + rejected || 1;
  const approvedPct = Math.round((approved / totalStatusVal) * 100);
  const pendingPct = Math.round((pending / totalStatusVal) * 100);
  const rejectedPct = Math.round((rejected / totalStatusVal) * 100);

  // Group by Course
  const courseCounts = {};
  students.forEach((s) => {
    const courseName = s.Course || "Unknown";
    courseCounts[courseName] = (courseCounts[courseName] || 0) + 1;
  });

  courses.forEach((c) => {
    if (!courseCounts[c.name]) {
      courseCounts[c.name] = 0;
    }
  });

  const courseData = Object.entries(courseCounts)
    .map(([name, count]) => ({
      name,
      count,
    }))
    .sort((a, b) => b.count - a.count);

  const maxCourseCount = Math.max(...courseData.map((d) => d.count), 1);

  return (
    <div className="dashboard-container">
      <div className="dash-header-row">
        <div>
          <h2 className="page-title">Admin Dashboard</h2>
          <p className="page-sub">Overview of academy performance & enrollments</p>
        </div>
      </div>

      {/* Top Hero Metrics Bar */}
      <div className="hero-metrics-bar">
        <div className="hero-metric-pod students-pod">
          <div className="pod-icon-wrap">
            <span className="pod-icon"><PiStudentBold /></span>
          </div>
          <div className="pod-content">
            <span className="pod-label">Total Registered</span>
            <span className="pod-value">{total}</span>
          </div>
        </div>

        <div className="pod-divider" />

        <div className="hero-metric-pod mentors-pod">
          <div className="pod-icon-wrap">
            <span className="pod-icon"><FaChalkboardTeacher /></span>
          </div>
          <div className="pod-content">
            <span className="pod-label">Active Mentors</span>
            <span className="pod-value">{mentors.length}</span>
          </div>
        </div>

        <div className="pod-divider" />

        <div className="hero-metric-pod courses-pod">
          <div className="pod-icon-wrap">
            <span className="pod-icon"><FaBook /></span>
          </div>
          <div className="pod-content">
            <span className="pod-label">Available Courses</span>
            <span className="pod-value">{courses.length}</span>
          </div>
        </div>
      </div>

      {/* Visualizations Section */}
      <div className="admin-visual-grid">
        {/* Creative Concentric Activity-Ring Meter */}
        <div className="visual-panel radial-panel">
          <div className="panel-title">
            <h3>Application Status Radial Meter</h3>
            <span className="sub-tag">Live Ratios</span>
          </div>

          <div className="radial-meter-container">
            <div className="radial-svg-wrap">
              <svg viewBox="0 0 160 160" className="radial-meter-svg">
                {/* Track 1: Approved (Outer) */}
                <circle cx="80" cy="80" r="56" className="radial-track" />
                <circle
                  cx="80"
                  cy="80"
                  r="56"
                  className="radial-ring approved-ring"
                  strokeDasharray="351.86"
                  strokeDashoffset={351.86 - (351.86 * (approved / totalStatusVal))}
                  transform="rotate(-90 80 80)"
                />

                {/* Track 2: Pending (Middle) */}
                <circle cx="80" cy="80" r="42" className="radial-track" />
                <circle
                  cx="80"
                  cy="80"
                  r="42"
                  className="radial-ring pending-ring"
                  strokeDasharray="263.89"
                  strokeDashoffset={263.89 - (263.89 * (pending / totalStatusVal))}
                  transform="rotate(-90 80 80)"
                />

                {/* Track 3: Rejected (Inner) */}
                <circle cx="80" cy="80" r="28" className="radial-track" />
                <circle
                  cx="80"
                  cy="80"
                  r="28"
                  className="radial-ring rejected-ring"
                  strokeDasharray="175.93"
                  strokeDashoffset={175.93 - (175.93 * (rejected / totalStatusVal))}
                  transform="rotate(-90 80 80)"
                />
              </svg>

              <div className="radial-center-badge">
                <span className="radial-center-num">{total}</span>
                <span className="radial-center-text">Applicants</span>
              </div>
            </div>

            <div className="radial-legend-list">
              <div className="radial-legend-item approved-item">
                <div className="legend-indicator">
                  <span className="dot" />
                  <span className="legend-label">Approved</span>
                </div>
                <div className="legend-val-box">
                  <strong>{approved}</strong>
                  <span className="pct">{approvedPct}%</span>
                </div>
              </div>

              <div className="radial-legend-item pending-item">
                <div className="legend-indicator">
                  <span className="dot" />
                  <span className="legend-label">Pending</span>
                </div>
                <div className="legend-val-box">
                  <strong>{pending}</strong>
                  <span className="pct">{pendingPct}%</span>
                </div>
              </div>

              <div className="radial-legend-item rejected-item">
                <div className="legend-indicator">
                  <span className="dot" />
                  <span className="legend-label">Rejected</span>
                </div>
                <div className="legend-val-box">
                  <strong>{rejected}</strong>
                  <span className="pct">{rejectedPct}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Horizontal Progress Gauge Leaderboard */}
        <div className="visual-panel course-panel">
          <div className="panel-title">
            <h3>Course Enrollment Gauge</h3>
            <span className="sub-tag">Density Metrics</span>
          </div>

          <div className="course-meters-list">
            {courseData.length === 0 ? (
              <div className="no-data-msg">No course enrollment data found</div>
            ) : (
              courseData.map((item, idx) => {
                const pct = (item.count / maxCourseCount) * 100;
                const isTop = idx === 0 && item.count > 0;
                return (
                  <div className={`course-meter-row ${isTop ? "is-top-course" : ""}`} key={item.name}>
                    <div className="meter-head">
                      <div className="meter-left">
                        <span className="meter-rank-num">0{idx + 1}</span>
                        <span className="meter-course-name">{item.name}</span>
                        {isTop && <span className="top-enroll-badge"> Highest Demand</span>}
                      </div>
                      <div className="meter-count-tag">
                        <strong>{item.count}</strong> enrolled
                      </div>
                    </div>

                    <div className="meter-progress-track">
                      <div
                        className="meter-progress-fill"
                        style={{ width: `${pct}%` }}
                      >
                        <span className="meter-glow-line" />
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
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
