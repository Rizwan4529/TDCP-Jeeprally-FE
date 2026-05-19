import React, { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { FiArrowRight, FiMapPin } from "react-icons/fi";
import {
  fetchRallyRoute,
  fetchRallyStages,
} from "../../../api/features/rally/rally.service.jsx";
import { activeRallyQueryOptions } from "../../../api/features/rally/rally.queryOptions.jsx";
import { handleImageError, resolveImageUrl } from "../../../utils/constants.js";
import {
  formatStageDateReadable,
  formatStageHeading,
  formatStageLocationRoute,
  formatStageSchedule,
  getStageRoutePath,
  sortStagesByNumber,
} from "../rallyStages.utils.js";

const DEFAULT_ROUTE_IMAGE = "/assets/images/map_line.png";

function RouteOverviewSkeleton() {
  return (
    <div className="ro-page" aria-busy="true" aria-label="Loading route">
      <div className="ro-hero">
        <div className="ro-skeleton ro-skeleton-title" />
        <div className="ro-skeleton ro-skeleton-text" />
        <div className="ro-skeleton ro-skeleton-text ro-skeleton-text--short" />
        <div className="ro-skeleton ro-skeleton-image" />
        <div className="ro-skeleton ro-skeleton-heading" />
        <div className="ro-skeleton ro-skeleton-table" />
      </div>
    </div>
  );
}

function RoutesOverview() {
  const navigate = useNavigate();
  const { data: activeEvent } = useQuery(activeRallyQueryOptions);
  const eventId = activeEvent?._id;

  const {
    data: route,
    isPending: routeLoading,
    isError: routeError,
  } = useQuery({
    queryKey: ["rally", "route", eventId],
    queryFn: () => fetchRallyRoute(eventId),
    enabled: Boolean(eventId),
    refetchOnWindowFocus: false,
  });

  const {
    data: stagesRaw = [],
    isPending: stagesLoading,
    isError: stagesError,
  } = useQuery({
    queryKey: ["rally", "stages", eventId],
    queryFn: () => fetchRallyStages(eventId),
    enabled: Boolean(eventId),
    refetchOnWindowFocus: false,
  });

  const stages = useMemo(() => sortStagesByNumber(stagesRaw), [stagesRaw]);
  const trackImageSrc = resolveImageUrl(
    route?.track_map_image,
    DEFAULT_ROUTE_IMAGE,
  );

  const isLoading = routeLoading || stagesLoading;

  if (!eventId) {
    return (
      <div className="ro-page">
        <div className="ro-container">
          <p className="ro-empty" role="status">
            No active rally event is available right now.
          </p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return <RouteOverviewSkeleton />;
  }

  if (routeError) {
    return (
      <div className="ro-page">
        <div className="ro-container">
          <p className="ro-empty ro-empty--error" role="alert">
            Could not load route details. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  if (!route) {
    return (
      <div className="ro-page">
        <div className="ro-container">
          <p className="ro-empty" role="status">
            No route has been published for this event yet.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="ro-page">
      <div className="ro-container">
        <header className="ro-hero">
          <h1 className="ro-title font-gilda">
            {route.title || "Rally Route"}
          </h1>
          {route.description ? (
            <p className="ro-description">{route.description}</p>
          ) : null}

          {(route.total_distance_km != null || route.estimated_time) && (
            <div className="ro-stats">
              {route.total_distance_km != null && (
                <span className="ro-stat">
                  <span className="ro-stat-label">Total distance</span>
                  <span className="ro-stat-value">
                    ~{route.total_distance_km} KM
                  </span>
                </span>
              )}
              {route.estimated_time ? (
                <span className="ro-stat">
                  <span className="ro-stat-label">Estimated time</span>
                  <span className="ro-stat-value">{route.estimated_time}</span>
                </span>
              ) : null}
            </div>
          )}

          <figure className="ro-figure">
            <img
              src={trackImageSrc}
              alt={route.title ? `${route.title} track map` : "Rally track map"}
              className="ro-track-image"
              onError={(event) => handleImageError(event, DEFAULT_ROUTE_IMAGE)}
            />
          </figure>
        </header>

        <section className="ro-stages" aria-labelledby="ro-stages-heading">
          <div className="ro-stages-head">
            <h2 id="ro-stages-heading" className="ro-stages-title font-gilda">
              Stages
            </h2>
            <p className="ro-stages-subtitle">
              Select a stage to view checkpoints and route details on the map.
            </p>
          </div>

          {stagesError ? (
            <p className="ro-empty ro-empty--error" role="alert">
              Could not load stages. Please try again later.
            </p>
          ) : stages.length === 0 ? (
            <p className="ro-empty" role="status">
              No stages have been published for this event yet.
            </p>
          ) : (
            <div className="ro-table-wrapper">
              <div className="ro-table-scroll">
                <table className="ro-table">
                  <thead>
                    <tr>
                      <th scope="col">Stage</th>
                      <th scope="col">Date</th>
                      <th scope="col">Start & Finish</th>
                      <th scope="col">Time</th>
                      <th scope="col" className="ro-table-action-col">
                        <span className="sr-only">View</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {stages.map((stage) => {
                      const schedule = formatStageSchedule(stage);
                      return (
                        <tr
                          key={stage._id}
                          className="ro-table-row"
                          tabIndex={0}
                          onClick={() =>
                            stage._id && navigate(getStageRoutePath(stage._id))
                          }
                          onKeyDown={(event) => {
                            if (event.key !== "Enter" && event.key !== " ")
                              return;
                            event.preventDefault();
                            if (stage._id)
                              navigate(getStageRoutePath(stage._id));
                          }}
                        >
                          <td>
                            <span className="ro-stage-badge">
                              {formatStageHeading(stage)}
                            </span>
                            {stage.stage_name ? (
                              <span className="ro-stage-name">
                                {stage.stage_name}
                              </span>
                            ) : null}
                          </td>
                          <td>{formatStageDateReadable(stage)}</td>
                          <td>
                            <span className="ro-route-locations">
                              <FiMapPin aria-hidden className="ro-route-icon" />
                              {formatStageLocationRoute(stage)}
                            </span>
                          </td>
                          <td>{schedule || "—"}</td>
                          <td className="ro-table-action-col">
                            <span className="ro-view-link" aria-hidden>
                              View
                              <FiArrowRight />
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default RoutesOverview;
