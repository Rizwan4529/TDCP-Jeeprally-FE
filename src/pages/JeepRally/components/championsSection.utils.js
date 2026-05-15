import {
  getDefaultCategoryKey,
  hasCategoryKey,
} from "../../../utils/constants.js";

const POSITION_STYLES = {
  1: { height: "h-[360px] md:h-[460px]", order: "order-2" },
  2: { height: "h-[320px] md:h-[400px]", order: "order-1" },
  3: { height: "h-[320px] md:h-[400px]", order: "order-3" },
};

/** Visual podium positions for up to 3 cards in a carousel slide (left, center, right). */
const SLIDE_PODIUM_POSITIONS = [2, 1, 3];

export function resolveChampionsCategoryKey({
  categories = [],
  activeCategoryKey = "",
  forcedCategoryKey = "",
} = {}) {
  if (forcedCategoryKey) {
    return String(forcedCategoryKey);
  }

  if (hasCategoryKey(categories, activeCategoryKey)) {
    return activeCategoryKey;
  }

  return getDefaultCategoryKey(categories);
}

export function shouldShowChampionsEmpty({
  eventId,
  activeCategoryKey,
  champions = [],
  championsSuccess = false,
  requireCategory = true,
} = {}) {
  return (
    Boolean(eventId) &&
    (!requireCategory || Boolean(activeCategoryKey)) &&
    championsSuccess &&
    Array.isArray(champions) &&
    champions.length === 0
  );
}

export function sortChampionsList(champions = []) {
  return [...champions].sort((a, b) => {
    const positionDiff = Number(a.position ?? 0) - Number(b.position ?? 0);
    if (positionDiff !== 0) return positionDiff;

    const aName = a.driver_name || a.team_id?.driver_id?.name || "";
    const bName = b.driver_name || b.team_id?.driver_id?.name || "";
    return aName.localeCompare(bName);
  });
}

export function chunkChampions(champions = [], size = 3) {
  if (!champions.length) return [];

  const chunks = [];
  for (let index = 0; index < champions.length; index += size) {
    chunks.push(champions.slice(index, index + size));
  }
  return chunks;
}

function mapChampionRecord(champion, visualPosition, resolveImage) {
  const style = POSITION_STYLES[visualPosition] ?? {
    height: "h-[320px] md:h-[400px]",
    order: "",
  };

  return {
    id: champion._id,
    rank: String(champion.position ?? "—"),
    name: champion.team_id?.driver_id?.name || champion.driver_name || "—",
    team: champion.team_id?.team_name || "Team",
    category: champion.category || "",
    image: resolveImage(
      champion.image ||
        champion.driver_image ||
        champion.team_id?.driver_id?.profile_image,
    ),
    height: style.height,
    order: style.order,
    podiumOrder: visualPosition,
  };
}

export function mapChampionSlideToPodium(championsInSlide = [], resolveImage) {
  return championsInSlide
    .map((champion, index) => {
      const visualPosition = SLIDE_PODIUM_POSITIONS[index] ?? index + 1;
      return mapChampionRecord(champion, visualPosition, resolveImage);
    })
    .sort((a, b) => a.podiumOrder - b.podiumOrder);
}

export function mapChampionsToPodium(champions = [], resolveImage) {
  return mapChampionSlideToPodium(
    sortChampionsList(champions).slice(0, 3),
    resolveImage,
  );
}
