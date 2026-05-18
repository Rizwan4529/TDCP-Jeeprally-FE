import React, { useMemo } from "react";
import "./About.css";
import Partners from "../JeepRally/components/Partners";
import AdventureSection from "../JeepRally/components/AdventureSection";
import WhyExperience from "./components/WhyExperience";
import RecentGallery from "../JeepRally/components/RecentGallery";
import OurStory from "./components/OurStory";
import ScrollReveal, { HeroReveal } from "../../components/common/ScrollReveal.jsx";
import { useWebsiteContentQuery } from "../../api/features/content/hooks.jsx";
import {
  getWebsiteContentPage,
  getWebsiteContentSection,
} from "../../api/features/content/websiteContent.utils.js";

const About = () => {
  const { data: websiteContent } = useWebsiteContentQuery();
  const aboutPage = useMemo(
    () => getWebsiteContentPage(websiteContent, "about"),
    [websiteContent],
  );
  const whyExperienceSection = useMemo(
    () => getWebsiteContentSection(aboutPage, "whyExperience"),
    [aboutPage],
  );

  return (
    <>
      <HeroReveal>
        <OurStory
          heroContent={getWebsiteContentSection(aboutPage, "hero")}
          introContent={getWebsiteContentSection(aboutPage, "intro")}
        />
      </HeroReveal>

      <ScrollReveal variant="fadeLeft" duration={0.8}>
        <AdventureSection />
      </ScrollReveal>

      {whyExperienceSection ? (
        <ScrollReveal variant="scaleIn" duration={0.75} delay={0.05}>
          <WhyExperience content={whyExperienceSection} />
        </ScrollReveal>
      ) : null}

      <ScrollReveal variant="zoomIn" duration={0.8} amount={0.15}>
        <RecentGallery />
      </ScrollReveal>

      <ScrollReveal variant="fadeUp" delay={0.08} duration={0.7}>
        <Partners content={getWebsiteContentPage(websiteContent, "partners")} />
      </ScrollReveal>
    </>
  );
};

export default About;
