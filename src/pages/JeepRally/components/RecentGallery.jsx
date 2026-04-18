import React, { useState } from 'react';
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";

const RecentGallery = ({ data }) => {
    const [startIndex, setStartIndex] = useState(0);

    if (!data || !data.images) return null;

    const totalImages = data.images.length;
    const windowSize = 7;

    const handleNext = () => {
        setStartIndex((prev) => (prev + 1) % (totalImages - windowSize + 1));
    };

    const handlePrev = () => {
        setStartIndex((prev) => (prev - 1 + (totalImages - windowSize + 1)) % (totalImages - windowSize + 1));
    };

    // Helper to get image by relative index
    const getImage = (offset) => data.images[startIndex + offset] || {};

    return (
        <section className="py-10 md:py-10 bg-white relative overflow-hidden">
            {/* Background Flower Cluster - Top Left */}
            <div className="absolute top-0 left-0 z-0 pointer-events-none select-none">
                <div className="relative w-48 md:w-64 lg:w-80 h-48 md:h-64 lg:h-80">
                    <img
                        src={'/assets/images/flag_3.png'}
                        alt=""
                        className="absolute top-[0%] left-[-65%] w-[300px] h-auto opacity-10 rotate-[50deg]"
                    />

                </div>
            </div>

            <div className="container mx-auto relative z-10">
                <div className="px-4 lg:px-20">
                    {/* Header */}
                    <div className="text-center mb-10 md:mb-10">
                        <h2 className="font-gilda text-primary text-[29px] md:text-[42px]">
                            {data.title}
                        </h2>
                    </div>

                    {/* Gallery Grid - Responsive Layout */}
                    <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 md:gap-4 lg:gap-6 lg:h-[500px] items-center">

                        {/* Column 1 - Left Medium */}
                        <div className="col-span-1 h-[180px] md:h-[240px] lg:h-[220px] transition-all duration-500 ease-in-out">
                            <img
                                key={getImage(0).src}
                                src={getImage(0).src}
                                alt={getImage(0).alt}
                                className="w-full h-full object-cover rounded-[6px] shadow-sm hover:shadow-md transition-all duration-300"
                            />
                        </div>

                        {/* Column 2 - Left Stacked */}
                        <div className="col-span-1 flex flex-col gap-3 md:gap-4 lg:gap-6 h-full justify-center">
                            <div className="h-[120px] md:h-[180px] lg:h-[238px] transition-all duration-500 ease-in-out">
                                <img
                                    key={getImage(1).src}
                                    src={getImage(1).src}
                                    alt={getImage(1).alt}
                                    className="w-full h-full object-cover rounded-[6px] shadow-sm hover:shadow-md transition-all duration-300"
                                />
                            </div>
                            <div className="h-[120px] md:h-[180px] lg:h-[238px] transition-all duration-500 ease-in-out">
                                <img
                                    key={getImage(2).src}
                                    src={getImage(2).src}
                                    alt={getImage(2).alt}
                                    className="w-full h-full object-cover rounded-[6px] shadow-sm hover:shadow-md transition-all duration-300"
                                />
                            </div>
                        </div>

                        {/* Column 3 - Center Tall Piece */}
                        <div className="col-span-2 lg:col-span-1 h-[280px] md:h-[400px] lg:h-full order-first lg:order-none transition-all duration-500 ease-in-out">
                            <img
                                key={getImage(3).src}
                                src={getImage(3).src}
                                alt={getImage(3).alt}
                                className="w-full h-full object-cover rounded-[6px] shadow-md border-4 border-white hover:scale-[1.02] transition-all duration-500"
                            />
                        </div>

                        {/* Column 4 - Right Stacked */}
                        <div className="col-span-1 flex flex-col gap-3 md:gap-4 lg:gap-6 h-full justify-center">
                            <div className="h-[120px] md:h-[180px] lg:h-[238px] transition-all duration-500 ease-in-out">
                                <img
                                    key={getImage(4).src}
                                    src={getImage(4).src}
                                    alt={getImage(4).alt}
                                    className="w-full h-full object-cover rounded-[6px] shadow-sm hover:shadow-md transition-all duration-300"
                                />
                            </div>
                            <div className="h-[120px] md:h-[180px] lg:h-[238px] transition-all duration-500 ease-in-out">
                                <img
                                    key={getImage(5).src}
                                    src={getImage(5).src}
                                    alt={getImage(5).alt}
                                    className="w-full h-full object-cover rounded-[6px] shadow-sm hover:shadow-md transition-all duration-300"
                                />
                            </div>
                        </div>

                        {/* Column 5 - Right Medium */}
                        <div className="col-span-1 h-[180px] md:h-[240px] lg:h-[220px] transition-all duration-500 ease-in-out">
                            <img
                                key={getImage(6).src}
                                src={getImage(6).src}
                                alt={getImage(6).alt}
                                className="w-full h-full object-cover rounded-[6px] shadow-sm hover:shadow-md transition-all duration-300"
                            />
                        </div>
                    </div>

                    {/* Navigation Buttons */}
                    <div className="flex items-center justify-center gap-4 mt-12 md:mt-16">
                        <button
                            onClick={handlePrev}
                            className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center text-primary hover:text-white bg-white hover:bg-[#15a067] transition-all duration-300 cursor-pointer group shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <FiArrowLeft className="text-xl group-hover:-translate-x-1 transition-transform" />
                        </button>
                        <button
                            onClick={handleNext}
                            className="w-12 h-12 rounded-full flex items-center justify-center hover:text-white hover:bg-[#15a067] bg-white transition-all duration-300 cursor-pointer group shadow-md shadow-accent/20 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <FiArrowRight className="text-xl group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default RecentGallery;
