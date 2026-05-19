import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  FiChevronLeft,
  FiChevronRight,
  FiMinus,
  FiPlus,
  FiX,
} from "react-icons/fi";

const MIN_SCALE = 1;
const MAX_SCALE = 4;
const ZOOM_STEP = 0.15;
const WHEEL_ZOOM_STEP = 0.08;

function clampScale(value) {
  return Math.min(MAX_SCALE, Math.max(MIN_SCALE, value));
}

const ImageLightbox = ({
  isOpen,
  onClose,
  items = [],
  index = 0,
  onPrev,
  onNext,
  label = "Image viewer",
}) => {
  const viewportRef = useRef(null);
  const [scale, setScale] = useState(MIN_SCALE);

  const current = items[index] ?? null;
  const hasMultiple = items.length > 1;
  const canGoPrev = hasMultiple && index > 0;
  const canGoNext = hasMultiple && index < items.length - 1;

  const resetZoom = useCallback(() => {
    setScale(MIN_SCALE);
  }, []);

  const zoomIn = useCallback(() => {
    setScale((value) => clampScale(value + ZOOM_STEP));
  }, []);

  const zoomOut = useCallback(() => {
    setScale((value) => clampScale(value - ZOOM_STEP));
  }, []);

  const handleClose = useCallback(() => {
    resetZoom();
    onClose();
  }, [onClose, resetZoom]);

  const handlePrev = useCallback(() => {
    if (!hasMultiple) return;
    resetZoom();
    onPrev?.();
  }, [hasMultiple, onPrev, resetZoom]);

  const handleNext = useCallback(() => {
    if (!hasMultiple) return;
    resetZoom();
    onNext?.();
  }, [hasMultiple, onNext, resetZoom]);

  useEffect(() => {
    if (!isOpen) {
      resetZoom();
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        handleClose();
        return;
      }
      if (event.key === "ArrowLeft") {
        handlePrev();
        return;
      }
      if (event.key === "ArrowRight") {
        handleNext();
        return;
      }
      if (event.key === "+" || event.key === "=") {
        event.preventDefault();
        zoomIn();
        return;
      }
      if (event.key === "-") {
        event.preventDefault();
        zoomOut();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleClose, handleNext, handlePrev, isOpen, resetZoom, zoomIn, zoomOut]);

  useEffect(() => {
    resetZoom();
  }, [index, isOpen, resetZoom]);

  useEffect(() => {
    const node = viewportRef.current;
    if (!isOpen || !node) return undefined;

    const handleWheel = (event) => {
      event.preventDefault();
      setScale((value) =>
        clampScale(value + (event.deltaY < 0 ? WHEEL_ZOOM_STEP : -WHEEL_ZOOM_STEP)),
      );
    };

    node.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      node.removeEventListener("wheel", handleWheel);
    };
  }, [isOpen, index]);

  if (!isOpen || !current?.src) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8"
      role="dialog"
      aria-modal="true"
      aria-label={label}
    >
      <button
        type="button"
        aria-label="Close image viewer"
        className="absolute inset-0 bg-black/85 backdrop-blur-sm"
        onClick={handleClose}
      />

      <button
        type="button"
        aria-label="Close image viewer"
        onClick={handleClose}
        className="absolute right-4 top-4 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 sm:right-8 sm:top-8"
      >
        <FiX className="size-6" />
      </button>

      <div className="absolute left-4 top-4 z-20 flex items-center gap-2 sm:left-8 sm:top-8">
        <button
          type="button"
          aria-label="Zoom out"
          onClick={zoomOut}
          disabled={scale <= MIN_SCALE}
          className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <FiMinus className="size-5" />
        </button>
        <button
          type="button"
          aria-label="Zoom in"
          onClick={zoomIn}
          disabled={scale >= MAX_SCALE}
          className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <FiPlus className="size-5" />
        </button>
        <span className="rounded-full bg-white/10 px-3 py-1.5 font-manrope text-[12px] font-medium text-white/90">
          {Math.round(scale * 100)}%
        </span>
      </div>

      {hasMultiple ? (
        <p className="absolute bottom-4 left-1/2 z-20 -translate-x-1/2 rounded-full bg-white/10 px-4 py-1.5 font-manrope text-[13px] text-white/90 sm:bottom-8">
          {index + 1} / {items.length}
        </p>
      ) : null}

      {hasMultiple ? (
        <>
          <button
            type="button"
            aria-label="Previous image"
            onClick={handlePrev}
            disabled={!canGoPrev}
            className="absolute left-2 top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-35 sm:left-6 sm:h-14 sm:w-14"
          >
            <FiChevronLeft className="size-7" />
          </button>
          <button
            type="button"
            aria-label="Next image"
            onClick={handleNext}
            disabled={!canGoNext}
            className="absolute right-2 top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-35 sm:right-6 sm:h-14 sm:w-14"
          >
            <FiChevronRight className="size-7" />
          </button>
        </>
      ) : null}

      <div
        ref={viewportRef}
        className="relative z-10 flex max-h-[82vh] max-w-6xl items-center justify-center overflow-hidden"
      >
        <img
          key={`${current.src}-${index}`}
          src={current.src}
          alt={current.alt ?? ""}
          draggable={false}
          className="max-h-[82vh] max-w-[min(100vw-2rem,72rem)] select-none object-contain transition-transform duration-150 ease-out"
          style={{ transform: `scale(${scale})` }}
        />
      </div>
    </div>,
    document.body,
  );
};

export default ImageLightbox;
