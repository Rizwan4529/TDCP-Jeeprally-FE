import React, { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { FiArrowRight, FiChevronDown } from "react-icons/fi";
import { Link } from "react-router";
import flagStripedRace from "../../assets/images/flag-striped-race.png";
import { fetchPastRallies } from "../../api/features/rally/rally.service.jsx";
import { handleImageError } from "../../utils/constants.js";
import Partners from "../JeepRally/components/Partners";
import ScrollReveal, {
  HeroReveal,
} from "../../components/common/ScrollReveal.jsx";
import {
  arrangeRalliesForListingGrid,
  getVisibleRalliesForListing,
  mapPastRallyToListingCard,
  shouldShowMoreRalliesButton,
} from "./previousRallies.utils.js";

const RALLY_CARD_SURFACE =
  "h-full w-full rounded-lg border border-slate-900/5 bg-white shadow-[0_10px_28px_rgba(15,23,42,0.06)] transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform [transform:translateZ(0)] [backface-visibility:hidden] group-hover/card:-translate-y-1 group-hover/card:shadow-[0_16px_34px_rgba(15,23,42,0.1)]";

const ViewDetailsButton = ({ to }) => (
  <Link
    to={to}
    className="group mt-[26px] inline-flex items-center gap-2.5 border-0 bg-transparent p-0 text-sm font-medium text-[#101010] max-md:mt-[22px]"
  >
    <span>View Details</span>
    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#111] text-xs text-white transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-0.5">
      <FiArrowRight />
    </span>
  </Link>
);

const PreviousRallyCard = ({ rally }) => {
  const isFeatured = rally.variant === "featured";

  return (
    <article
      className={`group/card relative hover:z-10 ${
        isFeatured ? "row-span-2 min-h-0 max-[991px]:row-span-1" : "min-h-0"
      }`}
    >
      <div
        className={`${RALLY_CARD_SURFACE} ${
          isFeatured
            ? "flex flex-col gap-0 p-3.5"
            : "grid grid-cols-[200px_1fr] items-stretch gap-6 p-3.5 max-md:grid-cols-[minmax(118px,38%)_minmax(0,1fr)] max-md:gap-[18px] max-md:p-3"
        }`}
      >
        <div
          className={`relative overflow-hidden rounded-md ${
            isFeatured
              ? "h-auto min-h-[220px] w-full flex-[1_1_auto] max-[991px]:h-[320px] max-md:aspect-[16/10] max-md:h-auto"
              : "h-[180px] w-[180px] max-md:h-[140px]"
          }`}
        >
          <span className="absolute left-0 top-3.5 z-[2]  bg-white/96 px-3 py-1.5 text-[10px] font-bold tracking-[0.08em] text-[#292929]">
            {rally.date}
          </span>
          <img
            src={rally.image}
            alt={rally.title}
            className="block h-full w-full object-cover"
            onError={handleImageError}
          />
        </div>

        <div
          className={`flex flex-col ${
            isFeatured
              ? "justify-start px-1.5 pb-2 pt-[18px] max-md:px-1 max-md:pb-1.5"
              : ""
          }`}
        >
          <h2
            className={`mb-3.5 m-0 font-gilda leading-[1.08] text-[#101010] max-md:text-xl ${
              isFeatured ? "text-[23px]" : "text-[22px]"
            }`}
          >
            {rally.title}
          </h2>
          <p
            className={`m-0 text-sm leading-[1.75] text-[#707070] max-md:max-w-none max-md:text-[13px] ${
              isFeatured
                ? "mb-[30px] max-w-none line-clamp-3"
                : "max-w-[280px] line-clamp-4"
            }`}
          >
            {rally.description}
          </p>
          <ViewDetailsButton to={rally.detailPath} />
        </div>
      </div>
    </article>
  );
};

const ShowMoreRalliesButton = ({ remainingCount, onClick }) => (
  <div className="mt-[42px] flex justify-center max-md:mt-8">
    <button
      type="button"
      onClick={onClick}
      className="group inline-flex items-center gap-3.5 rounded-full border border-slate-900/10 bg-white py-3.5 pl-7 pr-[22px] text-[15px] font-semibold tracking-[0.01em] text-[#101010] shadow-[0_10px_28px_rgba(15,23,42,0.08),inset_0_1px_0_rgba(255,255,255,0.9)] transition-[transform,box-shadow,border-color] duration-[220ms] hover:-translate-y-0.5 hover:border-primary/35 hover:shadow-[0_14px_34px_rgba(15,23,42,0.12)] focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-primary max-md:flex-wrap max-md:justify-center max-md:gap-2.5 max-md:px-[18px] max-md:py-3 max-md:text-sm"
      aria-label={`Show ${remainingCount} more previous rallies`}
    >
      <span>Show More Rallies</span>
      <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-bold text-[#8f3a1f]">
        +{remainingCount} more
      </span>
      <span
        className="inline-flex h-[34px] w-[34px] items-center justify-center rounded-full bg-[#101010] text-lg text-white transition-[background,transform] duration-[220ms] group-hover:translate-y-0.5 group-hover:bg-primary"
        aria-hidden="true"
      >
        <FiChevronDown />
      </span>
    </button>
  </div>
);

const PreviousRallies = () => {
  const [showAllRallies, setShowAllRallies] = useState(false);
  const {
    data: pastRalliesRaw = [],
    isPending,
    isError,
  } = useQuery({
    queryKey: ["rally", "past"],
    queryFn: fetchPastRallies,
    refetchOnWindowFocus: false,
  });

  const rallies = useMemo(
    () =>
      arrangeRalliesForListingGrid(
        pastRalliesRaw.map(mapPastRallyToListingCard),
      ),
    [pastRalliesRaw],
  );

  const visibleRallies = useMemo(
    () => getVisibleRalliesForListing(rallies, showAllRallies),
    [rallies, showAllRallies],
  );

  const showMoreButton = shouldShowMoreRalliesButton(rallies, showAllRallies);
  const remainingRallyCount = Math.max(
    rallies.length - visibleRallies.length,
    0,
  );

  useEffect(() => {
    setShowAllRallies(false);
  }, [pastRalliesRaw]);

  return (
    <div className="mt-[150px] min-h-screen bg-white max-md:mt-[120px]">
      <div className="mx-auto w-[min(1280px,calc(100%-48px))] pb-[84px] max-xl:w-[min(1180px,calc(100%-32px))] max-md:w-[calc(100%-24px)] max-md:pb-14">
        <HeroReveal>
          <header className="mb-12 flex items-center justify-center gap-3.5 max-md:mb-[34px] max-md:gap-2.5">
            <img
              src={flagStripedRace}
              alt="Previous rallies"
              className="h-auto w-[188px] object-contain max-md:w-[150px]"
            />
            <h1 className="m-0 font-gilda text-[clamp(2rem,4vw,3.1rem)] leading-none text-[#101010] max-md:text-[2.1rem]">
              Previous Rallies
            </h1>
          </header>
        </HeroReveal>

        <ScrollReveal variant="fadeLeft" duration={0.8}>
          <section className="grid grid-cols-1 grid-auto-rows-[minmax(190px,auto)] items-stretch gap-[26px] overflow-visible pt-1 min-[992px]:grid-cols-2">
            {isPending && (
              <p className="col-span-full py-12 text-center text-gray-500">
                Loading previous rallies…
              </p>
            )}
            {isError && (
              <p className="col-span-full py-12 text-center text-red-600">
                Could not load previous rallies. Please try again later.
              </p>
            )}
            {!isPending && !isError && rallies.length === 0 && (
              <p className="col-span-full py-12 text-center text-gray-500">
                No previous rallies available yet.
              </p>
            )}
            {!isPending &&
              !isError &&
              visibleRallies.map((rally) => (
                <PreviousRallyCard key={rally.id} rally={rally} />
              ))}
          </section>

          {!isPending && !isError && showMoreButton && (
            <ShowMoreRalliesButton
              remainingCount={remainingRallyCount}
              onClick={() => setShowAllRallies(true)}
            />
          )}
        </ScrollReveal>
      </div>

      <ScrollReveal variant="fadeUp" delay={0.1} duration={0.7}>
        <Partners />
      </ScrollReveal>
    </div>
  );
};

export default PreviousRallies;
