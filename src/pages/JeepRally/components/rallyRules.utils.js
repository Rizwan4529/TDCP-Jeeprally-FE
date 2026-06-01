import { resolveCheckpointImageUrl } from "../../../api/features/rally/rally.service.jsx";
import { getSlidingWindowPageCount } from "../../../utils/slidingWindowCarousel.utils.js";

export const RALLY_RULES_WINDOW_SIZE = 2;

const SLOT_FALLBACK_STYLES = [
  {
    bgClass: "bg-primary",
    titleClass: "text-white",
    buttonClass: "bg-secondary text-black",
  },
  {
    bgClass: "bg-secondary",
    titleClass: "text-white",
    buttonClass: "bg-primary text-white",
  },
];

export function normalizeRallyDocuments(documents = []) {
  return (documents ?? [])
    .map((document) => ({
      ...document,
      file_url: document.file_url ?? document.fileUrl ?? document.document_url ?? null,
      bg_image: document.bg_image ?? document.bgImage ?? null,
    }))
    .filter((document) => document.is_public !== false)
    .sort(
      (a, b) =>
        new Date(a.created_at || 0).getTime() -
        new Date(b.created_at || 0).getTime(),
    );
}

export function resolveRallyDocumentBgImage(document) {
  const raw = document?.bg_image ?? document?.bgImage ?? null;
  if (!raw) return null;
  return resolveCheckpointImageUrl(raw);
}

export function getRulesCardSlotStyle(slotIndex) {
  return (
    SLOT_FALLBACK_STYLES[slotIndex] ?? SLOT_FALLBACK_STYLES[0]
  );
}

export function shouldShowRulesDotPagination(itemCount) {
  return getSlidingWindowPageCount(itemCount, RALLY_RULES_WINDOW_SIZE) > 0;
}
