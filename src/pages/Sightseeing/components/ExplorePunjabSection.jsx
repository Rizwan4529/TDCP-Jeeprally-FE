import React from 'react';
import { BsCheckCircleFill } from 'react-icons/bs';
import { FaDollarSign, FaFacebookF, FaInstagram, FaXTwitter, FaLinkedinIn } from 'react-icons/fa6';

const iconMap = {
    FaFacebookF: <FaFacebookF />,
    FaInstagram: <FaInstagram />,
    FaXTwitter: <FaXTwitter />,
    FaLinkedinIn: <FaLinkedinIn />
};

const ExplorePunjabSection = ({ data }) => {
    if (!data) return null;

    return (
        <section className="py-16 md:py-24 bg-white overflow-hidden relative">
            <div className="container mx-auto">
                <div className="lg:px-20 px-4 flex flex-col lg:flex-row items-center lg:items-center gap-12 lg:gap-14">

                    {/* Left Column - Overlapping Images (Aligned with Logo) */}
                    <div className="w-full lg:w-[35%] relative min-h-[450px] md:min-h-[500px] flex items-center">
                        {/* Red Bus Image (Background) */}
                        <div className="absolute top-0 left-20 w-[90%] h-[90%] rounded-[6px] overflow-hidden shadow-lg z-10 transition-transform duration-700 hover:scale-[1.01]">
                            <img
                                src={data.images[0].src}
                                alt={data.images[0].alt}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        {/* House Image (Foreground) */}
                        <div className="absolute bottom-[0%] left-0 w-[65%] h-[40%] border-4 border-white rounded-[6px] overflow-hidden shadow-2xl z-20 transition-all duration-700 hover:scale-[1.02]">
                            <img
                                src={data.images[1].src}
                                alt={data.images[1].alt}
                                className="w-full h-full object-cover shadow-inner"
                            />
                        </div>
                    </div>

                    {/* Center Column - Text Content */}
                    <div className="w-full lg:w-[33%] flex flex-col items-center text-center lg:items-start lg:text-left justify-center">
                        <h2 className="font-gilda text-primary text-[30px] md:text-[42px] mb-4 leading-[1.1]">
                            {data.title}
                        </h2>

                        <p className="font-poppins text-[14px] text-gray-500 mb-10 leading-relaxed max-w-[400px]">
                            {data.description}
                        </p>

                        <div className="space-y-8 mb-10 text-left">
                            {/* Contact Info Block */}
                            <div className="flex items-start gap-5 group">
                                <div className="w-[50px] h-[50px] shrink-0 rounded-full bg-[#EBF5ED] flex items-center justify-center transition-transform duration-300 group-hover:scale-110 shadow-sm border-[6px] border-[#F4FAF5]">
                                    <BsCheckCircleFill className="text-[#51B578] text-xl" />
                                </div>
                                <div className="flex flex-col">
                                    <h4 className="font-gilda text-primary text-[22px] mb-1 leading-tight">Contact Us</h4>
                                    <p className="font-poppins text-gray-500 text-[14px]">{data.contactInfo.phone}</p>
                                    <p className="font-poppins text-gray-500 text-[14px]">Email: {data.contactInfo.email}</p>
                                </div>
                            </div>

                            {/* Office Info Block */}
                            <div className="flex items-start gap-5 group">
                                <div className="w-[50px] h-[50px] shrink-0 rounded-full bg-[#EBF5ED] flex items-center justify-center transition-transform duration-300 group-hover:scale-110 shadow-sm border-[6px] border-[#F4FAF5]">
                                    <FaDollarSign className="text-[#51B578] text-xl" />
                                </div>
                                <div className="flex flex-col">
                                    <h4 className="font-gilda text-primary text-[22px] mb-1 leading-tight">Office Address</h4>
                                    <p className="font-poppins text-gray-500 text-[14px] leading-relaxed max-w-[240px]">
                                        {data.officeInfo.address}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Social Icons */}
                        <div className="flex items-center justify-center lg:justify-start gap-3">
                            {data.socialLinks.map((social, i) => (
                                <a
                                    key={i}
                                    href={social.link}
                                    className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-gray-400 hover:bg-[#15a067] hover:text-white hover:border-primary transition-all duration-300"
                                >
                                    <span className="text-[13px]">{iconMap[social.icon]}</span>
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Right Column - Traveler Image */}
                    <div className="w-full lg:w-[32%] relative h-[300px] md:h-[350px] mt-16 lg:mt-0">
                        {/* Decorative Circle Background */}
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[220px] md:w-[300px] lg:w-[340px] aspect-square bg-[#EFF4EF] rounded-full z-0">
                        </div>

                        {/* Traveler Boy Image */}
                        <img
                            src={data.bottomImage.src}
                            alt={data.bottomImage.alt}
                            className="absolute z-10 bottom-3 left-1/2 -translate-x-1/2 scale-[1.8] md:scale-[2.1] origin-bottom object-contain"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ExplorePunjabSection;
