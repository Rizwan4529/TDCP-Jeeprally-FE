import axios from "axios";

// Create instance for Fleet Management APIs
const fleetApi = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL_2 || import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to attach token
fleetApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("tdcp_auth_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // Maintain the existing x-api-key if needed, but usually auth APIs use Bearer
    config.headers["x-api-key"] = `3b5a1366035fc143d10b7fbbbf7b096003466e88b33578ffb4075450d20a187d`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
fleetApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized (e.g., clear session)
      localStorage.removeItem("tdcp_auth_token");
      localStorage.removeItem("tdcp_user");
    }
    return Promise.reject(error);
  }
);

export default fleetApi;
