import React, { useEffect, useMemo, useState } from "react";
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
  shouldShowChampionsEmpty,
  sortChampionsList,
} from "./championsSection.utils.js";
import {
  getWebsiteContentPage,
  getWebsiteContentSection,
} from "../../../api/features/content/websiteContent.utils.js";
import CategoryFilter from "../../../components/common/CategoryFilter.jsx";

const CHAMPION_IMAGE_FALLBACK = "/assets/images/person-champion.png";

const ChampionPodiumRow = ({ champions, getChampionLink }) => (
  <div className="mx-auto flex max-w-7xl flex-col items-end justify-center gap-6 md:flex-row lg:gap-8">
    {champions.map((player) => (
      <Link
        to={getChampionLink(player)}
        key={player.id}
        className={`group relative flex w-full flex-col justify-end md:w-1/3 ${player.order}`}
      >
        <div className="flex w-full cursor-pointer flex-col overflow-hidden rounded-[15px] shadow-lg transition-transform duration-500 hover:-translate-y-2">
          <div
            className={`relative w-full shrink-0 overflow-hidden ${player.height}`}
          >
            <img
              src={player.image}
              alt={player.name}
              className={`absolute inset-0 ${player.height} w-full object-cover object-top`}
              onError={(e) => handleImageError(e, CHAMPION_IMAGE_FALLBACK)}
            />
          </div>

          <div className="shrink-0 bg-primary px-4 py-3 text-center font-gilda text-lg tracking-wide text-white">
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
  filterCategoriesWithChampions = false,
  sectionClassName = "",
  titleClassName = "",
  subtitleClassName = "text-gray-600",
}) => {
  const [activeCategoryKey, setActiveCategoryKey] = useState("");
  const { data: categoriesRaw = [] } = useCategoriesQuery();
  const { data: websiteContent } = useWebsiteContentQuery();
  const { data: activeEvent } = useQuery(activeRallyQueryOptions);
  const isPastEventMode = Boolean(useApiCategories && eventIdOverride);
  const shouldFilterCategoriesWithChampions =
    filterCategoriesWithChampions && !isPastEventMode;

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

  const visibleTabs = useMemo(() => {
    if (!shouldFilterCategoriesWithChampions) {
      return tabs;
    }

    return getCategoryTabsWithChampions(tabs, allHomeChampionsRaw);
  }, [allHomeChampionsRaw, shouldFilterCategoriesWithChampions, tabs]);

  const filterCategories = useMemo(
    () =>
      visibleTabs.map((tab) => ({
        key: tab.key,
        title: tab.title,
      })),
    [visibleTabs],
  );

  useEffect(() => {
    if (isPastEventMode) return;

    const resolvedCategoryKey = resolveChampionsCategoryKey({
      categories: shouldFilterCategoriesWithChampions
        ? filterCategories
        : categoriesRaw,
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
    isPastEventMode,
    shouldFilterCategoriesWithChampions,
    visibleTabs.length,
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

  const championsRaw = isPastEventMode
    ? pastChampionsRaw
    : shouldFilterCategoriesWithChampions
      ? homeChampionsRaw
      : websiteChampionsRaw;
  const championsSuccess = isPastEventMode
    ? pastChampionsSuccess
    : shouldFilterCategoriesWithChampions
      ? allHomeChampionsSuccess
      : websiteChampionsSuccess;
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

  const showChampionsEmpty =
    (shouldFilterCategoriesWithChampions &&
      completedRalliesSuccess &&
      !mostRecentCompletedRally) ||
    (shouldFilterCategoriesWithChampions &&
      allHomeChampionsSuccess &&
      visibleTabs.length === 0) ||
    shouldShowChampionsEmpty({
      eventId,
      activeCategoryKey: isPastEventMode ? "all" : activeCategoryKey,
      champions: sortedChampionsRaw,
      championsSuccess,
      requireCategory: !isPastEventMode,
    });

  const showCategoryFilters =
    !hideFilters &&
    !isPastEventMode &&
    visibleTabs.length > (shouldFilterCategoriesWithChampions ? 1 : 0);

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

        {championsPending && (
          <p className="py-12 text-center text-gray-500">Loading champions…</p>
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

        {!championsPending && !showChampionsEmpty && champions.length > 0 ? (
          <ChampionPodiumRow
            champions={champions}
            getChampionLink={getChampionLink}
          />
        ) : null}
      </div>
    </section>
  );
};

export default ChampionsSection;
