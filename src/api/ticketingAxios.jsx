import axios from "axios";

// Create instance for New Eticketing APIs
const ticketingApi = axios.create({
  baseURL: import.meta.env.VITE_NEW_ETICKETING_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to attach API Key
ticketingApi.interceptors.request.use(
  (config) => {
    config.headers["x-api-key"] = `3b5a1366035fc143d10b7fbbbf7b096003466e88b33578ffb4075450d20a187d`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
ticketingApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("Unauthorized ticketing API call");
    }
    return Promise.reject(error);
  }
);

export default ticketingApi;
