import React, { useEffect, useState } from "react";
import Button from "../../../components/common/Button";
import RoughTexture1 from "../../../assets/images/rough-patches-1.png";
import RoughTexture2 from "../../../assets/images/rough-patches-2.png";

const HERO_TARGET_DATE = new Date("2027-01-14T00:00:00");

const getTimeLeft = () => {
  const now = new Date();
  const difference = HERO_TARGET_DATE.getTime() - now.getTime();

  if (difference <= 0) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    };
  }

  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / (1000 * 60)) % 60),
    seconds: Math.floor((difference / 1000) % 60),
  };
};

const TimeTile = ({ value, label }) => (
  <div className="flex min-h-[112px] min-w-[93px] flex-col items-center justify-center rounded-[8px] border border-white/85 bg-white/[0.025] px-3 py-3 text-center  md:min-h-[148px] md:min-w-[104px] md:px-4 md:py-4">
    <div className="text-[50px] font-semibold leading-none tracking-[0.04em] text-white">
      {String(value).padStart(2, "0")}
    </div>
    <div className="mt-3 text-[12px] uppercase tracking-[0.08em] text-white/90 ">
      {label}
    </div>
  </div>
);

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
  const [timeLeft, setTimeLeft] = useState(getTimeLeft());
  const heroTitle = content?.title || DEFAULT_HERO_TITLE;
  const heroSubtitle = content?.subTitle || DEFAULT_HERO_SUBTITLE;
  const heroBackgroundImage = content?.bgImg || "/assets/images/hero_1.jpg";

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(getTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative mt-[84px] pt-20 md:pt-0 md:mt-[86px] h-[100vh] md:h-screen w-full bg-black overflow-hidden">
      {/* Background Layer */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url('${heroBackgroundImage}')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[#151922]/88 via-[#171A20]/44 to-[#8E5A32]/28"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_28%,rgba(246,177,114,0.30),transparent_34%)]"></div>
        <div className="absolute inset-0 bg-black/24"></div>
      </div>

      {/* Main Content Wrapper */}
      <div className="relative z-10 flex h-full w-full items-center">
        <div className="mx-auto flex h-full w-full max-w-[1536px] items-center px-4 pb-24 pt-10 md:px-10 md:pb-28 md:pt-14 xl:px-16">
          <div className="grid w-full items-end gap-8 lg:grid-cols-12 lg:items-center xl:gap-10">
            <div className="col-span-12 lg:col-span-7 text-white">
              <div className="space-y-5 md:space-y-7">
                <h1 className="font-gilda text-[42px] leading-[0.92] tracking-[-0.03em] text-white drop-shadow-[0_10px_24px_rgba(0,0,0,0.38)] sm:text-[52px] md:text-[66px] xl:text-[78px]">
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

            <div className="col-span-12 flex justify-start lg:col-span-5 lg:justify-end">
              <div className="relative w-full  overflow-hidden rounded-[8px] border border-white/[0.11] bg-[linear-gradient(180deg,rgba(255,255,255,0.11),rgba(255,255,255,0.07))] p-4 text-white font-manrope backdrop-blur-[25px] shadow-[inset_0_1px_40px_rgba(36,36,37,0.20),inset_0_4px_18px_rgba(62,63,64,0.30),inset_0_98px_100px_-48px_rgba(125,127,128,0.30),inset_0_-82px_68px_-64px_rgba(98,98,98,0.30),inset_0_7px_11px_-4px_rgba(255,255,255,1),inset_0_39px_56px_-36px_rgba(255,255,255,0.50)] md:max-w-[483px] md:p-6">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_100%_100%,rgba(142,90,50,0.26),transparent_34%)]" />
                <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.10),rgba(255,255,255,0.02))]" />

                <div className="relative z-10 space-y-3 md:space-y-4">
                  <p className="text-[24px] font-normal leading-none text-white">
                    Days Remain: {timeLeft.days}
                  </p>
                  <p className="text-[36px] font-semibold tracking-[0.12em] text-white ">
                    01/14/2027
                  </p>
                </div>

                <div className="relative z-10 mt-6 flex items-center justify-between gap-2 md:mt-7 md:gap-4">
                  <TimeTile value={timeLeft.hours} label="Hours" />
                  <div className="pb-5 text-[34px] font-light leading-none text-white md:pb-7 md:text-[62px]">
                    :
                  </div>
                  <TimeTile value={timeLeft.minutes} label="Minutes" />
                  <div className="pb-5 text-[34px] font-light leading-none text-white md:pb-7 md:text-[62px]">
                    :
                  </div>
                  <TimeTile value={timeLeft.seconds} label="Seconds" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute -bottom-32 left-0 w-full flex items-center">
        <img
          src={RoughTexture1}
          alt="Jeep Rally"
          className="w-[50%] h-40 object-cover"
        />
        <img
          src={RoughTexture2}
          alt="Jeep Rally"
          className="w-[50%] h-40 object-cover"
        />
      </div>
    </section>
  );
};

export default Hero;
