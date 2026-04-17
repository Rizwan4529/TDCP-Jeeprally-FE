import React from 'react';
import { HeroSection, TourPackages, JourneySection, RecentGallery, VideoPromoSection, ExplorePunjabSection } from './components';
import { useServiceContentQuery } from '../../api/features/content/hooks';
import Loading from '../../components/common/Loading';
import Error from '../../components/common/Error';

const Sightseeing = () => {
    // Fetching dynamic content for service 123
    const { data: pageData, isLoading, isError } = useServiceContentQuery(123);

    if (isLoading) return <Loading />;
    if (isError || !pageData) return <Error />;

    return (
        <div className="bg-white">
            <HeroSection data={pageData.hero} />
            <TourPackages
                headerData={pageData.tourPackagesHeader}
                cities={pageData.cities}
                tours={pageData.tours}
            />
            <JourneySection data={pageData.journey} />
            <RecentGallery data={pageData.gallery} />
            <VideoPromoSection data={pageData.videoPromo} />
            <ExplorePunjabSection data={pageData.explorePunjab} />
        </div>
    );
};

export default Sightseeing;
