import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const AuthProtect = ({ children, allowedRoles = [] }) => {
  const location = useLocation();
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  const role = localStorage.getItem('role') || sessionStorage.getItem('role');

  // Debugging logs
  console.log("AuthProtect: Current Location:", location.pathname);
  console.log("AuthProtect: Token:", token);
  console.log("AuthProtect: Role:", role);
  console.log("AuthProtect: Allowed Roles:", allowedRoles);

  // Not logged in
  if (!token) {
    console.warn("AuthProtect: No token found. Redirecting to login.");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Role not allowed
  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    console.warn("AuthProtect: Role not allowed. Redirecting to unauthorized page.");
    return <Navigate to="/unauthorized" replace />;
  }

  // All good
  return children;
};

export default AuthProtect;