import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  getSlidingWindowPrimarySpotTransition,
  slidingWindowPrimarySpotVariants,
} from "../../constants/slidingWindowCarousel.animation.js";

/**
 * In-place enter/exit animation for the primary (spot 1) carousel item.
 * Pair with useSlidingWindowCarousel — pass direction and a stable itemKey.
 */
export default function SlidingWindowPrimarySlot({
  itemKey,
  direction,
  className = "",
  children,
}) {
  const prefersReducedMotion = useReducedMotion();
  const transition = getSlidingWindowPrimarySpotTransition(prefersReducedMotion);

  if (!itemKey) return null;

  return (
    <div className={`relative overflow-hidden ${className}`.trim()}>
      <AnimatePresence mode="wait" initial={false} custom={direction}>
        <motion.div
          key={itemKey}
          custom={direction}
          variants={slidingWindowPrimarySpotVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={transition}
          className="absolute inset-0"
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
