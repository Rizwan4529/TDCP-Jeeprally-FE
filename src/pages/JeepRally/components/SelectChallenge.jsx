import React, { useEffect, useMemo, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import AnimatedButton from "../../../components/common/AnimatedButton";
import { activeRallyQueryOptions } from "../../../api/features/rally/rally.queryOptions.jsx";
import {
  fetchRallyChallenges,
  resolveCheckpointImageUrl,
} from "../../../api/features/rally/rally.service.jsx";
import {
  chunkSelectChallenges,
  getSelectChallengeColumns,
  shouldShowSelectChallengeCarouselControls,
} from "./selectChallenge.utils.js";
import "swiper/css";
import "swiper/css/navigation";

const STATIC_FALLBACK_CHALLENGES = [
  {
    _id: "static-dirt-bike",
    title: "Dirt Bike Race",
    description:
      "Navigate extreme terrains with our professional dirt bike track designed for maximum adrenaline and speed.",
    image: "/assets/images/jeep_4_1.jpg",
    ctaText: "View Details",
  },
  {
    _id: "static-toronto-motorcycle",
    title: "Toronto Motorcycle",
    description:
      "Experience the urban-to-wild transition with our unique motorcycle challenge across varied landscapes.",
    image: "/assets/images/jeep_4_3.jpg",
    ctaText: "View Details",
  },
  {
    _id: "static-cholistan-desert-rally",
    title: "Cholistan Desert Rally",
    description:
      "The ultimate challenge across the vast dunes of Cholistan. A test of endurance, skill, and sheer willpower.",
    image: "/assets/images/jeep_4_2.png",
    ctaText: "View Details",
  },
];

const ChallengeCard = ({
  title,
  description,
  image,
  ctaText = "View Details",
  isLarge = false,
  className = "",
}) => (
  <div className={`bg-white rounded-md p-3 shadow-lg shadow-gray-200/50 border border-gray-50 flex ${isLarge ? 'flex-col h-full' : 'flex-col sm:flex-row flex-1'} gap-6 group hover:shadow-xl transition-all duration-500 ${className}`}>
    <div className={`${isLarge ? 'w-full h-72 lg:h-[400px]' : 'w-full sm:w-52 h-48 sm:h-auto'} overflow-hidden rounded-md flex-shrink-0`}>
      <img
        src={image}
        alt={title}
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
      />
    </div>
    <div className="flex-1 flex flex-col justify-between pt-2">
      <div className="space-y-4">
        <h3 className="text-2xl font-gilda text-black">{title}</h3>
        <p className="para text-gray-500 line-clamp-3">
          {description}
        </p>
      </div>
      <div className="pt-4">
        <AnimatedButton text={ctaText} />
      </div>
    </div>
  </div>
);

function getFallbackChallenges(content) {
  const contentChallenges = (content?.items ?? []).map((item, index) => ({
    _id: item?._id ?? item?.id ?? `content-challenge-${index}`,
    title: item?.title || "Challenge",
    description: item?.subTitle || item?.description || "",
    image: item?.image || STATIC_FALLBACK_CHALLENGES[index]?.image || null,
    ctaText: item?.ctaText || "View Details",
  }));

  return contentChallenges.length > 0
    ? contentChallenges
    : STATIC_FALLBACK_CHALLENGES;
}

function ChallengeSlide({ challenges }) {
  const { smallCards, largeCard } = getSelectChallengeColumns(challenges);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto items-stretch">
      <div className="flex flex-col gap-8 h-full">
        {smallCards.map((challenge) => (
          <ChallengeCard
            key={challenge._id}
            title={challenge.title}
            description={challenge.description}
            image={challenge.image}
            ctaText={challenge.ctaText}
          />
        ))}
      </div>

      {largeCard ? (
        <div className="h-full">
          <ChallengeCard
            key={largeCard._id}
            isLarge={true}
            title={largeCard.title}
            description={largeCard.description}
            image={largeCard.image}
            ctaText={largeCard.ctaText}
          />
        </div>
      ) : null}
    </div>
  );
}

