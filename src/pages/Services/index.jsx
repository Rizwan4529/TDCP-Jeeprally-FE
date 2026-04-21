import React from 'react'
import About from './components/About'
import ChampionsSection from '../JeepRally/components/ChampionsSection'
import Partners from '../JeepRally/components/Partners'
import RecentGallery from '../JeepRally/components/RecentGallery'
import { dummyData } from '../JeepRally/data';

const Services = () => {
    return (
        <>
            <About />
            <ChampionsSection />
            <RecentGallery data={dummyData.gallery} />
            <Partners />
        </>
    )
}

export default Services