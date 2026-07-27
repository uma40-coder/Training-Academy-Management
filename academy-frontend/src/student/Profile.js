import React, { useEffect, useState } from "react";
import { authFetch } from "../utils/api";
import { showToast } from "../components/Toast";
import { MdEdit } from "react-icons/md";

const Profile = () => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const [user, setUser] = useState(currentUser);
  const [editing, setEditing] = useState(false);

  const [form, setForm] = useState({
    Fname: currentUser.Fname,
    Lname: currentUser.Lname,
    Email: currentUser.Email,
    Phone: currentUser.Phone || "",
  });

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const response = await authFetch("/api/students");
        const data = await response.json();

        const freshStudent = data.find((s) => s.email === currentUser.Email);

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

          setUser(formattedUser);
          setForm({
            Fname: formattedUser.Fname,
            Lname: formattedUser.Lname,
            Email: formattedUser.Email,
            Phone: formattedUser.Phone || "",
          });

          localStorage.setItem("currentUser", JSON.stringify(formattedUser));
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchStudent();
  }, [currentUser.Email]);

 const stud_avatar = (user?.Fname || "S").charAt(0).toUpperCase();

 function initCap(str) {
   if (!str) return "";
   return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
 }

 const handleSave = async () => {
   try {
     const response = await authFetch(
       `/api/students/${user.id}/profile`,
       {
         method: "PUT",
         body: JSON.stringify({
           firstName: form.Fname,
           lastName: form.Lname,
           phone: form.Phone,
         }),
       },
     );

     if (!response.ok) {
       const errorMessage = await response.text();
       console.log(errorMessage);
       showToast("Failed to update profile.", "error");
       return;
     }

     const updated = await response.json();

     const formattedUser = {
       ...user,
       Fname: updated.firstName,
       Lname: updated.lastName,
       Phone: updated.phone,
     };

     setUser(formattedUser);
     localStorage.setItem("currentUser", JSON.stringify(formattedUser));
     setEditing(false);
     showToast("Profile updated successfully!", "success");
   } catch (error) {
     console.log(error);
     showToast("Unable to connect to backend server.", "error");
   }
 };

  const handleCancel = () => {
    setForm({
      Fname: user.Fname,
      Lname: user.Lname,
      Email: user.Email,
      Phone: user.Phone || "",
    });
    setEditing(false);
  };

  return (
    <div className="profile-container">
      <div className="profile-content">
        <h2 className="page-title">My Profile</h2>
        <p className="page-sub">Your account information</p>

        <div className="profile-card">
          <div className="profile-top">
            <div className="profile-avatar">{stud_avatar}</div>
            <div>
              <h3 className="profile-name">
                {initCap(user.Fname)} {initCap(user.Lname)}
              </h3>
              <p className="profile-course">{user.Course}</p>
              <span className="profile-status-badge">
                {user.status === "pending" ? "⏳ Pending" : "✅ Active"}
              </span>
            </div>
          </div>

          <div className="profile-fields">
            {[
              { label: "First Name", key: "Fname", editable: true },
              { label: "Last Name", key: "Lname", editable: true },
              { label: "Email", key: "Email", editable: false },
              { label: "Phone", key: "Phone", editable: true },
              { label: "Course", key: "Course", editable: false },
              { label: "Batch", key: "Timing", editable: false },
            ].map(({ label, key, editable }) => (
              <div key={key} className="profile-field">
                <div className="profile-field-label">{label}</div>
                {editing && editable ? (
                  <input
                    className="profile-input"
                    value={form[key] || ""}
                    onChange={(e) =>
                      setForm({ ...form, [key]: e.target.value })
                    }
                  />
                ) : (
                  <div className="profile-field-value">{user[key] || "—"}</div>
                )}
              </div>
            ))}
          </div>

          <div className="profile-btn-row">
            {editing ? (
              <>
                <button className="btn-primary" onClick={handleSave}>
                  Save Changes
                </button>
                <button className="btn-outline" onClick={handleCancel}>
                  Cancel
                </button>
              </>
            ) : (
              <button className="btn-primary" onClick={() => setEditing(true)}>
                <MdEdit /> Edit Profile
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
