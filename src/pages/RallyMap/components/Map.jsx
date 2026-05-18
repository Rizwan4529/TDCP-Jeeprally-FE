import React, { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { FiImage, FiMapPin } from "react-icons/fi";
import "../RallyMap.css";
import {
  getCategoryLabelMap,
  getDefaultCategoryKey,
  hasCategoryKey,
  normalizeCategories,
} from "../../../utils/constants.js";
import { shouldShowRoutesEmpty } from "../map.utils.js";
import {
  fetchRallyRoutes,
  fetchRouteCheckpoints,
  resolveCheckpointImageUrl,
} from "../../../api/features/rally/rally.service.jsx";
import { activeRallyQueryOptions } from "../../../api/features/rally/rally.queryOptions.jsx";
import {
  useCategoriesQuery,
  useWebsiteContentQuery,
} from "../../../api/features/content/hooks.jsx";
import {
  getWebsiteContentPage,
  getWebsiteContentSection,
} from "../../../api/features/content/websiteContent.utils.js";

function topPercentForIndex(index, total) {
  if (total <= 0) return 0;
  if (total === 1) return 46;
  const padTop = 12;
  const padBottom = 20;
  const span = 100 - padTop - padBottom;
  return padTop + (index / (total - 1)) * span;
}

function CheckpointImageSlot({ image, title }) {
  const [broken, setBroken] = useState(false);
  const url = resolveCheckpointImageUrl(image);

  if (!url || broken) {
    return (
      <div
        className="rm-card-img rm-card-img-placeholder"
        role="img"
        aria-label={`No image for ${title}`}
      >
        <FiImage aria-hidden className="rm-card-img-placeholder-icon" />
      </div>
    );
  }

  return (
    <img
      className="rm-card-img"
      src={url}
      alt=""
      onError={() => setBroken(true)}
    />
  );
}

function CheckpointBlock({ checkpoint, side, style }) {
  const isRight = side === "right";
  const km = `(${checkpoint.km_start}–${checkpoint.km_end} KM)`;
  const points = Array.isArray(checkpoint.description_points)
    ? checkpoint.description_points
    : [];

  const card = (
    <div className="rm-card">
      <CheckpointImageSlot image={checkpoint.image} title={checkpoint.title} />
      <div className="rm-card-body">
        <h2 className="rm-card-title">
          {checkpoint.title} <span className="rm-km">{km}</span>
        </h2>
        {points.length > 0 && (
          <ul className="rm-list">
            {points.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );

  const connector = <div className="rm-dot-connector" />;

  return (
    <div
      className={`rm-item ${isRight ? "rm-right" : "rm-left"}`}
      style={style}
    >
      {isRight ? (
        <>
          {connector}
          {card}
        </>
      ) : (
        <>
          {card}
          {connector}
        </>
      )}
    </div>
  );
}

function CheckpointSequenceCard({ checkpoint, index }) {
  const orderNum = Number(checkpoint.order ?? index + 1);
  const km = `(${checkpoint.km_start}–${checkpoint.km_end} KM)`;
  const points = Array.isArray(checkpoint.description_points)
    ? checkpoint.description_points
    : [];

  return (
    <article className="rm-mobile-card">
      <div className="rm-mobile-card-header">
        <span className="rm-mobile-card-step">{orderNum}</span>
        <div className="rm-mobile-card-copy">
          <h2 className="rm-mobile-card-title">{checkpoint.title}</h2>
          <p className="rm-mobile-card-km">{km}</p>
        </div>
      </div>

      {(checkpoint.is_start || checkpoint.is_finish) && (
        <div className="rm-mobile-card-badges">
          {checkpoint.is_start && <span className="rm-mobile-card-badge">Start</span>}
          {checkpoint.is_finish && (
            <span className="rm-mobile-card-badge">Finish</span>
          )}
        </div>
      )}

      {points.length > 0 && (
        <ul className="rm-mobile-card-list">
          {points.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      )}
    </article>
  );
}

function MapEmptyState({ title, description }) {
  return (
    <div className="rm-checkpoints-empty" role="status">
      <FiMapPin className="rm-checkpoints-empty-icon" aria-hidden />
      <p className="rm-checkpoints-empty-title">{title}</p>
      <p className="rm-checkpoints-empty-text">{description}</p>
    </div>
  );
}

const Map = () => {
  const [activeCategory, setActiveCategory] = useState("");

  const { data: activeEvent } = useQuery(activeRallyQueryOptions);
  const { data: categoriesRaw = [] } = useCategoriesQuery();
  const { data: websiteContent } = useWebsiteContentQuery();

  const eventId = activeEvent?._id;
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
    data: routes = [],
    isFetching: routesLoading,
    isSuccess: routesSuccess,
  } = useQuery({
    queryKey: ["rally", "routes", eventId, activeCategory],
    queryFn: () => fetchRallyRoutes(eventId, activeCategory),
    enabled: Boolean(eventId && activeCategory),
  });

  const primaryRoute = routes[0];
  const title = primaryRoute?.title;
  const distanceKm = primaryRoute?.total_distance_km;
  const estimatedTime = primaryRoute?.estimated_time;
  const routeId = primaryRoute?._id;

  const {
    data: checkpointsRaw = [],
    isFetching: checkpointsLoading,
    isSuccess: checkpointsSuccess,
  } = useQuery({
    queryKey: ["rally", "checkpoints", routeId],
    queryFn: () => fetchRouteCheckpoints(routeId),
    enabled: Boolean(routeId),
  });

  const checkpoints = useMemo(
    () =>
      [...checkpointsRaw].sort(
        (a, b) => Number(a.order ?? 0) - Number(b.order ?? 0)
      ),
    [checkpointsRaw]
  );

  const showCheckpointsEmpty =
    Boolean(routeId) && checkpointsSuccess && checkpoints.length === 0;
  const showRoutesEmpty = shouldShowRoutesEmpty({
    eventId,
    activeCategory,
    routes,
    routesSuccess,
  });

  const firstCp = checkpoints[0];
  const lastCp = checkpoints[checkpoints.length - 1];
  const showStartLabel = Boolean(firstCp?.is_start);
  const showFinishLabel = Boolean(lastCp?.is_finish);
  const rallyMapPage = useMemo(
    () => getWebsiteContentPage(websiteContent, "rallyMap"),
    [websiteContent]
  );
  const chromeContent = useMemo(
    () => getWebsiteContentSection(rallyMapPage, "chrome"),
    [rallyMapPage]
  );
  const emptyStatesContent = useMemo(
    () => getWebsiteContentSection(rallyMapPage, "emptyStates"),
    [rallyMapPage]
  );

  return (
    <div className="rm-wrapper ">
      <header className="rm-header">
        <div className="rm-title-row">
          <img
            src={chromeContent?.leftFlagImage || "/assets/images/flag.png"}
            alt="flag"
            className="w-10 md:w-20 rotate-y-180"
          />
          <p className="font-gilda text-[24px] md:text-[42px]">
            {routesLoading && !title ? "…" : title ?? "—"}
          </p>
          <img
            src={chromeContent?.rightFlagImage || "/assets/images/flag.png"}
            alt="flag"
            className="w-10 md:w-20"
          />
        </div>
        <div className="rm-stats">
          <p>
            {chromeContent?.totalDistanceLabel || "Total Distance"}:{" "}
            <strong>
              {distanceKm != null ? `~${distanceKm} KM` : "—"}
            </strong>
          </p>
          <p>
            {chromeContent?.estimatedTimeLabel || "Estimated Time"}:{" "}
            <strong>{estimatedTime ?? "—"}</strong>
          </p>
        </div>

        <div className="rm-toggle-container max-w-full">
          {categories.map((category) => (
            <button
              key={category.key}
              type="button"
              className={`rm-toggle-btn whitespace-nowrap ${
                activeCategory === category.key ? "active" : ""
              }`}
              onClick={() => setActiveCategory(category.key)}
            >
              {categoryLabels[category.key]}
            </button>
          ))}
        </div>
      </header>

      <div
        className={`rm-canvas rm-canvas-desktop${showRoutesEmpty ? " rm-canvas--empty" : ""}`}
      >
        {!showRoutesEmpty && showStartLabel && (
          <div className="rm-label-start" aria-hidden>
            {chromeContent?.startLabel || "Start"}
          </div>
        )}
        {!showRoutesEmpty && showFinishLabel && (
          <div className="rm-label-finish" aria-hidden>
            {chromeContent?.finishLabel || "Finish"}
          </div>
        )}

        {!showRoutesEmpty && (
          <img
            src={chromeContent?.trackImage || "/assets/images/map_line.png"}
            alt="Rally Track"
            className={`rm-road-img${checkpointsLoading ? " rm-road-img--dim" : ""}`}
          />
        )}

        {showRoutesEmpty && (
          <MapEmptyState
            title={emptyStatesContent?.route?.title || "No route added yet"}
            description={emptyStatesContent?.route?.description || "A route has not been added for this category yet. Please check back later."}
          />
        )}

        {!showRoutesEmpty &&
          showCheckpointsEmpty && (
            <MapEmptyState
              title={emptyStatesContent?.checkpoints?.title || "No checkpoints yet"}
              description={emptyStatesContent?.checkpoints?.description || "Checkpoints have not been added for this route. Please check back later."}
            />
          )}

        {!showRoutesEmpty &&
          checkpoints.map((cp, index) => {
            const orderNum = Number(cp.order ?? index + 1);
            const side = orderNum % 2 === 1 ? "left" : "right";
            const top = `${topPercentForIndex(index, checkpoints.length)}%`;
            return (
              <CheckpointBlock
                key={cp._id}
                checkpoint={cp}
                side={side}
                style={{ top }}
              />
            );
          })}
      </div>

      <div className="rm-mobile-sequence">
        {showRoutesEmpty && (
          <MapEmptyState
            title={emptyStatesContent?.route?.title || "No route added yet"}
            description={emptyStatesContent?.route?.description || "A route has not been added for this category yet. Please check back later."}
          />
        )}

        {!showRoutesEmpty &&
          showCheckpointsEmpty && (
            <MapEmptyState
              title={emptyStatesContent?.checkpoints?.title || "No checkpoints yet"}
              description={emptyStatesContent?.checkpoints?.description || "Checkpoints have not been added for this route. Please check back later."}
            />
          )}

        {!showRoutesEmpty &&
          !showCheckpointsEmpty &&
          checkpoints.map((cp, index) => (
            <CheckpointSequenceCard
              key={cp._id}
              checkpoint={cp}
              index={index}
            />
          ))}
      </div>
    </div>
  );
};

export default Map;
