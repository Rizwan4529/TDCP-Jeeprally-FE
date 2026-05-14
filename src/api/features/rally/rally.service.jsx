import rallyAxios from "../../rallyAxios.jsx";

function resolveRallyStaticUrl(assetPath) {
  if (assetPath == null || assetPath === "") return null;
  const trimmed = String(assetPath).trim();
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  const normalized = trimmed.replace(/\\/g, "/");
  const path = normalized.startsWith("/") ? normalized : `/${normalized}`;
  return `${getRallyStaticOrigin()}${path}`;
}

/** Origin for static uploads (served from app root, not under `/api/v1`). */
export function getRallyStaticOrigin() {
  try {
    const base = import.meta.env.VITE_RALLY_API_BASE_URL;
    if (base) return new URL(base).origin;
  } catch {
    /* ignore */
  }
  return "http://localhost:3000";
}

/**
 * Turns API paths like `uploads\\images\\file.png` into a full URL on the backend origin.
 */
export function resolveCheckpointImageUrl(image) {
  return resolveRallyStaticUrl(image);
}

export function resolveRallyVideoUrl(videoUrl) {
  return resolveRallyStaticUrl(videoUrl);
}

export async function fetchActiveRally() {
  const { data } = await rallyAxios.get("/rally/active");
  if (!data?.success) {
    throw new Error(data?.message || "Failed to load active rally");
  }
  return data.data;
}

export async function fetchRallyRoutes(eventId, category) {
  const { data } = await rallyAxios.get(`/rally/${eventId}/routes`, {
    params: { category },
  });
  if (!data?.success) {
    throw new Error(data?.message || "Failed to load routes");
  }
  return data.data ?? [];
}

export async function fetchRouteCheckpoints(routeId) {
  const { data } = await rallyAxios.get(`/routes/${routeId}/checkpoints`);
  if (!data?.success) {
    throw new Error(data?.message || "Failed to load checkpoints");
  }
  return data.data ?? [];
}

export async function fetchGeneralGallery({ page = 1, limit = 10 } = {}) {
  const { data } = await rallyAxios.get("/gallery/general", {
    params: { page, limit },
  });
  if (!data?.success) {
    throw new Error(data?.message || "Failed to load gallery");
  }
  return data.data ?? { images: [], pagination: { page: 1, limit, total: 0, pages: 1 } };
}

export async function fetchPartners() {
  const { data } = await rallyAxios.get("/partners");
  if (!data?.success) {
    throw new Error(data?.message || "Failed to load partners");
  }
  return data.data ?? [];
}

export async function fetchDestinationsGeneral() {
  const { data } = await rallyAxios.get("/destinations/general");
  if (!data?.success) {
    throw new Error(data?.message || "Failed to load destinations");
  }
  return data.data ?? [];
}

export async function fetchRallyDocuments(eventId) {
  const { data } = await rallyAxios.get(`/rally/${eventId}/documents`);
  if (!data?.success) {
    throw new Error(data?.message || "Failed to load documents");
  }
  return data.data ?? [];
}

export async function fetchRallyRankings(eventId, category) {
  const { data } = await rallyAxios.get(`/rally/${eventId}/rankings`, {
    params: { category },
  });
  if (!data?.success) {
    throw new Error(data?.message || "Failed to load rankings");
  }
  return data.data ?? [];
}

export async function fetchRallyChampions(eventId, category) {
  const { data } = await rallyAxios.get(`/rally/${eventId}/champions`, {
    params: { category },
  });
  if (!data?.success) {
    throw new Error(data?.message || "Failed to load champions");
  }
  return data.data ?? [];
}

export async function fetchRallyVideos() {
  const { data } = await rallyAxios.get("/videos");
  if (!data?.success) {
    throw new Error(data?.message || "Failed to load videos");
  }
  return data?.data?.videos ?? [];
}

export async function fetchRallyCompetitors(eventId, category) {
  const { data } = await rallyAxios.get(`/rally/${eventId}/competitors`, {
    params: category ? { category } : undefined,
  });
  if (!data?.success) {
    throw new Error(data?.message || "Failed to load competitors");
  }
  return data.data ?? [];
}
