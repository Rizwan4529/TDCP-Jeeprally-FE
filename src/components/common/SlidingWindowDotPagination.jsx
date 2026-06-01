import { motion, useReducedMotion } from "framer-motion";
import { SLIDING_WINDOW_CAROUSEL_EASE } from "../../constants/slidingWindowCarousel.animation.js";

/**
 * Dot pagination for sliding-window carousels (one dot per full layout page).
 *
 * @param {number} count - Total pages / dot count
 * @param {number} activeIndex - Current page index (0-based)
 * @param {(pageIndex: number) => void} onSelect
 */
const SlidingWindowDotPagination = ({
  count,
  activeIndex,
  onSelect,
  ariaLabel = "Carousel position",
  className = "",
}) => {
  const prefersReducedMotion = useReducedMotion();

  if (!count || count <= 0) {
    return null;
  }

  return (
    <div
      className={`flex justify-center gap-2 ${className}`.trim()}
      role="tablist"
      aria-label={ariaLabel}
    >
      {Array.from({ length: count }, (_, index) => {
        const isActive = activeIndex === index;

        return (
          <motion.button
            key={`carousel-dot-${index}`}
            type="button"
            role="tab"
            aria-selected={isActive}
            aria-label={`Go to page ${index + 1}`}
            onClick={() => onSelect(index)}
            animate={{ scale: isActive ? 1.2 : 1 }}
            transition={
              prefersReducedMotion
                ? { duration: 0 }
                : { duration: 0.25, ease: SLIDING_WINDOW_CAROUSEL_EASE }
            }
            className={`h-2.5 w-2.5 rounded-full ${
              isActive
                ? "bg-[#B44423]"
                : "bg-[#FBE79C] hover:bg-[#B44423]/60"
            }`}
          />
        );
      })}
    </div>
  );
};

export default SlidingWindowDotPagination;
