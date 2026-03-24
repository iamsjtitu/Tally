// API Configuration
// In desktop app, backend runs on same origin
// In development, use localhost:8765

const isDesktopApp = window.electronAPI !== undefined;
const isDevelopment = !process.env.NODE_ENV || process.env.NODE_ENV === 'development';

export const API_URL = isDesktopApp || !isDevelopment 
  ? '/api'  // Desktop app or production - relative path
  : 'http://localhost:8765/api';  // Development

export default API_URL;
