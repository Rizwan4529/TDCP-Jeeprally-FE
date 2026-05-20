import React from "react";
import { getWebsiteNestedSection } from "../../../api/features/content/websiteContent.utils.js";
import { handleImageError, resolveImageUrl } from "../../../utils/constants.js";
import flagStripedRace from "../../../assets/images/flag_4.png";
import DEFAULT_CARD_IMAGE from "../../../assets/images/previous-rally-3.jpg";

/** White → primary (#B44423), strongest in bottom-right (design spec) */
const STATS_CARD_GRADIENT =
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
        <div className="relative h-[180px] w-full overflow-hidden rounded-md shadow-[0_10px_40px_rgba(0,0,0,0.06)] transition-transform duration-300 hover:-translate-y-2.5">
          <img
            src={imageSrc}
            alt={statLabel}
            className="h-full w-full object-cover"
            onError={(event) => handleImageError(event, DEFAULT_CARD_IMAGE)}
          />
        </div>

        <article
          className="rounded-md p-[30px] shadow-[0_10px_40px_rgba(0,0,0,0.06)] transition-transform duration-300 hover:-translate-y-2.5"
          style={{ background: STATS_CARD_GRADIENT }}
        >
          <p className="mb-[15px] font-sans text-[40px] font-normal leading-none text-[#111]">
            {statValue}
          </p>
          <h3 className="mb-3 font-gilda text-2xl text-[#222]">{statLabel}</h3>
          <p className="text-xs leading-[1.6] text-[#666]">{statDescription}</p>
        </article>
      </div>
    </div>
  );
}

const OurStory = ({ heroContent, introContent }) => {
  const visionContent = getWebsiteNestedSection(introContent, "vision");
  const mainContent = getWebsiteNestedSection(introContent, "main");
  const cardContent = getWebsiteNestedSection(introContent, "card");

  const heroBg = resolveImageUrl(heroContent?.bgImg, "/assets/images/s1.jpg");

  return (
    <div className="bg-white">
      <section className="relative mt-[86px] flex h-[60vh] w-full items-center overflow-hidden">
        <div
          className="absolute inset-0 z-0 bg-cover bg-center"
          style={{ backgroundImage: `url('${heroBg}')` }}
          role="img"
          aria-label=""
        />
        <div
          className="absolute inset-0 z-[1] bg-gradient-to-r from-black/70 via-black/30 to-black/10"
          aria-hidden
        />
        <div className="relative z-[2] w-full">
          <div className="container mx-auto px-4 md:px-20">
            <h1 className="hero-heading max-w-[600px] font-gilda leading-[1.1] text-white">
              {heroContent?.title || (
                <>
                  Where Speed Meets <br />
                  The Spirit Of The <br />
                  Desert
                </>
              )}
            </h1>
          </div>
        </div>
      </section>

      <section className="relative py-20">
        <div className="container mx-auto px-4 md:px-20">
          <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-[300px_1fr_320px] lg:gap-[60px]">
            <div className="flex h-full flex-col rounded-md bg-primary p-10  text-white">
              <h2 className="mb-[40px] font-gilda text-[32px]">
                {visionContent?.title || "Our Vision"}
              </h2>
              <p className="text-sm leading-[1.8] opacity-95">
                {visionContent?.subTitle ||
                  "To establish the TDCP Jeep Rally as a globally recognized off-road event that celebrates adventure, showcases the desert landscape, and attracts enthusiasts from around the world."}
              </p>
            </div>

            <div className="pt-5">
              <h2 className="mb-[30px] font-gilda text-[clamp(1.5rem,4vw,2.5rem)] leading-[1.2] text-[#222]">
                {mainContent?.title || "Our Story of Speed & Adventure"}
              </h2>
              <p className="text-[15px] leading-[1.8] text-[#666]">
                {mainContent?.subTitle ||
                  "The TDCP Jeep Rally is one of Pakistan's premier off-road motorsport events, organized to promote adventure tourism and showcase the raw beauty of the desert. It brings together professional drivers, thrill-seekers, and spectators for an unforgettable experience."}
              </p>
            </div>

            <IntroStatsColumn cardContent={cardContent} />
          </div>
        </div>

        <div
          className="pointer-events-none absolute top-0 right-0 -z-0 h-[500px] w-[500px] bg-contain bg-no-repeat opacity-[0.2]"
          style={{ backgroundImage: `url(${flagStripedRace})` }}
          aria-hidden
        />
      </section>
    </div>
  );
};

export default OurStory;
