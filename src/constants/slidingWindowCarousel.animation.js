export const SLIDING_WINDOW_CAROUSEL_EASE = [0.22, 1, 0.36, 1];

export const slidingWindowPrimarySpotVariants = {
  enter: (direction) => ({
    opacity: 0,
    scale: 1.03,
    x: direction > 0 ? 16 : -16,
  }),
  center: {
    opacity: 1,
    scale: 1,
    x: 0,
  },
  exit: (direction) => ({
    opacity: 0,
    scale: 0.98,
    x: direction > 0 ? -16 : 16,
  }),
};

export function getSlidingWindowPrimarySpotTransition(prefersReducedMotion) {
  return prefersReducedMotion
    ? { duration: 0 }
    : { duration: 0.4, ease: SLIDING_WINDOW_CAROUSEL_EASE };
}
