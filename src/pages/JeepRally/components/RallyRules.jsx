import React, { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  fetchRallyDocuments,
  resolveCheckpointImageUrl,
} from "../../../api/features/rally/rally.service.jsx";
import { activeRallyQueryOptions } from "../../../api/features/rally/rally.queryOptions.jsx";
import SlidingWindowDotPagination from "../../../components/common/SlidingWindowDotPagination.jsx";
import {
  getSlidingWindowPrimarySpotTransition,
  slidingWindowPrimarySpotVariants,
} from "../../../constants/slidingWindowCarousel.animation.js";
import { useSlidingWindowCarousel } from "../../../hooks/useSlidingWindowCarousel.js";
import {
  getRulesCardSlotStyle,
  normalizeRallyDocuments,
  RALLY_RULES_WINDOW_SIZE,
  resolveRallyDocumentBgImage,
  shouldShowRulesDotPagination,
} from "./rallyRules.utils.js";

function normalizeFileUrlString(raw) {
  if (raw == null) return null;
  const s = String(raw).trim();
  return s || null;
}

async function downloadRallyFile(url, title) {
  const base =
    (title || "document")
      .replace(/[/\\?%*:|"<>]/g, "-")
      .replace(/\s+/g, "-")
      .slice(0, 120) || "document";
  const extMatch = url.split(/[#?]/)[0].match(/\.([a-z0-9]+)$/i);
  const ext = extMatch ? extMatch[1].toLowerCase() : "pdf";
  const filename = base.toLowerCase().endsWith(`.${ext}`)
    ? base
    : `${base}.${ext}`;

  try {
    const res = await fetch(url);
    if (res.ok) {
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
      return;
    }
  } catch {
    /* network / CORS — fall back below */
  }

  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.target = "_blank";
  a.rel = "noopener noreferrer";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

const RulesCard = ({ title, slotIndex = 0, fileUrl, bgImage }) => {
  const rawPath = normalizeFileUrlString(fileUrl);
  const canDownload = Boolean(rawPath);
  const slotStyle = getRulesCardSlotStyle(slotIndex);
  const hasBgImage = Boolean(bgImage);

  return (
    <div
      className={`relative flex min-h-[400px] flex-1 flex-col items-center justify-center overflow-hidden rounded-md p-8 text-center transition-transform duration-500 ease-out hover:-translate-y-2 md:min-h-[450px] md:p-12 ${
        hasBgImage ? "bg-cover bg-center bg-no-repeat" : slotStyle.bgClass
      }`}
      style={hasBgImage ? { backgroundImage: `url('${bgImage}')` } : undefined}
    >
      {hasBgImage ? (
        <div className="absolute inset-0 bg-black/35" aria-hidden />
      ) : null}

      <div className="relative z-10 flex flex-col items-center space-y-10">
        <h3
          className={`font-gilda text-2xl capitalize leading-tight tracking-wide md:text-3xl ${slotStyle.titleClass}`}
        >
          {title}
        </h3>

        <button
          type="button"
          disabled={!canDownload}
          onClick={() => {
            if (!rawPath) return;
            const url = resolveCheckpointImageUrl(rawPath);
            if (url) void downloadRallyFile(url, title);
          }}
          className={`rounded-full px-10 py-3 transition-all duration-300 hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:pointer-events-none disabled:opacity-50 ${slotStyle.buttonClass}`}
        >
          Download
        </button>
      </div>
    </div>
  );
};

function RulesCarouselLayout({ layoutKey, direction, children }) {
  const prefersReducedMotion = useReducedMotion();
  const transition = getSlidingWindowPrimarySpotTransition(prefersReducedMotion);

  return (
    <div className="relative overflow-hidden">
      <AnimatePresence mode="wait" initial={false} custom={direction}>
        <motion.div
          key={layoutKey}
          custom={direction}
          variants={slidingWindowPrimarySpotVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={transition}
          className="flex w-full flex-col gap-6 will-change-[opacity,transform] md:flex-row md:gap-8"
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

const STATIC_FALLBACK_DOCUMENTS = [
  {
  _id: "static-a",
    title: "CDR 2026, RALLY COMPETITION RULES",
    file_url: null,
    bg_image: null,
  },
  {
    _id: "static-b",
    title: "DIRT BIKE CDR 2026, RALLY COMPETITION RULES",
    file_url: null,
    bg_image: null,
  },
];

const RallyRules = ({ content }) => {
  const { data: activeEvent } = useQuery(activeRallyQueryOptions);
  const eventId = activeEvent?._id;

  const { data: documentsRaw = [] } = useQuery({
    queryKey: ["rally", "documents", eventId],
    queryFn: () => fetchRallyDocuments(eventId),
    enabled: Boolean(eventId),
    refetchOnWindowFocus: false,
  });

  const documents = useMemo(() => {
    const list = normalizeRallyDocuments(documentsRaw);
    return list.length > 0 ? list : STATIC_FALLBACK_DOCUMENTS;
  }, [documentsRaw]);

  const carousel = useSlidingWindowCarousel(documents, {
    windowSize: RALLY_RULES_WINDOW_SIZE,
  });
  const { direction, visibleItems, pageCount, activePageIndex, goToPage } =
    carousel;

  const showDots = shouldShowRulesDotPagination(documents.length);

  const visibleCards = useMemo(
    () =>
      visibleItems.map((document, index) => ({
        document,
        slotIndex: index,
        bgImage: resolveRallyDocumentBgImage(document),
      })),
    [visibleItems],
  );

  const layoutKey = visibleCards
    .map(({ document }) => document._id)
    .join("-");

  return (
    <section className="bg-white py-section-break">
      <div className="container mx-auto px-4">
        <div className="flex flex-col gap-16 lg:flex-row lg:items-center">
          <div className="w-full space-y-8 lg:w-[35%]">
            <h2 className="font-gilda text-[29px] leading-tight text-black md:text-[42px]">
              {content?.title || (
                <>
                  Rally Rules and <br className="hidden md:block" /> Documents
                </>
              )}
            </h2>
            <p className="para max-w-3xl leading-relaxed text-gray-500">
              {content?.subTitle ||
                "Welcome to the Cholistan Desert Rally 2026 Rules and Documents area. All Rally Racers, looking to read the rules for competition or application for registration and Rally safety guidelines, then this is the place to get them."}
            </p>
          </div>

          <div className="w-full lg:w-[65%]">
            <RulesCarouselLayout layoutKey={layoutKey} direction={direction}>
              {visibleCards.map(({ document, slotIndex, bgImage }) => (
                <RulesCard
                  key={`${document._id}-${slotIndex}`}
                  title={document.title ?? ""}
                  slotIndex={slotIndex}
                  fileUrl={document.file_url}
                  bgImage={bgImage}
                />
              ))}
              {visibleCards.length === 1 ? (
                <div
                  className="pointer-events-none hidden min-h-[400px] flex-1 rounded-md opacity-0 md:block md:min-h-[450px]"
                  aria-hidden
                />
              ) : null}
            </RulesCarouselLayout>

            {showDots && pageCount > 0 ? (
              <SlidingWindowDotPagination
                count={pageCount}
                activeIndex={activePageIndex}
                onSelect={goToPage}
                className="mt-6"
                ariaLabel="Rally documents page"
              />
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
};

export default RallyRules;
