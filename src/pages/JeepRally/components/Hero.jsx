import React from "react";
import Button from "../../../components/common/Button";

const Hero = () => {
  return (
    <section className="mt-[80px] relative w-full h-[90vh] md:h-screen bg-black overflow-hidden">
      {/* Background Layer */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: "url('/assets/images/hero_1.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent"></div>
        <div className="absolute inset-0 bg-black/30"></div>
      </div>

      {/* Main Content Wrapper */}
      <div className="relative z-10 w-full h-full flex items-center">
        <div className="w-full max-w-[1536px] mx-auto px-4 md:px-20">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-20">

            {/* Left Column: Text Content */}
            <div className="w-full lg:w-3/5 text-white">
              <div className="space-y-6 md:space-y-8">
                <h1 className="hero-heading !leading-[1.1] drop-shadow-2xl">
                  Experience The Thrill <br className="hidden md:block" />
                  Of Desert Adventure <br className="hidden md:block" />
                  Like Never Before
                </h1>

                <p className="para max-w-[550px] text-white/90 !text-[14px] md:!text-[14px] leading-relaxed">
                  Join thousands of racing enthusiasts for the ultimate desert off-road 
                  experience. The 21st Cholistan Desert Rally brings together professional 
                  drivers and thrill-seekers for an unforgettable adventure.
                </p>

                <div className="flex flex-wrap gap-4 md:gap-6 pt-4">
                  <Button
                    variant="ghost"
                    className="!px-8 md:!px-12 !py-3 md:!py-3 !rounded-md border-2 border-white text-white hover:bg-white hover:text-black transition-all duration-300 font-bold text-[16px]"
                  >
                    Join Us Now
                  </Button>
                  <Button
                    variant="solid-green"
                    className="!px-8 md:!px-12 !py-3 md:!py-3 !rounded-md font-bold text-[16px]"
                  >
                    Explore Events
                  </Button>
                </div>
              </div>
            </div>

            {/* Right Column: Image Card */}
            <div className="hidden lg:flex justify-end">
              <div className="group relative max-w-[280px] xl:max-w-[320px] transform hover:-translate-y-4 transition-all duration-700">
                <div className="relative h-48 xl:h-56 overflow-hidden rounded-sm">
                  <img
                    src="/assets/images/hero_small_1.jpg"
                    alt="Professional Drivers"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                  />
                </div>
                <div className="text-white mt-4">
                  <h3 className="text-xl xl:text-2xl font-gilda mb-2">Professional Drivers</h3>
                  <p className="text-[13px] xl:text-[14px] font-sans opacity-90 leading-relaxed font-light">
                    Experience the thrill with the most skilled rally drivers in the region.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
