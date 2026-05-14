import React, { useMemo } from 'react';
import './About.css';
import Partners from '../JeepRally/components/Partners';
import AdventureSection from '../JeepRally/components/AdventureSection';
import WhyExperience from './components/WhyExperience';
import RecentGallery from '../JeepRally/components/RecentGallery';
import OurStory from './components/OurStory';
import { useWebsiteContentQuery } from '../../api/features/content/hooks.jsx';
import {
  getWebsiteContentPage,
  getWebsiteContentSection,
} from '../../api/features/content/websiteContent.utils.js';

const About = () => {
  const { data: websiteContent } = useWebsiteContentQuery();
  const aboutPage = useMemo(
    () => getWebsiteContentPage(websiteContent, "about"),
    [websiteContent]
  );
  const whyExperienceSection = useMemo(
    () => getWebsiteContentSection(aboutPage, "whyExperience"),
    [aboutPage]
  );

  return (
    <>
      <OurStory
        heroContent={getWebsiteContentSection(aboutPage, "hero")}
        introContent={getWebsiteContentSection(aboutPage, "intro")}
      />
      <AdventureSection />
      {whyExperienceSection ? <WhyExperience content={whyExperienceSection} /> : null}
      <RecentGallery />
      <Partners content={getWebsiteContentPage(websiteContent, "partners")} />
    </>
  );
};

export default About;
