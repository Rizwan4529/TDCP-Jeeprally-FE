import React from "react";
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

const JeepRally = () => {
  return (
    <div className="bg-white">
      <Hero />
      {/* <Countdown /> */}
      <div id="about" className="scroll-mt-28 md:scroll-mt-32">
        <AdventureSection />
      </div>
      <ExperienceSlider />
      {/* <EventsCompetitions /> */}
      <ChampionsSection />
      <div id="challenges" className="scroll-mt-28 md:scroll-mt-32">
        <SelectChallenge />
      </div>
      <div id="rules" className="scroll-mt-28 md:scroll-mt-32">
        <RallyRules />
      </div>
      <TrackDetails />
      <SocialMediaSection />
      <Destinations />
      <div id="gallery" className="scroll-mt-28 md:scroll-mt-32">
        <RecentGallery />
      </div>
      <div id="partners" className="scroll-mt-28 md:scroll-mt-32">
        <Partners />
      </div>
    </div>
  );
};

export default JeepRally;
