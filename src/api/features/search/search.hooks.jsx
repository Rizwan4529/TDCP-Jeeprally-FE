import { useQuery } from "@tanstack/react-query";

import { getGlobalSearchResults } from "./search.service";

export const useGlobalSearchQuery = (query) => {
  return useQuery({
    queryKey: ["global-search", query],
    queryFn: () => getGlobalSearchResults(query),
    enabled: !!query,
  })
}