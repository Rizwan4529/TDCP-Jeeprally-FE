import React, { useState } from 'react';
import TourCard from './TourCard';

const TourPackages = ({ cities, tours, headerData }) => {
    const [activeTab, setActiveTab] = useState(cities && cities.length > 0 ? cities[0].id : null);

    if (!cities || !tours || !headerData) return null;

    return (
        <section className="py-16 md:py-24 bg-white">
            <div className="container mx-auto">
                <div className="px-4 lg:px-20">
                    {/* Header */}
                    <div className="text-center mb-12 md:mb-16 max-w-3xl mx-auto">
                        <h2 className="font-gilda text-primary text-[30px] md:text-[42px] mb-6">
                            {headerData.title}
                        </h2>
                        <p className="text-gray-500 font-poppins text-[14px] leading-relaxed">
                            {headerData.description}
                        </p>
                    </div>

                    {/* Tabs */}
                    <div className="flex flex-wrap justify-center gap-4 md:gap-12 mb-12 border-b border-gray-100">
                        {cities.map((city) => (
                            <button
                                key={city.id}
                                onClick={() => setActiveTab(city.id)}
                                className={`pb-4 text-sm md:text-base font-semibold transition-all duration-300 relative px-2
                                ${activeTab === city.id
                                        ? 'text-primary'
                                        : 'text-gray-400 hover:text-gray-600'}`}
                            >
                                {city.label}
                                {activeTab === city.id && (
                                    <div className="absolute bottom-0 left-0 w-full h-1 bg-accent rounded-t-[6px] transition-all duration-300" />
                                )}
                            </button>
                        ))}
                    </div>

                    {/* Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {tours[activeTab]?.length > 0 ? (
                            tours[activeTab].map((tour) => (
                                <TourCard key={tour.id} tour={tour} />
                            ))
                        ) : (
                            <div className="col-span-full py-20 text-center">
                                <h3 className="text-xl text-gray-500 font-medium">No packages available for this city yet.</h3>
                                <p className="text-gray-400 mt-2">Check back soon for new exciting tours!</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default TourPackages;
