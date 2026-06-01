export const PROFILE_RACE_PANEL_LIMIT = 5;

function formatRankValue(ranking, fallbackPosition) {
  const position = ranking?.position ?? fallbackPosition;
  if (position == null || position === "") return "—";
  return String(position);
}

function formatTdcpStageLabel(registration) {
  const afterStage = registration?.ranking?.after_stage;
  if (afterStage != null && afterStage !== "") {
    return `Stage ${afterStage}`;
  }

  const challengeTitle = registration?.challenge_id?.title;
  if (challengeTitle) return challengeTitle;

  return "Event";
}

function resolveCategoryLabel(registration) {
  return (
    registration?.category_id?.title ||
    registration?.vehicle_id?.category_id?.title ||
    registration?.category ||
    "—"
  );
}

function getEventYear(registration) {
  if (registration?.year != null) return Number(registration.year);
  const date = registration?.event_id?.date;
  if (!date) return null;
  const parsed = new Date(date).getFullYear();
  return Number.isNaN(parsed) ? null : parsed;
}

function parseTimestamp(value) {
  if (!value) return 0;
  const parsed = new Date(value).getTime();
  return Number.isNaN(parsed) ? 0 : parsed;
}

function getTdcpRaceRecencyMs(registration) {
  return (
    parseTimestamp(registration?.registered_at) ||
    parseTimestamp(registration?.updated_at) ||
    parseTimestamp(registration?.event_id?.date) ||
    (getEventYear(registration) ?? 0) * 1e10
  );
}

function getOtherRaceRecencyMs(race) {
  return (
    parseTimestamp(race?.updated_at) ||
    parseTimestamp(race?.created_at) ||
    (race?.year != null ? Number(race.year) : 0) * 1e10
  );
}

function takeMostRecent(items, getRecencyMs, limit = PROFILE_RACE_PANEL_LIMIT) {
  return [...items]
    .sort((a, b) => getRecencyMs(b) - getRecencyMs(a))
    .slice(0, limit);
}

export function getTdcpRaceEntries(raceHistory) {
  if (!raceHistory) return [];

  if (Array.isArray(raceHistory.tdcp_races) && raceHistory.tdcp_races.length > 0) {
    return raceHistory.tdcp_races;
  }

  return (raceHistory.tdcp_races_by_year ?? []).flatMap(
    (group) => group?.items ?? [],
  );
}

export function getOtherRaceEntries(raceHistory) {
  if (!raceHistory) return [];

  if (Array.isArray(raceHistory.other_races) && raceHistory.other_races.length > 0) {
    return raceHistory.other_races;
  }

  return (raceHistory.other_races_by_year ?? []).flatMap(
    (group) => group?.items ?? [],
  );
}

export function hasTeamStandingData(raceHistory) {
  return getTdcpRaceEntries(raceHistory).length > 0;
}

export function hasOtherRacesData(raceHistory) {
  return getOtherRaceEntries(raceHistory).length > 0;
}

/** Maps TDCP registrations to Team Standing accordion rows (most recent only). */
export function mapTdcpRacesToTeamStanding(
  raceHistory,
  limit = PROFILE_RACE_PANEL_LIMIT,
) {
  return takeMostRecent(
    getTdcpRaceEntries(raceHistory),
    getTdcpRaceRecencyMs,
    limit,
  )
    .map((registration) => {
      const year = getEventYear(registration);
      const teamName =
        registration?.team_id?.team_name ||
        registration?.team_id?.team_number ||
        "—";

      return {
        id: registration?._id || `${year}-${teamName}`,
        year: year != null ? String(year) : "—",
        stage: formatTdcpStageLabel(registration),
        rank: formatRankValue(registration?.ranking),
        role: "Driver",
        category: resolveCategoryLabel(registration),
        team: teamName,
      };
    });
}

/** Maps other-race records to Other Races accordion rows (most recent only). */
export function mapOtherRacesToPanelItems(
  raceHistory,
  limit = PROFILE_RACE_PANEL_LIMIT,
) {
  return takeMostRecent(
    getOtherRaceEntries(raceHistory),
    getOtherRaceRecencyMs,
    limit,
  ).map((race) => ({
      id: race?._id || `${race?.year}-${race?.team}`,
      year: race?.year != null ? String(race.year) : "—",
      stage: race?.role ? String(race.role) : "Race",
      rank: race?.position ? String(race.position) : "—",
      event: race?.team || "—",
      vehicle: race?.vehicle || "—",
    }));
}
