import logo from "./logo.svg";
import "./App.css";
// import "./pages/Homepage";
import Homepage from "./pages/Homepage";
import Studentreg from "./pages/Studentreg";
import StudentLogin from "./pages/StudentLogin";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import StudentDashboard from "./student/StudentDashboard";
import Sidebar from "./component/Sidebar";
import Navbar from "./component/Navbar";


import Course from "./student/Course";
import Profile from "./student/Profile";
import Syllabus from "./student/Syllabus";
import Mentor from "./student/Mentor";
import Dashboard from "./student/Dashboard";

import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./admin/AdminDashboard";
import AdDashboard from "./admin/AdDashboard";
import Courses from "./admin/Courses";
import Mentors from "./admin/Mentors";
import Notifications from "./admin/Notifications";
import Students from "./admin/Students";
import Assignment from "./admin/Assignment";
import Request from "./admin/Request"
import AdSyllabus from "./admin/AdSyllabus";

import AdminSidebar from "./component/AdminSidebar";
import AdminNavbar from "./component/AdminNavbar";



import MentorLogin from "./pages/MentorLogin";

import MentorHome from "./Mentor/MentorHome";
import NewStudents from "./Mentor/NewStudents";
import ReviewedStudents from "./Mentor/ReviewedStudents";
import MentorProfile from "./Mentor/MentorProfile";
import MentorDashboard from "./Mentor/MentorDashboard";



// import AdminLogin from "./pages/AdminLogin";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/Studreg" element={<Studentreg />} />
          <Route path="/studentlogin" element={<StudentLogin />}></Route>
          <Route path="/StudentDashboard" element={<StudentDashboard />}>
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="profile" element={<Profile />} />
            <Route path="mentor" element={<Mentor />} />
            <Route path="syllabus" element={<Syllabus />} />
            <Route path="course" element={<Course />} />
          </Route>

          {/* <Route path="/navbar" element={<Navbar />} /> */}

          <Route path="/adminlogin" element={<AdminLogin />} />

          <Route path="/admindashboard" element={<AdminDashboard />}>
            <Route index element={<AdDashboard />} />
            <Route path="addashboard" element={<AdDashboard />} />
            <Route path="requests" element={<Request />}></Route>
            <Route path="students" element={<Students />} />
            <Route path="mentors" element={<Mentors />} />
            <Route path="courses" element={<Courses />} />

            <Route path="adsyllabus" element={<AdSyllabus />} />

            <Route path="assignment" element={<Assignment />} />
            <Route path="notifications" element={<Notifications />} />
          </Route>

          <Route path="/mentorlogin" element={<MentorLogin />} />

          <Route path="/mentordashboard" element={<MentorDashboard />}>
            <Route index element={<MentorHome />} />
            <Route path="mentorhome" element={<MentorHome />} />
            <Route path="newstudents" element={<NewStudents />} />
            <Route path="reviewedstudents" element={<ReviewedStudents />} />
            <Route path="mentorprofile" element={<MentorProfile />} />
          </Route>

          {/* <Route path="adminsidebar" element={<AdminSidebar />} />
          <Route path="adminnavbar" element={<AdminNavbar />} /> */}
        </Routes>
      </BrowserRouter>

      {/* <Homepage /> */}
      {/* <Studentreg /> */}
      {/* <StudentLogin /> */}
    </div>
  );
}

export default App;
