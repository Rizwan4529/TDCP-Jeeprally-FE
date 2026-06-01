import React, { useEffect, useMemo, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router";
import { useCategoriesQuery } from "../../../api/features/content/hooks.jsx";
import { useWebsiteContentQuery } from "../../../api/features/content/hooks.jsx";
import {
  getCategoryFilterTabs,
  handleImageError,
} from "../../../utils/constants.js";
import {
  activeRallyQueryOptions,
  completedRalliesQueryOptions,
} from "../../../api/features/rally/rally.queryOptions.jsx";
import { getMostRecentCompletedRally } from "../../../api/features/rally/rallyEvents.utils.js";
import {
  fetchRallyChampions,
  resolveCheckpointImageUrl,
} from "../../../api/features/rally/rally.service.jsx";
import {
  getCategoryTabsWithChampions,
  mapChampionsToPodium,
  resolveChampionsCategoryKey,
  shouldHideChampionsSection,
  sortChampionsList,
} from "./championsSection.utils.js";
import {
  getWebsiteContentPage,
  getWebsiteContentSection,
} from "../../../api/features/content/websiteContent.utils.js";
import CategoryFilter from "../../../components/common/CategoryFilter.jsx";

const CHAMPION_IMAGE_FALLBACK = "/assets/images/person-champion.png";

const CHAMPION_CARD_STAGGER = {
  "order-1": "[animation-delay:80ms]",
  "order-2": "[animation-delay:0ms]",
  "order-3": "[animation-delay:160ms]",
};

const ChampionPodiumRow = ({ champions, getChampionLink, animateCards = false }) => (
  <div className="mx-auto flex max-w-7xl flex-col items-end justify-center gap-6 md:flex-row md:items-end lg:gap-8">
    {champions.map((player) => (
      <Link
        to={getChampionLink(player)}
        key={player.id}
        className={`group relative flex w-full flex-col justify-end md:w-1/3 ${player.order} ${
          animateCards
            ? `animate-champions-card-in opacity-0 ${CHAMPION_CARD_STAGGER[player.order] ?? ""}`
            : ""
        }`}
      >
        <div
          className={`flex w-full cursor-pointer flex-col overflow-hidden rounded-[15px] shadow-lg transition-transform duration-500 ease-out hover:-translate-y-2 ${player.cardHeight}`}
        >
          <div className="relative min-h-0 w-full flex-1 overflow-hidden">
            <img
              src={player.image}
              alt={player.name}
              className="absolute inset-0 h-full w-full object-cover object-top"
              onError={(e) => handleImageError(e, CHAMPION_IMAGE_FALLBACK)}
            />
          </div>

          <div
            className={`flex shrink-0 items-center justify-center bg-primary px-4 py-3 text-center font-gilda text-base leading-snug tracking-wide text-white md:text-lg ${player.footerHeight}`}
          >
            <p className="line-clamp-3">
              {player.navigatorName
                ? `${player.name} & ${player.navigatorName}`
                : player.name}{" "}
              ( {player.team} )
            </p>
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
  filterCategoriesWithChampions = false,
  sectionClassName = "",
  titleClassName = "",
  subtitleClassName = "text-gray-600",
}) => {
  const [activeCategoryKey, setActiveCategoryKey] = useState("");
  const [podiumPhase, setPodiumPhase] = useState("visible");
  const [displayedChampions, setDisplayedChampions] = useState([]);
  const skipInitialPodiumTransition = useRef(true);
  const championsRef = useRef([]);
  const { data: categoriesRaw = [] } = useCategoriesQuery();
  const { data: websiteContent } = useWebsiteContentQuery();
  const { data: activeEvent } = useQuery(activeRallyQueryOptions);
  const isPastEventMode = Boolean(useApiCategories && eventIdOverride);
  const shouldFilterCategoriesWithChampions =
    filterCategoriesWithChampions && !isPastEventMode;
  const shouldFilterTabsByChampions =
    shouldFilterCategoriesWithChampions || isPastEventMode;

  const {
    data: completedRallies = [],
    isSuccess: completedRalliesSuccess,
    isPending: completedRalliesPending,
  } = useQuery({
    ...completedRalliesQueryOptions,
    enabled: shouldFilterCategoriesWithChampions,
  });

  const mostRecentCompletedRally = useMemo(
    () => getMostRecentCompletedRally(completedRallies),
    [completedRallies],
  );

  const eventId = useMemo(() => {
    if (eventIdOverride) return eventIdOverride;
    if (shouldFilterCategoriesWithChampions) {
      return mostRecentCompletedRally?._id ?? "";
    }
    return activeEvent?._id ?? "";
  }, [
    activeEvent?._id,
    eventIdOverride,
    mostRecentCompletedRally?._id,
    shouldFilterCategoriesWithChampions,
  ]);

  const tabs = useMemo(
    () => getCategoryFilterTabs(categoriesRaw),
    [categoriesRaw],
  );

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
    data: allHomeChampionsRaw = [],
    isSuccess: allHomeChampionsSuccess,
    isPending: allHomeChampionsPending,
  } = useQuery({
    queryKey: ["rally", "champions", eventId, "all-categories"],
    queryFn: () => fetchRallyChampions(eventId),
    enabled: Boolean(
      shouldFilterCategoriesWithChampions && eventId && completedRalliesSuccess,
    ),
    refetchOnWindowFocus: false,
  });

  const championsForTabFilter = isPastEventMode
    ? pastChampionsRaw
    : allHomeChampionsRaw;

  const visibleTabs = useMemo(() => {
    if (!shouldFilterTabsByChampions) {
      return tabs;
    }

    return getCategoryTabsWithChampions(tabs, championsForTabFilter);
  }, [championsForTabFilter, shouldFilterTabsByChampions, tabs]);

  const filterCategories = useMemo(
    () =>
      visibleTabs.map((tab) => ({
        key: tab.key,
        title: tab.title,
      })),
    [visibleTabs],
  );

  useEffect(() => {
    const resolvedCategoryKey = resolveChampionsCategoryKey({
      categories: shouldFilterTabsByChampions ? filterCategories : categoriesRaw,
      activeCategoryKey,
      forcedCategoryKey,
    });

    if (resolvedCategoryKey && resolvedCategoryKey !== activeCategoryKey) {
      setActiveCategoryKey(resolvedCategoryKey);
    }
  }, [
    activeCategoryKey,
    categoriesRaw,
    filterCategories,
    forcedCategoryKey,
    shouldFilterTabsByChampions,
    visibleTabs.length,
  ]);

  const {
    data: websiteChampionsRaw = [],
    isSuccess: websiteChampionsSuccess,
    isPending: websiteChampionsPending,
  } = useQuery({
    queryKey: ["rally", "champions", eventId, activeCategoryKey],
    queryFn: () => fetchRallyChampions(eventId, activeCategoryKey),
    enabled: Boolean(
      !isPastEventMode &&
      !shouldFilterCategoriesWithChampions &&
      eventId &&
      activeCategoryKey,
    ),
    refetchOnWindowFocus: false,
  });

  const homeChampionsRaw = useMemo(() => {
    if (!shouldFilterCategoriesWithChampions || !activeCategoryKey) {
      return [];
    }

    return allHomeChampionsRaw.filter(
      (champion) => String(champion?.category ?? "") === activeCategoryKey,
    );
  }, [
    activeCategoryKey,
    allHomeChampionsRaw,
    shouldFilterCategoriesWithChampions,
  ]);

  const pastChampionsByCategory = useMemo(() => {
    if (!isPastEventMode || !activeCategoryKey) {
      return [];
    }

    return pastChampionsRaw.filter(
      (champion) => String(champion?.category ?? "") === activeCategoryKey,
    );
  }, [activeCategoryKey, isPastEventMode, pastChampionsRaw]);

  const championsRaw = isPastEventMode
    ? pastChampionsByCategory
    : shouldFilterCategoriesWithChampions
      ? homeChampionsRaw
      : websiteChampionsRaw;
  const championsPending = isPastEventMode
    ? pastChampionsPending
    : shouldFilterCategoriesWithChampions
      ? completedRalliesPending || allHomeChampionsPending
      : websiteChampionsPending;

  const resolveChampionImage = (image) =>
    resolveCheckpointImageUrl(image) || CHAMPION_IMAGE_FALLBACK;

  const sortedChampionsRaw = useMemo(
    () => sortChampionsList(championsRaw),
    [championsRaw],
  );

  const champions = useMemo(
    () => mapChampionsToPodium(championsRaw, resolveChampionImage),
    [championsRaw],
  );

  championsRef.current = champions;

  useEffect(() => {
    if (champions.length === 0) return;
    if (podiumPhase === "out") return;
    setDisplayedChampions(champions);
  }, [champions, podiumPhase]);

  useEffect(() => {
    if (skipInitialPodiumTransition.current) {
      skipInitialPodiumTransition.current = false;
      return;
    }
    if (!activeCategoryKey) return;

    setPodiumPhase("out");

    const exitTimer = window.setTimeout(() => {
      setDisplayedChampions(championsRef.current);
      setPodiumPhase("in");
    }, 280);

    return () => window.clearTimeout(exitTimer);
  }, [activeCategoryKey]);

  useEffect(() => {
    if (podiumPhase !== "in") return;

    const enterTimer = window.setTimeout(() => {
      setPodiumPhase("visible");
    }, 550);

    return () => window.clearTimeout(enterTimer);
  }, [podiumPhase]);

  const podiumAnimationClass =
    podiumPhase === "out"
      ? "animate-champions-podium-out pointer-events-none"
      : podiumPhase === "in"
        ? "animate-champions-podium-in"
        : "";

  const allChampionsReady = isPastEventMode
    ? pastChampionsSuccess
    : shouldFilterCategoriesWithChampions
      ? completedRalliesSuccess && allHomeChampionsSuccess
      : false;

  const shouldHideSection = shouldHideChampionsSection({
    isLoading: championsPending,
    hasEvent: Boolean(eventId),
    usesAllChampionsGate: shouldFilterTabsByChampions,
    allChampionsReady,
    allChampionsCount: championsForTabFilter.length,
    visibleTabCount: visibleTabs.length,
    usesCategoryQuery: !shouldFilterTabsByChampions,
    categoryChampionsReady: websiteChampionsSuccess,
    categoryChampionsCount: sortedChampionsRaw.length,
  });

  const showCategoryFilters =
    !hideFilters &&
    visibleTabs.length > (shouldFilterTabsByChampions ? 1 : 0);

  const resolvedContent = useMemo(() => {
    if (content) return content;
    return getWebsiteContentSection(
      getWebsiteContentPage(websiteContent, "home"),
      "champions",
    );
  }, [content, websiteContent]);

  if (shouldHideSection) {
    return null;
  }

  const getChampionLink = (player) => {
    if (isPastEventMode) {
      const params = new URLSearchParams({ eventId });
      if (player.category) {
        params.set("category", player.category);
      }
      return `/player/${player.id}?${params.toString()}`;
    }

    const params = new URLSearchParams({
      category: activeCategoryKey,
    });
    if (eventId) {
      params.set("eventId", eventId);
    }
    return `/player/${player.id}?${params.toString()}`;
  };

  return (
    <section
      className={`overflow-x-clip bg-section py-section-break ${sectionClassName}`}
    >
      <div className="container mx-auto px-4 lg:px-20">
        <div className="mb-8 space-y-4 text-center">
          <h2
            className={`mb-2 font-gilda text-[32px] font-semibold leading-tight md:text-[42px] ${titleClassName}`}
          >
            {resolvedContent?.title || "Champions of the Rally"}
          </h2>
          <p className={`para mx-auto max-w-2xl ${subtitleClassName}`}>
            {resolvedContent?.subtitle ||
              "Celebrating the top performers who conquered the desert track"}
          </p>
          {/* {shouldFilterCategoriesWithChampions && mostRecentCompletedRally?.name ? (
            <p className="text-sm text-gray-500 md:text-base">
              Showing champions from {mostRecentCompletedRally.name}
            </p>
          ) : null} */}
        </div>

        {showCategoryFilters && (
          <CategoryFilter
            tabs={visibleTabs}
            activeKey={activeCategoryKey}
            onChange={setActiveCategoryKey}
            className="mb-12"
          />
        )}

        {displayedChampions.length > 0 ? (
          <div className={`will-change-[opacity,transform] ${podiumAnimationClass}`}>
            <ChampionPodiumRow
              key={activeCategoryKey}
              champions={displayedChampions}
              getChampionLink={getChampionLink}
              animateCards={podiumPhase === "in"}
            />
          </div>
        ) : null}
      </div>
    </section>
  );
};

export default ChampionsSection;
