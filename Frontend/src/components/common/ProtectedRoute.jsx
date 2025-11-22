import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/**
 * ProtectedRoute component that checks authentication and optional role authorization
 * 
 * @param {object} props
 * @param {React.ReactNode} props.children - Child components to render if authorized
 * @param {string[]} props.allowedRoles - Optional array of roles that can access this route
 * @param {string} props.redirectTo - Where to redirect if not authorized (default: '/')
 */
const ProtectedRoute = ({ children, allowedRoles = null, redirectTo = '/' }) => {
  const { user, isAuthenticated, loading } = useAuth();

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-cyan-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  // Check if user is authenticated
  if (!isAuthenticated()) {
    // Not logged in, redirect to home page
    return <Navigate to={redirectTo} replace />;
  }

  // If specific roles are required, check if user has any of them
  if (allowedRoles && allowedRoles.length > 0) {
    const hasRequiredRole = user.roles && user.roles.some(role => allowedRoles.includes(role));
    
    if (!hasRequiredRole) {
      // User doesn't have required role, redirect
      return <Navigate to={redirectTo} replace />;
    }
  }

  // User is authenticated and authorized, render the protected content
  return <>{children}</>;
};

export default ProtectedRoute;
