import axios from 'axios';
import { authService } from "../services/authService";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8082";

const api = axios.create({
  baseURL: API_BASE + '/api/v1',
});

// Automatically attach token
api.interceptors.request.use((config) => {
  const token = authService.getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle expired/invalid token globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const requestUrl = error?.config?.url;

    // Do NOT logout if error came from login or signup API
    const authEndpoints = ["/login", "/signup", "/auth/login", "/auth/signup"];

    if (
      error.response &&
      error.response.status === 401 &&
      !authEndpoints.some((e) => requestUrl?.includes(e))
    ) {
      authService.logout();
    }

    return Promise.reject(error);
  }
);

export default api;
