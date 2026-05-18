import "./RallyMap.css";
import Partners from "../JeepRally/components/Partners";
import Map from "./components/Map";
import ScrollReveal, { HeroReveal } from "../../components/common/ScrollReveal.jsx";

const RallyMap = () => {
  return (
    <>
      <HeroReveal>
        <Map />
      </HeroReveal>
      <ScrollReveal variant="fadeUp" delay={0.08} duration={0.7}>
        <Partners />
      </ScrollReveal>
    </>
  );
};

export default RallyMap;
