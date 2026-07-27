import React, { useState,useEffect } from "react";
import { NavLink, useNavigate, Outlet } from "react-router-dom";
import "../components/StudentDashboard.css";
import { FaBell, FaCog,FaUser,FaBook,FaChalkboardTeacher} from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import { IoLogOut  } from "react-icons/io5";
import Navbar from "../component/Navbar";



import Sidebar from "../component/Sidebar";

// const sideItems = [
//   {
//     id: "Dashboard",
//     label: "Dashboard",
//     icon: <MdDashboard />,
//     path: "/dashboard",
//   },
//   {
//     id: "Syllabus",
//     label: "Syllabus",
//     icon: <FaBook />,
//     path: "/syllabus",
//   },
//   {
//     id: "My Mentor",
//     label: "My Mentor",
//     icon: <FaChalkboardTeacher />,
//     path: "/mentor",
//   },

//   {
//     id: "Profile",
//     label: "Profile",
//     icon: <FaUser></FaUser>,
//     path: "/profile",
//   },
//   {
//     id: "Logout",
//     label: "Logout",
//     icon: <IoLogOut />,
//     path: "/",
//   },
// ];
  
// }

const StudentDashboard = () => {
   const [sidebarOpen, setSidebarOpen] = useState(false);
   

  const navigate = useNavigate();

   const currentUser = JSON.parse(localStorage.getItem("currentUser"));

   
   
   useEffect(()=>{
      if(!currentUser){
        navigate("/studentlogin");
      }
    },[currentUser,navigate])
    if (!currentUser) {
      return <h2>loading</h2>;
    }
    const stud_avatar = currentUser.Fname.charAt(0).toUpperCase(); 
    console.log(currentUser);
    


  // const logoutHandle=()=>{

  //  localStorage.removeItem("currentUser");
  //   navigate("/Studreg");

  // }



// ------------caps func----------------
  // function initCap(str) {
  //   return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  // }
  return (
    <div className="dash-main">
      {/* <h2>Welcome {currentUser.Fname}</h2>
      <p>Email: {currentUser.Email}</p>
      <p>Course: {currentUser.Course}</p>
      <p>Trainer: {currentUser.Trainer}</p>
      <p>Batch Timing: {currentUser.Timing}</p>
      <button type="button" onClick={logoutHandle}>
        logout
      </button> */}

      {/* ----------------navbar------------------------------ */}

      <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      {/* -------------sidebar-------------- */}
      <div className="app-body">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <div className="dash-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default StudentDashboard