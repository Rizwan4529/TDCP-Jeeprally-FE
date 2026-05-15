import React from 'react';
import { resolveImageUrl, handleImageError } from '../../../utils/constants.js';

const DEFAULT_FEATURES = [
        {
            icon: '/assets/images/ic1.png',
            title: 'High-Speed Racing',
            desc: 'Experience adrenaline-fueled competition'
        },
        {
            icon: '/assets/images/ic2.png',
            title: 'Desert Terrain',
            desc: 'Challenging dunes and rugged tracks'
        },
        {
            icon: '/assets/images/ic1.png',
            title: 'Cultural Experience',
            desc: 'Music, camps, and local traditions'
        },
        {
            icon: '/assets/images/ic2.png',
            title: 'Massive Participation',
            desc: 'Drivers, tourists, and spectators'
        }
    ];

const WhyExperience = ({ content }) => {
    const features = content?.items?.length
        ? content.items.map((item) => ({
            icon: resolveImageUrl(item?.image, '/assets/images/ic1.png'),
            title: item?.title || 'Feature',
            desc: item?.subTitle || '',
        }))
        : DEFAULT_FEATURES;

    return (
        <section className="why-experience-section py-20 overflow-hidden bg-section">
            <div className="container mx-auto px-4 md:px-20">
                <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-24">

                    {/* Left side: Jeep with dashed circle */}
                    <div className="relative flex-1 flex justify-center">
                        <div className="jeep-circular-frame relative">
                            {/* The Dashed Circle */}
                            <div className="dashed-circle"></div>
                            {/* The Solid Green Circle behind jeep */}
                            <div className="solid-circle"></div>
                            {/* The Jeep Image */}
                            <img
                                src={resolveImageUrl(content?.image, "/assets/images/yellow-jeep.png")}
                                alt={content?.title || "Yellow Jeep"}
                                className="relative z-10 w-full max-w-[500px] h-auto drop-shadow-2xl"
                                onError={handleImageError}
                            />
                            {/* Green Indicator Dot */}
                            <div className="green-indicator"></div>
                        </div>
                    </div>

                    {/* Right side: Content */}
                    <div className="flex-1">
                        <div className="adventure-content">
                            <h2 className="text-[32px] md:text-[42px] font-gilda leading-tight text-black border-l-4 border-primary pl-6 mb-6">
                                {content?.title || (
                                    <>
                                        Why Experience <br /> the Rally
                                    </>
                                )}
                            </h2>
                            <p className="adventure-desc text-gray-500 text-sm mb-12 leading-relaxed max-w-[500px]">
                                {content?.subTitle || "TDCP Jeep Rally combine advanced off-road racing with a personalized approach to help you experience the thrill and beauty of the desert landscape."}
                            </p>

                            <div className="features-grid grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-12">
                                {features.map((feature, index) => (
                                    <div key={index} className="feature-item flex items-start gap-4">
                                        <div className="feature-icon-wrapper flex-shrink-0">
                                            <img src={feature.icon} alt={feature.title} className="w-12 h-12 pt-2" onError={handleImageError} />
                                        </div>
                                        <div className="feature-text">
                                            <h3 className="feature-title text-xl font-gilda text-[#222] mb-2">
                                                {feature.title}
                                            </h3>
                                            <p className="feature-desc text-[12px] text-gray-500 leading-tight">
                                                {feature.desc}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default WhyExperience;
