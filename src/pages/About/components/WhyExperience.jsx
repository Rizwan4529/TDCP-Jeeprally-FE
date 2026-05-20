import React, { useMemo } from "react";
import { handleImageError, resolveImageUrl } from "../../../utils/constants.js";
import {
  mapWhyExperienceContent,
  shouldShowWhyExperienceSection,
  WHY_EXPERIENCE_ASSETS,
} from "../whyExperience.utils.js";

function ExperienceFeature({ feature }) {
  const iconSrc = resolveImageUrl(feature.iconUrl, feature.iconFallback);

  return (
    <div className="flex items-start gap-4">
      <div className="flex size-12 shrink-0 items-center justify-center sm:size-14">
        <img
          src={iconSrc}
          alt=""
          className="h-10 w-auto max-w-full object-contain sm:h-11"
          onError={(event) => handleImageError(event, feature.iconFallback)}
          aria-hidden
        />
      </div>
      <div className="min-w-0 pt-0.5">
        <h3 className="mb-2 font-gilda text-xl leading-snug text-[#222] sm:text-[22px]">
          {feature.title}
        </h3>
        <p className="font-manrope text-xs leading-snug text-[#6b6b6b] sm:text-[13px]">
          {feature.description}
        </p>
      </div>
    </div>
  );
}

const WhyExperience = ({ content }) => {
  const section = useMemo(() => mapWhyExperienceContent(content), [content]);
  console.log("section", section);
  const jeepSrc = resolveImageUrl(
    section.jeepImage,
    WHY_EXPERIENCE_ASSETS.jeep,
  );
  const circleSrc = resolveImageUrl(
    section.circleImage,
    WHY_EXPERIENCE_ASSETS.circle,
  );

  if (!shouldShowWhyExperienceSection(content)) {
    return null;
  }

  return (
    <section className="overflow-hidden bg-section py-16 md:py-20 lg:py-24">
      <div className="container mx-auto px-4 md:px-8 lg:px-12">
        <div className="flex flex-col items-center gap-12 lg:flex-row lg:items-center lg:gap-16 xl:gap-24">
          <div className="relative w-full shrink-0 lg:w-[46%] xl:w-[42%]">
            <div className="relative mx-auto aspect-square w-full max-w-[min(100%,520px)]">
              <img
                src={circleSrc}
                alt=""
                className="pointer-events-none absolute left-1/2 top-[52%] w-[92%] max-w-[480px] -translate-x-1/2 -translate-y-1/2 select-none"
                aria-hidden
                draggable={false}
                onError={(event) =>
                  handleImageError(event, WHY_EXPERIENCE_ASSETS.circle)
                }
              />
              <img
                src={jeepSrc}
                alt="TDCP Jeep Rally off-road vehicle"
                className="relative z-10 mx-auto w-[95%] max-w-[813px] object-contain drop-shadow-[0_28px_48px_rgba(0,0,0,0.18)]"
                onError={(event) =>
                  handleImageError(event, WHY_EXPERIENCE_ASSETS.jeep)
                }
                draggable={false}
              />
            </div>
          </div>

          <div className="w-full min-w-0 lg:flex-1">
            <h2 className="font-gilda text-[32px] leading-[1.15] text-black md:text-[40px] lg:text-[42px]">
              {section.title}
            </h2>
            {section.description ? (
              <p className="mt-5 max-w-[520px] font-manrope text-sm leading-relaxed text-[#6b6b6b] md:text-[15px]">
                {section.description}
              </p>
            ) : null}

            <div className="mt-10 grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 sm:gap-y-12 md:mt-12">
              {section.features.map((feature) => (
                <ExperienceFeature key={feature.id} feature={feature} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyExperience;
