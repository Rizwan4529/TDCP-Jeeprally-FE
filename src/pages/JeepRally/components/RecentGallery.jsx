import React, { useCallback, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";
import { fetchGeneralGallery } from "../../../api/features/rally/rally.service.jsx";
import { useWebsiteContentQuery } from "../../../api/features/content/hooks.jsx";
import {
  getWebsiteContentPage,
  getWebsiteContentSection,
} from "../../../api/features/content/websiteContent.utils.js";
import ImageLightbox from "../../../components/common/ImageLightbox.jsx";
import SlidingWindowPrimarySlot from "../../../components/common/SlidingWindowPrimarySlot";
import SlidingWindowSideSlot from "../../../components/common/SlidingWindowSideSlot";
import { useImageLightbox } from "../../../hooks/useImageLightbox.js";
import { useSlidingWindowCarousel } from "../../../hooks/useSlidingWindowCarousel.js";
import {
  findGalleryImageIndex,
  GALLERY_FALLBACK_IMG_SRC,
  GALLERY_WINDOW_SIZE,
  getGalleryLayoutSlots,
  isGalleryImageClickable,
  normalizeGalleryImagesFromApi,
  shouldShowGalleryCarouselControls,
} from "./recentGallery.utils.js";
import FlagImg from "../../../assets/images/flag_4.png";

const GALLERY_TITLE = "Recent Gallery";
const GALLERY_LIMIT = 20;

function GallerySideImage({ image, className, showSkeleton, onImageClick }) {
  if (showSkeleton) {
    return (
      <div
        className={`w-full rounded-[6px] bg-gray-200 animate-pulse shadow-sm ${className}`}
      />
    );
  }

  const clickable = isGalleryImageClickable(image);

  return (
    <SlidingWindowSideSlot
      itemKey={image?.id ?? "gallery-side-empty"}
      className={`rounded-[6px] ${className}`}
    >
      <button
        type="button"
        onClick={() => onImageClick?.(image)}
        disabled={!clickable}
        className={`h-full w-full overflow-hidden rounded-[6px] text-left ${
          clickable ? "cursor-zoom-in" : "cursor-default"
        }`}
        aria-label={
          clickable ? `View ${image?.alt || "gallery image"}` : undefined
        }
      >
        <img
          src={image?.src ?? GALLERY_FALLBACK_IMG_SRC}
          alt={image?.alt ?? ""}
          className="h-full w-full object-cover shadow-sm transition-shadow duration-300 hover:shadow-md"
        />
      </button>
    </SlidingWindowSideSlot>
  );
}

const RecentGallery = ({ content }) => {
  const imageLightbox = useImageLightbox();
  const { data: websiteContent } = useWebsiteContentQuery();

  const { data, isPending, isFetching, isError } = useQuery({
    queryKey: ["gallery", "general", GALLERY_LIMIT],
    queryFn: () => fetchGeneralGallery({ page: 1, limit: GALLERY_LIMIT }),
    refetchOnWindowFocus: false,
  });

  const images = useMemo(
    () => normalizeGalleryImagesFromApi(data?.images),
    [data?.images],
  );

  const lightboxItems = useMemo(
    () => images.map((image) => ({ src: image.src, alt: image.alt })),
    [images],
  );

  const carousel = useSlidingWindowCarousel(images, {
    windowSize: GALLERY_WINDOW_SIZE,
  });

  const { direction, visibleItems, canNavigate, next, previous } = carousel;

  const slots = useMemo(
    () => getGalleryLayoutSlots(visibleItems),
    [visibleItems],
  );

  const resolvedContent = useMemo(() => {
    if (content) return content;
    return getWebsiteContentSection(
      getWebsiteContentPage(websiteContent, "home"),
      "recentGallery",
    );
  }, [content, websiteContent]);

  const showSkeleton = isPending || isFetching;
  const showControls = shouldShowGalleryCarouselControls(images);
  const navDisabled = showSkeleton || isError || !showControls || !canNavigate;

  const openGalleryImage = useCallback(
    (image) => {
      const startIndex = findGalleryImageIndex(images, image);
      if (startIndex < 0) return;
      imageLightbox.open(lightboxItems, startIndex);
    },
    [imageLightbox, images, lightboxItems],
  );

  // Gallery layout: main is window index 3; "next" promotes the left neighbor into main.
  const handleNext = () => {
    if (navDisabled) return;
    previous();
  };

  const handlePrev = () => {
    if (navDisabled) return;
    next();
  };

  return (
    <section className="relative overflow-hidden bg-white py-section-break">
      <div className="absolute -left-32 top-20 h-48 w-48 md:h-64 md:w-64 lg:h-80 lg:w-[400px]">
        <img
          src={FlagImg}
          alt=""
          className="h-[300px] w-[300px] rotate-[50deg] object-cover opacity-10"
        />
      </div>

      <div className="container relative z-10 mx-auto">
        <div className="px-4 lg:px-20">
          <div className="mb-10 text-center md:mb-10">
            <h2 className="font-gilda text-[29px] md:text-[42px]">
              {resolvedContent?.title || GALLERY_TITLE}
            </h2>
          </div>

          <div className="grid grid-cols-2 items-center gap-3 md:gap-4 lg:h-[500px] lg:grid-cols-5 lg:gap-6">
            <div className="col-span-1 h-[180px] md:h-[240px] lg:h-[220px]">
              <GallerySideImage
                image={slots.leftOuter}
                showSkeleton={showSkeleton}
                className="h-full"
                onImageClick={openGalleryImage}
              />
            </div>

            <div className="col-span-1 flex h-full flex-col justify-center gap-3 md:gap-4 lg:gap-6">
              <div className="h-[120px] md:h-[180px] lg:h-[238px]">
                <GallerySideImage
                  image={slots.leftStackTop}
                  showSkeleton={showSkeleton}
                  className="h-full"
                  onImageClick={openGalleryImage}
                />
              </div>
              <div className="h-[120px] md:h-[180px] lg:h-[238px]">
                <GallerySideImage
                  image={slots.leftStackBottom}
                  showSkeleton={showSkeleton}
                  className="h-full"
                  onImageClick={openGalleryImage}
                />
              </div>
            </div>

            <SlidingWindowPrimarySlot
              itemKey={slots.main?.id}
              direction={direction}
              className="order-first col-span-2 h-[280px] md:h-[400px] lg:order-none lg:col-span-1 lg:h-full"
            >
              {showSkeleton ? (
                <div className="h-full w-full animate-pulse rounded-[6px] border-4 border-white bg-gray-200 shadow-md" />
              ) : (
                <button
                  type="button"
                  onClick={() => openGalleryImage(slots.main)}
                  disabled={!isGalleryImageClickable(slots.main)}
                  className={`h-full w-full overflow-hidden rounded-[6px] border-4 border-white text-left shadow-md ${
                    isGalleryImageClickable(slots.main)
                      ? "cursor-zoom-in"
                      : "cursor-default"
                  }`}
                  aria-label={
                    isGalleryImageClickable(slots.main)
                      ? `View ${slots.main?.alt || "gallery image"}`
                      : undefined
                  }
                >
                  <img
                    src={slots.main?.src ?? GALLERY_FALLBACK_IMG_SRC}
                    alt={slots.main?.alt ?? ""}
                    className="h-full w-full object-cover transition-transform duration-500 hover:scale-[1.02]"
                  />
                </button>
              )}
            </SlidingWindowPrimarySlot>

            <div className="col-span-1 flex h-full flex-col justify-center gap-3 md:gap-4 lg:gap-6">
              <div className="h-[120px] md:h-[180px] lg:h-[238px]">
                <GallerySideImage
                  image={slots.rightStackTop}
                  showSkeleton={showSkeleton}
                  className="h-full"
                  onImageClick={openGalleryImage}
                />
              </div>
              <div className="h-[120px] md:h-[180px] lg:h-[238px]">
                <GallerySideImage
                  image={slots.rightStackBottom}
                  showSkeleton={showSkeleton}
                  className="h-full"
                  onImageClick={openGalleryImage}
                />
              </div>
            </div>

            <div className="col-span-1 h-[180px] md:h-[240px] lg:h-[220px]">
              <GallerySideImage
                image={slots.rightOuter}
                showSkeleton={showSkeleton}
                className="h-full"
                onImageClick={openGalleryImage}
              />
            </div>
          </div>

          {isError && (
            <p className="mt-4 text-center text-sm text-red-600">
              Gallery could not be loaded. Please try again later.
            </p>
          )}

          {showControls ? (
            <div className="mt-12 flex items-center justify-center gap-4 md:mt-16">
              <button
                type="button"
                onClick={handlePrev}
                disabled={navDisabled}
                className="group flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border border-gray-200 bg-white text-primary shadow-sm transition-all duration-300 hover:bg-primary hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Previous gallery image"
              >
                <FiArrowLeft className="text-xl transition-transform group-hover:-translate-x-1" />
              </button>
              <button
                type="button"
                onClick={handleNext}
                disabled={navDisabled}
                className="group flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-white shadow-md shadow-accent/20 transition-all duration-300 hover:bg-primary hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Next gallery image"
              >
                <FiArrowRight className="text-xl transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          ) : null}
        </div>
      </div>

      <ImageLightbox
        isOpen={imageLightbox.isOpen}
        onClose={imageLightbox.close}
        items={imageLightbox.items}
        index={imageLightbox.index}
        onPrev={imageLightbox.goPrev}
        onNext={imageLightbox.goNext}
        label="Recent gallery"
      />
    </section>
  );
};

export default RecentGallery;
