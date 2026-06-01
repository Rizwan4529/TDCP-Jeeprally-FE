import React, { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { FiCalendar, FiLock } from "react-icons/fi";
import Button from "../../../components/common/Button";
import RoughTexture1 from "../../../assets/images/rough-patches-1.png";
import RoughTexture2 from "../../../assets/images/rough-patches-2.png";
import { activeRallyQueryOptions } from "../../../api/features/rally/rally.queryOptions.jsx";
import { resolveImageUrl } from "../../../utils/constants.js";
import {
  REGISTRATION_PHASE,
  formatHeroRegistrationDate,
  formatHeroRegistrationDateShort,
  getHeroRegistrationTiming,
} from "./heroRegistration.utils.js";

const TimeTile = ({ value, label }) => (
  <div className="flex min-h-[112px] min-w-[93px] flex-col items-center justify-center rounded-[8px] border border-white/85 bg-white/[0.025] px-3 py-3 text-center md:min-h-[148px] md:min-w-[104px] md:px-4 md:py-4">
    <div className="text-[50px] font-semibold leading-none tracking-[0.04em] text-white">
      {String(value).padStart(2, "0")}
    </div>
    <div className="mt-3 text-[12px] uppercase tracking-[0.08em] text-white/90">
      {label}
    </div>
  </div>
);

function RegistrationPanel({ activeEvent, isLoading }) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const timing = useMemo(
    () => getHeroRegistrationTiming(activeEvent, now),
    [activeEvent, now],
  );

  const isClosed = timing?.phase === REGISTRATION_PHASE.CLOSED;
  const daysRemaining = timing?.timeLeft?.days ?? 0;
  const registrationDisplayDate = timing?.registrationStart;
  const rallyStartDate = timing?.rallyStart;

  if (isLoading) {
    return (
      <div className="relative w-full overflow-hidden rounded-[8px] border border-white/[0.11] bg-[linear-gradient(180deg,rgba(255,255,255,0.11),rgba(255,255,255,0.07))] p-4 text-white font-manrope backdrop-blur-[25px] md:max-w-[483px] md:p-6">
        <div className="space-y-3 animate-pulse">
          <div className="h-3 w-24 rounded bg-white/20" />
          <div className="h-7 w-48 rounded bg-white/25" />
          <div className="h-4 w-full rounded bg-white/15" />
          <div className="mt-6 flex gap-3">
            <div className="h-[112px] flex-1 rounded-[8px] bg-white/10 md:h-[148px]" />
            <div className="h-[112px] flex-1 rounded-[8px] bg-white/10 md:h-[148px]" />
            <div className="h-[112px] flex-1 rounded-[8px] bg-white/10 md:h-[148px]" />
          </div>
        </div>
      </div>
    );
  }
  if (!activeEvent) return null;
  return (
    <div className="relative w-full overflow-hidden rounded-[8px] border border-white/[0.13] bg-[linear-gradient(180deg,rgba(255,255,255,0.22)_0%,rgba(255,255,255,0.06)_35%,transparent_70%)] p-4 text-white font-manrope backdrop-blur-[25px] shadow-[inset_0_1px_14px_rgb(255_255_255_/_22%),inset_0_4px_12px_var(--tw-shadow-color,_rgb(250_252_255_/22%)),inset_0_60px_60px_-48px_var(--tw-shadow-color,_rgba(125,_127,_128,_0.14)),inset_0_-56px_38px_-50px_var(--tw-shadow-color,_rgb(236_225_225_/9%)),inset_0_7px_11px_-4px_var(--tw-shadow-color,_rgba(255,_255,_255,_1))] md:max-w-[483px] md:p-6">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_100%_100%,rgba(142,90,50,0.26),transparent_34%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.10),rgba(255,255,255,0.02))]" />

      <div className="relative z-10 space-y-2 md:space-y-3">
        <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-white/75">
          Registration
        </p>
        <p className="text-[22px] font-normal leading-snug text-white md:text-[24px]">
          <span className="font-semibold">{daysRemaining}</span>{" "}
          {daysRemaining === 1 ? "day" : "days"} remaining
        </p>
        <p className="text-[13px] leading-relaxed text-white/80">
          Registration coming soon
        </p>
        {registrationDisplayDate ? (
          <p className="pt-1 text-[32px] font-semibold tracking-[0.12em] text-white md:text-[36px]">
            {formatHeroRegistrationDateShort(registrationDisplayDate)}
          </p>
        ) : null}

        {isClosed ? (
          <div className="mt-4 space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/[0.08] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-white/90">
              <FiLock className="text-secondary" aria-hidden />
              Registration closed
            </div>

            {rallyStartDate ? (
              <div className="rounded-[10px] border border-secondary/35 bg-[linear-gradient(135deg,rgba(236,202,48,0.14),rgba(255,255,255,0.06))] px-4 py-4 md:px-5 md:py-5">
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-full border border-secondary/40 bg-secondary/15 text-secondary">
                    <FiCalendar className="size-5" aria-hidden />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-white/70">
                      Rally starts on
                    </p>
                    <p className="mt-1 text-[28px] font-semibold leading-tight tracking-[0.02em] text-white md:text-[32px]">
                      {formatHeroRegistrationDate(rallyStartDate)}
                    </p>
                    <p className="mt-1 text-[12px] text-white/65">
                      {formatHeroRegistrationDateShort(rallyStartDate)}
                    </p>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        ) : timing?.timeLeft ? (
          <div className="mt-6 flex items-center justify-between gap-2 md:mt-7 md:gap-4">
            <TimeTile value={timing.timeLeft.hours} label="Hours" />
            <div className="pb-5 text-[34px] font-light leading-none text-white md:pb-7 md:text-[62px]">
              :
            </div>
            <TimeTile value={timing.timeLeft.minutes} label="Minutes" />
            <div className="pb-5 text-[34px] font-light leading-none text-white md:pb-7 md:text-[62px]">
              :
            </div>
            <TimeTile value={timing.timeLeft.seconds} label="Seconds" />
          </div>
        ) : null}
      </div>
    </div>
  );
}

