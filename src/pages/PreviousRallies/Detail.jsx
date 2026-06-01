import React, { useMemo } from "react";
import { FiCheck } from "react-icons/fi";
import { useQuery } from "@tanstack/react-query";
import { Navigate, useParams } from "react-router";
import RoughTexture1 from "../../assets/images/rough-patches-1.png";
import RoughTexture2 from "../../assets/images/rough-patches-2.png";
import { fetchPastRallies } from "../../api/features/rally/rally.service.jsx";
import { handleImageError } from "../../utils/constants.js";
import ChampionsSection from "../JeepRally/components/ChampionsSection";
import Partners from "../JeepRally/components/Partners";
import RecentGallery from "../JeepRally/components/RecentGallery";
import {
  findPastRallyById,
  mapPastRallyToDetail,
} from "./previousRallies.utils.js";
import ScrollReveal, {
  HeroReveal,
} from "../../components/common/ScrollReveal.jsx";

const HERO_OVERLAY =
  "bg-[linear-gradient(90deg,rgba(0,0,0,0.62)_0%,rgba(0,0,0,0.28)_43%,rgba(0,0,0,0.1)_100%)]";

const PROMO_OVERLAY =
  "bg-[linear-gradient(180deg,rgba(0,0,0,0.65)_0%,rgba(0,0,0,0.25)_45%,rgba(0,0,0,0.08)_100%)]";

