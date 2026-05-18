import React, { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { FiArrowRight } from "react-icons/fi";
import { Link } from "react-router";
import flagStripedRace from "../../assets/images/flag-striped-race.png";
import { fetchPastRallies } from "../../api/features/rally/rally.service.jsx";
import { useCategoriesQuery } from "../../api/features/content/hooks.jsx";
import {
  getCategoryFilterTabs,
  getDefaultCategoryKey,
  handleImageError,
  hasCategoryKey,
} from "../../utils/constants.js";
import Partners from "../JeepRally/components/Partners";
import ScrollReveal, { HeroReveal } from "../../components/common/ScrollReveal.jsx";
import { mapPastRallyToListingCard } from "./previousRallies.utils.js";
import "./PreviousRallies.css";
import CategoryFilter from "../../components/common/CategoryFilter.jsx";

const ViewDetailsButton = ({ to }) => (
  <Link to={to} className="previous-rally-cta">
    <span>View Details</span>
    <span className="previous-rally-cta-icon">
      <FiArrowRight />
    </span>
  </Link>
);

const PreviousRallyCard = ({ rally }) => {
  const isFeatured = rally.variant === "featured";

  return (
    <article
      className={`previous-rally-card ${
        isFeatured ? "previous-rally-card-featured" : "previous-rally-card-compact"
      }`}
    >
      <div className="previous-rally-image-wrap">
        <span className="previous-rally-date">{rally.date}</span>
        <img
          src={rally.image}
          alt={rally.title}
          className="previous-rally-image"
          onError={handleImageError}
        />
      </div>

      <div className="previous-rally-body">
        <h2 className="previous-rally-title">{rally.title}</h2>
        <p className="previous-rally-description">{rally.description}</p>
        <ViewDetailsButton to={rally.detailPath} />
      </div>
    </article>
  );
};

const PreviousRallies = () => {
  const [activeCategoryKey, setActiveCategoryKey] = useState("");
  const { data: categoriesRaw = [] } = useCategoriesQuery();
  const {
    data: pastRalliesRaw = [],
    isPending,
    isError,
  } = useQuery({
    queryKey: ["rally", "past"],
    queryFn: fetchPastRallies,
    refetchOnWindowFocus: false,
  });

  const tabs = useMemo(
    () => getCategoryFilterTabs(categoriesRaw),
    [categoriesRaw],
  );

  const rallies = useMemo(
    () => pastRalliesRaw.map(mapPastRallyToListingCard),
    [pastRalliesRaw],
  );

  useEffect(() => {
    if (tabs.length === 0) return;

    if (!activeCategoryKey || !hasCategoryKey(categoriesRaw, activeCategoryKey)) {
      setActiveCategoryKey(getDefaultCategoryKey(categoriesRaw));
    }
  }, [activeCategoryKey, categoriesRaw, tabs.length]);

  return (
    <div className="previous-page">
      <div className="previous-shell">
        <HeroReveal>
          <header className="previous-heading">
            <img
              src={flagStripedRace}
              alt="Previous rallies"
              className="previous-heading-art"
            />
            <h1 className="previous-heading-title">Previous Rallies</h1>
          </header>

          <CategoryFilter
            tabs={tabs}
            activeKey={activeCategoryKey}
            onChange={setActiveCategoryKey}
            className="mb-[42px]"
          />
        </HeroReveal>

        <ScrollReveal variant="fadeLeft" duration={0.8}>
          <section className="previous-grid">
            {isPending && (
              <p className="col-span-full text-center text-gray-500 py-12">
                Loading previous rallies…
              </p>
            )}
            {isError && (
              <p className="col-span-full text-center text-red-600 py-12">
                Could not load previous rallies. Please try again later.
              </p>
            )}
            {!isPending &&
              !isError &&
              rallies.length === 0 && (
                <p className="col-span-full text-center text-gray-500 py-12">
                  No previous rallies available yet.
                </p>
              )}
            {!isPending &&
              !isError &&
              rallies.map((rally) => (
                <PreviousRallyCard key={rally.id} rally={rally} />
              ))}
          </section>
        </ScrollReveal>
      </div>

      <ScrollReveal variant="fadeUp" delay={0.1} duration={0.7}>
        <Partners />
      </ScrollReveal>
    </div>
  );
};

export default PreviousRallies;
