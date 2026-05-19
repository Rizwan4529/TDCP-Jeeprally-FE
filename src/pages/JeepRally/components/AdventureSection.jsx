import { useCallback, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import SlidingWindowDotPagination from "../../../components/common/SlidingWindowDotPagination.jsx";
import SlidingWindowPrimarySlot from "../../../components/common/SlidingWindowPrimarySlot";
import SlidingWindowSideSlot from "../../../components/common/SlidingWindowSideSlot";
import VideoLightbox from "../../../components/common/VideoLightbox";
import VideoPlayButton from "../../../components/common/VideoPlayButton";
import { useSlidingWindowCarousel } from "../../../hooks/useSlidingWindowCarousel.js";
import { useVideoLightbox } from "../../../hooks/useVideoLightbox.js";
import {
  fetchRallyVideos,
  resolveRallyVideoUrl,
} from "../../../api/features/rally/rally.service.jsx";
import { useWebsiteContentQuery } from "../../../api/features/content/hooks.jsx";
import {
  getWebsiteContentPage,
  getWebsiteContentSection,
} from "../../../api/features/content/websiteContent.utils.js";
import {
  ADVENTURE_VIDEO_SLOT_COUNT,
  getAdventureVideoColumns,
  shouldShowAdventureDotPagination,
  shouldShowAdventureSection,
} from "./adventureSection.utils.js";

const ADVENTURE_GRID_HEIGHT = "lg:h-[600px]";

const SLOT_CLASSES = {
  main: `md:col-span-12 lg:col-span-6 relative group overflow-hidden rounded-md h-[280px] sm:h-[400px] lg:h-full lg:min-h-0`,
  stackEqual:
    "md:col-span-6 lg:col-span-3 grid min-h-0 h-full grid-rows-2 gap-6",
  stackSplit:
    "md:col-span-6 lg:col-span-3 grid min-h-0 h-full gap-6 grid-rows-[220fr_340fr]",
  stackTile:
    "relative group overflow-hidden rounded-md min-h-0 h-[200px] sm:h-[240px] lg:h-full cursor-pointer",
};

const DEFAULT_STATS = [
  {
    value: "600+",
    label: "Registered Racers",
    subLabel: "competing each year",
  },
  { value: "95+", label: "Professional Routes", subLabel: "carefully mapped" },
  {
    value: "500+",
    label: "Dedicated Volunteers",
    subLabel: "supporting the event",
  },
];

function VideoTile({ video, size, className, onOpen, animated = false }) {
  if (!video) return null;

  const handleOpen = () => onOpen(video);

  const tile = (
    <div
      className={animated ? "relative h-full w-full" : className}
      onClick={handleOpen}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          handleOpen();
        }
      }}
      role="button"
      tabIndex={0}
      aria-label="Play video in fullscreen"
    >
      <video
        src={resolveRallyVideoUrl(video.video_url)}
        className="pointer-events-none h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
        playsInline
        muted
        preload="metadata"
      />
      <div className="absolute inset-0 bg-black/10" />
      <div className="absolute inset-0 flex items-center justify-center">
        <VideoPlayButton
          size={size}
          ariaLabel="Play video"
          onClick={(event) => {
            event.stopPropagation();
            handleOpen();
          }}
        />
      </div>
    </div>
  );

  if (!animated) {
    return tile;
  }

  return (
    <SlidingWindowSideSlot itemKey={video._id} className={className}>
      {tile}
    </SlidingWindowSideSlot>
  );
}

