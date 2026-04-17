import React from 'react';
import { BsCheckCircleFill } from 'react-icons/bs';

const JourneySection = ({ data }) => {
    if (!data) return null;

    return (
        <section className="py-16 md:py-24 bg-[#EFF5F0]">
            <div className="container mx-auto">
                <div className="px-4 lg:px-20 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

                    {/* Left Content */}
                    <div className="relative">
                        <div className="relative inline-block w-full">
                            <h2 className="font-gilda text-primary text-[30px] md:w-full w-[80%] md:text-[42px] mb-6 leading-tight lg:max-w-[450px]">
                                {data.title}
                            </h2>
                            {/* Star Badge */}
                            <div className="absolute right-0 md:right-4 lg:-right-8 top-[-20px] md:top-4 w-28 h-28 md:w-32 md:h-32 flex flex-col items-center justify-center z-10 group">
                                <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full text-[#51B578] fill-current drop-shadow-sm transform transition-transform group-hover:rotate-12 duration-500">
                                    <path d="M50 0 L61 11 L77 7 L82 23 L98 28 L91 43 L100 58 L84 66 L82 82 L66 79 L50 93 L34 79 L18 82 L16 66 L0 58 L9 43 L2 28 L18 23 L23 7 L39 11 Z" />
                                </svg>
                                <div className="relative flex flex-col items-center justify-center text-white text-center transform -rotate-12">
                                    <span className="text-[10px] md:text-xs uppercase font-medium leading-[1]">{data.badge.top}</span>
                                    <span className="text-sm md:text-[18px] font-bold leading-[1.1] mt-1">{data.badge.middle}</span>
                                    <span className="text-sm md:text-[18px] font-bold leading-[1.1]">{data.badge.bottom}</span>
                                </div>
                            </div>
                        </div>

                        <p className="font-poppins text-[14px] text-gray-500 mb-8 md:mb-10 max-w-[450px] leading-relaxed mt-2 md:mt-0">
                            {data.description}
                        </p>

                        <h3 className="text-gray-400 font-semibold mb-6 uppercase tracking-wider text-sm md:text-base">
                            {data.servicesTitle}
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-5 gap-x-6 mb-10">
                            {data.services.map((service, idx) => (
                                <div key={idx} className="flex items-center gap-3">
                                    <BsCheckCircleFill className="text-[#51B578] text-[18px] shrink-0" />
                                    <span className="text-gray-700 font-medium text-[14px] md:text-[15px]">{service}</span>
                                </div>
                            ))}
                        </div>

                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 md:gap-8">
                            <button className="bg-[#15a067] hover:bg-[#0D542B] text-white px-8 py-3.5 rounded-full text-[14px] font-medium transition-colors border-none cursor-pointer">
                                {data.buttonText}
                            </button>
                            <span className="font-bold text-[22px] md:text-[26px] text-[#162C17]">
                                {data.phoneNumber}
                            </span>
                        </div>
                    </div>

                    {/* Right Content - Images */}
                    <div className="relative h-[350px] sm:h-[450px] md:h-[550px] w-full mt-12 lg:mt-0 hidden sm:block">
                        {/* Top Left Image */}
                        <div className="absolute top-0 right-[40%] md:right-[45%] w-[55%] md:w-[60%] h-[50%] rounded-[6px] overflow-hidden border-[6px] border-white shadow-xl transform -rotate-[8deg] z-10 hover:z-40 transition-transform hover:scale-105 duration-300 bg-gray-200">
                            <img src={data.images[0].src} alt={data.images[0].alt} className="w-full h-full object-cover rounded-[6px]" />
                        </div>

                        {/* Center Right Image */}
                        <div className="absolute top-[25%] md:top-[30%] right-0 w-[55%] md:w-[65%] h-[45%] md:h-[50%] rounded-[6px] overflow-hidden border-[6px] border-white shadow-xl transform rotate-[3deg] z-20 hover:z-40 transition-transform hover:scale-105 duration-300 bg-gray-200">
                            <img src={data.images[1].src} alt={data.images[1].alt} className="w-full h-full object-cover rounded-[6px]" />
                        </div>

                        {/* Bottom Left Image */}
                        <div className="absolute bottom-0 right-[35%] md:right-[30%] w-[60%] md:w-[70%] h-[45%] rounded-[6px] overflow-hidden border-[6px] border-white shadow-xl transform -rotate-[5deg] z-30 hover:z-40 transition-transform hover:scale-105 duration-300 bg-gray-200">
                            <img src={data.images[2].src} alt={data.images[2].alt} className="w-full h-full object-cover rounded-[6px]" />
                        </div>
                    </div>
                    {/* Mobile fallback for images */}
                    <div className="flex flex-col gap-4 sm:hidden mt-8">
                        {data.images.map((img, idx) => (
                            <img key={idx} src={img.src} alt={img.alt} className="w-full h-48 object-cover rounded-[6px] border-4 border-white shadow-md" />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default JourneySection;
