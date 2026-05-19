import React, { useMemo, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { Swiper, SwiperSlide } from "swiper/react";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";
import {
  fetchDestinationsGeneral,
  resolveCheckpointImageUrl,
} from "../../../api/features/rally/rally.service.jsx";

import "swiper/css";

const STATIC_FALLBACK_DESTINATIONS = [
  { id: "static-1", title: "Choilistan", image: "/assets/images/heroimg.png" },
  {
    id: "static-2",
    title: "Rahim Yar Khan",
    image: "/assets/images/journey2.jpg",
  },
  { id: "static-3", title: "Bhawalpur", image: "/assets/images/img1.png" },
  {
    id: "static-4",
    title: "Badshahi Mosque",
    image: "/assets/images/lahore.png",
  },
  {
    id: "static-5",
    title: "Lahore City",
    image: "/assets/images/journey1.jpg",
  },
];

const DestinationCard = ({ title, image }) => (
  <article className="group relative z-0 flex h-full cursor-pointer flex-col hover:z-10">
    <div className="relative h-[380px] w-full overflow-hidden rounded-md shadow-sm transition-all duration-500 ease-in-out group-hover:h-[480px] group-hover:shadow-2xl md:h-[450px] md:group-hover:h-[550px]">
      <img
        src={image}
        alt={title}
        className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
      />
    </div>
    <div className="mt-6 transition-colors duration-300">
      <h3 className="font-gilda text-2xl text-black transition-colors duration-300 group-hover:text-brand-green">
        {title}
      </h3>
    </div>
  </article>
);

const Destinations = ({ content }) => {
  const swiperRef = useRef(null);

  const { data: apiDestinations = [] } = useQuery({
    queryKey: ["destinations", "general"],
    queryFn: fetchDestinationsGeneral,
    refetchOnWindowFocus: false,
  });

  const destinations = useMemo(() => {
    const mapped = (apiDestinations ?? [])
      .map((d, index) => {
        const image = resolveCheckpointImageUrl(d.image);
        if (!image) return null;
        return {
          id: d._id ?? d.id ?? `destination-${index}`,
          title: d.name || "Destination",
          image,
        };
      })
      .filter(Boolean);
    return mapped.length > 0 ? mapped : STATIC_FALLBACK_DESTINATIONS;
  }, [apiDestinations]);

  const showNavigation = destinations.length > 4;

  const handlePrev = () => {
    swiperRef.current?.slidePrev();
  };

  const handleNext = () => {
    swiperRef.current?.slideNext();
  };

  return (
    <section className="bg-section py-section-break">
      <div className="mx-auto w-full max-w-[1600px] px-4 md:px-8">
        <div className="mb-16 flex items-end justify-between">
          <h2 className="font-gilda text-[29px] text-black md:text-[42px]">
            {content?.title || "Rally Destinations"}
          </h2>

          {showNavigation ? (
            <div className="flex shrink-0 gap-4">
              <button
                type="button"
                onClick={handlePrev}
                className="flex h-12 w-12 items-center justify-center rounded-full border border-black/10 bg-white text-black shadow-sm transition-all duration-300 hover:bg-secondary hover:text-black"
                aria-label="Previous destination"
              >
                <FiArrowLeft className="text-xl" aria-hidden />
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-green text-white shadow-md shadow-brand-green/20 transition-all duration-300 hover:bg-brand-green-hover"
                aria-label="Next destination"
              >
                <FiArrowRight className="text-xl" aria-hidden />
              </button>
            </div>
          ) : null}
        </div>

        <div className="overflow-x-hidden overflow-y-visible pb-4">
          <Swiper
            onSwiper={(swiper) => {
              swiperRef.current = swiper;
            }}
            slidesPerView={1}
            slidesPerGroup={1}
            spaceBetween={24}
            speed={650}
            rewind={destinations.length > 1}
            allowTouchMove
            resistanceRatio={0.85}
            longSwipesMs={300}
            breakpoints={{
              640: { slidesPerView: 2, spaceBetween: 20 },
              1024: { slidesPerView: 3, spaceBetween: 24 },
              1280: { slidesPerView: 4, spaceBetween: 24 },
            }}
            className="destinations-carousel !overflow-visible"
          >
            {destinations.map((destination) => (
              <SwiperSlide
                key={destination.id}
                className="!h-auto !overflow-visible"
              >
                <DestinationCard
                  title={destination.title}
                  image={destination.image}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
};

export default Destinations;
