// src/api/axios.js
import axios from "axios"

// Create instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    config.headers["x-api-key"] = `3b5a1366035fc143d10b7fbbbf7b096003466e88b33578ffb4075450d20a187d`
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle global errors
    if (error.response?.status === 401) {
      console.warn("Unauthorized! Redirecting to login...")
      // You can redirect or clear auth here
    }
    return Promise.reject(error)
  }
)

export default api
