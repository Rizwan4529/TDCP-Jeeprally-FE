import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, useSearchParams } from "react-router";
import { fetchTeamVehicle } from "../../api/features/fleet/fleet.service.jsx";
import {
  fetchDriverRaceHistory,
  fetchDriverRankingsParticipation,
  fetchRallyChampions,
  fetchRallyCompetitors,
} from "../../api/features/rally/rally.service.jsx";
import { activeRallyQueryOptions } from "../../api/features/rally/rally.queryOptions.jsx";
import { useCategoriesQuery } from "../../api/features/content/hooks.jsx";
import {
  getCategoryIdByKey,
  getDefaultCategoryKey,
  hasCategoryKey,
} from "../../utils/constants.js";
import {
  getRallyTeamId,
  hasVehicleFromApi,
  resolveGearUpEventId,
} from "./gearUpSection.utils.js";
import {
  hasOtherRacesData,
  hasTeamStandingData,
  mapOtherRacesToPanelItems,
  mapTdcpRacesToTeamStanding,
} from "./driverRaceHistory.utils.js";
import { hasRankingsParticipationData } from "./rankingsChart.utils.js";
import { STATIC_CHAMPION_PROFILES } from "./playerProfile.data.js";
import {
  buildPlayerProfile,
  resolveDriverUserIdFromProfileRecord,
} from "./playerProfile.utils.js";

