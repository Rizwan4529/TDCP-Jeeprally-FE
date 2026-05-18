import { FiArrowLeft, FiArrowRight } from "react-icons/fi";

const DEFAULT_BUTTON_CLASS =
  "flex h-14 w-14 items-center justify-center rounded-full bg-white text-black shadow-xl transition-all duration-300 hover:bg-brand-green hover:text-white disabled:pointer-events-none disabled:opacity-40";

/**
 * Shared previous / next controls for useSlidingWindowCarousel.
 * Styling and layout can be overridden per screen via className props.
 */
export default function SlidingWindowNavButtons({
  onPrevious,
  onNext,
  disablePrevious = false,
  disableNext = false,
  previousLabel = "Show previous item",
  nextLabel = "Show next item",
  className = "flex items-center justify-center gap-4",
  buttonClassName = DEFAULT_BUTTON_CLASS,
}) {
  return (
    <div className={className}>
      <button
        type="button"
        aria-label={previousLabel}
        onClick={onPrevious}
        disabled={disablePrevious}
        className={buttonClassName}
      >
        <FiArrowLeft className="text-2xl" />
      </button>
      <button
        type="button"
        aria-label={nextLabel}
        onClick={onNext}
        disabled={disableNext}
        className={buttonClassName}
      >
        <FiArrowRight className="text-2xl" />
      </button>
    </div>
  );
}
