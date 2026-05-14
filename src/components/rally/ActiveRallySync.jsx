import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { activeRallyQueryOptions } from "../../api/features/rally/rally.queryOptions.jsx";
import { ACTIVE_RALLY_EVENT_ID_KEY } from "../../utils/constants.js";

/**
 * Fetches the active rally once per app session and mirrors its id to localStorage
 * so other code can read {@link ACTIVE_RALLY_EVENT_ID_KEY}.
 */
export function ActiveRallySync() {
  const { data } = useQuery(activeRallyQueryOptions);

  useEffect(() => {
    const id = data?._id;
    if (id) {
      try {
        localStorage.setItem(ACTIVE_RALLY_EVENT_ID_KEY, id);
      } catch {
        // ignore quota / private mode
      }
    }
  }, [data]);

  return null;
}