export function usePlayerProfilePage() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const { data: activeEvent } = useQuery(activeRallyQueryOptions);
  const { data: categoriesRaw = [] } = useCategoriesQuery();

  const eventIdFromQuery = searchParams.get("eventId") || "";
  const eventId = eventIdFromQuery || activeEvent?._id || "";
  const requestedCategory = searchParams.get("category") || "";
  const profileSource = searchParams.get("source") || "champion";
  const isCompetitorProfile = profileSource === "competitor";
  const isPastEventProfile = Boolean(eventIdFromQuery);

  const activeCategoryKey = useMemo(() => {
    if (isPastEventProfile) {
      return requestedCategory;
    }
    if (hasCategoryKey(categoriesRaw, requestedCategory)) {
      return requestedCategory;
    }
    return getDefaultCategoryKey(categoriesRaw);
  }, [categoriesRaw, isPastEventProfile, requestedCategory]);

  const activeCategoryId = useMemo(
    () => getCategoryIdByKey(categoriesRaw, activeCategoryKey),
    [activeCategoryKey, categoriesRaw],
  );

  const fallbackProfile = useMemo(
    () =>
      STATIC_CHAMPION_PROFILES.find((item) => item.id === id) ||
      STATIC_CHAMPION_PROFILES[0],
    [id],
  );

  const championsQuery = useQuery({
    queryKey: [
      "rally",
      "champions",
      "player-profile",
      eventId,
      activeCategoryId || "all",
    ],
    queryFn: () =>
      fetchRallyChampions(eventId, activeCategoryId || undefined),
    enabled: Boolean(
      !isCompetitorProfile &&
        eventId &&
        (isPastEventProfile || activeCategoryId),
    ),
    refetchOnWindowFocus: false,
  });

  const competitorsQuery = useQuery({
    queryKey: [
      "rally",
      "competitors",
      "player-profile",
      eventId,
      activeCategoryKey,
    ],
    queryFn: () => fetchRallyCompetitors(eventId, activeCategoryKey),
    enabled: Boolean(isCompetitorProfile && eventId && activeCategoryKey),
    refetchOnWindowFocus: false,
  });

  const profileRecord = useMemo(() => {
    if (isCompetitorProfile) {
      return (
        competitorsQuery.data?.find((item) => item._id === id) ?? null
      );
    }
    return championsQuery.data?.find((item) => item._id === id) ?? null;
  }, [championsQuery.data, competitorsQuery.data, id, isCompetitorProfile]);

  const profile = useMemo(
    () => buildPlayerProfile(profileRecord, fallbackProfile),
    [fallbackProfile, profileRecord],
  );

  const driverUserId = useMemo(
    () => resolveDriverUserIdFromProfileRecord(profileRecord),
    [profileRecord],
  );

  const teamId = useMemo(
    () => getRallyTeamId(profileRecord),
    [profileRecord],
  );

  const gearUpEventId = useMemo(
    () =>
      resolveGearUpEventId({
        eventIdFromQuery,
        activeEventId: activeEvent?._id,
        profileRecord,
      }),
    [activeEvent?._id, eventIdFromQuery, profileRecord],
  );

  const rankingsQuery = useQuery({
    queryKey: ["rankings", "driver", driverUserId, "participation"],
    queryFn: () => fetchDriverRankingsParticipation(driverUserId),
    enabled: Boolean(driverUserId),
    refetchOnWindowFocus: false,
  });

  const driverRacesQuery = useQuery({
    queryKey: ["rankings", "driver", driverUserId, "races"],
    queryFn: () => fetchDriverRaceHistory(driverUserId),
    enabled: Boolean(driverUserId),
    refetchOnWindowFocus: false,
  });

  const vehicleQuery = useQuery({
    queryKey: ["vehicles", "team", gearUpEventId, teamId],
    queryFn: () => fetchTeamVehicle(gearUpEventId, teamId),
    enabled: Boolean(gearUpEventId && teamId),
    refetchOnWindowFocus: false,
  });

  const isProfileLoading = isCompetitorProfile
    ? competitorsQuery.isPending
    : championsQuery.isPending;

  const showRankingsSection = useMemo(() => {
    if (!driverUserId) return false;
    if (rankingsQuery.isPending) return false;
    if (rankingsQuery.isError) return false;
    return hasRankingsParticipationData(rankingsQuery.data);
  }, [
    driverUserId,
    rankingsQuery.data,
    rankingsQuery.isError,
    rankingsQuery.isPending,
  ]);

  const showVehicleSection = useMemo(() => {
    if (!gearUpEventId || !teamId) return false;
    if (vehicleQuery.isPending) return false;
    if (vehicleQuery.isError) return false;
    return hasVehicleFromApi(vehicleQuery.data);
  }, [
    gearUpEventId,
    teamId,
    vehicleQuery.data,
    vehicleQuery.isError,
    vehicleQuery.isPending,
  ]);

  const teamStandingItems = useMemo(
    () => mapTdcpRacesToTeamStanding(driverRacesQuery.data),
    [driverRacesQuery.data],
  );

  const otherRaceItems = useMemo(
    () => mapOtherRacesToPanelItems(driverRacesQuery.data),
    [driverRacesQuery.data],
  );

  const showTeamStandingPanel = useMemo(() => {
    if (!driverUserId) return false;
    if (driverRacesQuery.isPending) return false;
    if (driverRacesQuery.isError) return false;
    return hasTeamStandingData(driverRacesQuery.data);
  }, [
    driverUserId,
    driverRacesQuery.data,
    driverRacesQuery.isError,
    driverRacesQuery.isPending,
  ]);

  const showOtherRacesPanel = useMemo(() => {
    if (!driverUserId) return false;
    if (driverRacesQuery.isPending) return false;
    if (driverRacesQuery.isError) return false;
    return hasOtherRacesData(driverRacesQuery.data);
  }, [
    driverUserId,
    driverRacesQuery.data,
    driverRacesQuery.isError,
    driverRacesQuery.isPending,
  ]);

  return {
    id,
    eventId,
    eventIdFromQuery,
    activeCategoryKey,
    isCompetitorProfile,
    isPastEventProfile,
    profile,
    profileRecord,
    driverUserId,
    teamId,
    gearUpEventId,
    isProfileLoading,
    championsQuery,
    competitorsQuery,
    rankingsQuery,
    driverRacesQuery,
    vehicleQuery,
    teamStandingItems,
    otherRaceItems,
    showRankingsSection,
    showVehicleSection,
    showTeamStandingPanel,
    showOtherRacesPanel,
  };
}
