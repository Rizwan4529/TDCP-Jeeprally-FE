import { useQuery } from "@tanstack/react-query"
import { fetchPastOrUpcomingServices, fetchResorts, fetchServiceById, fetchServices } from "./events.service"

export const useServicesQuery = (filters) => {
  return useQuery({
    queryKey: ["services", filters],
    queryFn: () => fetchServices(filters),
  })
}

export const usePastOrUpcomingServicesQuery = (status) => {
  return useQuery({
    queryKey: ["services/status", status],
    queryFn: () => fetchPastOrUpcomingServices(status),
  })
}

export const useServiceByIdQuery = (id) => {
  return useQuery({
    queryKey: ["service", id],
    queryFn: () => fetchServiceById(id),
    enabled: !!id,
  })
}

export const useResortsQuery = () => {
  return useQuery({
    queryKey: ["resorts"],
    queryFn: () => fetchResorts(),
  })
}
