import React, { useEffect, useState } from "react";
import "../components/AdDashboard.css";
import { authFetch } from "../utils/api";
import { showToast } from "../components/Toast";

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({
    name: "",
    duration: "",
    fee: "",
    description: "",
  });

  const fetchCourses = async () => {
    try {
      const response = await authFetch("/api/courses");
      const data = await response.json();
      setCourses(data);
    } catch (error) {
      console.log(error);
      showToast("Failed to load courses. Please check backend connection.", "error");
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const openAdd = () => {
    setEditId(null);
    setForm({ name: "", duration: "", fee: "", description: "" });
    setShowModal(true);
  };

  const openEdit = (course) => {
    setEditId(course.id);
    setForm({
      name: course.name,
      duration: course.duration,
      fee: course.fee,
      description: course.description,
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.name.trim()) {
      showToast("Course name is required.", "warning");
      return;
    }

    const courseData = {
      name: form.name,
      duration: form.duration,
      fee: Number(form.fee),
      description: form.description,
    };

    try {
      const url = editId
        ? `/api/courses/${editId}`
        : "/api/courses";

      const method = editId ? "PUT" : "POST";

      const response = await authFetch(url, {
        method: method,
        body: JSON.stringify(courseData),
      });

      if (!response.ok) {
        showToast("Failed to save course details.", "error");
        return;
      }

      await fetchCourses();
      setShowModal(false);
      showToast(editId ? "Course updated successfully!" : "New course added successfully!", "success");
    } catch (error) {
      console.log(error);
      showToast("Unable to connect to backend server.", "error");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this course?")) {
      return;
    }

    try {
      const response = await authFetch(`/api/courses/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        showToast("Failed to delete course.", "error");
        return;
      }

      await fetchCourses();
      showToast("Course deleted successfully!", "success");
    } catch (error) {
      console.log(error);
      showToast("Unable to connect to backend server.", "error");
    }
  };

  const colors = [
    "#6C63FF",
    "#22C55E",
    "#F59E0B",
    "#EF4444",
    "#38BDF8",
    "#A78BFA",
  ];

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
        <h2 className="page-title">Courses</h2>
        <button className="admin-btn-primary" onClick={openAdd}>
          + Add Course
        </button>
      </div>

      <p className="page-sub">Manage all available courses</p>

      {courses.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            color: "var(--muted)",
            padding: "48px",
          }}
        >
          No courses added yet - click Add Course!
        </div>
      ) : (
        <div className="course-grid">
          {courses.map((c, i) => (
            <div
              className="course-card"
              key={c.id}
              style={{ borderTop: `3px solid ${colors[i % colors.length]}` }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 12,
                }}
              >
                <h3 className="course-card-title">{c.name}</h3>
                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    className="admin-btn-edit"
                    onClick={() => openEdit(c)}
                  >
                    Edit
                  </button>
                  <button
                    className="admin-btn-reject"
                    onClick={() => handleDelete(c.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>

              <div className="course-meta">{c.duration}</div>
              <div className="course-meta">Rs.{c.fee}</div>
              <div className="course-desc">{c.description}</div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <>
          <div className="admin-overlay" onClick={() => setShowModal(false)} />
          <div className="admin-modal">
            <h3 className="admin-modal-title">
              {editId ? "Edit Course" : "Add Course"}
            </h3>

            <div className="admin-form-group">
              <label>Course Name</label>
              <input
                className="admin-input"
                placeholder="e.g. FullStack"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>

            <div className="admin-form-row">
              <div className="admin-form-group">
                <label>Duration</label>
                <input
                  className="admin-input"
                  placeholder="e.g. 6 months"
                  value={form.duration}
                  onChange={(e) =>
                    setForm({ ...form, duration: e.target.value })
                  }
                />
              </div>

              <div className="admin-form-group">
                <label>Fee</label>
                <input
                  className="admin-input"
                  placeholder="e.g. 30000"
                  value={form.fee}
                  onChange={(e) => setForm({ ...form, fee: e.target.value })}
                />
              </div>
            </div>

            <div className="admin-form-group">
              <label>Description</label>
              <textarea
                className="admin-input"
                rows={3}
                placeholder="e.g. HTML, CSS, React, Node.js"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
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
                className="admin-btn-cancel"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button className="admin-btn-primary" onClick={handleSave}>
                Save
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Courses;
