import React from 'react'
import {
    getWebsiteNestedSection,
} from '../../../api/features/content/websiteContent.utils.js'

const OurStory = ({ heroContent, introContent }) => {
    const visionContent = getWebsiteNestedSection(introContent, "vision");
    const mainContent = getWebsiteNestedSection(introContent, "main");
    const cardContent = getWebsiteNestedSection(introContent, "card");

    return (
        <div className="about-page">
            {/* Hero Section */}
            <section className="about-hero">
                <div
                    className="about-hero-bg"
                    style={{
                        backgroundImage: `url('${heroContent?.bgImg || "/assets/images/s1.jpg"}')`,
                    }}
                ></div>
                <div className="about-hero-overlay"></div>
                <div className="container mx-auto px-4 md:px-20 about-hero-content">
                    <h1 className="hero-heading about-hero-title">
                        {heroContent?.title || (
                            <>
                                Where Speed Meets <br />
                                The Spirit Of The <br />
                                Desert
                            </>
                        )}
                    </h1>
                </div>
            </section>

            {/* Story & Vision Section */}
            <section className="story-section">
                <div className="container mx-auto px-4 md:px-20">
                    <div className="story-grid">

                        {/* Vision Box */}
                        <div className="vision-box">
                            <h2 className="vision-title">{visionContent?.title || "Our Vision"}</h2>
                            <p className="vision-text">
                                {visionContent?.subTitle || "To establish the TDCP Jeep Rally as a globally recognized off-road event that celebrates adventure, showcases the desert landscape, and attracts enthusiasts from around the world."}
                            </p>
                        </div>

                        {/* Story Content */}
                        <div className="story-content">
                            <h2 className="story-subtitle text-[29px] md:text-[42px]">
                                {mainContent?.title || "Our Story of Speed & Adventure"}
                            </h2>
                            <p className="story-description">
                                {mainContent?.subTitle || "The TDCP Jeep Rally is one of Pakistan's premier off-road motorsport events, organized to promote adventure tourism and showcase the raw beauty of the desert. It brings together professional drivers, thrill-seekers, and spectators for an unforgettable experience."}
                            </p>
                        </div>

                        {cardContent ? (
                            <div className="stats-card">
                                <div className="stats-img-wrapper">
                                    <img
                                        src={cardContent.image}
                                        alt={cardContent.subTitle || "Rally Action"}
                                        className="stats-img"
                                    />
                                </div>
                                <div className="stats-content">
                                    <div className="stats-number">{cardContent.title}</div>
                                    <h3 className="stats-label">{cardContent.subTitle}</h3>
                                    <p className="stats-desc">
                                        {cardContent.paragraph}
                                    </p>
                                </div>
                            </div>
                        ) : null}

                    </div>
                </div>
            </section>
        </div>

    )
}

export default OurStory