const SelectChallenge = ({ content }) => {
  const swiperRef = useRef(null);
  const prevButtonRef = useRef(null);
  const nextButtonRef = useRef(null);
  const { data: activeEvent } = useQuery(activeRallyQueryOptions);
  const eventId = activeEvent?._id;

  const { data: challengesRaw = [] } = useQuery({
    queryKey: ["rally", "challenges", eventId],
    queryFn: () => fetchRallyChallenges(eventId),
    enabled: Boolean(eventId),
    refetchOnWindowFocus: false,
    retry: 1,
  });

  const challenges = useMemo(() => {
    const fallbackChallenges = getFallbackChallenges(content);

    if (!Array.isArray(challengesRaw) || challengesRaw.length === 0) {
      return fallbackChallenges;
    }

    return challengesRaw.map((challenge, index) => {
      const fallbackMatch =
        fallbackChallenges.find((item) => item.title === challenge.title) ||
        fallbackChallenges[index] ||
        fallbackChallenges[fallbackChallenges.length - 1];

      return {
        _id: challenge._id,
        title: challenge.title || fallbackMatch?.title || "Challenge",
        description: challenge.description || fallbackMatch?.description || "",
        image:
          resolveCheckpointImageUrl(challenge.image) || fallbackMatch?.image || null,
        ctaText: fallbackMatch?.ctaText || "View Details",
      };
    });
  }, [challengesRaw, content]);

  const challengeSlides = useMemo(
    () => chunkSelectChallenges(challenges),
    [challenges]
  );
  const canNavigate = shouldShowSelectChallengeCarouselControls(challenges);

  useEffect(() => {
    const swiper = swiperRef.current;
    if (
      !swiper ||
      !canNavigate ||
      !prevButtonRef.current ||
      !nextButtonRef.current
    ) {
      return;
    }

    swiper.params.navigation.prevEl = prevButtonRef.current;
    swiper.params.navigation.nextEl = nextButtonRef.current;

    if (swiper.navigation) {
      swiper.navigation.destroy();
      swiper.navigation.init();
      swiper.navigation.update();
    }

    swiper.update();
  }, [canNavigate, challengeSlides.length]);

  return (
    <section className="py-10 bg-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-4 mb-10">
          <h2 className="text-[29px] md:text-[42px] font-gilda text-black">{content?.title || "Select Your Challenge"}</h2>
          <p className="para text-gray-500">
            {content?.subTitle || "Get a closer look at the terrain, distance, and key checkpoints of the race."}
          </p>
        </div>

        {!canNavigate ? (
          <ChallengeSlide challenges={challengeSlides[0] ?? []} />
        ) : (
          <div className="relative">
            <Swiper
              key={`${challengeSlides.length}-challenge-nav`}
              modules={[Navigation]}
              onSwiper={(swiper) => {
                swiperRef.current = swiper;
              }}
              navigation={
                canNavigate
                  ? {
                      prevEl: prevButtonRef.current,
                      nextEl: nextButtonRef.current,
                    }
                  : false
              }
              loop={canNavigate}
              loopedSlides={Math.min(challengeSlides.length, 2)}
              allowTouchMove={canNavigate}
              className="w-full"
            >
              {challengeSlides.map((slideChallenges, slideIndex) => (
                <SwiperSlide key={`challenge-slide-${slideIndex}`}>
                  <ChallengeSlide challenges={slideChallenges} />
                </SwiperSlide>
              ))}
            </Swiper>

            <button
              ref={prevButtonRef}
              type="button"
              aria-label="Show previous challenges"
              className="absolute -left-20 top-1/2 z-40 flex h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full bg-white text-black shadow-xl transition-all duration-300 hover:bg-brand-green hover:text-white"
            >
              <FiArrowLeft className="text-2xl" />
            </button>
            <button
              ref={nextButtonRef}
              type="button"
              aria-label="Show next challenges"
              className="absolute -right-20 top-1/2 z-40 flex h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full bg-white text-black shadow-xl transition-all duration-300 hover:bg-brand-green hover:text-white"
            >
              <FiArrowRight className="text-2xl" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default SelectChallenge;
