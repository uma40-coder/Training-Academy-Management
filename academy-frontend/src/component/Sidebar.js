import React from 'react'
import "../components/StudentDashboard.css";
import { logout } from "../utils/auth";
import { MdMenuBook } from "react-icons/md";

import { NavLink, useNavigate } from "react-router-dom";
import {
  FaBell,
  FaCog,
  FaUser,
  FaBook,
  FaChalkboardTeacher,
} from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import { IoLogOut } from "react-icons/io5";

const sideItems = [
  {
    id: "Dashboard",
    label: "Dashboard",
    icon: <MdDashboard />,
    path: "/StudentDashboard/dashboard",
  },
  {
    id: "Syllabus",
    label: "Syllabus",
    icon: <MdMenuBook />,
    path: "/StudentDashboard/syllabus",
  },
  {
    id: "My Mentor",
    label: "My Mentor",
    icon: <FaChalkboardTeacher />,
    path: "/StudentDashboard/mentor",
  },

  {
    id: "Course",
    label: "Course",
    icon: <FaBook />,
    path: "/StudentDashboard/course",
  },

  {
    id: "Profile",
    label: "Profile",
    icon: <FaUser></FaUser>,
    path: "/StudentDashboard/profile",
  },
  {
    id: "Logout",
    label: "Logout",
    icon: <IoLogOut />,
    path: "Logout",
  },
];

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
   const navigate = useNavigate();
  
  const logoutHandle = () => {
    logout("student");
    localStorage.removeItem("currentUser");
    navigate("/studentlogin");
  };
  return (
    <>
      {sidebarOpen && (
        <div className="overlay" onClick={()=>setSidebarOpen(false)} />
      )}

      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="sidebar-section-label">Menu</div>
        {sideItems.map((item) => {
          if (item.id === "Logout") {
            return (
              <button
                key={item.id}
                onClick={logoutHandle}
                className="side-item"
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            );
          }
          return (
            <NavLink
              className={({ isActive }) =>
                isActive ? "side-item-active" : "side-item"
              }
              key={item.id}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
            >
              <span className="side-icon">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </aside>
    </>
  );
}

export default Sidebar