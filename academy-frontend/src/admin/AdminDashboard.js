import React from 'react'
import AdminNavbar from '../component/AdminNavbar';
import AdminSidebar from '../component/AdminSidebar';
import "../components/AdDashboard.css";
import { Outlet } from 'react-router-dom';
const AdminDashboard = () => {


  return (
    <div className="dash-main">
      {" "}
      {/* ← add pannunga */}
      <AdminNavbar />
      <div className="app-body">
        <AdminSidebar />
        <div className="content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};



export default AdminDashboard