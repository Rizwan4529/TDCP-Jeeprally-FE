import React, { useMemo } from 'react'
import About from './components/About'
import ChampionsSection from '../JeepRally/components/ChampionsSection'
import Partners from '../JeepRally/components/Partners'
import RecentGallery from '../JeepRally/components/RecentGallery'
import { useWebsiteContentQuery } from '../../api/features/content/hooks.jsx'
import {
    getWebsiteContentPage,
    getWebsiteContentSection,
} from '../../api/features/content/websiteContent.utils.js'

const Services = () => {
    const { data: websiteContent } = useWebsiteContentQuery();
    const aboutEventPage = useMemo(
        () => getWebsiteContentPage(websiteContent, "aboutEvent"),
        [websiteContent]
    );

    return (
        <>
            <About
                heroContent={getWebsiteContentSection(aboutEventPage, "hero")}
                summaryCardContent={getWebsiteContentSection(aboutEventPage, "summaryCard")}
                promoBannerContent={getWebsiteContentSection(aboutEventPage, "promoBanner")}
                mainContent={getWebsiteContentSection(aboutEventPage, "mainContent")}
            />
            <ChampionsSection />
            <RecentGallery />
            <Partners content={getWebsiteContentPage(websiteContent, "partners")} />
        </>
    )
}

export default Services