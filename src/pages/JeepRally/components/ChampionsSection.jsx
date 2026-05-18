import React, { useEffect, useMemo, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { useCategoriesQuery } from "../../../api/features/content/hooks.jsx";
import { useWebsiteContentQuery } from "../../../api/features/content/hooks.jsx";
import {
  getCategoryFilterTabs,
  handleImageError,
} from "../../../utils/constants.js";
import { activeRallyQueryOptions } from "../../../api/features/rally/rally.queryOptions.jsx";
import {
  fetchRallyChampions,
  resolveCheckpointImageUrl,
} from "../../../api/features/rally/rally.service.jsx";
import {
  chunkChampions,
  mapChampionSlideToPodium,
  mapChampionsToPodium,
  resolveChampionsCategoryKey,
  shouldShowChampionsEmpty,
  sortChampionsList,
} from "./championsSection.utils.js";
import {
  getWebsiteContentPage,
  getWebsiteContentSection,
} from "../../../api/features/content/websiteContent.utils.js";
import "swiper/css";
import "swiper/css/navigation";

const CHAMPION_IMAGE_FALLBACK = "/assets/images/person-champion.png";
const PODIUM_CHUNK_SIZE = 3;

const ChampionPodiumRow = ({ champions, getChampionLink }) => (
  <div className="flex flex-col md:flex-row items-end justify-center gap-6 lg:gap-8 max-w-5xl mx-auto">
    {champions.map((player) => (
      <Link
        to={getChampionLink(player)}
        key={player.id}
        className={`relative w-full md:w-1/3 flex flex-col justify-end h-full ${player.order} group`}
      >
        <div className="w-full rounded-[15px] overflow-hidden shadow-lg transition-transform duration-500 hover:-translate-y-2 h-full cursor-pointer">
          <div className="pointer-events-none w-full h-full">
            <img
              src={player.image}
              alt={player.name}
              className={`w-full ${player.height} object-cover rounded-t-[15px]`}
              onError={(e) => handleImageError(e, CHAMPION_IMAGE_FALLBACK)}
            />
          </div>

          <div className="py-3 px-4 bg-primary text-white text-center font-gilda text-lg tracking-wide">
            {player.name} ( {player.team} )
          </div>
        </div>
      </Link>
    ))}
  </div>
);

const ChampionsSection = ({
  content,
  eventId: eventIdOverride = "",
  forcedCategoryKey = "",
  hideFilters = false,
  useApiCategories = false,
  sectionClassName = "",
  titleClassName = "text-primary",
  subtitleClassName = "text-gray-500",
}) => {
  const [activeCategoryKey, setActiveCategoryKey] = useState("");
  const swiperRef = useRef(null);
  const [swiperInstance, setSwiperInstance] = useState(null);
  const prevButtonRef = useRef(null);
  const nextButtonRef = useRef(null);
  const { data: categoriesRaw = [] } = useCategoriesQuery();
  const { data: websiteContent } = useWebsiteContentQuery();
  const { data: activeEvent } = useQuery(activeRallyQueryOptions);
  const tabs = useMemo(
    () => getCategoryFilterTabs(categoriesRaw),
    [categoriesRaw],
  );
  const eventId = eventIdOverride || activeEvent?._id;
  const isPastEventMode = Boolean(useApiCategories && eventIdOverride);

  useEffect(() => {
    if (isPastEventMode) return;

    const resolvedCategoryKey = resolveChampionsCategoryKey({
      categories: categoriesRaw,
      activeCategoryKey,
      forcedCategoryKey,
    });

    if (resolvedCategoryKey && resolvedCategoryKey !== activeCategoryKey) {
      setActiveCategoryKey(resolvedCategoryKey);
    }
  }, [
    activeCategoryKey,
    categoriesRaw,
    forcedCategoryKey,
    isPastEventMode,
    tabs.length,
  ]);

  const {
    data: pastChampionsRaw = [],
    isSuccess: pastChampionsSuccess,
    isPending: pastChampionsPending,
  } = useQuery({
    queryKey: ["rally", "champions", eventId, "all"],
    queryFn: () => fetchRallyChampions(eventId),
    enabled: Boolean(isPastEventMode && eventId),
    refetchOnWindowFocus: false,
  });

  const {
    data: websiteChampionsRaw = [],
    isSuccess: websiteChampionsSuccess,
    isPending: websiteChampionsPending,
  } = useQuery({
    queryKey: ["rally", "champions", eventId, activeCategoryKey],
    queryFn: () => fetchRallyChampions(eventId, activeCategoryKey),
    enabled: Boolean(!isPastEventMode && eventId && activeCategoryKey),
    refetchOnWindowFocus: false,
  });

  const championsRaw = isPastEventMode ? pastChampionsRaw : websiteChampionsRaw;
  const championsSuccess = isPastEventMode
    ? pastChampionsSuccess
    : websiteChampionsSuccess;
  const championsPending = isPastEventMode
    ? pastChampionsPending
    : websiteChampionsPending;

  const resolveChampionImage = (image) =>
    resolveCheckpointImageUrl(image) || CHAMPION_IMAGE_FALLBACK;

  const sortedPastChampions = useMemo(
    () => sortChampionsList(pastChampionsRaw),
    [pastChampionsRaw],
  );

  const championSlides = useMemo(() => {
    if (!isPastEventMode) return [];

    return chunkChampions(sortedPastChampions, PODIUM_CHUNK_SIZE).map((slide) =>
      mapChampionSlideToPodium(slide, resolveChampionImage),
    );
  }, [isPastEventMode, sortedPastChampions]);

  const champions = useMemo(() => {
    if (isPastEventMode) {
      return championSlides[0] ?? [];
    }

    return mapChampionsToPodium(championsRaw, resolveChampionImage);
  }, [championSlides, championsRaw, isPastEventMode]);

  const canCarousel = isPastEventMode && championSlides.length > 1;

  useEffect(() => {
    if (!canCarousel) {
      setSwiperInstance(null);
      swiperRef.current = null;
    }
  }, [canCarousel]);

  useEffect(() => {
    const swiper = swiperInstance;
    if (
      !swiper ||
      !canCarousel ||
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
  }, [canCarousel, championSlides.length, swiperInstance]);

  const showChampionsEmpty = shouldShowChampionsEmpty({
    eventId,
    activeCategoryKey: isPastEventMode ? "all" : activeCategoryKey,
    champions: isPastEventMode ? sortedPastChampions : champions,
    championsSuccess,
    requireCategory: !isPastEventMode,
  });

  const showCategoryFilters =
    !hideFilters && !isPastEventMode && tabs.length > 0;

  const resolvedContent = useMemo(() => {
    if (content) return content;
    return getWebsiteContentSection(
      getWebsiteContentPage(websiteContent, "home"),
      "champions",
    );
  }, [content, websiteContent]);

  const getChampionLink = (player) => {
    if (isPastEventMode) {
      const params = new URLSearchParams({ eventId });
      if (player.category) {
        params.set("category", player.category);
      }
      return `/player/${player.id}?${params.toString()}`;
    }

    return `/player/${player.id}?category=${encodeURIComponent(activeCategoryKey)}`;
  };

  return (
    <section className={`py-10 md:py-10 bg-section ${sectionClassName}`}>
      <div className="container mx-auto px-4 lg:px-20">
        <div className="text-center mb-16 space-y-4">
          <h2
            className={`font-gilda text-[32px] md:text-[42px] leading-tight ${titleClassName}`}
          >
            {resolvedContent?.title || "Champions of the Rally"}
          </h2>
          <p className={`para max-w-2xl mx-auto ${subtitleClassName}`}>
            {resolvedContent?.subtitle ||
              "Celebrating the top performers who conquered the desert track"}
          </p>
        </div>

        {showCategoryFilters && (
          <div className="players-filters flex justify-center overflow-x-auto no-scrollbar gap-2 md:gap-4 mb-12">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                type="button"
                className={`px-6 py-2 rounded-full text-sm transition-all duration-300 whitespace-nowrap ${
                  activeCategoryKey === tab.key
                    ? "bg-secondary text-black shadow-md"
                    : "bg-white/50 text-gray-600 hover:bg-white"
                }`}
                onClick={() => setActiveCategoryKey(tab.key)}
              >
                {tab.title}
              </button>
            ))}
          </div>
        )}

        {championsPending && (
          <p className="text-center text-gray-500 py-12">Loading champions…</p>
        )}

        {!championsPending && showChampionsEmpty ? (
          <div className="mx-auto max-w-3xl rounded-[15px] border border-primary/10 bg-white/80 px-6 py-12 text-center shadow-sm">
            <p className="font-gilda text-[26px] text-primary">
              No champions added yet
            </p>
            <p className="mt-3 text-sm text-gray-500 md:text-base">
              Champions have not been published for this event yet. Please check
              back later.
            </p>
          </div>
        ) : null}

        {!championsPending && !showChampionsEmpty && canCarousel ? (
          <div className="relative mb-4">
            <Swiper
              key={`${championSlides.length}-carousel`}
              modules={[Navigation]}
              onSwiper={(swiper) => {
                swiperRef.current = swiper;
                setSwiperInstance(swiper);
              }}
              navigation={{
                prevEl: prevButtonRef.current,
                nextEl: nextButtonRef.current,
              }}
              loop={canCarousel}
              loopedSlides={Math.min(championSlides.length, 2)}
              allowTouchMove={canCarousel}
              className="w-full"
            >
              {championSlides.map((slideChampions, slideIndex) => (
                <SwiperSlide key={`champions-slide-${slideIndex}`}>
                  <ChampionPodiumRow
                    champions={slideChampions}
                    getChampionLink={getChampionLink}
                  />
                </SwiperSlide>
              ))}
            </Swiper>

            <button
              ref={prevButtonRef}
              type="button"
              aria-label="Show previous champions"
              className="absolute -left-20 top-1/2 z-40 flex h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full bg-white text-black shadow-xl transition-all duration-300 hover:bg-brand-green hover:text-white"
            >
              <FiArrowLeft className="text-2xl" />
            </button>
            <button
              ref={nextButtonRef}
              type="button"
              aria-label="Show next champions"
              className="absolute -right-20 top-1/2 z-40 flex h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full bg-white text-black shadow-xl transition-all duration-300 hover:bg-brand-green hover:text-white"
            >
              <FiArrowRight className="text-2xl" />
            </button>
          </div>
        ) : null}

        {!championsPending && !showChampionsEmpty && !canCarousel ? (
          <ChampionPodiumRow
            champions={champions}
            getChampionLink={getChampionLink}
          />
        ) : null}
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        .swiper-button-prev, .swiper-button-next { display: none !important; }
        @media (max-width: 767px) {
          .order-1 { order: 2; }
          .order-2 { order: 1; }
          .order-3 { order: 3; }
        }
      `,
        }}
      />
    </section>
  );
};

export default ChampionsSection;
