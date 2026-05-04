import React from 'react';
import Hero from './components/Hero';
import Countdown from './components/Countdown';
import AdventureSection from './components/AdventureSection';
import SelectChallenge from './components/SelectChallenge';
import EventsCompetitions from './components/EventsCompetitions';
import RallyRules from './components/RallyRules';
import TrackDetails from './components/TrackDetails';
import Destinations from './components/Destinations';
import RecentGallery from './components/RecentGallery';
import { dummyData } from './data'
import Partners from './components/Partners';
import ExperienceSlider from './components/ExperienceSlider';
import ChampionsSection from './components/ChampionsSection';

const JeepRally = () => {
    return (
        <div className="bg-white">
            <Hero />
            <Countdown />
            <div id="about">
                <AdventureSection />
            </div>
            <ExperienceSlider />
            <EventsCompetitions />
            <ChampionsSection />
            <div id="rules">
                <RallyRules />
            </div>
            <SelectChallenge />
            <TrackDetails />
            <Destinations />
            <RecentGallery data={dummyData.gallery} />
            <Partners />
        </div>
    );
};

export default JeepRally;