import axios from "axios";

// Base URL for API endpoints
export const API_BASE_URL = "http://localhost:5454";

// Create axios instance with default configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
