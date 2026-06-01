export const DEFAULT_SLIDING_WINDOW_SIZE = 5;

export function normalizeWindowOffset(offset = 0, itemCount = 0) {
  if (!itemCount) return 0;
  return ((offset % itemCount) + itemCount) % itemCount;
}

export function getWindowDirection(
  currentOffset = 0,
  nextOffset = 0,
  itemCount = 0,
) {
  if (!itemCount || currentOffset === nextOffset) return 1;

  let diff = nextOffset - currentOffset;
  if (diff > itemCount / 2) diff -= itemCount;
  if (diff < -itemCount / 2) diff += itemCount;

  return diff >= 0 ? 1 : -1;
}

export function getWindowItems(
  items = [],
  startIndex = 0,
  windowSize = DEFAULT_SLIDING_WINDOW_SIZE,
) {
  if (!Array.isArray(items) || items.length === 0) return [];

  const slotCount = Math.min(windowSize, items.length);
  const normalizedStart = normalizeWindowOffset(startIndex, items.length);

  return Array.from({ length: slotCount }, (_, index) => {
    return items[(normalizedStart + index) % items.length];
  });
}

export function canNavigateSlidingWindow(
  items = [],
  windowSize = DEFAULT_SLIDING_WINDOW_SIZE,
) {
  return Array.isArray(items) && items.length > windowSize;
}

/** Number of dot-pagination pages (one full layout per page). */
export function getSlidingWindowPageCount(
  itemCount = 0,
  windowSize = DEFAULT_SLIDING_WINDOW_SIZE,
) {
  if (!itemCount || itemCount <= windowSize) return 0;
  return Math.ceil(itemCount / windowSize);
}

export function getSlidingWindowPageIndex(
  windowOffset = 0,
  windowSize = DEFAULT_SLIDING_WINDOW_SIZE,
  itemCount = 0,
) {
  if (!itemCount) return 0;
  const normalized = normalizeWindowOffset(windowOffset, itemCount);
  return Math.floor(normalized / windowSize);
}

export function getSlidingWindowOffsetForPage(
  pageIndex = 0,
  windowSize = DEFAULT_SLIDING_WINDOW_SIZE,
  itemCount = 0,
) {
  if (!itemCount) return 0;
  return normalizeWindowOffset(pageIndex * windowSize, itemCount);
}
