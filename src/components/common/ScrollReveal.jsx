import { motion, useReducedMotion } from "framer-motion";

const EASE_OUT = [0.22, 1, 0.36, 1];

export const scrollRevealVariants = {
  fadeUp: {
    hidden: { opacity: 0, y: 56 },
    visible: { opacity: 1, y: 0 },
  },
  fadeDown: {
    hidden: { opacity: 0, y: -48 },
    visible: { opacity: 1, y: 0 },
  },
  fadeLeft: {
    hidden: { opacity: 0, x: -72 },
    visible: { opacity: 1, x: 0 },
  },
  fadeRight: {
    hidden: { opacity: 0, x: 72 },
    visible: { opacity: 1, x: 0 },
  },
  scaleIn: {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1 },
  },
  zoomIn: {
    hidden: { opacity: 0, scale: 0.82 },
    visible: { opacity: 1, scale: 1 },
  },
  blurUp: {
    hidden: { opacity: 0, y: 40, filter: "blur(10px)" },
    visible: { opacity: 1, y: 0, filter: "blur(0px)" },
  },
  rotateIn: {
    hidden: { opacity: 0, y: 32, rotate: -2 },
    visible: { opacity: 1, y: 0, rotate: 0 },
  },
};

/**
 * Scroll-triggered section reveal. Respects prefers-reduced-motion.
 *
 * @param {"fadeUp"|"fadeDown"|"fadeLeft"|"fadeRight"|"scaleIn"|"zoomIn"|"blurUp"|"rotateIn"} variant
 */
export default function ScrollReveal({
  children,
  variant = "fadeUp",
  delay = 0,
  duration = 0.7,
  className = "",
  amount = 0.18,
  as = "motion.div",
}) {
  const prefersReducedMotion = useReducedMotion();
  const animation = scrollRevealVariants[variant] ?? scrollRevealVariants.fadeUp;
  const Component = as === "section" ? motion.section : motion.div;

  if (prefersReducedMotion) {
    const Tag = as === "section" ? "section" : "div";
    return <Tag className={className}>{children}</Tag>;
  }

  return (
    <Component
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount, margin: "0px 0px -40px 0px" }}
      transition={{ duration, delay, ease: EASE_OUT }}
      variants={animation}
    >
      {children}
    </Component>
  );
}

/** Hero / above-the-fold entrance (not scroll-based). */
export function HeroReveal({ children, className = "", delay = 0 }) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, delay, ease: EASE_OUT }}
    >
      {children}
    </motion.div>
  );
}
