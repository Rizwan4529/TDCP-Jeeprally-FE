import axios from "axios";
import endpoints from "../../endpoints";

// Create a dedicated axios instance for fleet management
const fleetApi = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL_2 || "http://localhost:5000",
  headers: {
    "Content-Type": "application/json",
  },
});

export const fetchVehicles = async (filters = {}) => {
  const queryParams = new URLSearchParams();
  if (filters.category) queryParams.append("category", filters.category);
  // add other filters as needed

  const url = `${endpoints.fleet.getVehicles}?${queryParams.toString()}`;
  const response = await fleetApi.get(url);
  // Handle flexible response object (e.g. data or direct array)
  return response.data?.data || response.data || [];
};

export const fetchPackages = async (filters = {}) => {
  const queryParams = new URLSearchParams();
  if (filters.vehicleId) queryParams.append("vehicleId", filters.vehicleId);

  const url = `${endpoints.fleet.getPackages}?${queryParams.toString()}`;
  const response = await fleetApi.get(url);
  return response.data?.data || response.data || [];
};

export const createCustomer = async (data) => {
  const response = await fleetApi.post(endpoints.fleet.createCustomer, data);
  // Expecting the created customer ID or object to be returned
  return response.data?.data || response.data;
};

export const createBooking = async (data) => {
  const response = await fleetApi.post(endpoints.fleet.createBooking, data);
  return response.data?.data || response.data;
};
