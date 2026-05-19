import { useCallback, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { AnimatePresence, motion } from "framer-motion";
import { fetchRallyStages } from "../../api/features/rally/rally.service.jsx";
import { activeRallyQueryOptions } from "../../api/features/rally/rally.queryOptions.jsx";
import { SLIDING_WINDOW_CAROUSEL_EASE } from "../../constants/slidingWindowCarousel.animation.js";
import {
  formatStageHeading,
  formatStageDate,
  formatStageSchedule,
  getStageRoutePath,
  ROUTES_NAV_PATH,
  splitStagesIntoColumns,
} from "../../pages/Routes/rallyStages.utils.js";

const panelTransition = {
  duration: 0.28,
  ease: SLIDING_WINDOW_CAROUSEL_EASE,
};

const panelMotion = {
  initial: { opacity: 0, y: -10, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -8, scale: 0.98 },
  transition: panelTransition,
};

function StageRow({ stage, onSelect }) {
  const schedule = formatStageSchedule(stage);

  return (
    <li className="border-b border-black/[0.06] last:border-b-0">
      <button
        type="button"
        className="group grid w-full cursor-pointer grid-cols-[minmax(72px,100px)_1fr] items-start gap-3 rounded-lg px-2 py-3.5 text-left transition-colors duration-200 hover:bg-primary/[0.07] active:bg-primary/[0.12] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-primary/40 sm:grid-cols-[minmax(88px,120px)_1fr] sm:gap-5 sm:px-2.5 sm:py-4"
        onClick={() => onSelect?.(stage)}
      >
        <div className="min-w-0">
          <p className="font-manrope text-[12px] font-bold uppercase tracking-[0.12em] text-black transition-colors duration-200 group-hover:text-primary sm:text-[13px]">
          {formatStageHeading(stage)}
        </p>
        {stage?.stage_name ? (
          <p className="mt-0.5 font-manrope text-[10px] leading-snug text-black/45 transition-colors duration-200 group-hover:text-black/60 sm:text-[11px]">
            {stage.stage_name}
          </p>
        ) : null}
      </div>
      <div className="min-w-0 text-right">
        <p className="font-manrope text-[11px] font-medium uppercase leading-snug tracking-[0.04em] text-black/80 transition-colors duration-200 group-hover:text-black sm:text-[12px]">
          {formatStageDate(stage)}
        </p>
        {schedule ? (
          <p className="mt-0.5 font-manrope text-[10px] text-primary/70 transition-colors duration-200 group-hover:text-primary sm:text-[11px]">
            {schedule}
          </p>
        ) : null}
      </div>
      </button>
    </li>
  );
}

function StageColumn({ stages, onStageSelect }) {
  if (!stages.length) {
    return null;
  }

  return (
    <ul>
      {stages.map((stage) => (
        <StageRow
          key={stage._id ?? `stage-${stage.stage_number}`}
          stage={stage}
          onSelect={onStageSelect}
        />
      ))}
    </ul>
  );
}

function StagesSkeleton() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 sm:gap-8">
      {[0, 1].map((column) => (
        <div key={column} className="space-y-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="h-12 animate-pulse rounded-md bg-black/[0.05]"
            />
          ))}
        </div>
      ))}
    </div>
  );
}

function MenuPanelContent({
  eventId,
  activeEventName,
  isOpen,
  compact = false,
  onStageSelect,
  onRouteClick,
}) {
  const {
    data: stages = [],
    isPending,
    isError,
    isFetching,
  } = useQuery({
    queryKey: ["rally", "stages", eventId],
    queryFn: () => fetchRallyStages(eventId),
    enabled: Boolean(isOpen && eventId),
    refetchOnWindowFocus: false,
  });

  const { left, right } = useMemo(
    () => splitStagesIntoColumns(stages),
    [stages],
  );

  const showSkeleton = isPending || (isFetching && !stages.length);
  const isEmpty = !showSkeleton && !isError && stages.length === 0;

  return (
    <>
      {!compact && activeEventName ? (
        <p className="mb-4 border-b border-black/[0.06] pb-3 font-manrope text-[11px] uppercase tracking-[0.14em] text-black/45">
          {activeEventName}
        </p>
      ) : null}

      {!eventId && !showSkeleton ? (
        <p className="py-6 text-center font-manrope text-sm text-black/50">
          No active rally event is available right now.
        </p>
      ) : null}

      {showSkeleton ? <StagesSkeleton /> : null}

      {isError ? (
        <p className="py-6 text-center font-manrope text-sm text-red-600">
          Could not load rally stages. Please try again later.
        </p>
      ) : null}

      {isEmpty ? (
        <p className="py-6 text-center font-manrope text-sm text-black/50">
          No stages have been published for this event yet.
        </p>
      ) : null}

      {!showSkeleton && !isError && stages.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 sm:gap-x-10">
          <StageColumn stages={left} onStageSelect={onStageSelect} />
          <StageColumn stages={right} onStageSelect={onStageSelect} />
        </div>
      ) : null}

      <div className="mt-5 flex justify-center border-t border-black/[0.06] pt-4">
        <button
          type="button"
          onClick={onRouteClick}
          className="flex min-h-10 min-w-[120px] items-center justify-center rounded-full border-2 border-primary bg-transparent px-8 font-manrope text-[13px] font-semibold uppercase tracking-[0.12em] text-primary transition-colors hover:bg-primary hover:text-white"
        >
          Route
        </button>
      </div>
    </>
  );
}

/**
 * Dropdown panel for rally stages — positions below the Routes nav trigger.
 */
const RallyStagesMenu = ({
  isOpen,
  onClose,
  align = "right",
  variant = "dropdown",
}) => {
  const navigate = useNavigate();
  const { data: activeEvent } = useQuery(activeRallyQueryOptions);
  const eventId = activeEvent?._id;

  const handleStageSelect = useCallback(
    (stage) => {
      if (!stage?._id) return;
      onClose();
      navigate(getStageRoutePath(stage._id));
    },
    [navigate, onClose],
  );

  const handleRouteClick = useCallback(() => {
    onClose();
    navigate(ROUTES_NAV_PATH);
  }, [navigate, onClose]);

  useEffect(() => {
    if (!isOpen) return undefined;

    const handleEscape = (event) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  const positionClasses =
    variant === "inline"
      ? "relative mt-2 w-full"
      : `absolute top-full z-[100] mt-2 w-[min(680px,calc(100vw-1.5rem))] ${
          align === "right" ? "right-0" : "left-0"
        }`;

  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          key="rally-stages-panel"
          {...panelMotion}
          role="menu"
          aria-label="Rally stages"
          className={`${positionClasses} overflow-hidden rounded-xl border border-primary/15 bg-white shadow-[0_20px_50px_rgba(62,34,12,0.16)]`}
          onClick={(event) => event.stopPropagation()}
        >
          <div className="max-h-[min(70vh,520px)] overflow-y-auto px-4 py-4 sm:px-6 sm:py-5">
            <MenuPanelContent
              eventId={eventId}
              activeEventName={activeEvent?.name}
              isOpen={isOpen}
              compact={variant === "inline"}
              onStageSelect={handleStageSelect}
              onRouteClick={handleRouteClick}
            />
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
};

export default RallyStagesMenu;
