import React, { useEffect, useState } from "react";
import "../components/MentorDashboard.css";

const MentorProfile = () => {
  const currentMentor = JSON.parse(localStorage.getItem("currentMentor"));
  const [mentor, setMentor] = useState(currentMentor);
  const [editing, setEditing] = useState(false);

  const [form, setForm] = useState({
    name: currentMentor?.name || "",
    specialization: currentMentor?.specialization || "",
    email: currentMentor?.email || "",
    phone: currentMentor?.phone || "",
    experience: currentMentor?.experience || "",
    about: currentMentor?.about || "",
  });

  useEffect(() => {
    const fetchMentor = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/mentors");
        const data = await response.json();

        const freshMentor = data.find((m) => m.id === currentMentor.id);

        if (freshMentor) {
          setMentor(freshMentor);
          setForm({
            name: freshMentor.name || "",
            specialization: freshMentor.specialization || "",
            email: freshMentor.email || "",
            phone: freshMentor.phone || "",
            experience: freshMentor.experience || "",
            about: freshMentor.about || "",
          });
          localStorage.setItem("currentMentor", JSON.stringify(freshMentor));
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchMentor();
  }, [currentMentor.id]);

  const avatar = (form.name || "M").charAt(0).toUpperCase();

  const handleSave = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/mentors/${mentor.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        },
      );

      if (!response.ok) {
        alert("Profile update failed");
        return;
      }

      const updatedMentor = await response.json();

      setMentor(updatedMentor);
      localStorage.setItem("currentMentor", JSON.stringify(updatedMentor));
      setEditing(false);
      alert("Profile updated!");
    } catch (error) {
      console.log(error);
      alert("Backend not connected");
    }
  };

  const handleCancel = () => {
    setForm({
      name: mentor?.name || "",
      specialization: mentor?.specialization || "",
      email: mentor?.email || "",
      phone: mentor?.phone || "",
      experience: mentor?.experience || "",
      about: mentor?.about || "",
    });
    setEditing(false);
  };

  const fields = [
    { label: "Full Name", key: "name", editable: false },
    { label: "Specialization", key: "specialization", editable: false },
    { label: "Email", key: "email", editable: false },
    { label: "Phone", key: "phone", editable: true },
    { label: "Experience", key: "experience", editable: true },
  ];

  return (
    <div>
      <div className="mentor-page-header">
        <h2 className="page-title">My Profile</h2>
      </div>

      <p className="page-sub">Your mentor account information</p>

      <div
        style={{
          background: "var(--card)",
          border: "1px solid var(--border)",
          borderRadius: 14,
          padding: 28,
          maxWidth: 650,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 20,
            marginBottom: 28,
            paddingBottom: 24,
            borderBottom: "1px solid var(--border)",
          }}
        >
          <div
            style={{
              width: 70,
              height: 70,
              borderRadius: "50%",
              background: "linear-gradient(135deg, var(--accent), #A78BFA)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 28,
              fontWeight: 700,
              color: "#fff",
              flexShrink: 0,
            }}
          >
            {avatar}
          </div>

          <div>
            <div
              style={{
                fontSize: 20,
                fontWeight: 700,
                color: "var(--text)",
                marginBottom: 4,
              }}
            >
              {form.name}
            </div>

            <div
              style={{ fontSize: 13, color: "var(--muted)", marginBottom: 8 }}
            >
              {form.specialization}
            </div>

            <span className="mentor-badge active">Mentor</span>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 0,
            marginBottom: 24,
          }}
        >
          {fields.map(({ label, key, editable }) => (
            <div
              key={key}
              style={{
                padding: "12px 0",
                borderBottom: "1px solid var(--border)",
                paddingRight: 20,
              }}
            >
              <div
                style={{
                  fontSize: 10,
                  color: "var(--muted)",
                  textTransform: "uppercase",
                  letterSpacing: "0.8px",
                  marginBottom: 4,
                }}
              >
                {label}
              </div>

              {editing && editable ? (
                <input
                  className="mentor-input"
                  value={form[key]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  style={{ marginTop: 4 }}
                />
              ) : (
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 500,
                    color: "var(--text)",
                  }}
                >
                  {form[key] || "—"}
                </div>
              )}
            </div>
          ))}
        </div>

        <div style={{ marginBottom: 24 }}>
          <div
            style={{
              fontSize: 10,
              color: "var(--muted)",
              textTransform: "uppercase",
              letterSpacing: "0.8px",
              marginBottom: 8,
            }}
          >
            About
          </div>

          {editing ? (
            <textarea
              className="mentor-input"
              rows={3}
              value={form.about}
              onChange={(e) => setForm({ ...form, about: e.target.value })}
            />
          ) : (
            <div
              style={{ fontSize: 14, color: "var(--muted)", lineHeight: 1.7 }}
            >
              {form.about || "—"}
            </div>
          )}
        </div>

        <div style={{ display: "flex", gap: 12 }}>
          {editing ? (
            <>
              <button className="mentor-btn-primary" onClick={handleSave}>
                Save Changes
              </button>
              <button className="mentor-btn-cancel" onClick={handleCancel}>
                Cancel
              </button>
            </>
          ) : (
            <button
              className="mentor-btn-primary"
              onClick={() => setEditing(true)}
            >
              ✏️ Edit Profile
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MentorProfile;
