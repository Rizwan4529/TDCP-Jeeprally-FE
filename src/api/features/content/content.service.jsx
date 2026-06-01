import api from "../../axios";
import endpoints from "../../endpoints";
import { getBackendOrigin, resolveImageUrl } from "../../../utils/constants.js";

export const getContentStaticOrigin = () => getBackendOrigin();

export const resolveCategoryImageUrl = (image) => resolveImageUrl(image);

export const fetchContent = async (filters = {}) => {
  const queryParams = new URLSearchParams();

  if (filters.id !== undefined) {
    queryParams.append("id", filters.id);
  }

  if (filters.pageName) {
    queryParams.append("pageName", filters.pageName);
  }

  const url = `${endpoints.content.getContent}?${queryParams.toString()}`;

  const response = await api.get(url);
  return response.data?.content || [];
};

export const fetchAllContent = async (filters = {}) => {
  const queryParams = new URLSearchParams();
  if (filters.type) {
    queryParams.append("type", filters.type);
  }
  if (filters.districtId) {
    queryParams.append("districtId", filters.districtId);
  }
  const url = `${endpoints.content.getAllContent}?${queryParams.toString()}`;
  const response = await api.get(url);
  return response.data?.contents || [];
};

export const fetchNamesList = async (filters = {}) => {
  const queryParams = new URLSearchParams();
  if (filters.type) {
    queryParams.append("type", filters.type);
  }

  queryParams.append("source", "site");

  const url = `${endpoints.content.getNameList}?${queryParams.toString()}`;

  const response = await api.get(url);
  return response.data?.results || [];
};

export const fetchAvailableSitesLinks = async () => {
  const url = `${endpoints.content.getAvailableSitesLinks}`;
  const response = await api.get(url);
  return response.data?.links || [];
};

export const fetchContentBySubCategory = async (subCategory) => {
  const url = `${endpoints.content.getContentBySubCategory(subCategory)}`;
  const response = await api.get(url);
  return response?.data?.data || [];
};

export const fetchContentByCategory = async (category, type) => {
  const url = `${endpoints.content.getContentByCategory(category, type)}`;
  const response = await api.get(url);
  return response?.data?.data || [];
};

export const fetchServiceContent = async (id) => {
  const url = `${endpoints.content.getServiceContent(id)}`;
  const response = await api.get(url);
  return response?.data?.data?.[0]?.content || null;
};

export const fetchCategories = async () => {
  const response = await api.get(endpoints.categories.getAll);
  if (!response?.data?.success) {
    throw new Error(response?.data?.message || "Failed to load categories");
  }
  return response?.data?.data || [];
};
