import {
  getDefaultCategoryKey,
  hasCategoryKey,
} from "../../../utils/constants.js";

const SIDE_PODIUM_CARD_HEIGHT = "h-[420px] md:h-[520px]";
const SIDE_PODIUM_FOOTER_HEIGHT = "h-[84px] md:h-[92px]";

const POSITION_STYLES = {
  1: {
    cardHeight: "h-[480px] md:h-[580px]",
    footerHeight: "h-[84px] md:h-[92px]",
    order: "order-2",
  },
  2: {
    cardHeight: SIDE_PODIUM_CARD_HEIGHT,
    footerHeight: SIDE_PODIUM_FOOTER_HEIGHT,
    order: "order-1",
  },
  3: {
    cardHeight: SIDE_PODIUM_CARD_HEIGHT,
    footerHeight: SIDE_PODIUM_FOOTER_HEIGHT,
    order: "order-3",
  },
};

export const PODIUM_DISPLAY_COUNT = 3;

export function getChampionNavigatorRecord(champion) {
  const navigator = champion?.team_id?.navigator_id;
  if (!navigator || typeof navigator !== "object") return null;
  if (!navigator.name && !navigator._id) return null;
  return navigator;
}

export function hasChampionNavigator(champion) {
  return Boolean(getChampionNavigatorRecord(champion));
}

export function resolveChampionDriverImageSource(champion) {
  return (
    champion?.driver_image ||
    champion?.team_id?.driver_id?.profile_image ||
    champion?.image ||
    null
  );
}

export function resolveChampionNavigatorImageSource(champion) {
  if (!hasChampionNavigator(champion)) return null;
  const navigator = getChampionNavigatorRecord(champion);
  return champion?.navigator_image || navigator?.profile_image || null;
}

export function getCategoryTabsWithChampions(tabs = [], champions = []) {
  if (!Array.isArray(tabs) || tabs.length === 0) {
    return [];
  }

  const keysWithChampions = new Set(
    (champions ?? [])
      .map((champion) => champion?.category)
      .filter(Boolean)
      .map(String),
  );

  return tabs.filter((tab) => keysWithChampions.has(tab.key));
}

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

export function shouldHideChampionsSection({
  isLoading = false,
  hasEvent = false,
  usesAllChampionsGate = false,
  allChampionsReady = false,
  allChampionsCount = 0,
  visibleTabCount = 0,
  usesCategoryQuery = false,
  categoryChampionsReady = false,
  categoryChampionsCount = 0,
} = {}) {
  if (isLoading) return true;
  if (!hasEvent) return true;

  if (usesAllChampionsGate) {
    if (!allChampionsReady) return true;
    if (allChampionsCount === 0) return true;
    if (visibleTabCount === 0) return true;
    return false;
  }

  if (usesCategoryQuery) {
    if (!categoryChampionsReady) return true;
    if (categoryChampionsCount === 0) return true;
    return false;
  }

  return true;
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

export function getTopChampionsByPosition(
  champions = [],
  limit = PODIUM_DISPLAY_COUNT,
) {
  return sortChampionsList(champions).slice(0, limit);
}

function mapChampionRecord(champion, visualPosition, resolveImage) {
  const style = POSITION_STYLES[visualPosition] ?? {
    cardHeight: SIDE_PODIUM_CARD_HEIGHT,
    footerHeight: SIDE_PODIUM_FOOTER_HEIGHT,
    order: "",
  };
  const navigator = getChampionNavigatorRecord(champion);
  const driverName =
    champion.team_id?.driver_id?.name || champion.driver_name || "—";

  return {
    id: champion._id,
    rank: String(champion.position ?? "—"),
    name: driverName,
    navigatorName: navigator?.name || champion.navigator_name || "",
    team: champion.team_id?.team_name || "Team",
    category: champion.category || "",
    image: resolveImage(resolveChampionDriverImageSource(champion)),
    cardHeight: style.cardHeight,
    footerHeight: style.footerHeight,
    order: style.order,
    podiumOrder: visualPosition,
  };
}

function resolvePodiumPosition(champion, fallbackPosition) {
  const rank = Number(champion?.position);
  if (rank >= 1 && rank <= PODIUM_DISPLAY_COUNT) {
    return rank;
  }
  return fallbackPosition;
}

export function mapChampionSlideToPodium(championsInSlide = [], resolveImage) {
  return getTopChampionsByPosition(championsInSlide)
    .map((champion, index) =>
      mapChampionRecord(
        champion,
        resolvePodiumPosition(champion, index + 1),
        resolveImage,
      ),
    )
    .sort((a, b) => a.podiumOrder - b.podiumOrder);
}

export function mapChampionsToPodium(champions = [], resolveImage) {
  return mapChampionSlideToPodium(champions, resolveImage);
}
