import {
  canNavigateSlidingWindow,
  DEFAULT_SLIDING_WINDOW_SIZE,
  getWindowDirection,
  getWindowItems,
  normalizeWindowOffset,
} from "../../../utils/slidingWindowCarousel.utils.js";

export const ADVENTURE_VIDEO_SLOT_COUNT = DEFAULT_SLIDING_WINDOW_SIZE;

export const normalizeAdventureWindowOffset = normalizeWindowOffset;
export const getAdventureWindowDirection = getWindowDirection;
export const getAdventureWindowVideos = getWindowItems;
export const shouldShowAdventureSection = (videos = []) =>
  Array.isArray(videos) && videos.length >= ADVENTURE_VIDEO_SLOT_COUNT;

export const shouldShowAdventureCarouselControls = (videos = []) =>
  canNavigateSlidingWindow(videos, ADVENTURE_VIDEO_SLOT_COUNT);

/** Dots when there are more videos than visible slots (window size). */
export const shouldShowAdventureDotPagination = (videos = []) =>
  shouldShowAdventureCarouselControls(videos);

export function getAdventureVideoColumns(slideVideos = []) {
  return {
    main: slideVideos[0] ?? null,
    firstStack: [slideVideos[1], slideVideos[2]].filter(Boolean),
    secondStack: [slideVideos[3], slideVideos[4]].filter(Boolean),
  };
}
