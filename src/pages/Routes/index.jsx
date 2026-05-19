import { useParams } from "react-router";
import "./Routes.css";
import "./RoutesOverview.css";
import Partners from "../JeepRally/components/Partners";
import RouteStageView from "./components/RouteStageView";
import RoutesOverview from "./components/RoutesOverview";
import ScrollReveal, { HeroReveal } from "../../components/common/ScrollReveal.jsx";

const Routes = () => {
  const { stageId } = useParams();
  const isStageDetail = Boolean(stageId);

  return (
    <>
      <HeroReveal>
        {isStageDetail ? (
          <RouteStageView stageId={stageId} />
        ) : (
          <RoutesOverview />
        )}
      </HeroReveal>
      <ScrollReveal variant="fadeUp" delay={0.08} duration={0.7}>
        <Partners />
      </ScrollReveal>
    </>
  );
};

export default Routes;
