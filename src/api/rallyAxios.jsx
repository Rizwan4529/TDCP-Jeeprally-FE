import axios from "axios";

const baseURL = import.meta.env.VITE_RALLY_API_BASE_URL;

const rallyAxios = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default rallyAxios;
