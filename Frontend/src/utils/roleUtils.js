/**
 * Role utility functions for dashboard routing and role management
 */

// Role constants
export const ROLES = {
  ADMIN: 'ADMIN',
  SHOP_OWNER: 'SHOP_OWNER',
  FARM_OWNER: 'FARM_OWNER',
  EXPORTER: 'EXPORTER',
  SERVICE_PROVIDER: 'SERVICE_PROVIDER',
  INDUSTRIAL_STUFF_SELLER: 'INDUSTRIAL_STUFF_SELLER',
  DELIVERY_PERSON: 'DELIVERY_PERSON'
};

// Role display names
export const ROLE_DISPLAY_NAMES = {
  [ROLES.ADMIN]: 'Administrator',
  [ROLES.SHOP_OWNER]: 'Shop Owner',
  [ROLES.FARM_OWNER]: 'Farm Owner',
  [ROLES.EXPORTER]: 'Exporter',
  [ROLES.SERVICE_PROVIDER]: 'Service Provider',
  [ROLES.INDUSTRIAL_STUFF_SELLER]: 'Industrial Seller',
  [ROLES.DELIVERY_PERSON]: 'Delivery Person'
};

// Role priority for determining primary dashboard
export const ROLE_PRIORITY = [
  ROLES.ADMIN,
  ROLES.SHOP_OWNER,
  ROLES.FARM_OWNER,
  ROLES.EXPORTER,
  ROLES.SERVICE_PROVIDER,
  ROLES.INDUSTRIAL_STUFF_SELLER,
  ROLES.DELIVERY_PERSON
];

/**
 * Get the primary role for a user (highest priority role)
 * @param {string[]} roles - Array of user roles
 * @returns {string|null} Primary role or null if no valid roles
 */
export const getPrimaryRole = (roles) => {
  if (!roles || !Array.isArray(roles) || roles.length === 0) {
    return null;
  }

  // Find the first role in priority order that the user has
  for (const priorityRole of ROLE_PRIORITY) {
    if (roles.includes(priorityRole)) {
      return priorityRole;
    }
  }

  // If no priority role found, return first role
  return roles[0];
};

/**
 * Get display name for a role
 * @param {string} role - Role identifier
 * @returns {string} Display name
 */
export const getRoleDisplayName = (role) => {
  return ROLE_DISPLAY_NAMES[role] || role;
};

/**
 * Get dashboard path for a role
 * All roles now use a single /dashboard route
 * @returns {string} Dashboard path
 */
export const getDashboardPath = () => {
  // All dashboards now use single /dashboard route
  // The actual dashboard component is determined by user's roles
  return '/dashboard';
};

/**
 * Get the default dashboard route for a user based on their roles
 * @param {string[]} roles - Array of user roles
 * @returns {string} Dashboard path
 */
export const getDefaultDashboardRoute = (roles) => {
  const primaryRole = getPrimaryRole(roles);
  return primaryRole ? getDashboardPath(primaryRole) : '/';
};

/**
 * Check if user has a specific role
 * @param {object} user - User object
 * @param {string} role - Role to check
 * @returns {boolean} True if user has the role
 */
export const userHasRole = (user, role) => {
  return user && user.roles && Array.isArray(user.roles) && user.roles.includes(role);
};

/**
 * Check if user has any of the specified roles
 * @param {object} user - User object
 * @param {string[]} roles - Roles to check
 * @returns {boolean} True if user has at least one role
 */
export const userHasAnyRole = (user, roles) => {
  if (!user || !user.roles || !Array.isArray(user.roles)) {
    return false;
  }
  return roles.some(role => user.roles.includes(role));
};
