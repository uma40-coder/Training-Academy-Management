import React, { useEffect, useState } from "react";
import "../components/AdDashboard.css";

const Request = () => {
 const [students, setStudents] = useState([]);

 const fetchStudents = async () => {
   try {
     const response = await fetch("http://localhost:8080/api/students");
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
     }));

     setStudents(formatted);
   } catch (error) {
     console.log(error);
     alert("Students load aagala. Backend check pannunga.");
   }
 };

 useEffect(() => {
   fetchStudents();
 }, []);
  // ---------------------------------------------
  // State add pannunga
  const [notifModal, setNotifModal] = useState(false);
  const [notifStudent, setNotifStudent] = useState(null);
  const [notifMessage, setNotifMessage] = useState("");

  // Open modal
  const openNotify = (student) => {
    setNotifStudent(student);
    setNotifMessage(
      `Hi ${student.Fname}! Your admission is approved. Welcome to NexAcademy! 🎉`,
    );
    setNotifModal(true);
  };

  // Send
const sendNotification = async () => {
  if (!notifMessage.trim()) {
    alert("Message required!");
    return;
  }

  try {
    const response = await fetch("http://localhost:8080/api/notifications", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        type: "Announcement",
        target: `Student:${notifStudent.Email}`,
        message: notifMessage,
      }),
    });

    if (!response.ok) {
      alert("Notification send failed");
      return;
    }

    alert(`Notification sent to ${notifStudent.Fname}!`);
    setNotifModal(false);
    setNotifMessage("");
    setNotifStudent(null);
  } catch (error) {
    console.log(error);
    alert("Backend not connected");
  }
};

  // ---------------------------------------------

  const pending = students.filter((s) => s.status === "pending");

 const updateStatus = async (email, status) => {
   const student = students.find((s) => s.Email === email);

   if (!student) {
     alert("Student not found");
     return;
   }

   try {
     const response = await fetch(
       `http://localhost:8080/api/students/${student.id}/status`,
       {
         method: "PUT",
         headers: {
           "Content-Type": "application/json",
         },
         body: JSON.stringify({ status: status }),
       },
     );

     if (!response.ok) {
       alert("Status update failed");
       return;
     }

     await fetchStudents();

     const currentUser = JSON.parse(localStorage.getItem("currentUser"));
     if (currentUser && currentUser.Email === email) {
       localStorage.setItem(
         "currentUser",
         JSON.stringify({ ...currentUser, status }),
       );
     }
   } catch (error) {
     console.log(error);
     alert("Backend not connected");
   }
 };

  return (
    <div className="dashboard-container">
      {/* Header — title left, count right */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 6,
        }}
      >
        <h2 className="page-title">Student Requests</h2>
        {/* <span className="admin-badge pending">{pending.length} pending</span> */}
      </div>
      <p className="page-sub">Approve or reject pending applications</p>
      {/* Pending Table */}
      <div className="admin-table-box">
        <div className="admin-table-head">
          <h3>Pending Applications</h3>
          <span className={`admin-badge pending`}>
            {pending.length} pending
          </span>
        </div>

        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Course</th>
              <th>Timing</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {pending.length === 0 ? (
              <tr>
                <td
                  colSpan="6"
                  style={{
                    textAlign: "center",
                    color: "var(--muted)",
                    padding: "32px",
                  }}
                >
                  ✅ No pending requests!
                </td>
              </tr>
            ) : (
              pending.map((s, i) => (
                <tr key={i}>
                  <td>
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 10 }}
                    >
                      <div className="admin-avatar">
                        {s.Fname.charAt(0).toUpperCase()}
                      </div>
                      {s.Fname} {s.Lname}
                    </div>
                  </td>
                  <td style={{ color: "var(--muted)", fontSize: 12 }}>
                    {s.Email}
                  </td>
                  <td>
                    <span className="admin-tag">{s.Course}</span>
                  </td>
                  <td style={{ color: "var(--muted)", fontSize: 12 }}>
                    {s.Timing}
                  </td>
                  <td>
                    <span className="admin-badge pending">Pending</span>
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button
                        className="admin-btn-approve"
                        onClick={() => updateStatus(s.Email, "approved")}
                      >
                        ✅ Approve
                      </button>
                      <button
                        className="admin-btn-reject"
                        onClick={() => updateStatus(s.Email, "rejected")}
                      >
                        ❌ Reject
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* All Students History */}
      <div className="admin-table-box">
        <div className="admin-table-head">
          <h3>All Students — Status History</h3>
        </div>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Course</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {students.length === 0 ? (
              <tr>
                <td
                  colSpan="3"
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
              students.map((s, i) => (
                <tr key={i}>
                  <td>
                    {s.Fname} {s.Lname}
                  </td>
                  <td>
                    <span className="admin-tag">{s.Course}</span>
                  </td>
                  <td>
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 8 }}
                    >
                      <span className={`admin-badge ${s.status}`}>
                        {s.status}
                      </span>
                      {s.status === "approved" && (
                        <button
                          className="admin-btn-primary"
                          style={{ padding: "3px 10px", fontSize: 11 }}
                          onClick={() => openNotify(s)}
                        >
                          📤 Notify
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Notify Modal — ADD THIS! */}
      {notifModal && (
        <>
          <div className="admin-overlay" onClick={() => setNotifModal(false)} />
          <div className="admin-modal">
            <h3 className="admin-modal-title">Send Notification</h3>
            <div
              style={{ marginBottom: 12, color: "var(--muted)", fontSize: 13 }}
            >
              To:{" "}
              <strong style={{ color: "var(--text)" }}>
                {notifStudent?.Fname} {notifStudent?.Lname}
              </strong>
            </div>
            <div className="admin-form-group">
              <label>Message</label>
              <textarea
                className="admin-input"
                rows={4}
                value={notifMessage}
                onChange={(e) => setNotifMessage(e.target.value)}
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
                onClick={() => setNotifModal(false)}
              >
                Cancel
              </button>
              <button className="admin-btn-primary" onClick={sendNotification}>
                📤 Send
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Request;
