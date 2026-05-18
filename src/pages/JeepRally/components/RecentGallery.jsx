import React, { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";
import {
  fetchGeneralGallery,
  resolveCheckpointImageUrl,
} from "../../../api/features/rally/rally.service.jsx";
import { useWebsiteContentQuery } from "../../../api/features/content/hooks.jsx";
import {
  getWebsiteContentPage,
  getWebsiteContentSection,
} from "../../../api/features/content/websiteContent.utils.js";

const GALLERY_TITLE = "Recent Gallery";
const GALLERY_LIMIT = 10;
const DISPLAY_SLOTS = 7;

const FALLBACK_IMG_SRC =
  "data:image/svg+xml," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="8" height="8"><rect width="8" height="8" fill="#e5e7eb"/></svg>',
  );

function slotImagesFromApi(images) {
  const list = (images ?? []).slice(0, DISPLAY_SLOTS).map((img) => {
    const resolved = resolveCheckpointImageUrl(img.image_url);
    return {
      src: resolved || FALLBACK_IMG_SRC,
      alt: img.caption || "Gallery image",
    };
  });
  while (list.length < DISPLAY_SLOTS) {
    list.push({ src: FALLBACK_IMG_SRC, alt: "" });
  }
  return list;
}

const RecentGallery = ({ content }) => {
  const [page, setPage] = useState(1);
  const { data: websiteContent } = useWebsiteContentQuery();

  const { data, isPending, isFetching, isError } = useQuery({
    queryKey: ["gallery", "general", page, GALLERY_LIMIT],
    queryFn: () => fetchGeneralGallery({ page, limit: GALLERY_LIMIT }),
    refetchOnWindowFocus: false,
  });

  const displayImages = useMemo(
    () => slotImagesFromApi(data?.images),
    [data?.images],
  );
  const resolvedContent = useMemo(() => {
    if (content) return content;
    return getWebsiteContentSection(
      getWebsiteContentPage(websiteContent, "home"),
      "recentGallery",
    );
  }, [content, websiteContent]);

  const totalPages = Math.max(1, Number(data?.pagination?.pages ?? 1));
  const showSkeleton = isPending || isFetching;

  const handleNext = () => {
    setPage((p) => (p < totalPages ? p + 1 : p));
  };

  const handlePrev = () => {
    setPage((p) => (p > 1 ? p - 1 : p));
  };

  const getImage = (offset) => displayImages[offset] || {};

  const navDisabled = showSkeleton || isError;
  const prevDisabled = navDisabled || page <= 1;
  const nextDisabled = navDisabled || page >= totalPages;

  return (
    <section className="py-section-break bg-white relative overflow-hidden">
      <div className="absolute top-0 left-0 z-0 pointer-events-none select-none">
        <div className="relative w-48 md:w-64 lg:w-80 h-48 md:h-64 lg:h-80">
          <img
            src={"/assets/images/flag_3.png"}
            alt=""
            className="absolute top-[0%] left-[-65%] w-[300px] h-auto opacity-10 rotate-[50deg]"
          />
        </div>
      </div>

      <div className="container mx-auto relative z-10">
        <div className="px-4 lg:px-20">
          <div className="text-center mb-10 md:mb-10">
            <h2 className="font-gilda text-primary text-[29px] md:text-[42px]">
              {resolvedContent?.title || GALLERY_TITLE}
            </h2>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 md:gap-4 lg:gap-6 lg:h-[500px] items-center">
            <div className="col-span-1 h-[180px] md:h-[240px] lg:h-[220px] transition-all duration-500 ease-in-out">
              {showSkeleton ? (
                <div className="w-full h-full rounded-[6px] bg-gray-200 animate-pulse shadow-sm" />
              ) : (
                <img
                  key={getImage(0).src}
                  src={getImage(0).src}
                  alt={getImage(0).alt}
                  className="w-full h-full object-cover rounded-[6px] shadow-sm hover:shadow-md transition-all duration-300"
                />
              )}
            </div>

            <div className="col-span-1 flex flex-col gap-3 md:gap-4 lg:gap-6 h-full justify-center">
              <div className="h-[120px] md:h-[180px] lg:h-[238px] transition-all duration-500 ease-in-out">
                {showSkeleton ? (
                  <div className="w-full h-full rounded-[6px] bg-gray-200 animate-pulse shadow-sm" />
                ) : (
                  <img
                    key={getImage(1).src}
                    src={getImage(1).src}
                    alt={getImage(1).alt}
                    className="w-full h-full object-cover rounded-[6px] shadow-sm hover:shadow-md transition-all duration-300"
                  />
                )}
              </div>
              <div className="h-[120px] md:h-[180px] lg:h-[238px] transition-all duration-500 ease-in-out">
                {showSkeleton ? (
                  <div className="w-full h-full rounded-[6px] bg-gray-200 animate-pulse shadow-sm" />
                ) : (
                  <img
                    key={getImage(2).src}
                    src={getImage(2).src}
                    alt={getImage(2).alt}
                    className="w-full h-full object-cover rounded-[6px] shadow-sm hover:shadow-md transition-all duration-300"
                  />
                )}
              </div>
            </div>

            <div className="col-span-2 lg:col-span-1 h-[280px] md:h-[400px] lg:h-full order-first lg:order-none transition-all duration-500 ease-in-out">
              {showSkeleton ? (
                <div className="w-full h-full rounded-[6px] bg-gray-200 animate-pulse shadow-md border-4 border-white" />
              ) : (
                <img
                  key={getImage(3).src}
                  src={getImage(3).src}
                  alt={getImage(3).alt}
                  className="w-full h-full object-cover rounded-[6px] shadow-md border-4 border-white hover:scale-[1.02] transition-all duration-500"
                />
              )}
            </div>

            <div className="col-span-1 flex flex-col gap-3 md:gap-4 lg:gap-6 h-full justify-center">
              <div className="h-[120px] md:h-[180px] lg:h-[238px] transition-all duration-500 ease-in-out">
                {showSkeleton ? (
                  <div className="w-full h-full rounded-[6px] bg-gray-200 animate-pulse shadow-sm" />
                ) : (
                  <img
                    key={getImage(4).src}
                    src={getImage(4).src}
                    alt={getImage(4).alt}
                    className="w-full h-full object-cover rounded-[6px] shadow-sm hover:shadow-md transition-all duration-300"
                  />
                )}
              </div>
              <div className="h-[120px] md:h-[180px] lg:h-[238px] transition-all duration-500 ease-in-out">
                {showSkeleton ? (
                  <div className="w-full h-full rounded-[6px] bg-gray-200 animate-pulse shadow-sm" />
                ) : (
                  <img
                    key={getImage(5).src}
                    src={getImage(5).src}
                    alt={getImage(5).alt}
                    className="w-full h-full object-cover rounded-[6px] shadow-sm hover:shadow-md transition-all duration-300"
                  />
                )}
              </div>
            </div>

            <div className="col-span-1 h-[180px] md:h-[240px] lg:h-[220px] transition-all duration-500 ease-in-out">
              {showSkeleton ? (
                <div className="w-full h-full rounded-[6px] bg-gray-200 animate-pulse shadow-sm" />
              ) : (
                <img
                  key={getImage(6).src}
                  src={getImage(6).src}
                  alt={getImage(6).alt}
                  className="w-full h-full object-cover rounded-[6px] shadow-sm hover:shadow-md transition-all duration-300"
                />
              )}
            </div>
          </div>

          {isError && (
            <p className="text-center text-sm text-red-600 mt-4">
              Gallery could not be loaded. Please try again later.
            </p>
          )}

          <div className="flex items-center justify-center gap-4 mt-12 md:mt-16">
            <button
              type="button"
              onClick={handlePrev}
              disabled={prevDisabled}
              className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center text-primary hover:text-white bg-white hover:bg-primary transition-all duration-300 cursor-pointer group shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FiArrowLeft className="text-xl group-hover:-translate-x-1 transition-transform" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              disabled={nextDisabled}
              className="w-12 h-12 rounded-full flex items-center justify-center hover:text-white hover:bg-primary bg-white transition-all duration-300 cursor-pointer group shadow-md shadow-accent/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FiArrowRight className="text-xl group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RecentGallery;