const PreviousRallyDetail = () => {
  const { rallyId } = useParams();
  const {
    data: pastRalliesRaw = [],
    isPending,
    isError,
  } = useQuery({
    queryKey: ["rally", "past"],
    queryFn: fetchPastRallies,
    refetchOnWindowFocus: false,
  });

  const rally = useMemo(
    () => findPastRallyById(pastRalliesRaw, rallyId),
    [pastRalliesRaw, rallyId],
  );

  const detail = useMemo(
    () => (rally ? mapPastRallyToDetail(rally) : null),
    [rally],
  );

  if (isPending) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center bg-white">
        <p className="text-gray-500">Loading rally details…</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center bg-white">
        <p className="text-red-600">
          Could not load rally details. Please try again later.
        </p>
      </div>
    );
  }

  if (!detail) {
    return <Navigate to="/previous" replace />;
  }

  const {
    heroContent,
    summaryCardContent,
    promoBannerContent,
    mainContent,
    championsContent,
    eventId,
  } = detail;

  return (
    <div className="bg-white">
      <HeroReveal>
        <section className="relative mt-[86px] flex min-h-[clamp(320px,45vw,540px)] items-center overflow-hidden max-md:mt-[74px] max-md:min-h-[250px]">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${heroContent.bgImg})` }}
          />
          <div className={`absolute inset-0 ${HERO_OVERLAY}`} />
          <div className="container relative z-[1] w-full">
            <h1 className="m-0 max-w-[700px] whitespace-pre-line font-gilda text-[clamp(2.6rem,5vw,4.6rem)] leading-[0.98] text-white max-md:max-w-[260px] max-md:text-[2.15rem]">
              {heroContent.title}
            </h1>
          </div>
          <div className="absolute -bottom-32 left-0 flex w-full items-center">
            <img
              src={RoughTexture1}
              alt="Jeep Rally"
              className="h-40 w-1/2 object-cover"
            />
            <img
              src={RoughTexture2}
              alt="Jeep Rally"
              className="h-40 w-1/2 object-cover"
            />
          </div>
        </section>
      </HeroReveal>

      <ScrollReveal variant="fadeRight" duration={0.8}>
        <section className="py-[70px] pb-[84px] max-md:py-10 max-md:pb-14">
          <div className="container">
            <div className="grid grid-cols-1 items-start gap-14 lg:grid-cols-[340px_minmax(0,1fr)] lg:gap-[72px] max-md:gap-[34px]">
              <aside className="flex flex-col gap-[26px]">
                <div className="overflow-hidden rounded-lg border border-slate-900/[0.06] bg-white shadow-[0_8px_24px_rgba(15,23,42,0.05)]">
                  <div className="bg-primary px-[22px] py-[17px]">
                    <h2 className="m-0 font-gilda text-[19px] text-white">
                      {summaryCardContent.title}
                    </h2>
                  </div>

                  <div className="py-2">
                    {summaryCardContent.items.map((item) => (
                      <div
                        key={`${item.label}-${item.value}`}
                        className="flex justify-between gap-4 border-b border-[#f0f0f0] px-[22px] py-4 last:border-b-0 max-md:px-4 max-md:py-3.5"
                      >
                        <span className="text-[15px] font-bold text-[#1f1f1f] max-md:text-[13px]">
                          {item.label}
                        </span>
                        <span className="text-right text-[15px] text-[#606060] max-md:text-[13px]">
                          {item.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div
                  className="relative flex min-h-[448px] items-start overflow-hidden rounded-lg bg-cover bg-center bg-no-repeat px-7 pb-[34px] pt-10 max-md:min-h-[250px] max-md:px-5 max-md:pb-6 max-md:pt-7"
                  style={{
                    backgroundImage: `url(${promoBannerContent.image})`,
                  }}
                >
                  <div className={`absolute inset-0 ${PROMO_OVERLAY}`} />
                  <div className="relative z-[1]">
                    <h2 className="m-0 whitespace-pre-line font-gilda text-[28px] leading-[1.12] text-white max-md:text-[22px]">
                      {promoBannerContent.title}
                    </h2>
                  </div>
                </div>
              </aside>

              <div className="flex flex-col">
                <img
                  src={mainContent.image}
                  alt={mainContent.title}
                  className="h-[365px] w-full rounded-lg object-cover shadow-[0_8px_24px_rgba(15,23,42,0.06)] max-md:h-[230px]"
                  onError={handleImageError}
                />

                <h2 className="mb-4 mt-6 font-gilda text-[clamp(2rem,4vw,3.2rem)] leading-[1.06] text-[#141414] max-md:mt-[18px] max-md:text-[2.15rem]">
                  {mainContent.title}
                </h2>
                <p className="mb-[34px] max-w-[900px] text-[15px] leading-[1.8] text-[#676767]">
                  {mainContent.subTitle}
                </p>

                <div>
                  <h3 className="mb-[18px] font-gilda text-[28px] leading-[1.1] text-[#171717] max-md:text-2xl">
                    {mainContent.sectionTitle}
                  </h3>

                  <div className="flex flex-col gap-2.5">
                    {mainContent.paragraphs.map((paragraph) => (
                      <p
                        key={paragraph}
                        className="m-0 text-[15px] leading-[1.85] text-[#5f5f5f]"
                      >
                        {paragraph}
                      </p>
                    ))}
                  </div>

                  <div className="mt-7 grid grid-cols-1 gap-[18px] rounded-lg bg-section p-[30px] max-md:p-6 lg:grid-cols-2">
                    {mainContent.checklist.map((item) => (
                      <div
                        key={item}
                        className="flex items-center gap-3 text-base font-medium text-[#262626] max-md:text-sm"
                      >
                        <span className="inline-flex items-center justify-center text-lg text-primary">
                          <FiCheck />
                        </span>
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>

      <ScrollReveal variant="scaleIn" duration={0.75}>
        <ChampionsSection
          content={championsContent}
          eventId={eventId}
          useApiCategories
          filterCategoriesWithChampions
        />
      </ScrollReveal>

      <ScrollReveal variant="zoomIn" duration={0.8}>
        <RecentGallery />
      </ScrollReveal>

      <ScrollReveal variant="fadeUp" delay={0.08} duration={0.7}>
        <Partners />
      </ScrollReveal>
    </div>
  );
};

export default PreviousRallyDetail;
