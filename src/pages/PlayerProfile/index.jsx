import GearUpSection from "./components/GearUpSection";
import RankingChart from "./components/RankingsChart";
import PlayerProfile from "./components/PlayerProfile";
import Partners from "../JeepRally/components/Partners";
import ScrollReveal from "../../components/common/ScrollReveal.jsx";
import {
  PlayerProfileProvider,
  usePlayerProfileContext,
} from "./PlayerProfileContext.jsx";

function PlayerPageContent() {
  const { showRankingsSection, showVehicleSection } = usePlayerProfileContext();

  return (
    <>
      <PlayerProfile />

      {showVehicleSection ? (
        <ScrollReveal variant="scaleIn" duration={0.8}>
          <GearUpSection />
        </ScrollReveal>
      ) : null}

      {showRankingsSection ? (
        <ScrollReveal variant="fadeUp" duration={0.75}>
          <RankingChart />
        </ScrollReveal>
      ) : null}

      <ScrollReveal variant="zoomIn" delay={0.06} duration={0.7}>
        <Partners />
      </ScrollReveal>
    </>
  );
}

const Player = () => {
  return (
    <PlayerProfileProvider>
      <PlayerPageContent />
    </PlayerProfileProvider>
  );
};

export default Player;
