import React from "react";
import PlayerProfile from "./components/PlayerProfile";
import GearUpSection from "./components/GearUpSection";
import RankingChart from "./components/RankingsChart";
import Partners from "../JeepRally/components/Partners";
import ScrollReveal from "../../components/common/ScrollReveal.jsx";

const Player = () => {
  return (
    <>
      <PlayerProfile />

      <ScrollReveal variant="scaleIn" duration={0.8}>
        <GearUpSection />
      </ScrollReveal>

      <ScrollReveal variant="fadeUp" duration={0.75}>
        <RankingChart />
      </ScrollReveal>

      <ScrollReveal variant="zoomIn" delay={0.06} duration={0.7}>
        <Partners />
      </ScrollReveal>
    </>
  );
};

export default Player;
