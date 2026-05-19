import { AnimatePresence, motion } from "framer-motion";
import { SLIDING_WINDOW_CAROUSEL_EASE } from "../../constants/slidingWindowCarousel.animation.js";

const sideSlotTransition = {
  duration: 0.4,
  ease: SLIDING_WINDOW_CAROUSEL_EASE,
};

/**
 * Crossfade wrapper for secondary sliding-window carousel slots.
 * Pair with SlidingWindowPrimarySlot on the featured item.
 */
export default function SlidingWindowSideSlot({
  itemKey,
  className = "",
  children,
}) {
  if (!itemKey) return null;

  return (
    <div className={`relative overflow-hidden ${className}`.trim()}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={itemKey}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={sideSlotTransition}
          className="absolute inset-0"
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
