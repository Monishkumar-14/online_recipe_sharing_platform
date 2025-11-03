import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ allowedRoles }) => {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('role');

  // 1. Check if user is logged in
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // 2. Check if user has the required role
  if (allowedRoles && !allowedRoles.includes(userRole)) {
    // If user is logged in but doesn't have the right role, send them home
    return <Navigate to="/" replace />;
  }

  // 3. If logged in and has permission, show the page
  return <Outlet />;
};

export default ProtectedRoute;