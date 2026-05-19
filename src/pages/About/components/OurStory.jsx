import React from "react";
import { getWebsiteNestedSection } from "../../../api/features/content/websiteContent.utils.js";
import { handleImageError, resolveImageUrl } from "../../../utils/constants.js";
import flagStripedRace from "../../../assets/images/flag_4.png";
import DEFAULT_CARD_IMAGE from "../../../assets/images/previous-rally-3.jpg";

const INTRO_STATS_GRADIENT =
  "linear-gradient(135deg, #FFFFFF 0%, #FFFFFF 62%, #B44423 100%)";

function IntroStatsColumn({ cardContent }) {
  if (!cardContent) return null;

  const statValue = cardContent.title ?? "600+";
  const statLabel = cardContent.subTitle ?? "Rally Drivers";
  const statDescription =
    cardContent.paragraph ??
    "Top drivers and off-road enthusiasts competing for victory.";
  const imageSrc = resolveImageUrl(cardContent.image, DEFAULT_CARD_IMAGE);

  return (
    <div className="relative mx-auto w-full max-w-[320px] lg:mx-0 lg:max-w-none">
      <div className="relative z-10 flex flex-col gap-4">
        <div className="overflow-hidden rounded-md shadow-[0_8px_24px_rgba(0,0,0,0.08)]">
          <img
            src={imageSrc}
            alt={statLabel}
            className="h-[180px] w-full object-cover"
            onError={(event) => handleImageError(event, DEFAULT_CARD_IMAGE)}
          />
        </div>

        <article
          className="rounded-md p-8 shadow-[0_10px_40px_rgba(0,0,0,0.06)] transition-transform duration-300 hover:-translate-y-2.5"
          style={{ background: INTRO_STATS_GRADIENT }}
        >
          <p className="font-nanum-myeongjo text-[40px] font-bold leading-none text-[#111] lg:text-[42px]">
            {statValue}
          </p>
          <h3 className="mt-4 font-gilda text-2xl leading-tight text-[#222]">
            {statLabel}
          </h3>
          <p className="mt-4 font-manrope text-xs leading-relaxed text-[#666]">
            {statDescription}
          </p>
        </article>
      </div>
    </div>
  );
}

const OurStory = ({ heroContent, introContent }) => {
  const visionContent = getWebsiteNestedSection(introContent, "vision");
  const mainContent = getWebsiteNestedSection(introContent, "main");
  const cardContent = getWebsiteNestedSection(introContent, "card");

  return (
    <div className="about-page">
      <section className="about-hero">
        <div
          className="about-hero-bg"
          style={{
            backgroundImage: `url('${resolveImageUrl(heroContent?.bgImg, "/assets/images/s1.jpg")}')`,
          }}
        />
        <div className="about-hero-overlay" />
        <div className="container mx-auto px-4 md:px-20 about-hero-content">
          <h1 className="hero-heading about-hero-title">
            {heroContent?.title || (
              <>
                Where Speed Meets <br />
                The Spirit Of The <br />
                Desert
              </>
            )}
          </h1>
        </div>
      </section>

      <section className="story-section relative">
        <div className="container mx-auto px-4 md:px-20">
          <div className="story-grid">
            <div className="vision-box">
              <h2 className="vision-title">
                {visionContent?.title || "Our Vision"}
              </h2>
              <p className="vision-text">
                {visionContent?.subTitle ||
                  "To establish the TDCP Jeep Rally as a globally recognized off-road event that celebrates adventure, showcases the desert landscape, and attracts enthusiasts from around the world."}
              </p>
            </div>

            <div className="story-content">
              <h2 className="story-subtitle text-[29px] md:text-[42px]">
                {mainContent?.title || "Our Story of Speed & Adventure"}
              </h2>
              <p className="story-description">
                {mainContent?.subTitle ||
                  "The TDCP Jeep Rally is one of Pakistan's premier off-road motorsport events, organized to promote adventure tourism and showcase the raw beauty of the desert. It brings together professional drivers, thrill-seekers, and spectators for an unforgettable experience."}
              </p>
            </div>

            <IntroStatsColumn cardContent={cardContent} />
          </div>
        </div>
        <div
          className="pointer-events-none absolute top-0 right-0 w-[500px] h-[500px] -z-0  opacity-[0.07]"
          style={{ backgroundImage: `url(${flagStripedRace})` }}
          aria-hidden
        />
      </section>
    </div>
  );
};

export default OurStory;
