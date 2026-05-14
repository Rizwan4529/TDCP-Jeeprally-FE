import React, { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import "./Players.css";
import Partners from "../JeepRally/components/Partners";
import { useCategoriesQuery } from "../../api/features/content/hooks.jsx";
import {
  getCategoryFilterTabs,
  getDefaultCategoryKey,
  hasCategoryKey,
} from "../../utils/constants.js";
import { activeRallyQueryOptions } from "../../api/features/rally/rally.queryOptions.jsx";
import {
  fetchRallyCompetitors,
  resolveCheckpointImageUrl,
} from "../../api/features/rally/rally.service.jsx";
import {
  getPlayerSkeletonCards,
  mapCompetitorsToPlayers,
} from "./players.utils.js";

const Players = () => {
  const [activeCategoryKey, setActiveCategoryKey] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const { data: categoriesRaw = [] } = useCategoriesQuery();
  const { data: activeEvent } = useQuery(activeRallyQueryOptions);
  const tabs = useMemo(
    () => getCategoryFilterTabs(categoriesRaw),
    [categoriesRaw]
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
    () => mapCompetitorsToPlayers(competitorsRaw, resolveCheckpointImageUrl),
    [competitorsRaw]
  );

  const filteredPlayers = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return playersData;
    return playersData.filter((player) =>
      player.name.toLowerCase().includes(query)
    );
  }, [playersData, searchQuery]);

  const playerSkeletons = useMemo(() => getPlayerSkeletonCards(), []);

  return (
    <div className="players-page mt-[100px]">
      <div className="players-container">
        {/* Banner Section */}
        <div className="players-banner">
          <div className="banner-frame-container">
            <img src="/assets/images/frame.png" alt="TDCP Jeep Rally Frame" className="banner-frame-img" />
            <div className="banner-text-overlay">
              <h1 className="banner-title">TDCP JEEP RALLY</h1>
            </div>
          </div>
          <p className="banner-subtitle">Cholistan 2026</p>
        </div>

        {/* Header Content Row */}
        <div className="players-header-row">
          <h1 className="players-title">Players Name</h1>
          <div className="search-container">
            <input
              type="text"
              placeholder="Driver name"
              className="search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="button" className="search-btn">
              Search
            </button>
          </div>
        </div>

        {/* Filters Section */}
        <div className="players-filters">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              className={`filter-btn ${
                activeCategoryKey === tab.key ? "active" : ""
              }`}
              onClick={() => setActiveCategoryKey(tab.key)}
            >
              {tab.title}
            </button>
          ))}
        </div>

        {/* Players Grid Section */}
        <div className="players-grid">
          {!eventId && (
            <div className="col-span-full text-center py-12 text-gray-500">
              Active rally is not available yet.
            </div>
          )}
          {eventId && isPending && (
            <>
              {playerSkeletons.map((skeleton) => (
                <div
                  key={skeleton.id}
                  className="player-card player-card-skeleton"
                  aria-hidden="true"
                >
                  <div className="player-img player-img-skeleton" />
                  <div className="player-info-box player-info-box-skeleton">
                    <span className="player-number-skeleton" />
                    <span className="player-name-skeleton" />
                  </div>
                </div>
              ))}
            </>
          )}
          {eventId && isError && (
            <div className="col-span-full text-center py-12 text-red-600">
              Could not load competitors. Please try again later.
            </div>
          )}
          {eventId && !isPending && !isError && filteredPlayers.length === 0 && (
            <div className="col-span-full text-center py-12 text-gray-500">
              No approved competitors found for this category.
            </div>
          )}
          {eventId &&
            !isPending &&
            !isError &&
            filteredPlayers.map((player) => (
              <div key={player.id} className="player-card">
                <img
                  src={player.image}
                  alt={player.name}
                  className="player-img"
                />
                <div className="player-info-box">
                  <span className="player-number">{player.number}</span>
                  <span className="player-name">{player.name}</span>
                </div>
              </div>
            ))}
        </div>
      </div>

      <Partners />
    </div>
  );
};

export default Players;
