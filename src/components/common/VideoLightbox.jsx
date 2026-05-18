import { useCallback, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { FiX } from "react-icons/fi";

const VideoLightbox = ({
  isOpen,
  onClose,
  src,
  title = "Video",
  className = "",
}) => {
  const videoRef = useRef(null);

  const pauseAndClose = useCallback(() => {
    const node = videoRef.current;
    if (node) {
      node.pause();
      node.currentTime = 0;
    }
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        pauseAndClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, pauseAndClose]);

  useEffect(() => {
    if (isOpen) return;

    const node = videoRef.current;
    if (node) {
      node.pause();
      node.currentTime = 0;
    }
  }, [isOpen]);

  if (!isOpen || !src) return null;

  return createPortal(
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8 ${className}`.trim()}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <button
        type="button"
        aria-label="Close video"
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={pauseAndClose}
      />

      <div className="relative z-10 w-full max-w-5xl">
        <button
          type="button"
          aria-label="Close video"
          onClick={pauseAndClose}
          className="absolute -top-12 right-0 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 sm:-right-12 sm:top-0"
        >
          <FiX className="size-6" />
        </button>

        <video
          ref={videoRef}
          key={src}
          src={src}
          controls
          autoPlay
          playsInline
          className="max-h-[80vh] w-full rounded-lg bg-black shadow-2xl"
        />
      </div>
    </div>,
    document.body,
  );
};

export default VideoLightbox;
