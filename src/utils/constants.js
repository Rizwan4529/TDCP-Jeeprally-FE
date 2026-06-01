// ---------------------------------------------------------------------------
// Image URL resolver
// ---------------------------------------------------------------------------

/**
 * Returns the origin of the backend server derived from VITE_API_BASE_URL.
 * Falls back to http://localhost:3000 if the env variable is absent or invalid.
 */
export function getBackendOrigin() {
  try {
    const base = import.meta.env.VITE_API_BASE_URL;
    if (base) return new URL(base).origin;
  } catch {
    /* ignore */
  }
  return "http://localhost:3000";
}

/** Fallback image shown when an API image URL is empty or fails to load. */
export const FALLBACK_IMAGE = "/assets/images/hero-bg.png";

/**
 * Resolves an image URL coming from the API:
 *  - null / empty  → returns `fallback`
 *  - absolute URL  → returned as-is
 *  - relative path → prepends the backend origin (from VITE_API_BASE_URL)
 */
export function resolveImageUrl(url, fallback = FALLBACK_IMAGE) {
  if (url == null || String(url).trim() === "") return fallback;

  const trimmed = String(url).trim();

  if (/^https?:\/\//i.test(trimmed)) return trimmed;

  const normalized = trimmed.replace(/\\/g, "/");
  const path = (normalized.startsWith("/") ? normalized : `/${normalized}`).replace(
    /\/+/g,
    "/"
  );
  return `${getBackendOrigin()}${path}`;
}

/**
 * `onError` handler for `<img>` elements.
 * Swaps a broken image src to `fallback` once, preventing infinite error loops.
 *
 * Usage: <img src={resolveImageUrl(url)} onError={handleImageError} />
 */
export function handleImageError(e, fallback = FALLBACK_IMAGE) {
  const img = e.currentTarget;
  if (img.dataset.fallbackApplied) return;
  img.dataset.fallbackApplied = "1";
  img.src = fallback;
}

// ---------------------------------------------------------------------------

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

export function getDefaultCategoryId(categories = []) {
  return normalizeCategories(categories)[0]?._id ?? "";
}

export function getCategoryIdByKey(categories = [], key) {
  if (!key) return "";
  return (
    normalizeCategories(categories).find((category) => category.key === key)
      ?._id ?? ""
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
