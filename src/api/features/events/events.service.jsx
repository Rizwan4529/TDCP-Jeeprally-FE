import { db } from "../../firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import api from "../../axios"
import endpoints from "../../endpoints"

export const fetchServices = async (filters = {}) => {
  const queryParams = new URLSearchParams();

  if (filters.isFeatured !== undefined) {
    queryParams.append("isFeatured", filters.isFeatured);
  }

  if (filters.service_type) {
    queryParams.append("service_type", filters.service_type);
  }

  const url = `${endpoints.services.getAllServices}?${queryParams.toString()}`;

  const response = await api.get(url)
  return response.data?.data || []
}


export const fetchServiceById = async (id) => {
  if (!id) throw new Error("Service ID is required")
  const response = await api.get(`${endpoints.services.getServiceById(id)}`)
  return response.data?.data || {}
}


export const fetchResorts = async () => {
  try {
    // Reference to the "hotels" collection
    const hotelsCollection = collection(db, "hotels");

    // Get all documents in that collection
    const snapshot = await getDocs(hotelsCollection);

    // Map through and return the data
    const resorts = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return resorts;
  } catch (error) {
    console.error("Error fetching all hotels:", error);
    throw error;
  }
};

export const fetchPastOrUpcomingServices = async (status = 'upcoming') => {
  const url = `${endpoints.services.getUpcomingOrPastServices(status)}`;
  const response = await api.get(url)
  return response.data?.data || []
}