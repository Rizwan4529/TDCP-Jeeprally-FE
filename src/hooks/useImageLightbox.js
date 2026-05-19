import { useCallback, useMemo, useState } from "react";

function normalizeItems(items = []) {
  return items
    .map((item, index) => {
      if (typeof item === "string") {
        return { src: item, alt: `Image ${index + 1}` };
      }
      if (!item?.src) return null;
      return {
        src: item.src,
        alt: item.alt ?? `Image ${index + 1}`,
      };
    })
    .filter(Boolean);
}

/**
 * Shared state for ImageLightbox.
 * @param {Array<string|{ src: string, alt?: string }>} items
 * @param {number} startIndex
 */
export function useImageLightbox() {
  const [state, setState] = useState(null);

  const open = useCallback((items, startIndex = 0) => {
    const normalized = normalizeItems(items);
    if (!normalized.length) return;

    const index = Math.max(0, Math.min(startIndex, normalized.length - 1));
    setState({ items: normalized, index });
  }, []);

  const close = useCallback(() => {
    setState(null);
  }, []);

  const setIndex = useCallback((index) => {
    setState((prev) => {
      if (!prev) return prev;
      const nextIndex = Math.max(0, Math.min(index, prev.items.length - 1));
      return { ...prev, index: nextIndex };
    });
  }, []);

  const goNext = useCallback(() => {
    setState((prev) => {
      if (!prev || prev.index >= prev.items.length - 1) return prev;
      return { ...prev, index: prev.index + 1 };
    });
  }, []);

  const goPrev = useCallback(() => {
    setState((prev) => {
      if (!prev || prev.index <= 0) return prev;
      return { ...prev, index: prev.index - 1 };
    });
  }, []);

  const current = useMemo(() => {
    if (!state) return null;
    return state.items[state.index] ?? null;
  }, [state]);

  return {
    isOpen: Boolean(state),
    items: state?.items ?? [],
    index: state?.index ?? 0,
    current,
    hasMultiple: (state?.items?.length ?? 0) > 1,
    open,
    close,
    setIndex,
    goNext,
    goPrev,
  };
}
