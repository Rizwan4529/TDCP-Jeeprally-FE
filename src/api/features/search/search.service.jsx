import api from "../../axios";
import endpoints from "../../endpoints";

export const getGlobalSearchResults = async (query) => {
  const response = await api(endpoints.search.searchContent(query));
  return response?.data || [];
}