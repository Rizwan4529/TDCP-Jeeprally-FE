import axios from "axios";

// Create instance for Central User APIs
const authApi = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL_CENTRAL_USER || "https://centeral-user-apis.tdcp.gop.pk/",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to attach token
authApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("tdcp_auth_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
authApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("tdcp_auth_token");
      localStorage.removeItem("tdcp_user");
    }
    return Promise.reject(error);
  }
);

export default authApi;
