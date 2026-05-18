import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import { useQuery } from "@tanstack/react-query";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import VideoPlayButton from "../../../components/common/VideoPlayButton";
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
  chunkAdventureVideos,
  getAdventureVideoColumns,
  shouldShowAdventureCarouselControls,
} from "./adventureSection.utils.js";
import "swiper/css";
import "swiper/css/navigation";

const SLOT_CLASSES = {
  main: "md:col-span-12 lg:col-span-6 relative group overflow-hidden rounded-md h-[600px] ",
  stack: "md:col-span-6 lg:col-span-3 space-y-6",
  medium: "relative group overflow-hidden rounded-md h-[280px]",
  short: "relative group overflow-hidden rounded-md h-[220px]",
  tall: "relative group overflow-hidden rounded-md h-[340px]",
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

function VideoTile({
  video,
  size,
  className,
  isPlaying,
  isLoading,
  onTogglePlayback,
  registerRef,
}) {
  if (!video) return null;

  return (
    <div className={className}>
      <video
        ref={registerRef(video._id)}
        src={resolveRallyVideoUrl(video.video_url)}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        playsInline
        preload="metadata"
        onClick={() => onTogglePlayback(video._id)}
      />
      <div className="absolute inset-0 bg-black/10" />
      <div className="absolute inset-0 flex items-center justify-center">
        <VideoPlayButton
          size={size}
          isPlaying={isPlaying}
          isLoading={isLoading}
          ariaLabel={isPlaying ? "Pause video" : "Play video"}
          onClick={() => onTogglePlayback(video._id)}
          disabled={isLoading}
        />
      </div>
      {isLoading && (
        <div className="absolute inset-x-0 bottom-0 h-1 overflow-hidden bg-black/10">
          <div className="h-full w-1/2 animate-[loading-bar_1s_ease-in-out_infinite] bg-secondary" />
        </div>
      )}
    </div>
  );
}

const AdventureSection = ({ content }) => {
  const videoRefs = useRef(new Map());
  const swiperRef = useRef(null);
  const [swiperInstance, setSwiperInstance] = useState(null);
  const prevButtonRef = useRef(null);
  const nextButtonRef = useRef(null);
  const [activeVideoId, setActiveVideoId] = useState(null);
  const [loadingVideoId, setLoadingVideoId] = useState(null);
  const sliderId = useId().replace(/:/g, "");
  const { data: websiteContent } = useWebsiteContentQuery();

  const { data: videosRaw = [] } = useQuery({
    queryKey: ["rally", "videos"],
    queryFn: fetchRallyVideos,
    refetchOnWindowFocus: false,
    staleTime: Infinity,
    gcTime: Infinity,
    retry: 1,
  });

  const videos = useMemo(() => [...videosRaw], [videosRaw]);
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

  const videoSlides = useMemo(() => chunkAdventureVideos(videos), [videos]);
  const canNavigate = shouldShowAdventureCarouselControls(videos);

  useEffect(() => {
    if (!canNavigate) {
      setSwiperInstance(null);
      swiperRef.current = null;
    }
  }, [canNavigate]);

  useEffect(() => {
    const swiper = swiperInstance;
    if (
      !swiper ||
      !canNavigate ||
      !prevButtonRef.current ||
      !nextButtonRef.current
    ) {
      return;
    }

    if (!swiper.params.navigation) {
      swiper.params.navigation = {};
    }

    swiper.params.navigation.prevEl = prevButtonRef.current;
    swiper.params.navigation.nextEl = nextButtonRef.current;

    if (swiper.navigation) {
      swiper.navigation.destroy();
      swiper.navigation.init();
      swiper.navigation.update();
    }

    swiper.update();
  }, [swiperInstance, canNavigate, videoSlides.length]);

  const pauseVideoById = useCallback((videoId) => {
    const videoNode = videoRefs.current.get(videoId);
    if (videoNode) {
      videoNode.pause();
    }
  }, []);

  const registerRef = useCallback(
    (videoId) => (node) => {
      if (node) {
        videoRefs.current.set(videoId, node);

        node.onplay = () => {
          setActiveVideoId(videoId);
          setLoadingVideoId(null);
        };
        node.onpause = () => {
          setActiveVideoId((current) => (current === videoId ? null : current));
          setLoadingVideoId((current) =>
            current === videoId ? null : current,
          );
        };
        node.onplaying = () => {
          setActiveVideoId(videoId);
          setLoadingVideoId(null);
        };
        node.onwaiting = () => {
          setLoadingVideoId((current) =>
            current === videoId ? videoId : current,
          );
        };
        node.oncanplay = () => {
          setLoadingVideoId((current) =>
            current === videoId ? null : current,
          );
        };
        node.onended = () => {
          setActiveVideoId((current) => (current === videoId ? null : current));
          setLoadingVideoId((current) =>
            current === videoId ? null : current,
          );
        };
      } else {
        videoRefs.current.delete(videoId);
      }
    },
    [],
  );

  const handleTogglePlayback = useCallback(
    async (videoId) => {
      const currentVideo = videoRefs.current.get(videoId);
      if (!currentVideo) return;

      if (activeVideoId && activeVideoId !== videoId) {
        pauseVideoById(activeVideoId);
      }

      if (!currentVideo.paused && !currentVideo.ended) {
        currentVideo.pause();
        return;
      }

      setLoadingVideoId(videoId);

      try {
        await currentVideo.play();
      } catch {
        setLoadingVideoId(null);
      }
    },
    [activeVideoId, pauseVideoById],
  );

  const handleSlideChange = useCallback(() => {
    if (activeVideoId) {
      pauseVideoById(activeVideoId);
    }
    setActiveVideoId(null);
    setLoadingVideoId(null);
  }, [activeVideoId, pauseVideoById]);

  useEffect(() => {
    return () => {
      videoRefs.current.forEach((videoNode) => videoNode.pause());
    };
  }, []);

  return (
    <section className="py-12 md:py-20 bg-white overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Header Row - 3 Columns */}
        {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12 mb-16 md:mb-20">
          <div className="space-y-4 md:space-y-6">
            <h2 className="text-[28px] md:text-[42px] font-gilda leading-tight text-black border-l-4 border-brand-green pl-6">
              High-Speed <br /> Desert Adventure
            </h2>
            <p className="para text-gray-600">
              Experience the thrill of racing across vast desert landscapes at high speed,
              surrounded by raw natural beauty.
            </p>
          </div>

          <div className="space-y-4 md:space-y-6">
            <h2 className="text-[28px] md:text-[42px] font-gilda leading-tight text-black border-l-4 border-brand-green pl-6">
              Thrilling Off- <br /> Road Experience
            </h2>
            <p className="para text-gray-600 border-t border-gray-100 pt-6">
              An adrenaline-filled experience combining high-speed action,
              desert adventure, and unforgettable moments.
            </p>
          </div>

          <div className="relative space-y-4 md:space-y-6 md:col-span-2 lg:col-span-1">
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 opacity-10 pointer-events-none">
              <img src="/assets/images/flag_3.png" alt="" className="w-32 md:w-40" />
            </div>
            <h2 className="text-[28px] md:text-[42px] font-gilda leading-tight text-black border-l-4 border-brand-green pl-6">
              Unforgettable <br /> Rally Excitement
            </h2>
            <p className="para text-gray-600">
              Navigate rugged terrain and challenging tracks for an adrenaline-pumping
              off-road adventure.
            </p>
          </div>
        </div> */}

        <div className="relative mb-16 md:mb-20">
          <Swiper
            key={`${videoSlides.length}-${canNavigate ? "nav" : "static"}`}
            modules={[Navigation]}
            onSwiper={(swiper) => {
              swiperRef.current = swiper;
              setSwiperInstance(swiper);
            }}
            navigation={
              canNavigate
                ? {
                    prevEl: prevButtonRef.current,
                    nextEl: nextButtonRef.current,
                  }
                : false
            }
            loop={canNavigate}
            loopedSlides={Math.min(videoSlides.length, 2)}
            allowTouchMove={canNavigate}
            onSlideChange={handleSlideChange}
            className="w-full"
          >
            {videoSlides.map((slideVideos, slideIndex) => {
              const columns = getAdventureVideoColumns(slideVideos);

              return (
                <SwiperSlide key={`adventure-slide-${slideIndex}`}>
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                    <VideoTile
                      video={columns.main}
                      size="lg"
                      className={SLOT_CLASSES.main}
                      isPlaying={activeVideoId === columns.main?._id}
                      isLoading={loadingVideoId === columns.main?._id}
                      onTogglePlayback={handleTogglePlayback}
                      registerRef={registerRef}
                    />

                    {columns.firstStack.length > 0 && (
                      <div className={SLOT_CLASSES.stack}>
                        {columns.firstStack[0] && (
                          <VideoTile
                            video={columns.firstStack[0]}
                            size="sm"
                            className={SLOT_CLASSES.medium}
                            isPlaying={
                              activeVideoId === columns.firstStack[0]?._id
                            }
                            isLoading={
                              loadingVideoId === columns.firstStack[0]?._id
                            }
                            onTogglePlayback={handleTogglePlayback}
                            registerRef={registerRef}
                          />
                        )}
                        {columns.firstStack[1] && (
                          <VideoTile
                            video={columns.firstStack[1]}
                            size="sm"
                            className={SLOT_CLASSES.medium}
                            isPlaying={
                              activeVideoId === columns.firstStack[1]?._id
                            }
                            isLoading={
                              loadingVideoId === columns.firstStack[1]?._id
                            }
                            onTogglePlayback={handleTogglePlayback}
                            registerRef={registerRef}
                          />
                        )}
                      </div>
                    )}

                    {columns.secondStack.length > 0 && (
                      <div className={SLOT_CLASSES.stack}>
                        {columns.secondStack[0] && (
                          <VideoTile
                            video={columns.secondStack[0]}
                            size="sm"
                            className={SLOT_CLASSES.short}
                            isPlaying={
                              activeVideoId === columns.secondStack[0]?._id
                            }
                            isLoading={
                              loadingVideoId === columns.secondStack[0]?._id
                            }
                            onTogglePlayback={handleTogglePlayback}
                            registerRef={registerRef}
                          />
                        )}
                        {columns.secondStack[1] && (
                          <VideoTile
                            video={columns.secondStack[1]}
                            size="sm"
                            className={SLOT_CLASSES.tall}
                            isPlaying={
                              activeVideoId === columns.secondStack[1]?._id
                            }
                            isLoading={
                              loadingVideoId === columns.secondStack[1]?._id
                            }
                            onTogglePlayback={handleTogglePlayback}
                            registerRef={registerRef}
                          />
                        )}
                      </div>
                    )}
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>

          {canNavigate && (
            <>
              <button
                ref={prevButtonRef}
                type="button"
                aria-label="Show previous videos"
                className="absolute -left-20 top-1/2 z-40 flex h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full bg-white text-black shadow-xl transition-all duration-300 hover:bg-brand-green hover:text-white"
              >
                <FiArrowLeft className="text-2xl" />
              </button>
              <button
                ref={nextButtonRef}
                type="button"
                aria-label="Show next videos"
                className="absolute -right-20 top-1/2 z-40 flex h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full bg-white text-black shadow-xl transition-all duration-300 hover:bg-brand-green hover:text-white"
              >
                <FiArrowRight className="text-2xl" />
              </button>
            </>
          )}
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 py-0 md:py-0 ">
          {stats.map((item) => (
            <div
              key={`${item.value}-${item.label}`}
              className="flex items-center gap-4 md:gap-6"
            >
              <span className="text-[42px] lg:text-[64px] font-sans font-medium text-brand-green leading-none">
                {item.value}
              </span>
              <p className="text-sm text-gray-500 leading-snug">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
      <style
        dangerouslySetInnerHTML={{
          __html: `
          .swiper-button-prev, .swiper-button-next { display: none !important; }
          @keyframes loading-bar {
            0% { transform: translateX(-100%); }
            50% { transform: translateX(75%); }
            100% { transform: translateX(220%); }
          }
        `,
        }}
      />
    </section>
  );
};

export default AdventureSection;
