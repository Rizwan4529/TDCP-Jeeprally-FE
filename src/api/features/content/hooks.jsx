import { useQuery } from "@tanstack/react-query"
import { fetchAllContent, fetchAvailableSitesLinks, fetchContent, fetchContentByCategory, fetchContentBySubCategory, fetchNamesList, fetchServiceContent } from "./content.service"

export const useContentQuery = (filters) => {
  return useQuery({
    queryKey: ["content", filters],
    queryFn: () => fetchContent(filters),
  })
}

export const useAllContentQuery = (filters) => {
  return useQuery({
    queryKey: ["all-content", filters],
    queryFn: () => fetchAllContent(filters),
  })
}

export const useContentNamesListQuery = (filters) => {
  return useQuery({
    queryKey: ["content-names-list", filters],
    queryFn: () => fetchNamesList(filters),
  })
}

export const useAvailableSitesLinksQuery = () => {
  return useQuery({
    queryKey: ["available-sites-links"],
    queryFn: () => fetchAvailableSitesLinks(),
  })
}

export const useContentBySubCategoryQuery = (subCategory) => {
  return useQuery({
    queryKey: ["content-by-subcategory", subCategory],
    queryFn: () => fetchContentBySubCategory(subCategory),
  })
}

export const useContentByCategoryQuery = (category, type) => {
  return useQuery({
    queryKey: ["content-by-category", category, type],
    queryFn: () => fetchContentByCategory(category, type),
  })
}

export const useServiceContentQuery = (id) => {
  return useQuery({
    queryKey: ["service-content", id],
    queryFn: () => fetchServiceContent(id),
    enabled: !!id,
  })
}
