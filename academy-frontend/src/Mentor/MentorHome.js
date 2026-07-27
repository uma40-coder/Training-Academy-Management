import React, { useEffect, useState } from "react";
import "../components/MentorDashboard.css";
import "../components/AdDashboard.css";
import { authFetch } from "../utils/api";
import { showToast } from "../components/Toast";
import { PiStudentBold } from "react-icons/pi";
import { FaHourglassHalf } from "react-icons/fa";
import { TiTick } from "react-icons/ti";

const MentorHome = () => {
  const currentMentor = JSON.parse(localStorage.getItem("currentMentor"));
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await authFetch("/api/students");
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
        showToast("Failed to load assigned students. Please check backend connection.", "error");
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

  const totalCount = myStudents.length;
  const pendingCount = pending.length;
  const approvedCount = approved.length;
  const rejectedCount = rejected.length;
  const reviewedCount = reviewed.length;

  const totalStatusVal = totalCount || 1;
  const approvedPct = Math.round((approvedCount / totalStatusVal) * 100);
  const pendingPct = Math.round((pendingCount / totalStatusVal) * 100);
  const rejectedPct = Math.round((rejectedCount / totalStatusVal) * 100);
  const completionPct = Math.round((reviewedCount / totalStatusVal) * 100);

  // Group assigned students by Batch Timing (Standard Slots)
  const timingSlots = ["9 AM - 11 AM", "11 AM - 1 PM", "2 PM - 4 PM", "4 PM - 6 PM"];
  const timingCounts = {
    "9 AM - 11 AM": 0,
    "11 AM - 1 PM": 0,
    "2 PM - 4 PM": 0,
    "4 PM - 6 PM": 0,
  };

  const normalizeTiming = (t) => {
    if (!t) return "2 PM - 4 PM";
    const str = t.trim();
    if (str === "2 AM - 4 PM" || str === "2 AM-4 PM" || str === "2AM - 4PM") return "2 PM - 4 PM";
    if (str === "6 PM - 8 PM" || str === "6 PM-8 PM") return "4 PM - 6 PM";
    return timingSlots.includes(str) ? str : "2 PM - 4 PM";
  };

  myStudents.forEach((s) => {
    const slot = normalizeTiming(s.Timing);
    timingCounts[slot] = (timingCounts[slot] || 0) + 1;
  });

  const timingData = timingSlots.map((name) => ({
    name,
    count: timingCounts[name],
  }));

  const maxTimingCount = Math.max(...timingData.map((d) => d.count), 1);

  return (
    <div>
      <div className="mentor-page-header">
        <div>
          <h2 className="page-title">Dashboard</h2>
          <p className="page-sub">
            Welcome back, {currentMentor?.name}! Here is your student review & workload overview.
          </p>
        </div>
      </div>

      {/* Hero Metrics Pods */}
      <div className="hero-metrics-bar">
        <div className="hero-metric-pod students-pod">
          <div className="pod-icon-wrap">
            <span className="pod-icon"><PiStudentBold /></span>
          </div>
          <div className="pod-content">
            <span className="pod-label">Assigned Students</span>
            <span className="pod-value">{totalCount}</span>
          </div>
        </div>

        <div className="pod-divider" />

        <div className="hero-metric-pod mentors-pod">
          <div className="pod-icon-wrap">
            <span className="pod-icon"><FaHourglassHalf /></span>
          </div>
          <div className="pod-content">
            <span className="pod-label">Pending Reviews</span>
            <span className="pod-value" style={{ color: "var(--warning)" }}>{pendingCount}</span>
          </div>
        </div>

        <div className="pod-divider" />

        <div className="hero-metric-pod courses-pod">
          <div className="pod-icon-wrap">
            <span className="pod-icon"><TiTick /></span>
          </div>
          <div className="pod-content">
            <span className="pod-label">Completed Reviews</span>
            <span className="pod-value" style={{ color: "var(--success)" }}>{reviewedCount}</span>
          </div>
        </div>
      </div>

      {/* Visual Graph Panels Row */}
      <div className="admin-visual-grid" style={{ marginBottom: "28px" }}>
        {/* Concentric Review Status Radial Meter */}
        <div className="visual-panel radial-panel">
          <div className="panel-title">
            <h3>Review Status Gauge</h3>
            <span className="sub-tag">{completionPct}% Complete</span>
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
                  strokeDashoffset={351.86 - (351.86 * (approvedCount / totalStatusVal))}
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
                  strokeDashoffset={263.89 - (263.89 * (pendingCount / totalStatusVal))}
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
                  strokeDashoffset={175.93 - (175.93 * (rejectedCount / totalStatusVal))}
                  transform="rotate(-90 80 80)"
                />
              </svg>

              <div className="radial-center-badge">
                <span className="radial-center-num">{completionPct}%</span>
                <span className="radial-center-text">Reviewed</span>
              </div>
            </div>

            <div className="radial-legend-list">
              <div className="radial-legend-item approved-item">
                <div className="legend-indicator">
                  <span className="dot" />
                  <span className="legend-label">Approved</span>
                </div>
                <div className="legend-val-box">
                  <strong>{approvedCount}</strong>
                  <span className="pct">{approvedPct}%</span>
                </div>
              </div>

              <div className="radial-legend-item pending-item">
                <div className="legend-indicator">
                  <span className="dot" />
                  <span className="legend-label">Pending</span>
                </div>
                <div className="legend-val-box">
                  <strong>{pendingCount}</strong>
                  <span className="pct">{pendingPct}%</span>
                </div>
              </div>

              <div className="radial-legend-item rejected-item">
                <div className="legend-indicator">
                  <span className="dot" />
                  <span className="legend-label">Rejected</span>
                </div>
                <div className="legend-val-box">
                  <strong>{rejectedCount}</strong>
                  <span className="pct">{rejectedPct}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Horizontal Progress Gauge for Batch Timings */}
        <div className="visual-panel course-panel">
          <div className="panel-title">
            <h3>Batch Timing Workload</h3>
            <span className="sub-tag">Batch Density</span>
          </div>

          <div className="course-meters-list">
            {timingData.length === 0 ? (
              <div className="no-data-msg">No assigned students to display</div>
            ) : (
              timingData.map((item, idx) => {
                const pct = (item.count / maxTimingCount) * 100;
                const isTop = item.count === maxTimingCount && maxTimingCount > 0;
                return (
                  <div className={`course-meter-row ${isTop ? "is-top-course" : ""}`} key={item.name}>
                    <div className="meter-head">
                      <div className="meter-left">
                        <span className="meter-rank-num">0{idx + 1}</span>
                        <span className="meter-course-name"> {item.name}</span>
                        {isTop && <span className="top-enroll-badge">Largest Batch</span>}
                      </div>
                      <div className="meter-count-tag">
                        <strong>{item.count}</strong> students
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
