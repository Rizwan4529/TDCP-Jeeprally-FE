import React, { useMemo } from "react";
import Hero from "./components/Hero";
import Countdown from "./components/Countdown";
import AdventureSection from "./components/AdventureSection";
import SelectChallenge from "./components/SelectChallenge";
import EventsCompetitions from "./components/EventsCompetitions";
import RallyRules from "./components/RallyRules";
import TrackDetails from "./components/TrackDetails";
import SocialMediaSection from "./components/SocialMediaSection";
import Destinations from "./components/Destinations";
import RecentGallery from "./components/RecentGallery";
import Partners from "./components/Partners";
import ExperienceSlider from "./components/ExperienceSlider";
import ChampionsSection from "./components/ChampionsSection";
import { useWebsiteContentQuery } from "../../api/features/content/hooks.jsx";
import {
  getWebsiteContentPage,
  getWebsiteContentSection,
} from "../../api/features/content/websiteContent.utils.js";

const JeepRally = () => {
  const { data: websiteContent } = useWebsiteContentQuery();
  const homePage = useMemo(
    () => getWebsiteContentPage(websiteContent, "home"),
    [websiteContent]
  );

  return (
    <div className="bg-white">
      <Hero content={getWebsiteContentSection(homePage, "hero")} />
      {/* <Countdown /> */}
      <div id="about" className="scroll-mt-28 md:scroll-mt-32">
        <AdventureSection content={getWebsiteContentSection(homePage, "stats")} />
      </div>
      <ExperienceSlider />
      {/* <EventsCompetitions /> */}
      <ChampionsSection content={getWebsiteContentSection(homePage, "champions")} />
      <div id="challenges" className="scroll-mt-28 md:scroll-mt-32">
        <SelectChallenge content={getWebsiteContentSection(homePage, "selectChallenge")} />
      </div>
      <div id="rules" className="scroll-mt-28 md:scroll-mt-32">
        <RallyRules content={getWebsiteContentSection(homePage, "rules")} />
      </div>
      <TrackDetails content={getWebsiteContentSection(homePage, "trackDetails")} />
      <SocialMediaSection content={getWebsiteContentSection(homePage, "socialMedia")} />
      <Destinations content={getWebsiteContentSection(homePage, "rallyDestinations")} />
      <div id="gallery" className="scroll-mt-28 md:scroll-mt-32">
        <RecentGallery content={getWebsiteContentSection(homePage, "recentGallery")} />
      </div>
      <div id="partners" className="scroll-mt-28 md:scroll-mt-32">
        <Partners content={getWebsiteContentPage(websiteContent, "partners")} />
      </div>
    </div>
  );
};

export default JeepRally;
