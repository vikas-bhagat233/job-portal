import React from 'react';
import { Navigate } from 'react-router-dom';

// roles: array of allowed roles e.g., ['candidate'] or ['recruiter']
export default function ProtectedRoute({ roles, children }) {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  if (roles && roles.length > 0 && !roles.includes(user.role)) {
    // Not authorized for this route
    // Send them to their own dashboard if logged in
    const fallback = user.role === 'recruiter' ? '/recruiter' : '/candidate';
    return <Navigate to={fallback} replace />;
  }

  return children;
}
