import api from "../../axios.jsx";
import endpoints from "../../endpoints";

export const fetchVehicles = async (filters = {}) => {
  const queryParams = new URLSearchParams();
  if (filters.category) queryParams.append("category", filters.category);
  if (filters.eventId) queryParams.append("eventId", filters.eventId);
  if (filters.teamId) queryParams.append("teamId", filters.teamId);
  if (filters.vehicleId) queryParams.append("vehicleId", filters.vehicleId);

  const query = queryParams.toString();
  const url = query
    ? `${endpoints.fleet.getVehicles}?${query}`
    : endpoints.fleet.getVehicles;
  const response = await api.get(url);

  if (response.data?.success === false) {
    throw new Error(response.data?.message || "Failed to load vehicles");
  }

  return response.data?.data ?? response.data ?? [];
};

export async function fetchTeamVehicle(eventId, teamId) {
  if (!eventId || !teamId) return null;

  const vehicles = await fetchVehicles({ eventId, teamId });
  return Array.isArray(vehicles) && vehicles.length > 0 ? vehicles[0] : null;
}

export const fetchPackages = async (filters = {}) => {
  const queryParams = new URLSearchParams();
  if (filters.vehicleId) queryParams.append("vehicleId", filters.vehicleId);

  const url = `${endpoints.fleet.getPackages}?${queryParams.toString()}`;
  const response = await api.get(url);
  return response.data?.data || response.data || [];
};

export const createCustomer = async (data) => {
  const response = await api.post(endpoints.fleet.createCustomer, data);
  return response.data?.data || response.data;
};

export const createBooking = async (data) => {
  const response = await api.post(endpoints.fleet.createBooking, data);
  return response.data?.data || response.data;
};