const DEFAULT_HERO_TITLE = (
  <>
    Experience The Thrill
    <br />
    Of Desert Adventure
    <br />
    Like Never Before
  </>
);

const DEFAULT_HERO_SUBTITLE =
  "This text presents my research journey on the topic of Music and Tourism Imaginaries and gives the context which led to the publication of this special issue of Via Tourism Review.";

const Hero = ({ content }) => {
  const {
    data: activeEvent,
    isPending,
    isFetching,
  } = useQuery(activeRallyQueryOptions);
  const heroTitle = content?.title || DEFAULT_HERO_TITLE;
  const heroSubtitle = content?.subTitle || DEFAULT_HERO_SUBTITLE;
  const heroBackgroundImage = resolveImageUrl(
    content?.bgImg,
    "/assets/images/hero_1.jpg",
  );
  const isRegistrationLoading = isPending || (isFetching && !activeEvent);

  return (
    <section className="relative mt-[84px] h-[100vh] w-full overflow-hidden bg-black pt-20 md:mt-[86px] md:h-screen md:pt-0">
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url('${heroBackgroundImage}')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[#151922]/55 via-[#171A20]/28 to-[#8E5A32]/16"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_28%,rgba(246,177,114,0.18),transparent_34%)]"></div>
        <div className="absolute inset-0 bg-black/10"></div>
      </div>

      <div className="relative z-10 flex h-full w-full items-center">
        <div className="mx-auto flex h-full w-full max-w-[1536px] items-center px-4 pb-24 pt-10 md:px-10 md:pb-28 md:pt-14 xl:px-16">
          <div className="grid w-full items-end gap-8 lg:grid-cols-12 lg:items-center xl:gap-10">
            <div className="col-span-12 text-white lg:col-span-6">
              <div className="space-y-5 md:space-y-7">
                <h1 className="font-nanum-myeongjo text-[42px] font-bold capitalize leading-[1.1] tracking-[-0.02em] text-white drop-shadow-[0_10px_24px_rgba(0,0,0,0.38)] sm:text-[52px] md:text-[66px] xl:text-[80px]">
                  {heroTitle}
                </h1>

                <p className="max-w-[520px] text-[13px] leading-[1.8] text-white/82 md:text-[15px]">
                  {heroSubtitle}
                </p>

                <div className="flex flex-wrap gap-3 pt-2 md:gap-4 md:pt-4">
                  <Button
                    variant="solid"
                    className="!min-h-[48px] !rounded-full !border-secondary !bg-secondary !px-7 !py-3 !text-[15px] !font-semibold !text-black shadow-[0_10px_18px_rgba(0,0,0,0.18)] hover:!border-[#ECCA30] hover:!bg-[#ECCA30] hover:!text-black md:!px-9"
                  >
                    Join Us Now
                  </Button>
                  <Button
                    variant="solid-green"
                    className="!min-h-[48px] !rounded-full !border-primary !bg-primary !px-7 !py-3 !text-[15px] !font-semibold text-white shadow-[0_10px_18px_rgba(91,52,17,0.22)] hover:!border-primary-dark hover:!bg-primary-dark md:!px-9"
                  >
                    Explore Events
                  </Button>
                </div>
              </div>
            </div>

            <div className="col-span-12 flex justify-start lg:col-span-6 lg:justify-end">
              <RegistrationPanel
                activeEvent={activeEvent}
                isLoading={isRegistrationLoading}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="absolute -bottom-32 left-0 flex w-full items-center">
        <img
          src={RoughTexture1}
          alt="Jeep Rally"
          className="h-40 w-[50%] object-cover"
        />
        <img
          src={RoughTexture2}
          alt="Jeep Rally"
          className="h-40 w-[50%] object-cover"
        />
      </div>
    </section>
  );
};

export default Hero;
