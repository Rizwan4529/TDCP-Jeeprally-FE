const endpoints = {
  services: {
    getAllServices: '/api/get_services',
    getService: (id) => `/api/get_service/${id}`,
    getServiceById: (id) => `/api/get_service/${id}`,
    getUpcomingOrPastServices: (status) => `/api/get_services/status?status=${status}`,
  },
  content: {
    getAllContent: `/api/content/all`,
    getContent: `/api/content`,
    getServiceContent: (id) => `/api/content/service/${id}`,
    getNameList: `/api/content/names-list`,
    getAvailableSitesLinks: `/api/content/available_sites_links`,
    getContentBySubCategory: (subCategory) => `/api/content/subcategory/${encodeURIComponent(subCategory)}`,
    getContentByCategory: (category, type) => {
      const base = `/api/content/category/${encodeURIComponent(category)}`;
      return type ? `${base}?type=${encodeURIComponent(type)}` : base;
    },
  },
  search: {
    searchContent: (query) => `/api/global_search?q=${encodeURIComponent(query)}`,
  },
  fleet: {
    getVehicles: "/api/v1/vehicles",
    getPackages: "/api/v1/packages",
    createCustomer: "/api/v1/customers",
    createBooking: "/api/v1/bookings",
  },
  auth: {
    login: "/api/v1/auth/login",
    signup: "/api/v1/auth/signup",
    logout: "/api/v1/auth/logout",
  },
  categories: {
    getAll: "/categories",
  }
}

export default endpoints