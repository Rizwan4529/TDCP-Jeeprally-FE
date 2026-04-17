import React from 'react';
import { MdOutlineTimer, MdOutlineCall } from "react-icons/md";
import { HiOutlineClock } from "react-icons/hi";

const TourCard = ({ tour }) => {
    return (
        <div className="w-full bg-white rounded-[6px] overflow-hidden shadow-lg border border-gray-100 flex flex-col md:flex-row h-full group transition-all duration-300 hover:shadow-2xl">
            {/* Image Section */}
            <div className="relative w-full md:w-52 lg:w-64 h-64 md:h-auto overflow-hidden shrink-0">
                <img
                    src={tour.image}
                    alt={tour.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute top-4 left-4 bg-primary/80 backdrop-blur-sm text-white px-4 py-1.5 rounded-[6px] text-xs font-semibold tracking-wider uppercase">
                    {tour.destination}
                </div>
            </div>

            {/* Content Section */}
            <div className="flex-1 p-6 md:p-8 flex flex-col justify-between">
                <div>
                    <span className="text-gray-500 text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase mb-2 block">
                        {tour.duration}
                    </span>
                    <h3 className="font-poppins text-primary text-[18px] md:text-[20px] mb-4 leading-tight group-hover:text-accent transition-colors">
                        {tour.title}
                    </h3>

                    <div className="space-y-3 mb-6">
                        <div className="flex items-center gap-3 text-gray-600">
                            <MdOutlineTimer className="text-accent text-[16px] md:text-[18px] shrink-0" />
                            <span className="text-xs md:text-sm">Timings: {tour.timings}</span>
                        </div>
                        <div className="flex items-center gap-3 text-gray-600">
                            <MdOutlineCall className="text-accent text-[16px] md:text-[18px] shrink-0" />
                            <span className="text-xs md:text-sm">{tour.contact}</span>
                        </div>
                    </div>

                    <p className="text-gray-500 font-poppins text-[12px] md:text-[14px] leading-relaxed line-clamp-3 mb-6">
                        {tour.description}
                    </p>
                </div>

                <div className="pt-6 border-t border-gray-100 mt-auto">
                    <div className="flex items-center justify-between gap-4">
                        <div>
                            <span className="text-[10px] md:text-xs text-gray-400 font-medium block mb-1 uppercase tracking-wider">Ticket Prices</span>
                            <div className="flex items-baseline gap-2">
                                <span className="text-[10px] md:text-xs text-gray-400 font-semibold">• Per Person</span>
                                <span className="text-primary font-bold text-lg md:text-xl">Rs. {tour.price}</span>
                            </div>
                        </div>
                        <button
                            onClick={() => { }}
                            className="bg-[#15a067] hover:bg-[#0D542B] cursor-pointer shadow-sm text-white text-[12px] md:text-[13px] h-9 px-6 rounded-full transition-all font-medium border-none flex items-center whitespace-nowrap"
                        >
                            Book Now
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TourCard;
