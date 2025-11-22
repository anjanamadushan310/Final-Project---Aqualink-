import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ROLES } from '../../utils/roleUtils';

/**
 * RoleBasedRoute - Validates if user has required role before rendering content
 * Used inside dashboard nested routes to prevent unauthorized access
 * 
 * @param {object} props
 * @param {React.ReactNode} props.children - Content to render if authorized
 * @param {string[]} props.allowedRoles - Array of roles that can access this route
 * @param {string} props.redirectTo - Where to redirect if not authorized
 */
const RoleBasedRoute = ({ children, allowedRoles, redirectTo = '/dashboard' }) => {
  const { user } = useAuth();

  // Check if user has any of the allowed roles
  const hasRequiredRole = user?.roles && user.roles.some(role => allowedRoles.includes(role));

  if (!hasRequiredRole) {
    // User doesn't have required role, redirect to their default dashboard
    console.warn(`Access denied: User roles ${user?.roles} do not match required roles ${allowedRoles}`);
    return <Navigate to={redirectTo} replace />;
  }

  // User has required role, render the content
  return <>{children}</>;
};

export default RoleBasedRoute;
