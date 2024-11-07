// src/components/ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');

  // Redirect to login if token is not present
  if (!token) {
    return <Navigate to="/loginorg" replace />;
  }

  return children;
};

export default ProtectedRoute;
