import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import MentorNavbar from "../component/MentorNavbar";
import MentorSidebar from "../component/MentorSidebar";
import "../components/MentorDashboard.css";

const MentorDashboard = () => {
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const currentMentor = localStorage.getItem("currentMentor");
    if (!currentMentor) {
      navigate("/mentorlogin");
    }
  }, [navigate]);

  return (
    <div className="mentor-main">
      <MentorNavbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="mentor-body">
        <MentorSidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        <div className="mentor-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default MentorDashboard;
