import React from 'react';
import './About.css';
import Partners from '../JeepRally/components/Partners';
import AdventureSection from '../JeepRally/components/AdventureSection';
import WhyExperience from './components/WhyExperience';
import RecentGallery from '../JeepRally/components/RecentGallery';
import OurStory from './components/OurStory';

const About = () => {
  return (
    <>
      <OurStory />
      <AdventureSection />
      <WhyExperience />
      <RecentGallery />
      <Partners />
    </>
  );
};

export default About;
