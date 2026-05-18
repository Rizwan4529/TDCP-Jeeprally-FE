import { useCallback, useEffect, useMemo, useState } from "react";
import {
  canNavigateSlidingWindow,
  DEFAULT_SLIDING_WINDOW_SIZE,
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

  return {
    windowOffset,
    direction,
    visibleItems,
    canNavigate,
    next,
    previous,
    goToIndex,
  };
}
