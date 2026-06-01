import {
  getChampionDriverRecord,
  getChampionNavigatorRecord,
  getChampionTeamRecord,
  hasChampionNavigator,
  resolveChampionDriverProfileImageSource,
  resolveChampionNavigatorProfileImageSource,
} from "../JeepRally/components/championsSection.utils.js";

export function formatChampionNumber(number) {
  const value = String(number ?? "").trim();
  if (!value) return "—";
  return value.startsWith("#") ? value : `#${value}`;
}

/**
 * Driver user _id for GET /rankings/driver/:driverId — never the champion/competitor registration id.
 */
export function resolveDriverUserIdFromProfileRecord(record) {
  if (!record) return null;

  const driver = getChampionDriverRecord(record);
  if (driver?._id) return String(driver._id);

  const teamDriverId = record?.team_id?.driver_id;
  if (typeof teamDriverId === "string" && teamDriverId.trim()) {
    return teamDriverId.trim();
  }

  return null;
}

function formatDateOfBirth(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return `Born on ${date.toLocaleDateString("en-GB")}`;
}

function hasDetailValue(value) {
  if (value == null) return false;
  return String(value).trim() !== "";
}

function buildDetailRows(rows = []) {
  return rows.filter((row) => hasDetailValue(row.value));
}

function buildDriverDetails(champion) {
  const driver = getChampionDriverRecord(champion);
  const team = getChampionTeamRecord(champion);

  return buildDetailRows([
    {
      label: "AGE",
      value:
        driver?.age != null && driver?.age !== "" ? String(driver.age) : "",
    },
    {
      label: "OCCUPATION",
      value: driver?.occupation || "",
    },
    {
      label: "DATE OF BIRTH",
      value: formatDateOfBirth(driver?.date_of_birth) || "",
    },
    {
      label: "LOCATION",
      value: driver?.address || driver?.location || "",
    },
    {
      label: "TEAM",
      value: team?.team_name || "",
    },
  ]);
}

function buildNavigatorDetails(champion) {
  const navigator = getChampionNavigatorRecord(champion);
  const team = getChampionTeamRecord(champion);
  if (!navigator) return [];

  return buildDetailRows([
    {
      label: "OCCUPATION",
      value: navigator.occupation || "",
    },
    {
      label: "DATE OF BIRTH",
      value: formatDateOfBirth(navigator.date_of_birth) || "",
    },
    {
      label: "LOCATION",
      value: navigator.location || "",
    },
    {
      label: "TEAM",
      value: team?.team_name || "",
    },
  ]);
}

function normalizeFallbackProfile(fallbackProfile) {
  const details = Array.isArray(fallbackProfile?.details)
    ? fallbackProfile.details
    : [];
  const driverImage = String(fallbackProfile?.driverImage ?? "").trim();
  const navigatorImage = String(fallbackProfile?.navigatorImage ?? "").trim();

  return {
    ...fallbackProfile,
    driverImage,
    navigatorImage,
    hasDriverImage: Boolean(driverImage),
    hasNavigatorImage: Boolean(navigatorImage),
    hasNavigator: Boolean(fallbackProfile?.hasNavigator),
    navigatorName: fallbackProfile?.navigatorName || "",
    driverDetails: fallbackProfile?.driverDetails ?? details,
    navigatorDetails: fallbackProfile?.navigatorDetails ?? [],
  };
}

export function buildPlayerProfile(champion, fallbackProfile) {
  const normalizedFallback = normalizeFallbackProfile(fallbackProfile);

  if (!champion) return normalizedFallback;

  const team = getChampionTeamRecord(champion);
  const driver = getChampionDriverRecord(champion);
  const teamName = team?.team_name || normalizedFallback.teamName;
  const teamNumber = team?.team_number || normalizedFallback.teamNumber;
  const driverName =
    driver?.name || champion.driver_name || normalizedFallback.driverName;
  const navigator = getChampionNavigatorRecord(champion);
  const navigatorPresent = hasChampionNavigator(champion);
  const navigatorName = navigatorPresent ? navigator?.name || "" : "";
  const driverImageSource = resolveChampionDriverProfileImageSource(champion);
  const navigatorImageSource = navigatorPresent
    ? resolveChampionNavigatorProfileImageSource(champion)
    : null;
  const hasDriverImage = Boolean(driverImageSource);
  const hasNavigatorImage = Boolean(navigatorImageSource);
  const driverImage = driverImageSource || "";
  const navigatorImage = navigatorImageSource || "";
  const heroImage = hasDriverImage
    ? driverImage
    : normalizedFallback.heroImage || "";
  const driverDetails = buildDriverDetails(champion);
  const navigatorDetails = buildNavigatorDetails(champion);

  return {
    ...normalizedFallback,
    id: champion._id || normalizedFallback.id,
    number: formatChampionNumber(teamNumber || normalizedFallback.number),
    driverName,
    navigatorName,
    teamName,
    teamNumber,
    heroImage,
    driverImage,
    navigatorImage,
    hasDriverImage,
    hasNavigatorImage,
    hasNavigator: navigatorPresent,
    driverDetails,
    navigatorDetails,
    details: driverDetails,
    driverUserId: resolveDriverUserIdFromProfileRecord(champion),
  };
}
