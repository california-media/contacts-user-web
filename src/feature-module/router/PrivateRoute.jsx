// src/components/PrivateRoute.jsx
import React from "react";
import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import LoadingIndicator2 from "../../core/common/loadingIndicator/LoadingIndicator2";

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const { id, role, error } = useSelector((state) => state.profile); ////if id  = "" then it is default user
  const location = useLocation();
  if (error) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }
  // Show loading spinner while profile is being fetched
  if (id === "") {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 w-100">
        {" "}
        <LoadingIndicator2 />
      </div>
    ); // Or your custom loading component
  }

  if (role === "superadmin") {
    return (
      <Navigate to="/admin/dashboard" state={{ from: location }} replace />
    );
  }

  return children;
};

export default PrivateRoute;
