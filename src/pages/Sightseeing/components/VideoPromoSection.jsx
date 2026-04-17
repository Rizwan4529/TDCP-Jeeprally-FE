import React, { useState } from 'react';
import { FaPlay } from 'react-icons/fa';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay, EffectFade } from 'swiper/modules';

const VideoPromoSection = ({ data }) => {
    const [activeIndex, setActiveIndex] = useState(0);

    if (!data || !data.videos) return null;

    return (
        <section className="relative w-full bg-white overflow-hidden">
            {/* Background Layer(s) - Synced with Slider */}
            <div className="absolute top-0 left-0 w-full h-[65%] md:h-[70%] bg-gray-900 overflow-hidden">
                {data.videos.map((video, idx) => (
                    <div
                        key={idx}
                        className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000 ${activeIndex === idx ? 'opacity-60' : 'opacity-0'}`}
                        style={{ backgroundImage: `url('${video.backgroundImage}')` }}
                    ></div>
                ))}
                <div className="absolute inset-0 bg-black/20"></div>
            </div>

            <div className="container mx-auto px-4 lg:px-20 relative z-10 flex flex-col items-center pt-16 md:pt-24 pb-4 md:pb-6">
                {/* Header Text */}
                <div className="text-center mb-10 md:mb-16">
                    <h2 className="font-gilda text-white text-[30px] md:text-[42px] leading-tight mb-2 drop-shadow-lg font-medium">
                        {data.title.includes('<br />') ? (
                            <span dangerouslySetInnerHTML={{ __html: data.title }} />
                        ) : (
                            data.title.split('\n').map((line, i) => (
                                <React.Fragment key={i}>
                                    {line}
                                    {i < data.title.split('\n').length - 1 && <br />}
                                </React.Fragment>
                            ))
                        )}
                    </h2>
                    <p className="font-poppins text-white/95 text-[12px] md:text-[14px] max-w-2xl mx-auto drop-shadow-md font-normal uppercase tracking-wider">
                        {data.subtitle}
                    </p>
                </div>

                {/* Video Slider Container */}
                <div className="w-full max-w-[1100px] video-promo-swiper">
                    <Swiper
                        modules={[Pagination, Autoplay]}
                        pagination={{ clickable: true }}
                        autoplay={{ delay: 5000, disableOnInteraction: false }}
                        loop={true}
                        onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
                        className="overflow-visible"
                    >
                        {data.videos.map((video, idx) => (
                            <SwiperSlide key={idx} className="pb-1">
                                <div className="relative aspect-video rounded-[6px] overflow-hidden group cursor-pointer shadow-2xl">
                                    {/* Video Thumbnail */}
                                    <img
                                        src={video.thumbnailImage}
                                        alt={video.videoAlt}
                                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                                    />
                                    {/* Subtle Overlay on Video */}
                                    <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors duration-500"></div>

                                    {/* Play Button */}
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="w-14 h-14 md:w-20 md:h-20 bg-white rounded-full flex items-center justify-center shadow-2xl transform transition-all duration-300 group-hover:scale-110">
                                            <FaPlay className="text-[#1a1a1a]/80 text-lg md:text-2xl ml-1" />
                                        </div>
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </div>

            <style jsx global>{`
                .video-promo-swiper .swiper-pagination-bullet {
                    background: #15a067;
                    opacity: 0.3;
                    width: 10px;
                    height: 10px;
                    transition: all 0.3s ease;
                }
                .video-promo-swiper .swiper-pagination-bullet-active {
                    background: #15a067;
                    opacity: 1;
                    width: 25px;
                    border-radius: 5px;
                }
                .video-promo-swiper .swiper-pagination {
                    bottom: 0px !important;
                }
            `}</style>
        </section>
    );
};

export default VideoPromoSection;
