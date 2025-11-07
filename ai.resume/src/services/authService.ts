// src/services/authService.js
import axios from "axios";
import {jwtDecode} from "jwt-decode";

interface JwtPayload {
  exp: number; // standard JWT expiry field
  [key: string]: any;
}

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8082";

export const authService = {
  getToken: () => localStorage.getItem("token"),

  verifyToken: async () => {

    const token = localStorage.getItem("token");
    if (!token) return false;

    try {
      // Decode the JWT token
      const decoded = jwtDecode<JwtPayload>(token);

      // Check if expired
      if (decoded.exp * 1000 < Date.now()) {
        return false;
      }
    } catch (err) {
      return false;
    }

    try {
      const res = await axios.get(`${API_BASE}/api/v1/auth/verify`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data.status === "valid";
    } catch (error) {
      return false;
    }
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  },
};
