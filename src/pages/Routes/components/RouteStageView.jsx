import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { FiChevronDown, FiMapPin } from "react-icons/fi";
import "../Routes.css";
import {
  getCategoryIdByKey,
  getCategoryLabelMap,
  getDefaultCategoryKey,
  handleImageError,
  hasCategoryKey,
  normalizeCategories,
  resolveImageUrl,
} from "../../../utils/constants.js";
import { formatStageDateReadable } from "../rallyStages.utils.js";
import {
  buildCheckpointLightboxItems,
  buildConnectorStyle,
  buildMapCheckpointStyle,
  computeCheckpointLayout,
  findCheckpointLightboxIndex,
  shouldShowRoutesEmpty,
  shouldShowStageNotFound,
} from "../routes.utils.js";
import ImageLightbox from "../../../components/common/ImageLightbox.jsx";
import { useImageLightbox } from "../../../hooks/useImageLightbox.js";
import {
  fetchRallyRoutes,
  fetchRallyStages,
  fetchRouteCheckpoints,
  fetchStageCheckpoints,
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
import CategoryFilter from "../../../components/common/CategoryFilter.jsx";
import StageCheckpointsEmptyCard from "./StageCheckpointsEmptyCard.jsx";
import CheckpointCard from "./CheckpointCard.jsx";
import CheckpointDetailModal from "./CheckpointDetailModal.jsx";

const DEFAULT_FLAG_IMAGE = "/assets/images/flag.png";
const DEFAULT_TRACK_IMAGE = "/assets/images/map_line.png";

function CheckpointBlock({
  checkpoint,
  side,
  topPct,
  leftPct,
  rightPct,
  connectorWidthPx,
  onImageClick,
  onReadMore,
}) {
  const isRight = side === "right";
  const hasCustomPosition = leftPct != null || rightPct != null;
  const card = (
    <CheckpointCard
      checkpoint={checkpoint}
      onImageClick={onImageClick}
      onReadMore={onReadMore}
    />
  );
  const connector = (
    <div
      className="rm-dot-connector"
      style={buildConnectorStyle(connectorWidthPx)}
    />
  );

  const positionStyle = buildMapCheckpointStyle({
    topPct,
    leftPct,
    rightPct,
    side,
  });

  return (
    <div
      className={
        hasCustomPosition
          ? `rm-item rm-item--custom rm-item--${side}`
          : `rm-item ${isRight ? "rm-right" : "rm-left"}`
      }
      style={positionStyle}
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

function MapEmptyState({ title, description }) {
  return (
    <div className="rm-checkpoints-empty" role="status">
      <FiMapPin className="rm-checkpoints-empty-icon" aria-hidden />
      <p className="rm-checkpoints-empty-title">{title}</p>
      <p className="rm-checkpoints-empty-text">{description}</p>
    </div>
  );
}

function CheckpointsEmptyState({ isStageMode, stage, emptyStatesContent }) {
  if (isStageMode && stage) {
    return <StageCheckpointsEmptyCard stage={stage} />;
  }

  return (
    <MapEmptyState
      title={emptyStatesContent?.checkpoints?.title || "No checkpoints yet"}
      description={
        emptyStatesContent?.checkpoints?.description ||
        "Checkpoints have not been added for this route. Please check back later."
      }
    />
  );
}

const RouteStageView = ({ stageId } = {}) => {
  const imageLightbox = useImageLightbox();
  const [activeCategory, setActiveCategory] = useState("");
  const [showOverflow, setShowOverflow] = useState(false);
  const [detailCheckpoint, setDetailCheckpoint] = useState(null);
  const [detailCheckpointIndex, setDetailCheckpointIndex] = useState(0);
  const isStageMode = Boolean(stageId);

  const { data: activeEvent } = useQuery(activeRallyQueryOptions);
  const { data: categoriesRaw = [] } = useCategoriesQuery();
  const { data: websiteContent } = useWebsiteContentQuery();

  const eventId = activeEvent?._id;
  const categories = useMemo(
    () => normalizeCategories(categoriesRaw),
    [categoriesRaw],
  );
  const categoryLabels = useMemo(
    () => getCategoryLabelMap(categories),
    [categories],
  );
  const activeCategoryId = useMemo(
    () => getCategoryIdByKey(categories, activeCategory),
    [activeCategory, categories],
  );

  useEffect(() => {
    if (categories.length === 0) return;

    if (!activeCategory || !hasCategoryKey(categories, activeCategory)) {
      setActiveCategory(getDefaultCategoryKey(categories));
    }
  }, [activeCategory, categories]);

  const {
    data: stages = [],
    isFetching: stagesLoading,
    isSuccess: stagesSuccess,
  } = useQuery({
    queryKey: ["rally", "stages", eventId],
    queryFn: () => fetchRallyStages(eventId),
    enabled: Boolean(eventId && isStageMode),
    refetchOnWindowFocus: false,
  });

  const stage = useMemo(
    () => stages.find((item) => item._id === stageId),
    [stageId, stages],
  );

  const {
    data: routes = [],
    isFetching: routesLoading,
    isSuccess: routesSuccess,
  } = useQuery({
    queryKey: ["rally", "routes", eventId, activeCategory],
    queryFn: () => fetchRallyRoutes(eventId, activeCategory),
    enabled: Boolean(eventId && activeCategory && !isStageMode),
  });

  const primaryRoute = routes[0];
  const routeId = primaryRoute?._id;

  const {
    data: checkpointsRaw = [],
    isFetching: checkpointsLoading,
    isSuccess: checkpointsSuccess,
  } = useQuery({
    queryKey: isStageMode
      ? ["rally", "checkpoints", "stage", stageId, activeCategoryId]
      : ["rally", "checkpoints", "route", routeId],
    queryFn: () =>
      isStageMode
        ? fetchStageCheckpoints(stageId, activeCategoryId)
        : fetchRouteCheckpoints(routeId),
    enabled: isStageMode
      ? Boolean(stageId && activeCategoryId)
      : Boolean(routeId),
  });

  const checkpoints = useMemo(
    () =>
      [...checkpointsRaw].sort(
        (a, b) => Number(a.order ?? 0) - Number(b.order ?? 0),
      ),
    [checkpointsRaw],
  );

  const title = isStageMode ? stage?.stage_name : primaryRoute?.title;
  const distanceKm = primaryRoute?.total_distance_km;
  const estimatedTime = primaryRoute?.estimated_time;

  const showStageNotFound = shouldShowStageNotFound({
    stageId,
    stages,
    stagesSuccess,
  });
  const showRoutesEmpty =
    !isStageMode &&
    shouldShowRoutesEmpty({
      eventId,
      activeCategory,
      routes,
      routesSuccess,
    });
  const showMapEmpty = showRoutesEmpty || showStageNotFound;
  const checkpointsReady = isStageMode
    ? Boolean(stageId && activeCategoryId && !showStageNotFound)
    : Boolean(routeId);
  const showCheckpointsEmpty =
    checkpointsReady && checkpointsSuccess && checkpoints.length === 0;
  const headerLoading =
    (isStageMode && stagesLoading && !title) ||
    (!isStageMode && routesLoading && !title);

  const firstCp = checkpoints[0];
  const lastCp = checkpoints[checkpoints.length - 1];
  const showStartLabel = Boolean(firstCp?.is_start);
  const showFinishLabel = Boolean(lastCp?.is_finish);
  const rallyMapPage = useMemo(
    () => getWebsiteContentPage(websiteContent, "rallyMap"),
    [websiteContent],
  );
  const chromeContent = useMemo(
    () => getWebsiteContentSection(rallyMapPage, "chrome"),
    [rallyMapPage],
  );
  const emptyStatesContent = useMemo(
    () => getWebsiteContentSection(rallyMapPage, "emptyStates"),
    [rallyMapPage],
  );

  const leftFlagSrc = useMemo(
    () => resolveImageUrl(chromeContent?.leftFlagImage, DEFAULT_FLAG_IMAGE),
    [chromeContent?.leftFlagImage],
  );
  const rightFlagSrc = useMemo(
    () => resolveImageUrl(chromeContent?.rightFlagImage, DEFAULT_FLAG_IMAGE),
    [chromeContent?.rightFlagImage],
  );
  const checkpointLightboxItems = useMemo(
    () => buildCheckpointLightboxItems(checkpoints),
    [checkpoints],
  );

  const openCheckpointImage = useCallback(
    (checkpoint) => {
      const startIndex = findCheckpointLightboxIndex(
        checkpointLightboxItems,
        checkpoint?._id,
      );
      if (startIndex < 0) return;

      imageLightbox.open(
        checkpointLightboxItems.map(({ src, alt }) => ({ src, alt })),
        startIndex,
      );
    },
    [checkpointLightboxItems, imageLightbox],
  );

  const openCheckpointDetail = useCallback(
    (checkpoint) => {
      const index = checkpoints.findIndex(
        (item) => item._id === checkpoint._id,
      );
      setDetailCheckpointIndex(index >= 0 ? index : 0);
      setDetailCheckpoint(checkpoint);
    },
    [checkpoints],
  );

  const closeCheckpointDetail = useCallback(() => {
    setDetailCheckpoint(null);
  }, []);

  const trackImageSrc = useMemo(
    () => resolveImageUrl(chromeContent?.trackImage, DEFAULT_TRACK_IMAGE),
    [chromeContent?.trackImage],
  );

  const checkpointLayout = useMemo(
    () => computeCheckpointLayout(checkpoints),
    [checkpoints],
  );
  const { inMap: mappedCheckpoints, overflow: overflowCheckpoints } =
    checkpointLayout;
  const overflowCount = overflowCheckpoints.length;
  const hasOverflow = overflowCount > 0;

  useEffect(() => {
    if (!hasOverflow && showOverflow) {
      setShowOverflow(false);
    }
  }, [hasOverflow, showOverflow]);

  return (
    <div className="rm-wrapper ">
      <header className="rm-header">
        <div className="rm-title-row">
          <img
            src={leftFlagSrc}
            alt="flag"
            className="w-10 md:w-20 rotate-y-180"
            onError={(event) => handleImageError(event, DEFAULT_FLAG_IMAGE)}
          />
          <p className="font-gilda text-[24px] md:text-[42px]">
            {headerLoading && !title ? "…" : (title ?? "—")}
          </p>
          <img
            src={rightFlagSrc}
            alt="flag"
            className="w-10 md:w-20"
            onError={(event) => handleImageError(event, DEFAULT_FLAG_IMAGE)}
          />
        </div>
        <div className="rm-stats">
          {isStageMode ? (
            <>
              {/* Total Distance & Estimated Time — hidden on stage pages */}
              <p>
                {chromeContent?.startingLocationLabel || "Starting Location"}:{" "}
                <strong>{stage?.starting_location?.trim() || "—"}</strong>
              </p>
              <p>
                {chromeContent?.endingLocationLabel || "Ending Location"}:{" "}
                <strong>{stage?.ending_location?.trim() || "—"}</strong>
              </p>
              <p>
                {chromeContent?.stageDateLabel || "Stage Date"}:{" "}
                <strong>{formatStageDateReadable(stage)}</strong>
              </p>
            </>
          ) : (
            <>
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
            </>
          )}
        </div>

        <CategoryFilter
          categories={categories}
          categoryLabels={categoryLabels}
          activeKey={activeCategory}
          onChange={setActiveCategory}
          className="mt-5"
        />
      </header>

      <div
        className={`rm-canvas rm-canvas-desktop${showMapEmpty ? " rm-canvas--empty" : ""}`}
      >
        {/* {!showMapEmpty && showStartLabel && (
          <div className="rm-label-start" aria-hidden>
            {chromeContent?.startLabel || "Start"}
          </div>
        )}
        {!showMapEmpty && showFinishLabel && (
          <div className="rm-label-finish" aria-hidden>
            {chromeContent?.finishLabel || "Finish"}
          </div>
        )} */}
        {!showMapEmpty && (
          <img
            src={trackImageSrc}
            alt="Rally Track"
            className={`rm-road-img${checkpointsLoading ? " rm-road-img--dim" : ""}`}
            onError={(event) => handleImageError(event, DEFAULT_TRACK_IMAGE)}
          />
        )}

        {showRoutesEmpty && (
          <MapEmptyState
            title={emptyStatesContent?.route?.title || "No route added yet"}
            description={
              emptyStatesContent?.route?.description ||
              "A route has not been added for this category yet. Please check back later."
            }
          />
        )}

        {showStageNotFound && (
          <MapEmptyState
            title={emptyStatesContent?.stage?.title || "Stage not found"}
            description={
              emptyStatesContent?.stage?.description ||
              "This stage is not available for the current rally event."
            }
          />
        )}

        {!showMapEmpty && showCheckpointsEmpty && (
          <CheckpointsEmptyState
            isStageMode={isStageMode}
            stage={stage}
            emptyStatesContent={emptyStatesContent}
          />
        )}

        {!showMapEmpty &&
          !showCheckpointsEmpty &&
          mappedCheckpoints.map(
            ({ checkpoint, side, topPct, leftPct, rightPct, connectorWidthPx }) => (
              <CheckpointBlock
                key={checkpoint._id}
                checkpoint={checkpoint}
                side={side}
                topPct={topPct}
                leftPct={leftPct}
                rightPct={rightPct}
                connectorWidthPx={connectorWidthPx}
                onImageClick={openCheckpointImage}
                onReadMore={openCheckpointDetail}
              />
            ),
          )}
      </div>

      {!showMapEmpty && !showCheckpointsEmpty && hasOverflow && (
        <section
          className={`rm-overflow${showOverflow ? " rm-overflow--open" : ""}`}
          aria-label="Additional checkpoints"
        >
          <div className="my-5 mb-12 flex items-center justify-center">
            <button
              type="button"
              className="rm-overflow-toggle "
              onClick={() => setShowOverflow((value) => !value)}
              aria-expanded={showOverflow}
              aria-controls="rm-overflow-panel"
            >
              <span>
                {showOverflow
                  ? "Hide additional checkpoints"
                  : `+${overflowCount} more checkpoint${overflowCount === 1 ? "" : "s"}`}
              </span>
              <FiChevronDown
                aria-hidden
                className={`rm-overflow-chevron${showOverflow ? " rm-overflow-chevron--open" : ""}`}
              />
            </button>
          </div>

          <div
            id="rm-overflow-panel"
            className={`rm-overflow-collapse${showOverflow ? " rm-overflow-collapse--open" : ""}`}
            aria-hidden={!showOverflow}
          >
            <div className="rm-overflow-collapse-inner">
              <div id="rm-overflow-grid" className="rm-overflow-grid">
                {overflowCheckpoints.map((cp) => (
                  <CheckpointCard
                    key={cp._id}
                    checkpoint={cp}
                    onImageClick={openCheckpointImage}
                    onReadMore={openCheckpointDetail}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      <div className="rm-mobile-sequence">
        {showRoutesEmpty && (
          <MapEmptyState
            title={emptyStatesContent?.route?.title || "No route added yet"}
            description={
              emptyStatesContent?.route?.description ||
              "A route has not been added for this category yet. Please check back later."
            }
          />
        )}

        {showStageNotFound && (
          <MapEmptyState
            title={emptyStatesContent?.stage?.title || "Stage not found"}
            description={
              emptyStatesContent?.stage?.description ||
              "This stage is not available for the current rally event."
            }
          />
        )}

        {!showMapEmpty && showCheckpointsEmpty && (
          <CheckpointsEmptyState
            isStageMode={isStageMode}
            stage={stage}
            emptyStatesContent={emptyStatesContent}
          />
        )}

        {!showMapEmpty &&
          !showCheckpointsEmpty &&
          checkpoints.map((cp) => (
            <CheckpointCard
              key={cp._id}
              checkpoint={cp}
              onImageClick={openCheckpointImage}
              onReadMore={openCheckpointDetail}
            />
          ))}
      </div>

      <CheckpointDetailModal
        checkpoint={detailCheckpoint}
        orderIndex={detailCheckpointIndex}
        isOpen={Boolean(detailCheckpoint)}
        onClose={closeCheckpointDetail}
        onImageClick={openCheckpointImage}
      />

      <ImageLightbox
        isOpen={imageLightbox.isOpen}
        onClose={imageLightbox.close}
        items={imageLightbox.items}
        index={imageLightbox.index}
        onPrev={imageLightbox.goPrev}
        onNext={imageLightbox.goNext}
        label="Checkpoint image viewer"
      />
    </div>
  );
};

export default RouteStageView;
