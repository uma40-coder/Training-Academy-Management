import React from "react";
import { Navigate } from "react-router-dom";
import { isLoggedIn } from "../utils/auth";

/**
 * ProtectedRoute — wraps a route and redirects to the login page
 * if the user is not logged in with the required role.
 *
 * Usage:
 *   <ProtectedRoute role="admin" redirectTo="/adminlogin">
 *     <AdminDashboard />
 *   </ProtectedRoute>
 */
const ProtectedRoute = ({ role, redirectTo, children }) => {
  if (!isLoggedIn(role)) {
    return <Navigate to={redirectTo} replace />;
  }
  return children;
};

export default ProtectedRoute;
