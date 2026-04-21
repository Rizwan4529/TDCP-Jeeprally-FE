import React from 'react'

const OurStory = () => {
    return (
        <div className="about-page">
            {/* Hero Section */}
            <section className="about-hero">
                <div className="about-hero-bg"></div>
                <div className="about-hero-overlay"></div>
                <div className="container mx-auto px-4 md:px-20 about-hero-content">
                    <h1 className="hero-heading about-hero-title">
                        Where Speed Meets <br />
                        The Spirit Of The <br />
                        Desert
                    </h1>
                </div>
            </section>

            {/* Story & Vision Section */}
            <section className="story-section">
                <div className="container mx-auto px-4 md:px-20">
                    <div className="story-grid">

                        {/* Vision Box */}
                        <div className="vision-box">
                            <h2 className="vision-title">Our Vision</h2>
                            <p className="vision-text">
                                To establish the TDCP Jeep Rally as a globally recognized
                                off-road event that celebrates adventure, showcases the
                                desert landscape, and attracts enthusiasts from
                                around the world.
                            </p>
                        </div>

                        {/* Story Content */}
                        <div className="story-content">
                            <h2 className="story-subtitle text-[29px] md:text-[42px]">Our Story of Speed & Adventure</h2>
                            <p className="story-description">
                                The TDCP Jeep Rally is one of Pakistan's premier off-road motorsport
                                events, organized to promote adventure tourism and showcase the
                                raw beauty of the desert. It brings together professional drivers,
                                thrill-seekers, and spectators for an unforgettable experience.
                                <br /><br />
                                Over the years, the rally has evolved into a symbol of resilience
                                and passion, attracting international participants and putting
                                the Cholistan desert on the global tourism map.
                            </p>
                        </div>

                        {/* Stats Card */}
                        <div className="stats-card">
                            <div className="stats-img-wrapper">
                                <img
                                    src="/assets/images/jeep_3_1.jpg"
                                    alt="Rally Action"
                                    className="stats-img"
                                />
                            </div>
                            <div className="stats-content">
                                <div className="stats-number">600+</div>
                                <h3 className="stats-label">Rally Drivers</h3>
                                <p className="stats-desc">
                                    Top drivers and off-road enthusiasts competing for victory.
                                </p>
                            </div>
                        </div>

                    </div>
                </div>
            </section>
        </div>

    )
}

export default OurStory