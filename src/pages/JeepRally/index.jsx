import React, { useMemo } from "react";
import Hero from "./components/Hero";
import AdventureSection from "./components/AdventureSection";
import SelectChallenge from "./components/SelectChallenge";
import RallyRules from "./components/RallyRules";
import TrackDetails from "./components/TrackDetails";
import SocialMediaSection from "./components/SocialMediaSection";
import Destinations from "./components/Destinations";
import RecentGallery from "./components/RecentGallery";
import Partners from "./components/Partners";
import ExperienceSlider from "./components/ExperienceSlider";
import ChampionsSection from "./components/ChampionsSection";
import ScrollReveal, {
  HeroReveal,
} from "../../components/common/ScrollReveal.jsx";
import { useWebsiteContentQuery } from "../../api/features/content/hooks.jsx";
import {
  getWebsiteContentPage,
  getWebsiteContentSection,
} from "../../api/features/content/websiteContent.utils.js";

const JeepRally = () => {
  const { data: websiteContent } = useWebsiteContentQuery();
  const homePage = useMemo(
    () => getWebsiteContentPage(websiteContent, "home"),
    [websiteContent],
  );

  return (
    <div className="bg-white overflow-x-clip">
      <HeroReveal>
        <Hero content={getWebsiteContentSection(homePage, "hero")} />
      </HeroReveal>

      <ScrollReveal variant="blurUp" duration={0.85}>
        <div id="about" className="scroll-mt-28 md:scroll-mt-32">
          <AdventureSection
            content={getWebsiteContentSection(homePage, "stats")}
          />
        </div>
      </ScrollReveal>

      <ScrollReveal variant="fadeLeft" duration={0.75} delay={0.05}>
        <ExperienceSlider />
      </ScrollReveal>

      <ScrollReveal variant="scaleIn" duration={0.8}>
        <ChampionsSection
          content={getWebsiteContentSection(homePage, "champions")}
          filterCategoriesWithChampions
        />
      </ScrollReveal>

      {/* <ScrollReveal variant="fadeUp" delay={0.08}>
        <div id="challenges" className="scroll-mt-28 md:scroll-mt-32">
          <SelectChallenge
            content={getWebsiteContentSection(homePage, "selectChallenge")}
          />
        </div>
      </ScrollReveal> */}

      <ScrollReveal variant="fadeRight" duration={0.75}>
        <div id="rules" className="scroll-mt-28 md:scroll-mt-32">
          <RallyRules content={getWebsiteContentSection(homePage, "rules")} />
        </div>
      </ScrollReveal>

      <ScrollReveal variant="rotateIn" duration={0.7}>
        <TrackDetails
          content={getWebsiteContentSection(homePage, "trackDetails")}
        />
      </ScrollReveal>

      <ScrollReveal variant="zoomIn" duration={0.75} delay={0.06}>
        <SocialMediaSection
          content={getWebsiteContentSection(homePage, "socialMedia")}
        />
      </ScrollReveal>

      <ScrollReveal variant="fadeUp" duration={0.8}>
        <Destinations
          content={getWebsiteContentSection(homePage, "rallyDestinations")}
        />
      </ScrollReveal>

      <ScrollReveal variant="fadeDown" duration={0.7} amount={0.12}>
        <div id="gallery" className="scroll-mt-28 md:scroll-mt-32">
          <RecentGallery
            content={getWebsiteContentSection(homePage, "recentGallery")}
          />
        </div>
      </ScrollReveal>

      <ScrollReveal variant="fadeUp" delay={0.1} duration={0.65}>
        <div id="partners" className="scroll-mt-28 md:scroll-mt-32">
          <Partners
            content={getWebsiteContentPage(websiteContent, "partners")}
          />
        </div>
      </ScrollReveal>
    </div>
  );
};

export default JeepRally;
