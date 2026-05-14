export function formatChampionNumber(number) {
  const value = String(number ?? "").trim();
  if (!value) return "—";
  return value.startsWith("#") ? value : `#${value}`;
}

export function buildPlayerProfile(champion, fallbackProfile) {
  console.log("Champion", champion);
  if (!champion) return fallbackProfile;

  const teamName = champion.team_id?.team_name || fallbackProfile.teamName;
  const teamNumber =
    champion.team_id?.team_number || fallbackProfile.teamNumber;
  const driverName =
    champion.team_id?.driver_id?.name ||
    champion.driver_name ||
    fallbackProfile.driverName;
  const heroImage =
    champion.image || champion.driver_image || fallbackProfile.heroImage;
  const driverImage =
    champion.driver_image ||
    champion.image ||
    champion.team_id?.driver_id?.profile_image ||
    fallbackProfile.driverImage;

  return {
    ...fallbackProfile,
    id: champion._id || fallbackProfile.id,
    number: formatChampionNumber(teamNumber || fallbackProfile.number),
    driverName,
    teamName,
    teamNumber,
    heroImage,
    driverImage,
    details: fallbackProfile.details.map((detail) => {
      if (detail.label === "LOCATION") {
        return {
          ...detail,
          value: champion.event_id?.location || detail.value,
        };
      }

      if (detail.label === "TEAM") {
        return {
          ...detail,
          value: teamName || detail.value,
        };
      }

      return detail;
    }),
  };
}
