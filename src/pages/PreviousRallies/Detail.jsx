import React, { useMemo } from "react";
import { FiCheck } from "react-icons/fi";
import { useQuery } from "@tanstack/react-query";
import { Navigate, useParams } from "react-router";
import RoughTexture1 from "../../assets/images/rough-patches-1.png";
import RoughTexture2 from "../../assets/images/rough-patches-2.png";
import { fetchPastRallies } from "../../api/features/rally/rally.service.jsx";
import { handleImageError } from "../../utils/constants.js";
import ChampionsSection from "../JeepRally/components/ChampionsSection";
import Partners from "../JeepRally/components/Partners";
import RecentGallery from "../JeepRally/components/RecentGallery";
import {
  findPastRallyById,
  mapPastRallyToDetail,
} from "./previousRallies.utils.js";
import "./PreviousRallyDetail.css";

const PreviousRallyDetail = () => {
  const { rallyId } = useParams();
  const {
    data: pastRalliesRaw = [],
    isPending,
    isError,
  } = useQuery({
    queryKey: ["rally", "past"],
    queryFn: fetchPastRallies,
    refetchOnWindowFocus: false,
  });

  const rally = useMemo(
    () => findPastRallyById(pastRalliesRaw, rallyId),
    [pastRalliesRaw, rallyId],
  );

  const detail = useMemo(
    () => (rally ? mapPastRallyToDetail(rally) : null),
    [rally],
  );

  if (isPending) {
    return (
      <div className="previous-rally-detail-page flex min-h-[50vh] items-center justify-center">
        <p className="text-gray-500">Loading rally details…</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="previous-rally-detail-page flex min-h-[50vh] items-center justify-center">
        <p className="text-red-600">
          Could not load rally details. Please try again later.
        </p>
      </div>
    );
  }

  if (!detail) {
    return <Navigate to="/previous" replace />;
  }

  const {
    heroContent,
    summaryCardContent,
    promoBannerContent,
    mainContent,
    championsContent,
    eventId,
  } = detail;

  return (
    <div className="previous-rally-detail-page">
      <section className="relative previous-rally-detail-hero">
        <div
          className="previous-rally-detail-hero-bg"
          style={{ backgroundImage: `url(${heroContent.bgImg})` }}
        />
        <div className="previous-rally-detail-hero-overlay" />
        <div className="container mx-auto px-4 md:px-20 previous-rally-detail-hero-content">
          <h1 className="previous-rally-detail-hero-title whitespace-pre-line">
            {heroContent.title}
          </h1>
        </div>
        <div className="absolute -bottom-32 left-0 w-full flex items-center">
          <img
            src={RoughTexture1}
            alt="Jeep Rally"
            className="w-[50%] h-40 object-cover"
          />
          <img
            src={RoughTexture2}
            alt="Jeep Rally"
            className="w-[50%] h-40 object-cover"
          />
        </div>
      </section>

      <section className="previous-rally-detail-main">
        <div className="container mx-auto px-4 md:px-20">
          <div className="previous-rally-detail-grid">
            <aside className="previous-rally-detail-sidebar">
              <div className="previous-rally-detail-summary-card">
                <div className="previous-rally-detail-summary-header">
                  <h2>{summaryCardContent.title}</h2>
                </div>

                <div className="previous-rally-detail-summary-table">
                  {summaryCardContent.items.map((item) => (
                    <div
                      key={`${item.label}-${item.value}`}
                      className="previous-rally-detail-summary-row"
                    >
                      <span className="previous-rally-detail-summary-label">
                        {item.label}
                      </span>
                      <span className="previous-rally-detail-summary-value">
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div
                className="previous-rally-detail-promo"
                style={{ backgroundImage: `url(${promoBannerContent.image})` }}
              >
                <div className="previous-rally-detail-promo-overlay" />
                <div className="previous-rally-detail-promo-content">
                  <h2 className="whitespace-pre-line">
                    {promoBannerContent.title}
                  </h2>
                </div>
              </div>
            </aside>

            <div className="previous-rally-detail-content">
              <img
                src={mainContent.image}
                alt={mainContent.title}
                className="previous-rally-detail-featured-image"
                onError={handleImageError}
              />

              <h2 className="previous-rally-detail-title">
                {mainContent.title}
              </h2>
              <p className="previous-rally-detail-lead">
                {mainContent.subTitle}
              </p>

              <div className="previous-rally-detail-about">
                <h3 className="previous-rally-detail-section-title">
                  {mainContent.sectionTitle}
                </h3>

                <div className="previous-rally-detail-paragraphs">
                  {mainContent.paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>

                <div className="previous-rally-detail-checklist">
                  {mainContent.checklist.map((item) => (
                    <div
                      key={item}
                      className="previous-rally-detail-check-item"
                    >
                      <span className="previous-rally-detail-check-icon">
                        <FiCheck />
                      </span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ChampionsSection
        content={championsContent}
        eventId={eventId}
        useApiCategories
        titleClassName="text-black"
        subtitleClassName="text-[#6f6f6f]"
      />
      <RecentGallery />
      <Partners />
    </div>
  );
};

export default PreviousRallyDetail;
