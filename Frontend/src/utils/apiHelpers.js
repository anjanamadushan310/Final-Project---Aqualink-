/**
 * API Helper Utilities
 * Centralized API request handling with environment-aware URLs
 */

import { API_URL, getImageUrl } from '../config';

/**
 * Make an authenticated API request
 * @param {string} endpoint - API endpoint (e.g., '/fish', '/auth/login')
 * @param {object} options - Fetch options
 * @returns {Promise<Response>}
 */
export const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_URL}${endpoint}`;
  
  const token = localStorage.getItem('token');
  
  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    return response;
  } catch (error) {
    console.error(`API Request failed: ${endpoint}`, error);
    throw error;
  }
};

/**
 * Make an authenticated API request with multipart/form-data
 * (for file uploads)
 */
export const apiUpload = async (endpoint, formData, options = {}) => {
  const url = `${API_URL}${endpoint}`;
  
  const token = localStorage.getItem('token');
  
  const defaultHeaders = {};
  
  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    method: 'POST',
    ...options,
    body: formData,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    return response;
  } catch (error) {
    console.error(`API Upload failed: ${endpoint}`, error);
    throw error;
  }
};

/**
 * GET request helper
 */
export const apiGet = async (endpoint, options = {}) => {
  return apiRequest(endpoint, { method: 'GET', ...options });
};

/**
 * POST request helper
 */
export const apiPost = async (endpoint, data, options = {}) => {
  return apiRequest(endpoint, {
    method: 'POST',
    body: JSON.stringify(data),
    ...options,
  });
};

/**
 * PUT request helper
 */
export const apiPut = async (endpoint, data, options = {}) => {
  return apiRequest(endpoint, {
    method: 'PUT',
    body: JSON.stringify(data),
    ...options,
  });
};

/**
 * DELETE request helper
 */
export const apiDelete = async (endpoint, options = {}) => {
  return apiRequest(endpoint, { method: 'DELETE', ...options });
};

/**
 * Export image URL helper from config
 */
export { getImageUrl };

/**
 * Export API_URL for direct use if needed
 */
export { API_URL };
