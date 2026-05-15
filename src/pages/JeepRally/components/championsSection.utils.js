import {
  getDefaultCategoryKey,
  hasCategoryKey,
} from "../../../utils/constants.js";

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
} = {}) {
  return (
    Boolean(eventId) &&
    Boolean(activeCategoryKey) &&
    championsSuccess &&
    Array.isArray(champions) &&
    champions.length === 0
  );
}
