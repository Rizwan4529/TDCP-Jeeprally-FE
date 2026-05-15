import React from 'react';
import '../Tours.css';
import { resolveImageUrl, handleImageError } from '../../../utils/constants.js';

const DEFAULT_CHECKLIST_ITEMS = [
    '120+ Professional Racing Events',
    '50+ Elite Drivers Worldwide',
    'International Championship Standards',
    'Advanced Track & Safety System'
];

const About = ({
    heroContent,
    summaryCardContent,
    promoBannerContent,
    mainContent,
}) => {
    const checklistItems = mainContent?.checklist?.length
        ? mainContent.checklist
        : DEFAULT_CHECKLIST_ITEMS;

    return (
        <div className="tours-page">
            {/* Hero Section - Reusing styling from About Hero */}
            <section className="about-hero">
                <div
                    className="about-hero-bg"
                    style={{ backgroundImage: `url('${resolveImageUrl(heroContent?.bgImg, "/assets/images/jeep_5_1.jpg")}')` }}
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

            {/* Main Content Layout */}
            <section className="story-section tours-container">
                <div className="container mx-auto px-4 md:px-20">
                    <div className="tours-main-grid">

                        {/* Sidebar (Left) */}
                        <div className="sidebar-wrapper">

                            {/* Discover Services Card */}
                            <div className="service-card">
                                <div className="service-header">
                                    <h3>{summaryCardContent?.title || "Discover Our Services"}</h3>
                                </div>
                                <div className="service-table">
                                    {(summaryCardContent?.items?.length
                                        ? summaryCardContent.items
                                        : [
                                            { label: "Event Name", value: "Desert Rally" },
                                            { label: "Date", value: "22-12-2025" },
                                            { label: "Location", value: "Cholistan Desert" },
                                            { label: "Organiser", value: "red bull ktm racing" },
                                        ]).map((item, index) => (
                                            <div key={item.id ?? `${item.label}-${index}`} className="service-row">
                                                <span className="service-label">{item.label}</span>
                                                <span className="service-value">{item.value}</span>
                                            </div>
                                        ))}
                                </div>
                            </div>

                            {/* Promo Banner */}
                            <div className="promo-banner">
                                <div className="promo-banner-bg"></div>
                                <div className="promo-overlay"></div>
                                <div className="promo-content">
                                    <h3 className="promo-title">
                                        {promoBannerContent?.title || (
                                            <>
                                                Reliving the <br /> Desert Thrill
                                            </>
                                        )}
                                    </h3>
                                    <p className="promo-desc">
                                        {promoBannerContent?.subTitle || "An unforgettable showcase of speed, skill, and endurance across the desert."}
                                    </p>
                                </div>
                            </div>

                        </div>

                        {/* Main Section (Right) */}
                        <div className="tour-main-content">
                            <img src={resolveImageUrl(mainContent?.image, "/assets/images/jeep_5_3.jpg")} alt={mainContent?.title || "Rally Car"} className="tour-featured-img" onError={handleImageError} />

                            <h2 className="tour-title">{mainContent?.title || "Cholistan Desert Rally"}</h2>

                            <p className="tour-subheading">
                                {mainContent?.subTitle || "An electrifying night championship event set against the illuminated skyline of Tokyo, featuring elite drivers, precision cornering, and high-speed technical racing under floodlights."}
                            </p>

                            <div className="event-details-section">
                                <h3 className="section-title">{mainContent?.sectionTitle || "About This Event"}</h3>
                                <p className="section-text">
                                    {mainContent?.paragraph || "The Tokyo Night Racing Series is one of Racify's most anticipated championship events, combining technical circuit challenges with high-intensity night racing conditions."}
                                </p>

                                <div className="checklist-box">
                                    {checklistItems.map((item, index) => (
                                        <div key={index} className="check-item">
                                            <span className="check-icon">✓</span>
                                            <span className="check-text">{item}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

        </div>
    );
};

export default About;
