import rallyAxios from "../../rallyAxios.jsx";
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
  const { data } = await rallyAxios.get("/rally/active");
  if (!data?.success) {
    throw new Error(data?.message || "Failed to load active rally");
  }
  return data.data;
}

export async function fetchPastRallies() {
  const { data } = await rallyAxios.get("/rally", { params: { type: "past" } });
  if (!data?.success) {
    throw new Error(data?.message || "Failed to load past rallies");
  }
  return data.data ?? [];
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
    params: category ? { category } : undefined,
  });
  if (!data?.success) {
    throw new Error(data?.message || "Failed to load champions");
  }
  return data.data ?? [];
}

export async function fetchRallyChallenges(eventId) {
  const { data } = await rallyAxios.get(`/rally/${eventId}/challenges`);
  if (!data?.success) {
    throw new Error(data?.message || "Failed to load challenges");
  }
  return data.data ?? [];
}

export async function fetchRallyVideos() {
  const { data } = await rallyAxios.get("/videos");
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
  const { data } = await rallyAxios.get(`/rally/${eventId}/competitors`, {
    params: category ? { category } : undefined,
  });
  if (!data?.success) {
    throw new Error(data?.message || "Failed to load competitors");
  }
  return data.data ?? [];
}
