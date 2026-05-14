import React from "react";
import jeepPersonalProfile from "../../../assets/images/jeep-perosnal-profile.png";
import jeepPersonalProfileBg from "../../../assets/images/jeep-personal-profile-bg.png";

const specs = {
  left: [
    { label: "Model", value: "450 RALLY", top: 30, angle: 8, left: 60 },
    {
      label: "Engine",
      value: "MONOCILINDRICO DE 449.5cc",
      top: 122,
      angle: 4,
      left: 10,
    },
    {
      label: "Frame",
      value: "ACERO CROMO MOLIBDENO",
      top: 214,
      angle: 0,
      left: 5,
    },
    { label: "Power", value: "45", top: 350, angle: -10, left: 46 },
  ],
  right: [
    { label: "Weight", value: "140", top: 30, angle: -8, right: 60 },
    { label: "Length", value: "220", top: 122, angle: 0, right: 12 },
    { label: "Tank capacity", value: "35", top: 214, angle: 0 },
    { label: "Class", value: "Rally GP", top: 350, angle: 10, right: 46 },
  ],
};

const Callout = ({ label, value, angle = 0, reverse = false }) => (
  <div
    className={`flex items-center gap-4 ${reverse ? "flex-row-reverse text-right" : ""}`}
  >
    <div
      className={`flex items-center justify-center ${reverse ? "flex-row-reverse text-right" : ""}`}
    >
      <div
        className="w-40 h-[2px] flex-1 z-10 bg-primary"
        style={{
          transform: `rotate(${angle}deg)`,
          transformOrigin: reverse ? "left center" : "right center",
        }}
      />
      <div className="flex h-6 w-6 items-center justify-center rounded-full border border-primary bg-white">
        <div className="h-2.5 w-2.5 rounded-full bg-primary" />
      </div>
    </div>
    <div className="w-[128px] shrink-0">
      <h4 className="font-gilda text-[18px] leading-none text-black">
        {label}
      </h4>
      <p className="mt-1 text-[12px] uppercase tracking-[0.02em] text-[#676767]">
        {value}
      </p>
    </div>
  </div>
);

const GearUpSection = () => {
  return (
    <section className="bg-section py-16 md:py-20 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="mx-auto flex max-w-6xl flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <h2 className="max-w-[360px] font-gilda text-[34px] leading-[1.05] text-black md:text-[40px]">
            Gear Up For Cholistan Challenge
          </h2>
          <p className="max-w-[420px] text-[15px] leading-[1.5] text-[#606060]">
            Cholistan Desert Rally started back in 2005 and has since grown in
            leaps and bounds. The upcoming rally will mark this event&apos;s
            21st edition which reflects its ever-increasing popularity.
          </p>
        </div>

        <div className="mx-auto mt-10 max-w-6xl">
          <div className="relative mx-auto hidden h-[430px] w-[1100px] lg:block">
            <div className="absolute left-0 top-0 h-full w-[335px]">
              {specs.left.map((spec) => (
                <div
                  key={spec.label}
                  className="absolute left-0 w-full"
                  style={{ top: `${spec.top}px`, left: `${spec?.left ?? 0}px` }}
                >
                  <Callout
                    label={spec.label}
                    value={spec.value}
                    angle={spec.angle}
                    reverse={true}
                  />
                </div>
              ))}
            </div>

            <div className="absolute left-1/2 top-1/2 flex h-[430px] w-[430px] -translate-x-1/2 -translate-y-1/2 items-center justify-center">
              <div className="absolute inset-0 rounded-full border-2 border-primary/90" />
              <div className="relative z-10 flex h-[320px] w-[320px] items-center justify-center">
                <img
                  src={jeepPersonalProfileBg}
                  alt=""
                  aria-hidden="true"
                  className="absolute inset-0 h-full w-full object-contain"
                />
                <img
                  src={jeepPersonalProfile}
                  alt="Jeep profile"
                  className="relative z-10 h-[220px] w-[300px] object-contain drop-shadow-[0_20px_28px_rgba(0,0,0,0.18)]"
                />
              </div>
            </div>

            <div className="absolute right-0 top-0 h-full w-[335px]">
              {specs.right.map((spec) => (
                <div
                  key={spec.label}
                  className="absolute right-0 w-full"
                  style={{
                    top: `${spec.top}px`,
                    right: `${spec?.right ?? 0}px`,
                  }}
                >
                  <Callout
                    label={spec.label}
                    value={spec.value}
                    angle={spec.angle}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-5 lg:hidden">
            <div className="mx-auto flex h-[280px] w-[280px] items-center justify-center rounded-full border-2 border-primary bg-[#FDEEE8] p-10">
              <div className="relative flex h-[220px] w-[220px] items-center justify-center">
                <img
                  src={jeepPersonalProfileBg}
                  alt=""
                  aria-hidden="true"
                  className="absolute inset-0 h-full w-full object-contain"
                />
                <img
                  src={jeepPersonalProfile}
                  alt="Jeep profile"
                  className="relative z-10 h-[140px] w-[180px] object-contain drop-shadow-[0_14px_22px_rgba(0,0,0,0.16)]"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[...specs.left, ...specs.right].map((spec) => (
                <div
                  key={spec.label}
                  className="rounded-[6px] border border-primary/10 bg-white/70 px-4 py-3 text-center"
                >
                  <h4 className="font-gilda text-[18px] text-black">
                    {spec.label}
                  </h4>
                  <p className="mt-1 text-[11px] uppercase text-[#676767]">
                    {spec.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GearUpSection;
