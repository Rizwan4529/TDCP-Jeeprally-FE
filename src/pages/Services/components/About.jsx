import React from 'react';
import '../Tours.css';

const About = () => {
    const checklistItems = [
        '120+ Professional Racing Events',
        '50+ Elite Drivers Worldwide',
        'International Championship Standards',
        'Advanced Track & Safety System'
    ];

    return (
        <div className="tours-page">
            {/* Hero Section - Reusing styling from About Hero */}
            <section className="about-hero">
                <div className="about-hero-bg" style={{ backgroundImage: "url('/assets/images/jeep_5_1.jpg')" }}></div>
                <div className="about-hero-overlay"></div>
                <div className="container mx-auto px-4 md:px-20 about-hero-content">
                    <h1 className="hero-heading about-hero-title">
                        Where Speed Meets <br />
                        The Spirit Of The <br />
                        Desert
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
                                    <h3>Discover Our Services</h3>
                                </div>
                                <div className="service-table">
                                    <div className="service-row">
                                        <span className="service-label">Event Name</span>
                                        <span className="service-value">Desert Rally</span>
                                    </div>
                                    <div className="service-row">
                                        <span className="service-label">Date</span>
                                        <span className="service-value">22-12-2025</span>
                                    </div>
                                    <div className="service-row">
                                        <span className="service-label">Location</span>
                                        <span className="service-value">Cholistan Desert</span>
                                    </div>
                                    <div className="service-row">
                                        <span className="service-label">Organiser</span>
                                        <span className="service-value">red bull ktm racing</span>
                                    </div>
                                </div>
                            </div>

                            {/* Promo Banner */}
                            <div className="promo-banner">
                                <div className="promo-banner-bg"></div>
                                <div className="promo-overlay"></div>
                                <div className="promo-content">
                                    <h3 className="promo-title">Reliving the <br /> Desert Thrill</h3>
                                    <p className="promo-desc">
                                        An unforgettable showcase of speed, skill,
                                        and endurance across the desert.
                                    </p>
                                </div>
                            </div>

                        </div>

                        {/* Main Section (Right) */}
                        <div className="tour-main-content">
                            <img src="/assets/images/jeep_5_3.jpg" alt="Rally Car" className="tour-featured-img" />

                            <h2 className="tour-title">Cholistan Desert Rally</h2>

                            <p className="tour-subheading">
                                An electrifying night championship event set against the illuminated skyline of
                                Tokyo, featuring elite drivers, precision cornering, and high-speed technical racing
                                under floodlights.
                            </p>

                            <div className="event-details-section">
                                <h3 className="section-title">About This Event</h3>
                                <p className="section-text">
                                    The Tokyo Night Racing Series is one of Racify's most anticipated championship
                                    events, combining technical circuit challenges with high-intensity night racing
                                    conditions.
                                    <br />
                                    Drivers will compete under advanced floodlight systems designed to simulate high-
                                    pressure competitive environments. The circuit layout demands precision braking,
                                    strategic overtaking, and flawless race execution.
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
