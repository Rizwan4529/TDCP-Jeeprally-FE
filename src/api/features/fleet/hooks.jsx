import { useQuery, useMutation } from "@tanstack/react-query";
import { fetchVehicles, fetchPackages, createCustomer, createBooking } from "./fleet.service";

export const useVehiclesQuery = (filters) => {
  return useQuery({
    queryKey: ["vehicles", filters],
    queryFn: () => fetchVehicles(filters),
  });
};

export const usePackagesQuery = (filters) => {
  return useQuery({
    queryKey: ["packages", filters],
    queryFn: () => fetchPackages(filters),
  });
};

export const useCreateCustomerMutation = () => {
  return useMutation({
    mutationFn: createCustomer,
  });
};

export const useCreateBookingMutation = () => {
  return useMutation({
    mutationFn: createBooking,
  });
};
