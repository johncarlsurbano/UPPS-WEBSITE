
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
export const ProtectedRoute = ({ children, allowedRoles, checkAccountStatus = false, checkPrintRequest = false }) => {
    const {isLoggin, user} = useSelector((state) => state.user.value);
    const location = useLocation(); 
  
    // Check if user is logged in
    if (!isLoggin) {
      return <Navigate to="/login" state={{ from: location }} replace />;
    }

    const userRole = user.role;
  
    // Check if user role matches allowed roles
    if (allowedRoles) {
        // Chairman can access Personnel pages
        const isChairmanAccessing = userRole === "Chairman" && allowedRoles.includes("Personnel");
        if (!allowedRoles.includes(userRole) && !isChairmanAccessing) {
            return <Navigate to="/unauthorized" replace />;
        }
    }

    if (checkAccountStatus && user.account_status !== "Active") {
      alert("Your account is not active. Please contact the chairman.");
      return <Navigate to="/personnel/dashboard" replace />; // Redirect to dashboard instead of blocking access to login
    }
  
    return children;
  };
