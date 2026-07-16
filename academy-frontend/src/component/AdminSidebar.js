// AdminSidebar.js
import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "../components/StudentDashboard.css"; // ← same CSS reuse!

import { MdDashboard } from "react-icons/md";
import { FaUsers, FaChalkboardTeacher, FaBook, FaBell } from "react-icons/fa";
import { MdAssignment } from "react-icons/md";
import { FaUserCheck } from "react-icons/fa";
import { IoLogOut } from "react-icons/io5";

// ── Admin nav items — text different, design same ──
const adminItems = [
  {
    id: "addashboard",
    label: "Dashboard",
    icon: <MdDashboard />,
    path: "/admindashboard/addashboard",
  },
  {
    id: "requests",
    label: "Student Requests",
    icon: <FaUserCheck />,
    path: "/admindashboard/requests",
  },
  {
    id: "students",
    label: "Students",
    icon: <FaUsers />,
    path: "/admindashboard/students",
  },
  {
    id: "mentors",
    label: "Mentors",
    icon: <FaChalkboardTeacher />,
    path: "/admindashboard/mentors",
  },
  {
    id: "courses",
    label: "Courses",
    icon: <FaBook />,
    path: "/admindashboard/courses",
  },
  {
    id: "Syllabus",
    label: "Syllabus",
    icon: <FaBook />,
    path: "/admindashboard/adsyllabus",
  },
  {
    id: "assignment",
    label: "Mentor Assignment",
    icon: <MdAssignment />,
    path: "/admindashboard/assignment",
  },
  {
    id: "notifications",
    label: "Notifications",
    icon: <FaBell />,
    path: "/admindashboard/notifications",
  },
];

const AdminSidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("adminAuth");
    navigate("/adminlogin");
  };

  return (
    <aside className="sidebar">
     
      {/* ← same class! */}
      <div className="sidebar-section-label">Menu</div>
      {adminItems.map((item) => (
        <NavLink
          key={item.id}
          to={item.path}
          className={({ isActive }) =>
            isActive ? "side-item-active" : "side-item"
          }
        >
          <span className="side-icon">{item.icon}</span>
          <span>{item.label}</span>
        </NavLink>
      ))}
      {/* Logout button */}
      <button className="side-item" onClick={handleLogout}>
        <span className="side-icon">
          <IoLogOut />
        </span>
        <span>Logout</span>
      </button>
    </aside>
  );
};

export default AdminSidebar;
