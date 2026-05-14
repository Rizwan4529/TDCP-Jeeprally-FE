const PLAYER_PLACEHOLDER_IMAGES = [
  "/assets/images/pl1.png",
  "/assets/images/pl2.png",
  "/assets/images/pl3.png",
];

export function formatCompetitorNumber(teamNumber) {
  const trimmed = String(teamNumber ?? "").trim();
  if (!trimmed) return "#—";
  return trimmed.startsWith("#") ? trimmed : `#${trimmed}`;
}

export function mapCompetitorsToPlayers(
  competitors = [],
  resolveImage = (value) => value
) {
  return competitors.map((competitor, index) => {
    const driver = competitor.team_id?.driver_id || {};
    const fallbackImage =
      PLAYER_PLACEHOLDER_IMAGES[index % PLAYER_PLACEHOLDER_IMAGES.length];
    const driverImage = competitor.driver_image || driver.profile_image;

    return {
      id: competitor._id,
      number: formatCompetitorNumber(competitor.team_id?.team_number),
      name: driver.name || "—",
      image: resolveImage(driverImage) || fallbackImage,
    };
  });
}

export function getPlayerSkeletonCards(count = 4) {
  return Array.from({ length: count }, (_, index) => ({
    id: `player-skeleton-${index}`,
  }));
}
