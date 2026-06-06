import axios from "axios";

/**
 * api.js
 * Centralized Axios instance for making HTTP requests to the backend.
 * Handles the base URL and ensures cookies (like our JWT) are sent with every request.
 */

let baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
if (baseUrl && !baseUrl.endsWith('/api')) {
  // Automatically append /api if it's missing from the environment variable
  baseUrl = baseUrl.replace(/\/$/, '') + '/api';
}

const api = axios.create({
  // Use Vercel's env variable in production, fallback to localhost for development
  baseURL: baseUrl,
  withCredentials: true, // Crucial for sending/receiving httpOnly cookies
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Future: attach tokens or modify headers here
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Future: handle 401 redirects, token refresh, etc.
    return Promise.reject(error);
  }
);

export default api;
