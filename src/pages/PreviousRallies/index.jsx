import React, { useEffect, useMemo, useState } from "react";
import { FiArrowRight } from "react-icons/fi";
import { Link } from "react-router";
import flagStripedRace from "../../assets/images/flag-striped-race.png";
import { useCategoriesQuery } from "../../api/features/content/hooks.jsx";
import {
  getCategoryFilterTabs,
  getDefaultCategoryKey,
  hasCategoryKey,
} from "../../utils/constants.js";
import Partners from "../JeepRally/components/Partners";
import { PREVIOUS_RALLIES_LIST } from "./previousRallies.data.js";
import "./PreviousRallies.css";

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
  const tabs = useMemo(
    () => getCategoryFilterTabs(categoriesRaw),
    [categoriesRaw]
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
        <header className="previous-heading">
          <img
            src={flagStripedRace}
            alt="Previous rallies"
            className="previous-heading-art"
          />
          <h1 className="previous-heading-title">Previous Rallies</h1>
        </header>

        <div className="previous-filter-row no-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              className={`previous-filter-pill ${
                activeCategoryKey === tab.key ? "is-active" : ""
              }`}
              onClick={() => setActiveCategoryKey(tab.key)}
            >
              {tab.title}
            </button>
          ))}
        </div>

        <section className="previous-grid">
          {PREVIOUS_RALLIES_LIST.map((rally) => (
            <PreviousRallyCard key={rally.id} rally={rally} />
          ))}
        </section>
      </div>

      <Partners />
    </div>
  );
};

export default PreviousRallies;
