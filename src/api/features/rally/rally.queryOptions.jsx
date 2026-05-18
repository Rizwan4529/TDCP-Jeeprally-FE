import { fetchActiveRally, fetchCompletedRallies } from "./rally.service.jsx";

export const activeRallyQueryOptions = {
  queryKey: ["rally", "active"],
  queryFn: fetchActiveRally,
  staleTime: Infinity,
  gcTime: Infinity,
  refetchOnWindowFocus: false,
  refetchOnMount: false,
  retry: 1,
};

export const completedRalliesQueryOptions = {
  queryKey: ["rally", "completed"],
  queryFn: fetchCompletedRallies,
  staleTime: Infinity,
  gcTime: Infinity,
  refetchOnWindowFocus: false,
  refetchOnMount: false,
  retry: 1,
};
