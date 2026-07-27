import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "../components/StudentDashboard.css";
import { MdMenuBook } from "react-icons/md";
import { logout } from "../utils/auth";

import { MdDashboard, MdAssignment } from "react-icons/md";
import {
  FaUsers,
  FaChalkboardTeacher,
  FaBook,
  FaBell,
  FaUserCheck,
} from "react-icons/fa";
import { IoLogOut } from "react-icons/io5";

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
    id: "syllabus",
    label: "Syllabus",
    icon: <MdMenuBook />,
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

const AdminSidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout("admin");
    localStorage.removeItem("adminAuth");
    navigate("/adminlogin");
  };

  return (
    <>
      {sidebarOpen && (
        <div className="overlay" onClick={() => setSidebarOpen(false)} />
      )}

      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="sidebar-section-label">Menu</div>

        {adminItems.map((item) => (
          <NavLink
            key={item.id}
            to={item.path}
            className={({ isActive }) =>
              isActive ? "side-item-active" : "side-item"
            }
            onClick={() => setSidebarOpen(false)}
          >
            <span className="side-icon">{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}

        <button
          className="side-item"
          onClick={() => {
            setSidebarOpen(false);
            handleLogout();
          }}
        >
          <span className="side-icon">
            <IoLogOut />
          </span>
          <span>Logout</span>
        </button>
      </aside>
    </>
  );
};

export default AdminSidebar;
