import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';

const experiences = [
  {
    id: 1,
    title: "Thrilling Off-Road Experience",
    image: "/assets/images/s1.jpg",
  },
  {
    id: 2,
    title: "Unforgettable Rally Excitement",
    image: "/assets/images/s2.jpg",
  },
  {
    id: 3,
    title: "High-Speed Desert Adventure",
    image: "/assets/images/s3.jpg",
  },
  {
    id: 4,
    title: "Unforgettable Rally Excitement",
    image: "/assets/images/s4.jpg",
  },
  {
    id: 5,
    title: "Thrilling Off-Road Experience",
    image: "/assets/images/s1.jpg",
  },
  {
    id: 6,
    title: "Unforgettable Rally Excitement",
    image: "/assets/images/s2.jpg",
  },
];

const ExperienceSlider = () => {
  return (
    <section className="relative w-full py-0 overflow-hidden group/section">
      <Swiper
        modules={[Navigation]}
        onBeforeInit={(swiper) => {
          swiper.params.navigation.prevEl = "#prev-btn";
          swiper.params.navigation.nextEl = "#next-btn";
        }}
        navigation={true}
        loop={true}
        loopedSlides={2}
        centeredSlides={false}
        allowTouchMove={true}
        breakpoints={{
          320: { slidesPerView: 1 },
          640: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
          1280: { slidesPerView: 4 },
        }}
        className="w-full h-[500px] md:h-[600px] lg:h-[700px]"
      >
        {experiences.map((exp) => (
          <SwiperSlide key={exp.id}>
            <div className="relative w-full h-full overflow-hidden group cursor-pointer border-r border-white/5 last:border-r-0">
              {/* Background Image */}
              <img
                src={exp.image}
                alt={exp.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
              />

              {/* Overlay - Darker on hover */}
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-all duration-500" />

              {/* Content Area */}
              <div className="absolute bottom-0 left-0 right-0 p-8 md:p-10 lg:p-14 transition-all duration-500 bg-transparent group-hover:bg-brand-green">

                <h3 className="text-2xl md:text-3xl lg:text-3xl font-gilda leading-snug text-white max-w-[300px]">
                  {exp.title}
                </h3>

                {exp.subtext && (
                  <p className="font-nanum italic text-lg text-white/90 mt-2">
                    {exp.subtext}
                  </p>
                )}
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom Navigation Buttons - Visible by default, styled like the screenshot */}
      <button
        id="prev-btn"
        className="absolute left-6 top-1/2 -translate-y-1/2 z-40 w-14 h-14 rounded-full bg-white flex items-center justify-center text-black shadow-xl hover:bg-brand-green hover:text-white transition-all duration-300 cursor-pointer"
      >
        <FiArrowLeft className="text-2xl" />
      </button>
      <button
        id="next-btn"
        className="absolute right-6 top-1/2 -translate-y-1/2 z-40 w-14 h-14 rounded-full bg-white flex items-center justify-center text-black shadow-xl hover:bg-brand-green hover:text-white transition-all duration-300 cursor-pointer"
      >
        <FiArrowRight className="text-2xl" />
      </button>

      {/* CSS to hide default swiper buttons if they appear */}
      <style dangerouslySetInnerHTML={{
        __html: `
        .swiper-button-prev, .swiper-button-next { display: none !important; }
      `}} />
    </section>
  );
};

export default ExperienceSlider;
