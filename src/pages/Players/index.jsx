import React, { useEffect, useMemo, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router";
import Partners from "../JeepRally/components/Partners";
import {
  useCategoriesQuery,
  useWebsiteContentQuery,
} from "../../api/features/content/hooks.jsx";
import {
  getCategoryFilterTabs,
  getDefaultCategoryKey,
  handleImageError,
  hasCategoryKey,
  resolveImageUrl,
} from "../../utils/constants.js";
import { activeRallyQueryOptions } from "../../api/features/rally/rally.queryOptions.jsx";
import { fetchRallyCompetitors } from "../../api/features/rally/rally.service.jsx";
import {
  getCompetitorProfilePath,
  getPlayerSkeletonCards,
  mapCompetitorsToPlayers,
} from "./players.utils.js";
import {
  getWebsiteContentPage,
  getWebsiteContentSection,
} from "../../api/features/content/websiteContent.utils.js";
import CategoryFilter from "../../components/common/CategoryFilter.jsx";

const PLAYER_CARD_CLASS =
  "relative flex aspect-[4/5] items-end justify-center overflow-visible rounded-lg bg-[#3b4950]";

const PLAYER_SKELETON_SHIMMER = "players-skeleton-shimmer";

function PlayerCardSkeleton() {
  return (
    <div className={`${PLAYER_CARD_CLASS} bg-[#eceef2]`} aria-hidden="true">
      <div className={`${PLAYER_SKELETON_SHIMMER} h-full w-full rounded-lg`} />
      <div className="absolute bottom-[-20px] left-1/2 flex w-[85%] max-[600px]:w-[90%] -translate-x-1/2 flex-col gap-2.5 rounded-md bg-white px-6 py-4 shadow-[0_4px_15px_rgba(0,0,0,0.1)]">
        <span
          className={`${PLAYER_SKELETON_SHIMMER} block h-[0.9rem] w-[42%] rounded-full`}
        />
        <span
          className={`${PLAYER_SKELETON_SHIMMER} block h-4 w-[76%] rounded-full`}
        />
      </div>
    </div>
  );
}

const PLAYER_CARD_STAGGER_STEP_MS = 45;
const PLAYER_CARD_STAGGER_MAX_MS = 360;

function PlayerCard({
  player,
  activeCategoryKey,
  eventId,
  animateCard = false,
  animationDelayMs = 0,
}) {
  return (
    <Link
      to={getCompetitorProfilePath({
        playerId: player.id,
        category: activeCategoryKey,
        eventId,
      })}
      className={`${PLAYER_CARD_CLASS} block text-inherit no-underline transition-transform duration-300 hover:-translate-y-1 ${
        animateCard ? "animate-champions-card-in opacity-0" : ""
      }`}
      style={
        animateCard ? { animationDelay: `${animationDelayMs}ms` } : undefined
      }
    >
      <img
        src={player.image}
        alt={player.name}
        className="h-full w-full rounded-lg object-cover"
        onError={(event) => handleImageError(event, player.imageFallback)}
      />
      <div className="absolute bottom-[-20px] left-1/2 flex w-[85%] max-[600px]:w-[90%] -translate-x-1/2 flex-col gap-1 rounded-md bg-white px-6 py-4 shadow-[0_4px_15px_rgba(0,0,0,0.1)]">
        <span className="text-[0.9rem] font-normal text-[#333]">
          {player.number}
        </span>
        <span className="font-sans text-base font-normal text-black">
          {player.name}
        </span>
      </div>
    </Link>
  );
}

const Players = () => {
  const [activeCategoryKey, setActiveCategoryKey] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [gridPhase, setGridPhase] = useState("visible");
  const [displayedPlayers, setDisplayedPlayers] = useState([]);
  const skipInitialGridTransition = useRef(true);
  const filteredPlayersRef = useRef([]);
  const { data: categoriesRaw = [] } = useCategoriesQuery();
  const { data: websiteContent } = useWebsiteContentQuery();
  const { data: activeEvent } = useQuery(activeRallyQueryOptions);
  const tabs = useMemo(
    () => getCategoryFilterTabs(categoriesRaw),
    [categoriesRaw],
  );
  const eventId = activeEvent?._id;

  useEffect(() => {
    if (tabs.length === 0) return;

    if (
      !activeCategoryKey ||
      !hasCategoryKey(categoriesRaw, activeCategoryKey)
    ) {
      setActiveCategoryKey(getDefaultCategoryKey(categoriesRaw));
    }
  }, [activeCategoryKey, categoriesRaw, tabs.length]);

  const {
    data: competitorsRaw = [],
    isPending,
    isError,
  } = useQuery({
    queryKey: ["rally", "competitors", eventId, activeCategoryKey],
    queryFn: () => fetchRallyCompetitors(eventId, activeCategoryKey),
    enabled: Boolean(eventId && activeCategoryKey),
    refetchOnWindowFocus: false,
  });

  const playersData = useMemo(
    () => mapCompetitorsToPlayers(competitorsRaw, resolveImageUrl),
    [competitorsRaw],
  );

  const filteredPlayers = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return playersData;
    return playersData.filter((player) =>
      player.name.toLowerCase().includes(query),
    );
  }, [playersData, searchQuery]);

  filteredPlayersRef.current = filteredPlayers;

  useEffect(() => {
    if (gridPhase === "out") return;
    setDisplayedPlayers(filteredPlayers);
  }, [filteredPlayers, gridPhase]);

  useEffect(() => {
    if (skipInitialGridTransition.current) {
      skipInitialGridTransition.current = false;
      return;
    }
    if (!activeCategoryKey) return;

    setGridPhase("out");

    const exitTimer = window.setTimeout(() => {
      setDisplayedPlayers(filteredPlayersRef.current);
      setGridPhase("in");
    }, 280);

    return () => window.clearTimeout(exitTimer);
  }, [activeCategoryKey]);

  useEffect(() => {
    if (gridPhase !== "in") return;

    const enterTimer = window.setTimeout(() => {
      setGridPhase("visible");
    }, 550);

    return () => window.clearTimeout(enterTimer);
  }, [gridPhase]);

  const gridAnimationClass =
    gridPhase === "out"
      ? "animate-champions-podium-out pointer-events-none"
      : gridPhase === "in"
        ? "animate-champions-podium-in"
        : "";

  const showPlayerSkeletons =
    isPending && displayedPlayers.length === 0 && gridPhase === "visible";

  const playerSkeletons = useMemo(() => getPlayerSkeletonCards(), []);
  const playersPage = useMemo(
    () => getWebsiteContentPage(websiteContent, "players"),
    [websiteContent],
  );
  const heroContent = useMemo(
    () => getWebsiteContentSection(playersPage, "hero"),
    [playersPage],
  );
  const listHeaderContent = useMemo(
    () => getWebsiteContentSection(playersPage, "listHeader"),
    [playersPage],
  );
  const messagesContent = useMemo(
    () => getWebsiteContentSection(playersPage, "messages"),
    [playersPage],
  );

  return (
    <div className="mt-[100px] min-h-screen bg-white px-4 pb-8 pt-20">
      <div className="mx-auto max-w-[1200px]">
        <div className="mb-12 flex w-full flex-col items-center">
          <div className="relative flex w-full max-w-[800px] items-center justify-center">
            <img
              src={resolveImageUrl(
                heroContent?.frameImage,
                "/assets/images/frame.png",
              )}
              alt="TDCP Jeep Rally Frame"
              className="h-auto w-full"
              onError={(event) =>
                handleImageError(event, "/assets/images/frame.png")
              }
            />
            <div className="absolute left-1/2 top-1/2 w-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
              <h1 className="m-0 whitespace-nowrap font-gilda text-[clamp(1.5rem,4vw,2.5rem)] text-black">
                {heroContent?.title || "TDCP JEEP RALLY"}
              </h1>
            </div>
          </div>
          <p className="mt-2 font-sans text-xl italic text-[#333]">
            {heroContent?.subTitle || "Cholistan 2026"}
          </p>
        </div>

        <div className="mb-8 flex flex-wrap items-center justify-between gap-6 max-[900px]:flex-col max-[900px]:items-start">
          <h1 className="m-0 font-gilda text-[clamp(1.5rem,5vw,2.5rem)] text-black">
            {listHeaderContent?.title || "Players Name"}
          </h1>
          <div className="flex max-w-[500px] flex-1 gap-2 max-[900px]:w-full max-[900px]:max-w-none">
            <input
              type="text"
              placeholder={
                listHeaderContent?.searchPlaceholder || "Driver name"
              }
              className="flex-1 rounded-md border border-[#e0e0e0] px-8 py-2 text-[0.9rem] outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button
              type="button"
              className="cursor-pointer rounded-lg border-0 bg-primary px-8 py-1.5 text-[0.9rem] font-medium text-white transition-colors hover:bg-primary-dark"
            >
              {listHeaderContent?.searchButtonText || "Search"}
            </button>
          </div>
        </div>

        <CategoryFilter
          tabs={tabs}
          activeKey={activeCategoryKey}
          onChange={setActiveCategoryKey}
          className="mb-14"
        />

        <div
          className={`mb-16 grid grid-cols-1 gap-12 will-change-[opacity,transform] min-[601px]:grid-cols-2 min-[601px]:gap-6 min-[901px]:grid-cols-3 min-[1201px]:grid-cols-4 min-[1201px]:gap-8 ${gridAnimationClass}`}
        >
          {!eventId && (
            <div className="col-span-full py-12 text-center text-gray-500">
              {messagesContent?.noActiveEvent ||
                "Active rally is not available yet."}
            </div>
          )}
          {eventId && showPlayerSkeletons && (
            <>
              {playerSkeletons.map((skeleton) => (
                <PlayerCardSkeleton key={skeleton.id} />
              ))}
            </>
          )}
          {eventId && isError && (
            <div className="col-span-full py-12 text-center text-red-600">
              {messagesContent?.loadError ||
                "Could not load competitors. Please try again later."}
            </div>
          )}
          {eventId &&
            !isError &&
            !showPlayerSkeletons &&
            filteredPlayers.length === 0 &&
            gridPhase === "visible" && (
              <div className="col-span-full py-12 text-center text-gray-500">
                {messagesContent?.emptyState ||
                  "No approved competitors found for this category."}
              </div>
            )}
          {eventId &&
            !isError &&
            !showPlayerSkeletons &&
            displayedPlayers.map((player, index) => (
              <PlayerCard
                key={`${activeCategoryKey}-${player.id}`}
                player={player}
                activeCategoryKey={activeCategoryKey}
                eventId={eventId}
                animateCard={gridPhase === "in"}
                animationDelayMs={Math.min(
                  index * PLAYER_CARD_STAGGER_STEP_MS,
                  PLAYER_CARD_STAGGER_MAX_MS,
                )}
              />
            ))}
        </div>
      </div>

      <Partners />
    </div>
  );
};

export default Players;
