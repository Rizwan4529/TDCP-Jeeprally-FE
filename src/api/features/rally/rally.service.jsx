import api from "../../axios.jsx";
import { getBackendOrigin, resolveImageUrl } from "../../../utils/constants.js";

/** Origin for static uploads (served from app root, not under `/api/v1`). */
export function getRallyStaticOrigin() {
  return getBackendOrigin();
}

/**
 * Turns API paths like `uploads\\images\\file.png` into a full URL on the backend origin.
 */
export function resolveCheckpointImageUrl(image) {
  return resolveImageUrl(image);
}

export function resolveRallyVideoUrl(videoUrl) {
  return resolveImageUrl(videoUrl, null);
}

export async function fetchActiveRally() {
  const { data } = await api.get("/rally/active");
  if (!data?.success) {
    throw new Error(data?.message || "Failed to load active rally");
  }
  return data.data;
}

export async function fetchPastRallies() {
  const { data } = await api.get("/rally", { params: { type: "past" } });
  if (!data?.success) {
    throw new Error(data?.message || "Failed to load past rallies");
  }
  return data.data ?? [];
}

export async function fetchCompletedRallies() {
  const { data } = await api.get("/rally", {
    params: { status: "completed" },
  });
  if (!data?.success) {
    throw new Error(data?.message || "Failed to load completed rallies");
  }
  return data.data ?? [];
}

export async function fetchRallyStages(eventId) {
  const { data } = await api.get(`/rally/${eventId}/stages`);
  if (!data?.success) {
    throw new Error(data?.message || "Failed to load stages");
  }
  return data.data ?? [];
}

/** Overall rally route (single object) for the routes overview page. */
export async function fetchRallyRoute(eventId) {
  const { data } = await api.get(`/rally/${eventId}/routes`);
  if (!data?.success) {
    throw new Error(data?.message || "Failed to load route");
  }
  return data.data ?? null;
}

/** Category-scoped routes list (checkpoint map). */
export async function fetchRallyRoutes(eventId, category) {
  const { data } = await api.get(`/rally/${eventId}/routes`, {
    params: { category },
  });
  if (!data?.success) {
    throw new Error(data?.message || "Failed to load routes");
  }
  const payload = data.data;
  if (Array.isArray(payload)) return payload;
  if (payload && typeof payload === "object") return [payload];
  return [];
}

export async function fetchRouteCheckpoints(routeId) {
  const { data } = await api.get(`/routes/${routeId}/checkpoints`);
  if (!data?.success) {
    throw new Error(data?.message || "Failed to load checkpoints");
  }
  return data.data ?? [];
}

export async function fetchStageCheckpoints(stageId, categoryId) {
  const { data } = await api.get("/checkpoints", {
    params: {
      stage_id: stageId,
      category_id: categoryId,
    },
  });
  if (!data?.success) {
    throw new Error(data?.message || "Failed to load checkpoints");
  }
  return data.data ?? [];
}

export async function fetchGeneralGallery({ page = 1, limit = 10 } = {}) {
  const { data } = await api.get("/gallery/general", {
    params: { page, limit },
  });
  if (!data?.success) {
    throw new Error(data?.message || "Failed to load gallery");
  }
  return data.data ?? { images: [], pagination: { page: 1, limit, total: 0, pages: 1 } };
}

export async function fetchPartners() {
  const { data } = await api.get("/partners");
  if (!data?.success) {
    throw new Error(data?.message || "Failed to load partners");
  }
  return data.data ?? [];
}

export async function fetchDestinationsGeneral() {
  const { data } = await api.get("/destinations/general");
  if (!data?.success) {
    throw new Error(data?.message || "Failed to load destinations");
  }
  return data.data ?? [];
}

export async function fetchRallyDocuments(eventId) {
  const { data } = await api.get(`/rally/${eventId}/documents`);
  if (!data?.success) {
    throw new Error(data?.message || "Failed to load documents");
  }
  return data.data ?? [];
}

export async function fetchRallyRankings(eventId, category) {
  const { data } = await api.get(`/rally/${eventId}/rankings`, {
    params: { category },
  });
  if (!data?.success) {
    throw new Error(data?.message || "Failed to load rankings");
  }
  return data.data ?? [];
}

export async function fetchRallyChampions(eventId, categoryId) {
  const { data } = await api.get(`/rally/${eventId}/champions`, {
    params: categoryId ? { category_id: categoryId } : undefined,
  });
  if (!data?.success) {
    throw new Error(data?.message || "Failed to load champions");
  }
  return data.data ?? [];
}

export async function fetchRallyChallenges(eventId) {
  const { data } = await api.get(`/rally/${eventId}/challenges`);
  if (!data?.success) {
    throw new Error(data?.message || "Failed to load challenges");
  }
  return data.data ?? [];
}

export async function fetchRallyVideos() {
  const { data } = await api.get("/videos");
  if (!data?.success) {
    throw new Error(data?.message || "Failed to load videos");
  }
  const videos = Array.isArray(data?.data)
    ? data.data
    : data?.data?.videos ?? [];

  return videos.map((video) => ({
    ...video,
    video_url: video.video_url ?? video.url ?? null,
  }));
}

export async function fetchRallyCompetitors(eventId, category) {
  const { data } = await api.get(`/rally/${eventId}/competitors`, {
    params: category ? { category } : undefined,
  });
  if (!data?.success) {
    throw new Error(data?.message || "Failed to load competitors");
  }
  return data.data ?? [];
}

/** Public participation counts by year (TDCP vs other races) for rankings chart. */
export async function fetchDriverRankingsParticipation(driverId) {
  const { data } = await api.get(`/rankings/driver/${driverId}`);
  if (!data?.success) {
    throw new Error(data?.message || "Failed to load rankings participation data");
  }
  return data.data ?? null;
}

/** TDCP and other race history for profile standing panels. */
export async function fetchDriverRaceHistory(driverId) {
  const { data } = await api.get(`/rankings/driver/${driverId}/races`);
  if (!data?.success) {
    throw new Error(data?.message || "Failed to load driver race history");
  }
  return data.data ?? null;
}
