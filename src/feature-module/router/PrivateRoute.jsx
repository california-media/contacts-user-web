// src/components/PrivateRoute.jsx
import React from "react";
import { Navigate, useLocation } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const location = useLocation();

  // ⛔ If no token, redirect to login and save current location
  if (!token) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // ✅ If token exists, render children (the full app)
  return children;
};

export default PrivateRoute;
