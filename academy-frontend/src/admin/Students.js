import React, { useEffect, useState } from "react";
import "../components/AdDashboard.css";

const Students = () => {
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
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterCourse, setFilterCourse] = useState("All"); // ← missing was this!

  const courses = [...new Set(students.map((s) => s.Course))];

  // ── Filter logic ──
  const filtered = students.filter((s) => {
    const matchSearch =
      `${s.Fname} ${s.Lname}`.toLowerCase().includes(search.toLowerCase()) ||
      s.Email.toLowerCase().includes(search.toLowerCase()) ||
      s.Course.toLowerCase().includes(search.toLowerCase());

    const matchStatus = filterStatus === "All" || s.status === filterStatus;
    const matchCourse = filterCourse === "All" || s.Course === filterCourse;

    return matchSearch && matchStatus && matchCourse;
  });

  // const deleteStudent = (email) => {
  //   if (window.confirm("Delete this student?")) {
  //     const updated = students.filter((s) => s.Email !== email);
  //     setStudents(updated);
  //     localStorage.setItem("Students_detail", JSON.stringify(updated));

  //     // currentUser also check pannunga ← add this!
  //     const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  //     if (currentUser && currentUser.Email === email) {
  //       localStorage.removeItem("currentUser");
  //     }
  //   }
  // };

 const toggleStatus = async (email) => {
   const student = students.find((s) => s.Email === email);
   const newStatus = student.status === "inactive" ? "approved" : "inactive";

   if (
     !window.confirm(
       `${newStatus === "inactive" ? "Deactivate" : "Activate"} this student?`,
     )
   ) {
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
         body: JSON.stringify({ status: newStatus }),
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
         JSON.stringify({ ...currentUser, status: newStatus }),
       );
     }
   } catch (error) {
     console.log(error);
     alert("Backend not connected");
   }
 };

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 6,
        }}
      >
        <h2 className="page-title">Students</h2>
        <span className="admin-badge active">{students.length} total</span>
      </div>
      <p className="page-sub">View and manage all registered students</p>

      {/* Search + Filters */}
      <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
        <input
          className="admin-search"
          type="text"
          placeholder="🔍 Search by name, email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="admin-select"
          value={filterCourse}
          onChange={(e) => setFilterCourse(e.target.value)}
        >
          <option value="All">All Courses</option>
          {courses.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <select
          className="admin-select"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="All">All Status</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {/* Table */}
      <div className="admin-table-box">
        <div className="admin-table-head">
          <h3>All Students</h3>
          <span className="admin-badge active">{filtered.length} results</span>
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
            {filtered.length === 0 ? (
              <tr>
                <td
                  colSpan="6"
                  style={{
                    textAlign: "center",
                    color: "var(--muted)",
                    padding: "32px",
                  }}
                >
                  No students found!
                </td>
              </tr>
            ) : (
              filtered.map((s, i) => (
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
                    <span className={`admin-badge ${s.status}`}>
                      {s.status}
                    </span>
                  </td>
                  <td>
                    {/* <button
                      className="admin-btn-reject"
                      onClick={() => deleteStudent(s.Email)}
                    >
                      🗑️ Delete
                    </button> */}
                    {/* // Delete → Deactivate */}
                    <button
                      className={
                        s.status === "inactive"
                          ? "admin-btn-approve"
                          : "admin-btn-reject"
                      }
                      onClick={() => toggleStatus(s.Email)}
                    >
                      {s.status === "inactive"
                        ? "✅ Activate"
                        : "🚫 Deactivate"}
                    </button>
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

export default Students;
