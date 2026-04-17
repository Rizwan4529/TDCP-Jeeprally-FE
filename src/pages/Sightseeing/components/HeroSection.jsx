import React from 'react';

const HeroSection = ({ data }) => {
    if (!data) return null;
    return (
        <section className="relative h-[60vh] md:h-[100vh] flex items-center justify-center overflow-hidden">
            {/* Background Image */}
            <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 hover:scale-105"
                style={{
                    backgroundImage: `url('${data.backgroundImage}')`,
                }}
            >
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/40" />
            </div>

            {/* Content */}
            <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
                <h1 className="font-gilda font-medium text-white text-3xl md:text-6xl leading-none tracking-tight drop-shadow-2xl">
                    {data.titleMain} <br />
                    <span className="md:mt-4 block">{data.titleSub}</span>
                </h1>
            </div>
        </section>
    );
};

export default HeroSection;
