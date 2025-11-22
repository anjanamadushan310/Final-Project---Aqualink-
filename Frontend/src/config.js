// API configuration - DO NOT hardcode URLs here
// Use environment variables for flexibility across environments
export const API_BASE_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:8080';

// Image base URL for uploaded files
export const IMAGE_BASE_URL = `${API_BASE_URL}`;

// Full API URL
export const API_URL = `${API_BASE_URL}/api`;

// Helper function to get full image URL
export const getImageUrl = (imagePath) => {
  if (!imagePath) return '';
  if (imagePath.startsWith('http')) return imagePath;
  if (imagePath.startsWith('/uploads')) return `${IMAGE_BASE_URL}${imagePath}`;
  return `${IMAGE_BASE_URL}/uploads/${imagePath}`;
};

// Other configuration variables can be added here