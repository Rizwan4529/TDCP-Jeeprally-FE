/** Paths are relative to VITE_API_BASE_URL (e.g. http://localhost:3000/api/v1). */
const endpoints = {
  services: {
    getAllServices: "/get_services",
    getService: (id) => `/get_service/${id}`,
    getServiceById: (id) => `/get_service/${id}`,
    getUpcomingOrPastServices: (status) => `/get_services/status?status=${status}`,
  },
  content: {
    getAllContent: "/content/all",
    getContent: "/content",
    getServiceContent: (id) => `/content/service/${id}`,
    getNameList: "/content/names-list",
    getAvailableSitesLinks: "/content/available_sites_links",
    getContentBySubCategory: (subCategory) =>
      `/content/subcategory/${encodeURIComponent(subCategory)}`,
    getContentByCategory: (category, type) => {
      const base = `/content/category/${encodeURIComponent(category)}`;
      return type ? `${base}?type=${encodeURIComponent(type)}` : base;
    },
  },
  search: {
    searchContent: (query) => `/global_search?q=${encodeURIComponent(query)}`,
  },
  fleet: {
    getVehicles: "/vehicles",
    getPackages: "/packages",
    createCustomer: "/customers",
    createBooking: "/bookings",
  },
  auth: {
    login: "/auth/login",
    signup: "/auth/signup",
    logout: "/auth/logout",
  },
  categories: {
    getAll: "/categories",
  },
  socialMedia: {
    feed: "/social-media/feed",
  },
};

export default endpoints;
