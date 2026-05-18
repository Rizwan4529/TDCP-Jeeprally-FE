import { useCallback, useState } from "react";

/**
 * Shared state for VideoLightbox.
 * @param {{ src: string, title?: string }} payload
 */
export function useVideoLightbox() {
  const [video, setVideo] = useState(null);

  const open = useCallback((payload) => {
    if (!payload?.src) return;
    setVideo({
      src: payload.src,
      title: payload.title ?? "Video",
    });
  }, []);

  const close = useCallback(() => {
    setVideo(null);
  }, []);

  return {
    isOpen: Boolean(video),
    src: video?.src ?? "",
    title: video?.title ?? "Video",
    open,
    close,
  };
}
