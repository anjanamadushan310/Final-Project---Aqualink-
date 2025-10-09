// Environment Configuration Helper
// This file centralizes all environment variable access

export const ENV = {
  // API Configuration
  API_URL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
  
  // Development
  NODE_ENV: import.meta.env.NODE_ENV || 'development',
  
  // External Services
  TINYMCE_API_KEY: import.meta.env.VITE_TINYMCE_API_KEY,
};

// Debug logging in development
if (import.meta.env.DEV) {
  console.log('🔧 Environment Configuration:', {
    API_URL: ENV.API_URL,
    NODE_ENV: ENV.NODE_ENV,
    TINYMCE_API_KEY: ENV.TINYMCE_API_KEY ? `${ENV.TINYMCE_API_KEY.substring(0, 10)}...` : 'Not loaded'
  });
}

// Helper functions
export const isDevelopment = () => ENV.NODE_ENV === 'development';
export const isProduction = () => ENV.NODE_ENV === 'production';

// API URL builders
export const buildApiUrl = (endpoint) => `${ENV.API_URL}${endpoint}`;

export default ENV;