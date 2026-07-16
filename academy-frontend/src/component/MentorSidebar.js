import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { MdDashboard } from "react-icons/md";
import { FaUsers, FaCheckCircle, FaUser } from "react-icons/fa";
import { IoLogOut } from "react-icons/io5";
import "../components/MentorDashboard.css";

const mentorItems = [
  {
    id: "home",
    label: "Dashboard",
    icon: <MdDashboard />,
    path: "/mentordashboard/mentorhome",
  },
  {
    id: "new",
    label: "New Students",
    icon: <FaUsers />,
    path: "/mentordashboard/newstudents",
  },
  {
    id: "reviewed",
    label: "Reviewed Students",
    icon: <FaCheckCircle />,
    path: "/mentordashboard/reviewedstudents",
  },
  {
    id: "profile",
    label: "Profile",
    icon: <FaUser />,
    path: "/mentordashboard/mentorprofile",
  },
];

const MentorSidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("currentMentor");
    navigate("/mentorlogin");
  };

  return (
    <>
      {sidebarOpen && (
        <div className="overlay" onClick={() => setSidebarOpen(false)} />
      )}

      <aside className={`mentor-sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="mentor-sidebar-label">Menu</div>

        {mentorItems.map((item) => (
          <NavLink
            key={item.id}
            to={item.path}
            className={({ isActive }) =>
              isActive ? "mentor-nav-item active" : "mentor-nav-item"
            }
            onClick={() => setSidebarOpen(false)}
          >
            <span style={{ fontSize: 16 }}>{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}

        <button
          className="mentor-nav-item"
          onClick={handleLogout}
          style={{
            border: "none",
            background: "transparent",
            width: "100%",
            textAlign: "left",
            marginTop: "auto",
          }}
        >
          <span style={{ fontSize: 16 }}>
            <IoLogOut />
          </span>
          <span>Logout</span>
        </button>
      </aside>
    </>
  );
};

export default MentorSidebar;
