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

const skeletonClass = "rounded-md bg-black/5 animate-pulse";
const pageClass = "min-h-screen bg-white px-4 pb-12 pt-24 mt-[100px] md:px-8";

function RouteOverviewSkeleton() {
  return (
    <div className={pageClass} aria-busy="true" aria-label="Loading route">
      <div className="mx-auto max-w-4xl space-y-6 text-center">
        <div className={`mx-auto h-10 max-w-xs ${skeletonClass}`} />
        <div className={`mx-auto h-4 max-w-lg ${skeletonClass}`} />
        <div className={`mx-auto h-4 max-w-md ${skeletonClass}`} />
        <div className={`mx-auto h-72 max-w-md ${skeletonClass}`} />
        <div className={`h-8 max-w-40 ${skeletonClass}`} />
        <div className={`h-60 w-full ${skeletonClass}`} />
      </div>
    </div>
  );
}

function EmptyMessage({ children, isError = false }) {
  return (
    <p
      className={`py-8 text-center font-manrope text-sm ${
        isError ? "text-primary" : "text-muted"
      }`}
      role={isError ? "alert" : "status"}
    >
      {children}
    </p>
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
      <div className={pageClass}>
        <div className="mx-auto max-w-4xl">
          <EmptyMessage>
            No active rally event is available right now.
          </EmptyMessage>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return <RouteOverviewSkeleton />;
  }

  if (routeError) {
    return (
      <div className={pageClass}>
        <div className="mx-auto max-w-4xl">
          <EmptyMessage isError>
            Could not load route details. Please try again later.
          </EmptyMessage>
        </div>
      </div>
    );
  }

  if (!route) {
    return (
      <div className={pageClass}>
        <div className="mx-auto max-w-4xl">
          <EmptyMessage>
            No route has been published for this event yet.
          </EmptyMessage>
        </div>
      </div>
    );
  }

  return (
    <div className={pageClass}>
      <div className="mx-auto max-w-4xl">
        <header className="mb-12 text-center">
          <h1 className="font-gilda text-[clamp(2rem,5vw,2.75rem)] leading-tight text-[#1a1a1a]">
            {route.title || "Rally Route"}
          </h1>
          {route.description ? (
            <p className="mx-auto mt-5 max-w-2xl font-manrope text-base leading-relaxed text-[#444]">
              {route.description}
            </p>
          ) : null}

          {(route.total_distance_km != null || route.estimated_time) && (
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              {route.total_distance_km != null && (
                <span className="inline-flex flex-col items-center gap-0.5 rounded-full  border border-primary/20 bg-primary/5 px-10 py-2">
                  <span className="font-manrope text-[11px] font-semibold uppercase tracking-wider text-[#888]">
                    Total distance
                  </span>
                  <span className="font-manrope text-[15px] font-bold text-primary">
                    ~{route.total_distance_km} KM
                  </span>
                </span>
              )}
              {route.estimated_time ? (
                <span className="inline-flex flex-col items-center gap-0.5 rounded-full  border border-primary/20 bg-primary/5 px-10 py-2">
                  <span className="font-manrope text-[11px] font-semibold uppercase tracking-wider text-[#888]">
                    Estimated time
                  </span>
                  <span className="font-manrope text-[15px] font-bold text-primary">
                    {route.estimated_time}
                  </span>
                </span>
              ) : null}
            </div>
          )}

          <figure className="mx-auto mt-10 max-w-2xl">
            <img
              src={trackImageSrc}
              alt={route.title ? `${route.title} track map` : "Rally track map"}
              className="block w-full rounded-lg shadow-[0_16px_40px_rgba(0,0,0,0.1)]"
              onError={(event) => handleImageError(event, DEFAULT_ROUTE_IMAGE)}
            />
          </figure>
        </header>

        <section aria-labelledby="routes-stages-heading">
          <div className="mb-5">
            <h2
              id="routes-stages-heading"
              className="font-gilda text-[clamp(1.5rem,3vw,2rem)] text-[#1a1a1a]"
            >
              Stages
            </h2>
            <p className="mt-2 font-manrope text-[15px] text-[#666]">
              Select a stage to view checkpoints and route details on the map.
            </p>
          </div>

          {stagesError ? (
            <EmptyMessage isError>
              Could not load stages. Please try again later.
            </EmptyMessage>
          ) : stages.length === 0 ? (
            <EmptyMessage>
              No stages have been published for this event yet.
            </EmptyMessage>
          ) : (
            <div className="overflow-hidden rounded-md border-t-4 border-primary bg-white shadow-[0_8px_28px_rgba(0,0,0,0.06)]">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[640px] border-collapse font-manrope text-sm">
                  <thead className="bg-[#faf8f2]">
                    <tr>
                      <th className="whitespace-nowrap border-b border-[#ece7d2] px-4 py-3.5 text-left text-[11px] font-bold uppercase tracking-widest text-[#666]">
                        Stage
                      </th>
                      <th className="whitespace-nowrap border-b border-[#ece7d2] px-4 py-3.5 text-left text-[11px] font-bold uppercase tracking-widest text-[#666]">
                        Date
                      </th>
                      <th className="whitespace-nowrap border-b border-[#ece7d2] px-4 py-3.5 text-left text-[11px] font-bold uppercase tracking-widest text-[#666]">
                        Start & Finish
                      </th>
                      <th className="whitespace-nowrap border-b border-[#ece7d2] px-4 py-3.5 text-left text-[11px] font-bold uppercase tracking-widest text-[#666]">
                        Time
                      </th>
                      <th className="w-px whitespace-nowrap border-b border-[#ece7d2] px-4 py-3.5 text-left text-[11px] font-bold uppercase tracking-widest text-[#666]">
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
                          tabIndex={0}
                          className="cursor-pointer border-b border-[#f0ebe0] transition-colors last:border-b-0 hover:bg-primary/[0.06] focus-visible:bg-primary/[0.06] focus-visible:outline-none"
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
                          <td className="px-4 py-4 align-middle text-[#333]">
                            <span className="block text-[11px] font-extrabold uppercase tracking-widest text-primary">
                              {formatStageHeading(stage)}
                            </span>
                            {stage.stage_name ? (
                              <span className="mt-0.5 block text-[15px] font-semibold text-[#222]">
                                {stage.stage_name}
                              </span>
                            ) : null}
                          </td>
                          <td className="px-4 py-4 align-middle text-[#333]">
                            {formatStageDateReadable(stage)}
                          </td>
                          <td className="px-4 py-4 align-middle text-[#333]">
                            <span className="inline-flex items-start gap-1.5 text-[13px] leading-snug text-[#444]">
                              <FiMapPin
                                aria-hidden
                                className="mt-0.5 size-3.5 shrink-0 text-primary"
                              />
                              {formatStageLocationRoute(stage)}
                            </span>
                          </td>
                          <td className="px-4 py-4 align-middle text-[#333]">
                            {schedule || "—"}
                          </td>
                          <td className="whitespace-nowrap px-4 py-4 align-middle">
                            <span
                              className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-primary max-md:text-[0px] max-md:[&_svg]:size-[18px]"
                              aria-hidden
                            >
                              View
                              <FiArrowRight className="size-3.5" />
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
