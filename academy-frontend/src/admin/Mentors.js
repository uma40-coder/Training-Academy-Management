import React, { useEffect, useState } from "react";
import "../components/AdDashboard.css";
import { authFetch } from "../utils/api";
import { showToast } from "../components/Toast";

const Mentors = () => {
  const [mentors, setMentors] = useState([]);
  const [students, setStudents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);

  const [form, setForm] = useState({
    name: "",
    specialization: "",
    email: "",
    phone: "",
    experience: "",
    about: "",
  });

  const fetchMentors = async () => {
    try {
      const response = await authFetch("/api/mentors");
      const data = await response.json();
      setMentors(data);
    } catch (error) {
      console.log(error);
      showToast("Failed to load mentor list. Please check backend connection.", "error");
    }
  };

  const fetchStudents = async () => {
    try {
      const response = await authFetch("/api/students");
      const data = await response.json();
      setStudents(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchMentors();
    fetchStudents();
  }, []);

  const colors = [
    "#6C63FF",
    "#22C55E",
    "#F59E0B",
    "#EF4444",
    "#38BDF8",
    "#A78BFA",
  ];

  const getInitials = (name) =>
    name
      ? name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
      : "";

  const getStudentCount = (mentorId) =>
    students.filter((s) => s.assignedMentor === mentorId).length;

  const openAdd = () => {
    setEditId(null);
    setForm({
      name: "",
      specialization: "",
      email: "",
      phone: "",
      experience: "",
      about: "",
    });
    setShowModal(true);
  };

  const openEdit = (mentor) => {
    setEditId(mentor.id);
    setForm({
      name: mentor.name,
      specialization: mentor.specialization,
      email: mentor.email,
      phone: mentor.phone,
      experience: mentor.experience,
      about: mentor.about,
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.name.trim()) {
      showToast("Mentor name is required.", "warning");
      return;
    }

    try {
      const url = editId
        ? `/api/mentors/${editId}`
        : "/api/mentors";

      const method = editId ? "PUT" : "POST";

      const response = await authFetch(url, {
        method: method,
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        showToast(errorMessage || "Failed to save mentor details.", "error");
        return;
      }

      await fetchMentors();
      setShowModal(false);
      showToast(editId ? "Mentor profile updated!" : "New mentor added successfully!", "success");
    } catch (error) {
      console.log(error);
      showToast("Unable to connect to backend server.", "error");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this mentor?")) {
      return;
    }

    try {
      const response = await authFetch(`/api/mentors/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        showToast("Failed to delete mentor.", "error");
        return;
      }

      await fetchMentors();
      showToast("Mentor deleted successfully!", "success");
    } catch (error) {
      console.log(error);
      showToast("Unable to connect to backend server.", "error");
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
        <h2 className="page-title">Mentors</h2>
        <button className="admin-btn-primary" onClick={openAdd}>
          + Add Mentor
        </button>
      </div>

      <p className="page-sub">Manage all mentors and their assignments</p>

      <div className="admin-table-box">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Specialization</th>
              <th>Email</th>
              <th>Experience</th>
              <th>Students</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {mentors.length === 0 ? (
              <tr>
                <td
                  colSpan="6"
                  style={{
                    textAlign: "center",
                    color: "var(--muted)",
                    padding: "32px",
                  }}
                >
                  No mentors added yet!
                </td>
              </tr>
            ) : (
              mentors.map((m, i) => (
                <tr key={m.id}>
                  <td>
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 10 }}
                    >
                      <div
                        className="admin-avatar"
                        style={{ background: colors[i % colors.length] }}
                      >
                        {getInitials(m.name)}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600 }}>{m.name}</div>
                        <div style={{ fontSize: 11, color: "var(--muted)" }}>
                          {m.email}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td>
                    <span className="admin-tag">{m.specialization}</span>
                  </td>

                  <td style={{ color: "var(--muted)", fontSize: 12 }}>
                    {m.email}
                  </td>

                  <td style={{ color: "var(--muted)", fontSize: 12 }}>
                    {m.experience}
                  </td>

                  <td>
                    <span className="admin-badge active">
                      {getStudentCount(m.id)} students
                    </span>
                  </td>

                  <td>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button
                        className="admin-btn-edit"
                        onClick={() => openEdit(m)}
                      >
                        Edit
                      </button>

                      <button
                        className="admin-btn-reject"
                        onClick={() => handleDelete(m.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <>
          <div className="admin-overlay" onClick={() => setShowModal(false)} />

          <div className="admin-modal">
            <h3 className="admin-modal-title">
              {editId ? "Edit Mentor" : "Add Mentor"}
            </h3>

            <div className="admin-form-row">
              <div className="admin-form-group">
                <label>Name</label>
                <input
                  className="admin-input"
                  placeholder="e.g. Ravi Kumar"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>

              <div className="admin-form-group">
                <label>Specialization</label>
                <input
                  className="admin-input"
                  placeholder="e.g. Java Full Stack"
                  value={form.specialization}
                  onChange={(e) =>
                    setForm({ ...form, specialization: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="admin-form-row">
              <div className="admin-form-group">
                <label>Email</label>
                <input
                  className="admin-input"
                  placeholder="e.g. ravi@academy.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>

              <div className="admin-form-group">
                <label>Phone</label>
                <input
                  className="admin-input"
                  placeholder="e.g. 9999999999"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
              </div>
            </div>

            <div className="admin-form-row">
              <div className="admin-form-group">
                <label>Experience</label>
                <input
                  className="admin-input"
                  placeholder="e.g. 5 Years"
                  value={form.experience}
                  onChange={(e) =>
                    setForm({ ...form, experience: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="admin-form-group">
              <label>About</label>
              <textarea
                className="admin-input"
                rows={3}
                placeholder="Brief description about mentor..."
                value={form.about}
                onChange={(e) => setForm({ ...form, about: e.target.value })}
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

export default Mentors;
