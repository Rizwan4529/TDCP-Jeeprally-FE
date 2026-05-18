import React, { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import "./Rankings.css";
import Partners from "../JeepRally/components/Partners";
import {
  getCategoryLabelMap,
  getDefaultCategoryKey,
  hasCategoryKey,
  normalizeCategories,
  resolveImageUrl,
  handleImageError,
} from "../../utils/constants.js";
import { fetchRallyRankings } from "../../api/features/rally/rally.service.jsx";
import { activeRallyQueryOptions } from "../../api/features/rally/rally.queryOptions.jsx";
import {
  useCategoriesQuery,
  useWebsiteContentQuery,
} from "../../api/features/content/hooks.jsx";
import {
  getWebsiteContentPage,
  getWebsiteContentSection,
} from "../../api/features/content/websiteContent.utils.js";
import ScrollReveal, { HeroReveal } from "../../components/common/ScrollReveal.jsx";

function mapRankingRows(apiRows) {
  return (apiRows ?? [])
    .map((item) => {
      const team = item.team_id || {};
      const driver = team.driver_id || {};
      return {
        id: item._id,
        pos: item.position ?? 0,
        driveTeam: driver.name || "—",
        team: team.team_name || "—",
        time: item.total_time ?? "—",
        variation: "—",
        penalty: item.total_penalty ?? "—",
        afterStage: item.after_stage,
      };
    })
    .sort((a, b) => Number(a.pos) - Number(b.pos));
}

const Rankings = () => {
  const [activeCategory, setActiveCategory] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const { data: activeEvent } = useQuery(activeRallyQueryOptions);
  const eventId = activeEvent?._id;

  const { data: categoriesRaw = [] } = useCategoriesQuery();
  const { data: websiteContent } = useWebsiteContentQuery();

  const categories = useMemo(
    () => normalizeCategories(categoriesRaw),
    [categoriesRaw]
  );
  const categoryLabels = useMemo(
    () => getCategoryLabelMap(categories),
    [categories]
  );

  useEffect(() => {
    if (categories.length === 0) return;

    if (!activeCategory || !hasCategoryKey(categories, activeCategory)) {
      setActiveCategory(getDefaultCategoryKey(categories));
    }
  }, [activeCategory, categories]);

  const {
    data: rankingsRaw = [],
    isPending,
    isError,
  } = useQuery({
    queryKey: ["rally", "rankings", eventId, activeCategory],
    queryFn: () => fetchRallyRankings(eventId, activeCategory),
    enabled: Boolean(eventId && activeCategory),
    refetchOnWindowFocus: false,
  });

  const rows = useMemo(() => mapRankingRows(rankingsRaw), [rankingsRaw]);

  const filteredRows = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter(
      (r) =>
        r.driveTeam.toLowerCase().includes(q) ||
        r.team.toLowerCase().includes(q)
    );
  }, [rows, searchQuery]);

  const afterStage = useMemo(() => {
    const stages = (rankingsRaw ?? [])
      .map((r) => r.after_stage)
      .filter((v) => v != null && v !== "");
    if (stages.length === 0) return null;
    return Math.max(...stages.map(Number));
  }, [rankingsRaw]);
  const rankingsPage = useMemo(
    () => getWebsiteContentPage(websiteContent, "rankings"),
    [websiteContent]
  );
  const heroContent = useMemo(
    () => getWebsiteContentSection(rankingsPage, "hero"),
    [rankingsPage]
  );
  const tableChromeContent = useMemo(
    () => getWebsiteContentSection(rankingsPage, "tableChrome"),
    [rankingsPage]
  );
  const messagesContent = useMemo(
    () => getWebsiteContentSection(rankingsPage, "messages"),
    [rankingsPage]
  );

  return (
    <>
      <div className="rankings-page !mt-[100px]">
        <div className="rankings-container">
          <HeroReveal>
          <div className="rankings-banner">
            <div className="banner-frame-container">
              <img
                src={resolveImageUrl(heroContent?.frameImage, "/assets/images/frame.png")}
                alt="TDCP Jeep Rally Frame"
                className="banner-frame-img"
                onError={handleImageError}
              />
              <div className="banner-text-overlay">
                <h1 className="banner-title">{heroContent?.title || "TDCP JEEP RALLY"}</h1>
              </div>
            </div>
            <p className="banner-subtitle">{heroContent?.subTitle || "Cholistan 2026"}</p>
          </div>
          </HeroReveal>

          <ScrollReveal variant="fadeUp" duration={0.75}>
          <div className="rankings-header-row">
            <h1 className="rankings-title">
              {afterStage != null
                ? `Rankings after stage ${afterStage}`
                : tableChromeContent?.titleFallback || "Rankings after the stage"}
            </h1>
            <div className="search-container">
              <input
                type="text"
                placeholder={tableChromeContent?.searchPlaceholder || "Driver name"}
                className="search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="button" className="search-btn">
                {tableChromeContent?.searchButtonText || "Search"}
              </button>
            </div>
          </div>

          <div className="rankings-filters no-scrollbar">
            {categories.map((category) => (
              <button
                key={category.key}
                type="button"
                className={`filter-btn ${
                  activeCategory === category.key ? "active" : ""
                }`}
                onClick={() => setActiveCategory(category.key)}
              >
                {categoryLabels[category.key]}
              </button>
            ))}
          </div>

          <div className="rankings-table-wrapper">
            <div className="table-title-bar">
              <h2>{tableChromeContent?.tableTitle || "Team Standing"}</h2>
              <img
                src={resolveImageUrl(tableChromeContent?.headerPatternImage, "/assets/images/head.png")}
                alt="pattern"
                className="header-pattern"
                onError={handleImageError}
              />
            </div>
            <table className="rankings-table">
              <thead>
                <tr>
                  {(tableChromeContent?.tableHeaders ?? [
                    "POS.",
                    "DRIVE-TEAM",
                    "TEAM",
                    "TIME",
                    "VARIATION",
                    "PENALTY",
                  ]).map((header) => (
                    <th key={header}>{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {!eventId && (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-gray-500">
                      {messagesContent?.noActiveEvent || "Active rally is not available yet."}
                    </td>
                  </tr>
                )}
                {eventId && isPending && (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-gray-500">
                      {messagesContent?.loading || "Loading rankings…"}
                    </td>
                  </tr>
                )}
                {eventId && isError && (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-red-600">
                      {messagesContent?.loadError || "Could not load rankings. Please try again later."}
                    </td>
                  </tr>
                )}
                {eventId &&
                  !isPending &&
                  !isError &&
                  filteredRows.length === 0 && (
                    <tr>
                      <td colSpan={6} className="text-center py-8 text-gray-500">
                        {messagesContent?.emptyState || "No rankings for this category."}
                      </td>
                    </tr>
                  )}
                {eventId &&
                  !isPending &&
                  !isError &&
                  filteredRows.map((row) => (
                    <tr key={row.id}>
                      <td>{row.pos}</td>
                      <td className="drive-team">{row.driveTeam}</td>
                      <td className="team-name">{row.team}</td>
                      <td className="time-val">{row.time}</td>
                      <td className="variation-plus">{row.variation}</td>
                      <td>{row.penalty}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          <div className="rankings-footer">
            <div className="footer-flags-wrapper">
              <img
                src={resolveImageUrl(tableChromeContent?.footerFlagImage, "/assets/images/flag_black.png")}
                alt="flag"
                className="w-20 md:w-60 "
                onError={handleImageError}
              />
            </div>
          </div>
          </ScrollReveal>
        </div>
      </div>
      <ScrollReveal variant="zoomIn" delay={0.06} duration={0.7}>
        <Partners />
      </ScrollReveal>
    </>
  );
};

export default Rankings;
