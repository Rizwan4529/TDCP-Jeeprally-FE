export function normalizeCategories(categories = []) {
  if (!Array.isArray(categories)) return [];

  return categories
    .filter((category) => category?.key && category?.title)
    .map((category) => ({
      ...category,
      key: String(category.key),
      title: String(category.title),
    }));
}

export function getDefaultCategoryKey(categories = []) {
  return normalizeCategories(categories)[0]?.key ?? "";
}

export function getCategoryLabelMap(categories = []) {
  return Object.fromEntries(
    normalizeCategories(categories).map((category) => [
      category.key,
      category.title,
    ]),
  );
}

export function getCategoryFilterTabs(categories = []) {
  return normalizeCategories(categories).map((category) => ({
    key: category.key,
    title: category.title,
  }));
}

export function hasCategoryKey(categories = [], key) {
  if (!key) return false;
  return normalizeCategories(categories).some(
    (category) => category.key === key,
  );
}

/** localStorage key for the active rally event id (set from GET /rally/active on each full page load). */
export const ACTIVE_RALLY_EVENT_ID_KEY = "tdcp_active_rally_event_id";

export function getActiveRallyEventIdFromStorage() {
  try {
    return localStorage.getItem(ACTIVE_RALLY_EVENT_ID_KEY);
  } catch {
    return null;
  }
}
