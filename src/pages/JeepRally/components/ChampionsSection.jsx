import React, { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router";
import { useCategoriesQuery } from "../../../api/features/content/hooks.jsx";
import { useWebsiteContentQuery } from "../../../api/features/content/hooks.jsx";
import { getCategoryFilterTabs } from "../../../utils/constants.js";
import { activeRallyQueryOptions } from "../../../api/features/rally/rally.queryOptions.jsx";
import {
  fetchRallyChampions,
  resolveCheckpointImageUrl,
} from "../../../api/features/rally/rally.service.jsx";
import {
  resolveChampionsCategoryKey,
  shouldShowChampionsEmpty,
} from "./championsSection.utils.js";
import {
  getWebsiteContentPage,
  getWebsiteContentSection,
} from "../../../api/features/content/websiteContent.utils.js";

const POSITION_STYLES = {
  1: {
    height: "h-[360px] md:h-[460px]",
    order: "order-2",
    desktopOrder: 1,
  },
  2: {
    height: "h-[320px] md:h-[400px]",
    order: "order-1",
    desktopOrder: 0,
  },
  3: {
    height: "h-[320px] md:h-[400px]",
    order: "order-3",
    desktopOrder: 2,
  },
};

const ChampionsSection = ({
  content,
  forcedCategoryKey = "",
  hideFilters = false,
  sectionClassName = "",
  titleClassName = "text-primary",
  subtitleClassName = "text-gray-500",
}) => {
  const [activeCategoryKey, setActiveCategoryKey] = useState("");
  const { data: categoriesRaw = [] } = useCategoriesQuery();
  const { data: websiteContent } = useWebsiteContentQuery();
  const { data: activeEvent } = useQuery(activeRallyQueryOptions);
  const tabs = useMemo(
    () => getCategoryFilterTabs(categoriesRaw),
    [categoriesRaw],
  );
  const eventId = activeEvent?._id;

  useEffect(() => {
    const resolvedCategoryKey = resolveChampionsCategoryKey({
      categories: categoriesRaw,
      activeCategoryKey,
      forcedCategoryKey,
    });

    if (resolvedCategoryKey && resolvedCategoryKey !== activeCategoryKey) {
      setActiveCategoryKey(resolvedCategoryKey);
    }
  }, [activeCategoryKey, categoriesRaw, forcedCategoryKey, tabs.length]);

  const { data: championsRaw = [], isSuccess: championsSuccess } = useQuery({
    queryKey: ["rally", "champions", eventId, activeCategoryKey],
    queryFn: () => fetchRallyChampions(eventId, activeCategoryKey),
    enabled: Boolean(eventId && activeCategoryKey),
    refetchOnWindowFocus: false,
  });

  const champions = useMemo(
    () =>
      [...championsRaw]
        .sort((a, b) => {
          const aPosition = Number(a.position ?? 0);
          const bPosition = Number(b.position ?? 0);
          const aPriority =
            POSITION_STYLES[aPosition]?.desktopOrder ?? aPosition + 10;
          const bPriority =
            POSITION_STYLES[bPosition]?.desktopOrder ?? bPosition + 10;
          return aPriority - bPriority;
        })
        .map((champion) => {
          const position = Number(champion.position ?? 0);
          const style = POSITION_STYLES[position] ?? {
            height: "h-[320px] md:h-[400px]",
            order: "",
          };
          return {
            id: champion._id,
            rank: String(champion.position ?? "—"),
            name:
              champion.team_id?.driver_id?.name || champion.driver_name || "—",
            team: champion.team_id?.team_name || "Team",
            image: resolveCheckpointImageUrl(champion.image),
            height: style.height,
            order: style.order,
          };
        }),
    [championsRaw],
  );
  const showChampionsEmpty = shouldShowChampionsEmpty({
    eventId,
    activeCategoryKey,
    champions,
    championsSuccess,
  });
  const resolvedContent = useMemo(() => {
    if (content) return content;
    return getWebsiteContentSection(
      getWebsiteContentPage(websiteContent, "home"),
      "champions"
    );
  }, [content, websiteContent]);

  return (
    <section className={`py-10 md:py-10 bg-section ${sectionClassName}`}>
      <div className="container mx-auto px-4 lg:px-20">
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <h2
            className={`font-gilda text-[32px] md:text-[42px] leading-tight ${titleClassName}`}
          >
            {resolvedContent?.title || "Champions of the Rally"}
          </h2>
          <p className={`para max-w-2xl mx-auto ${subtitleClassName}`}>
            {resolvedContent?.subtitle || "Celebrating the top performers who conquered the desert track"}
          </p>
        </div>
        {/* Filters Section */}
        {!hideFilters && (
          <div className="players-filters flex justify-center overflow-x-auto no-scrollbar gap-2 md:gap-4 mb-12">
            {tabs.map((tab) => (
              <button
                key={tab.key}
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
        {/* Podium Layout */}
        {showChampionsEmpty ? (
          <div className="mx-auto max-w-3xl rounded-[15px] border border-primary/10 bg-white/80 px-6 py-12 text-center shadow-sm">
            <p className="font-gilda text-[26px] text-primary">
              No champions added yet
            </p>
            <p className="mt-3 text-sm text-gray-500 md:text-base">
              Champions have not been published for this category yet. Please check
              back later.
            </p>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row items-end justify-center gap-6 lg:gap-8 max-w-5xl mx-auto">
            {champions
              .sort((a, b) => {
                // Desktop: 2, 1, 3. Mobile: 1, 2, 3
                const desktopOrder = [2, 1, 3];
                return desktopOrder.indexOf(a.id) - desktopOrder.indexOf(b.id);
              })
              .map((player) => (
                <Link
                  to={`/player/${player.id}?category=${encodeURIComponent(activeCategoryKey)}`}
                  key={player.id}
                  className={`relative w-full md:w-1/3 flex flex-col justify-end h-full ${player.order} group`}
                >
                  {/* Card Container with Gradient */}
                  <div
                    className={`w-full rounded-[15px] overflow-hidden shadow-lg transition-transform duration-500 hover:-translate-y-2 h-full cursor-pointer`}
                  >
                    {/* Player Image */}
                    <div className={`pointer-events-none w-full h-full`}>
                      <img
                        src={player.image}
                        alt={player.name}
                        className={`w-full ${player.height} object-cover rounded-t-[15px]`}
                      />
                    </div>

                    {/* Name Bar */}
                    <div className=" py-3 px-4 bg-primary text-white text-center font-gilda text-lg tracking-wide">
                      {player.name} ( {player.team} )
                    </div>
                  </div>
                </Link>
              ))}
          </div>
        )}
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
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