const AdventureSection = ({ content }) => {
  const videoLightbox = useVideoLightbox();
  const { data: websiteContent } = useWebsiteContentQuery();

  const { data: videosRaw = [], isPending } = useQuery({
    queryKey: ["rally", "videos"],
    queryFn: fetchRallyVideos,
    refetchOnWindowFocus: false,
    staleTime: Infinity,
    gcTime: Infinity,
    retry: 1,
  });

  const videos = useMemo(() => [...videosRaw], [videosRaw]);
  const showSection = shouldShowAdventureSection(videos);
  const resolvedContent = useMemo(() => {
    if (content) return content;
    return getWebsiteContentSection(
      getWebsiteContentPage(websiteContent, "home"),
      "stats",
    );
  }, [content, websiteContent]);
  const stats = useMemo(() => {
    const apiStats = resolvedContent?.stats
      ?.map((item) => ({
        value: item?.value,
        label: item?.label,
      }))
      .filter((item) => item?.value && item?.label);

    return apiStats?.length ? apiStats : DEFAULT_STATS;
  }, [resolvedContent]);

  const carousel = useSlidingWindowCarousel(videos, {
    windowSize: ADVENTURE_VIDEO_SLOT_COUNT,
  });
  const { windowOffset, direction, visibleItems, goToIndex } = carousel;
  const showDots = shouldShowAdventureDotPagination(videos);
  const columns = useMemo(
    () => getAdventureVideoColumns(visibleItems),
    [visibleItems],
  );

  const openVideoLightbox = useCallback(
    (video) => {
      videoLightbox.open({
        src: resolveRallyVideoUrl(video.video_url),
        title: video.title || "Rally video",
      });
    },
    [videoLightbox],
  );

  const goToWindow = useCallback(
    (index) => {
      if (videoLightbox.isOpen) {
        videoLightbox.close();
      }
      goToIndex(index);
    },
    [goToIndex, videoLightbox],
  );

  if (isPending || !showSection) {
    return null;
  }

  return (
    <section className="pt-section-break bg-white overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="relative mb-16 md:mb-20">
          <div
            className={`grid grid-cols-1 md:grid-cols-12 gap-6 lg:items-stretch ${ADVENTURE_GRID_HEIGHT}`}
          >
            <SlidingWindowPrimarySlot
              itemKey={columns.main?._id}
              direction={direction}
              className={SLOT_CLASSES.main}
            >
              <VideoTile
                video={columns.main}
                size="lg"
                className="relative h-full w-full overflow-hidden rounded-md"
                onOpen={openVideoLightbox}
              />
            </SlidingWindowPrimarySlot>

            {columns.firstStack.length > 0 && (
              <div className={SLOT_CLASSES.stackEqual}>
                {columns.firstStack[0] && (
                  <VideoTile
                    video={columns.firstStack[0]}
                    size="sm"
                    className={SLOT_CLASSES.stackTile}
                    onOpen={openVideoLightbox}
                    animated
                  />
                )}
                {columns.firstStack[1] && (
                  <VideoTile
                    video={columns.firstStack[1]}
                    size="sm"
                    className={SLOT_CLASSES.stackTile}
                    onOpen={openVideoLightbox}
                    animated
                  />
                )}
              </div>
            )}

            {columns.secondStack.length > 0 && (
              <div className={SLOT_CLASSES.stackSplit}>
                {columns.secondStack[0] && (
                  <VideoTile
                    video={columns.secondStack[0]}
                    size="sm"
                    className={SLOT_CLASSES.stackTile}
                    onOpen={openVideoLightbox}
                    animated
                  />
                )}
                {columns.secondStack[1] && (
                  <VideoTile
                    video={columns.secondStack[1]}
                    size="sm"
                    className={SLOT_CLASSES.stackTile}
                    onOpen={openVideoLightbox}
                    animated
                  />
                )}
              </div>
            )}
          </div>

          {showDots ? (
            <SlidingWindowDotPagination
              count={videos.length}
              activeIndex={windowOffset}
              onSelect={goToWindow}
              className="mt-6"
              ariaLabel="Featured video position"
            />
          ) : null}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 py-0 md:py-0 ">
          {stats.map((item) => (
            <div
              key={`${item.value}-${item.label}`}
              className="flex items-center gap-4 md:gap-6"
            >
              <span className="text-[42px] lg:text-[64px] font-nanum-myeongjo font-bold text-brand-green leading-none">
                {item.value}
              </span>
              <p className="text-[18px] text-gray-500 leading-snug font-manrope">
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      <VideoLightbox
        isOpen={videoLightbox.isOpen}
        onClose={videoLightbox.close}
        src={videoLightbox.src}
        title={videoLightbox.title}
      />
    </section>
  );
};

export default AdventureSection;
