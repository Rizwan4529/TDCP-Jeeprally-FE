import { resolveCheckpointImageUrl } from "../../../api/features/rally/rally.service.jsx";
import { canNavigateSlidingWindow } from "../../../utils/slidingWindowCarousel.utils.js";

export const GALLERY_WINDOW_SIZE = 7;
export const GALLERY_MAIN_SLOT_INDEX = 3;

export const GALLERY_FALLBACK_IMG_SRC =
  "data:image/svg+xml," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="8" height="8"><rect width="8" height="8" fill="#e5e7eb"/></svg>',
  );

const FALLBACK_SLOT_IMAGE = {
  id: "gallery-slot-fallback",
  src: GALLERY_FALLBACK_IMG_SRC,
  alt: "",
};

export function normalizeGalleryImage(image, index = 0) {
  const resolved = resolveCheckpointImageUrl(image?.image_url);
  return {
    id: image?._id ?? image?.id ?? `gallery-${index}`,
    src: resolved || GALLERY_FALLBACK_IMG_SRC,
    alt: image?.caption || "Gallery image",
  };
}

export function normalizeGalleryImagesFromApi(apiImages = []) {
  return apiImages.map((image, index) => normalizeGalleryImage(image, index));
}

export function shouldShowGalleryCarouselControls(images = []) {
  return canNavigateSlidingWindow(images, GALLERY_WINDOW_SIZE);
}

/** Maps the 7 visible window items onto the gallery grid slots. */
export function getGalleryLayoutSlots(slideImages = []) {
  const slots = Array.from({ length: GALLERY_WINDOW_SIZE }, (_, index) => {
    return slideImages[index] ?? {
      ...FALLBACK_SLOT_IMAGE,
      id: `${FALLBACK_SLOT_IMAGE.id}-${index}`,
    };
  });

  return {
    leftOuter: slots[0],
    leftStackTop: slots[1],
    leftStackBottom: slots[2],
    main: slots[GALLERY_MAIN_SLOT_INDEX],
    rightStackTop: slots[4],
    rightStackBottom: slots[5],
    rightOuter: slots[6],
  };
}
