import { useCallback, useEffect, useMemo, useState } from "react";
import {
  canNavigateSlidingWindow,
  DEFAULT_SLIDING_WINDOW_SIZE,
  getSlidingWindowOffsetForPage,
  getSlidingWindowPageCount,
  getSlidingWindowPageIndex,
  getWindowDirection,
  getWindowItems,
  normalizeWindowOffset,
} from "../utils/slidingWindowCarousel.utils.js";

/**
 * Circular sliding-window carousel: advances one item at a time while keeping
 * a fixed number of visible slots (e.g. 1,2,3,4,5 → 2,3,4,5,6).
 */
export function useSlidingWindowCarousel(items, options = {}) {
  const {
    windowSize = DEFAULT_SLIDING_WINDOW_SIZE,
    initialIndex = 0,
    onIndexChange,
  } = options;

  const [windowOffset, setWindowOffset] = useState(initialIndex);
  const [direction, setDirection] = useState(1);

  const itemCount = items?.length ?? 0;
  const canNavigate = canNavigateSlidingWindow(items, windowSize);

  const visibleItems = useMemo(
    () => getWindowItems(items, windowOffset, windowSize),
    [items, windowOffset, windowSize],
  );

  useEffect(() => {
    setWindowOffset((current) => normalizeWindowOffset(current, itemCount));
  }, [itemCount]);

  const goToIndex = useCallback(
    (index) => {
      const nextOffset = normalizeWindowOffset(index, itemCount);

      if (nextOffset === windowOffset) return;

      const nextDirection = getWindowDirection(
        windowOffset,
        nextOffset,
        itemCount,
      );

      setDirection(nextDirection);
      setWindowOffset(nextOffset);
      onIndexChange?.(nextOffset, nextDirection);
    },
    [itemCount, onIndexChange, windowOffset],
  );

  const next = useCallback(() => {
    if (!canNavigate) return;
    goToIndex(windowOffset + 1);
  }, [canNavigate, goToIndex, windowOffset]);

  const previous = useCallback(() => {
    if (!canNavigate) return;
    goToIndex(windowOffset - 1);
  }, [canNavigate, goToIndex, windowOffset]);

  const pageCount = useMemo(
    () => getSlidingWindowPageCount(itemCount, windowSize),
    [itemCount, windowSize],
  );

  const activePageIndex = useMemo(
    () => getSlidingWindowPageIndex(windowOffset, windowSize, itemCount),
    [windowOffset, windowSize, itemCount],
  );

  const goToPage = useCallback(
    (pageIndex) => {
      const nextOffset = getSlidingWindowOffsetForPage(
        pageIndex,
        windowSize,
        itemCount,
      );
      goToIndex(nextOffset);
    },
    [goToIndex, itemCount, windowSize],
  );

  return {
    windowOffset,
    direction,
    visibleItems,
    canNavigate,
    pageCount,
    activePageIndex,
    next,
    previous,
    goToIndex,
    goToPage,
  };
}
