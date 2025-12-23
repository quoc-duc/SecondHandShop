import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    // Simulate loading time if needed (e.g., token verification with backend)
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return <div>Loading...</div>; // You can replace this with a spinner or similar UI
  }

  if (!token) {
    return <Navigate to="/admin/login" />;
  }

  return children;
};

export default ProtectedRoute;
