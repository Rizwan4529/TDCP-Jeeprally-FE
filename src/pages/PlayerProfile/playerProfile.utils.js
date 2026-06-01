import {
  getChampionNavigatorRecord,
  hasChampionNavigator,
  resolveChampionDriverImageSource,
  resolveChampionNavigatorImageSource,
} from "../JeepRally/components/championsSection.utils.js";

export function formatChampionNumber(number) {
  const value = String(number ?? "").trim();
  if (!value) return "—";
  return value.startsWith("#") ? value : `#${value}`;
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
  const driver = champion.team_id?.driver_id;

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
      value: champion.team_id?.team_name || "",
    },
  ]);
}

function buildNavigatorDetails(champion) {
  const navigator = getChampionNavigatorRecord(champion);
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
      value: champion.team_id?.team_name || "",
    },
  ]);
}

function normalizeFallbackProfile(fallbackProfile) {
  const details = Array.isArray(fallbackProfile?.details)
    ? fallbackProfile.details
    : [];

  return {
    ...fallbackProfile,
    hasNavigator: Boolean(fallbackProfile?.hasNavigator),
    navigatorName: fallbackProfile?.navigatorName || "",
    driverDetails: fallbackProfile?.driverDetails ?? details,
    navigatorDetails: fallbackProfile?.navigatorDetails ?? [],
  };
}

export function buildPlayerProfile(champion, fallbackProfile) {
  const normalizedFallback = normalizeFallbackProfile(fallbackProfile);

  if (!champion) return normalizedFallback;

  const teamName = champion.team_id?.team_name || normalizedFallback.teamName;
  const teamNumber =
    champion.team_id?.team_number || normalizedFallback.teamNumber;
  const driverName =
    champion.team_id?.driver_id?.name ||
    champion.driver_name ||
    normalizedFallback.driverName;
  const navigator = getChampionNavigatorRecord(champion);
  const navigatorPresent = hasChampionNavigator(champion);
  const navigatorName = navigatorPresent
    ? navigator?.name || champion.navigator_name || ""
    : "";
  const driverImage =
    resolveChampionDriverImageSource(champion) ||
    normalizedFallback.driverImage;
  const navigatorImage = navigatorPresent
    ? resolveChampionNavigatorImageSource(champion) ||
      normalizedFallback.navigatorImage
    : "";
  const heroImage = driverImage || normalizedFallback.heroImage;
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
    hasNavigator: navigatorPresent,
    driverDetails,
    navigatorDetails,
    details: driverDetails,
  };
}
