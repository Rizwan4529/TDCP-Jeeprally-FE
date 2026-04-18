import React from "react";

const RulesCard = ({ title, bgColor, buttonBg, buttonText, isDark = false }) => (
  <div
    className={`flex-1 min-h-[400px] md:min-h-[450px] rounded-md p-8 md:p-12 flex flex-col items-center justify-center text-center space-y-10 transition-transform duration-500 hover:-translate-y-2`}
    style={{ backgroundColor: bgColor }}
  >
    <h3 className={`text-2xl md:text-3xl font-gilda leading-tight tracking-wide ${isDark ? 'text-white' : 'text-white'}`}>
      {title}
    </h3>

    <button
      className={`px-10 py-3 rounded-full  transition-all duration-300 hover:scale-105 active:scale-95`}
      style={{ backgroundColor: buttonBg, color: isDark ? 'white' : 'black' }}
    >
      Download
    </button>
  </div>
);

const RallyRules = () => {
  return (
    <section className="py-24 bg-[#F5F9F5]">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-16 lg:items-center">

          {/* Left Side: Content */}
          <div className="w-full lg:w-[35%] space-y-8">
            <h2 className="text-[29px] md:text-[42px] font-gilda leading-tight text-black">
              Rally Rules and <br className="hidden md:block" /> Documents
            </h2>
            <p className="para text-gray-500 leading-relaxed max-w-3xl">
              Welcome to the Cholistan Desert Rally 2026 Rules and Documents area.
              All Rally Racers, looking to read the rules for competition or application
              for registration and Rally safety guidelines, then this is the place to get them.
            </p>
          </div>

          {/* Right Side: Simple Square Cards */}
          <div className="w-full lg:w-[65%] flex flex-col md:flex-row gap-6 md:gap-8">
            <RulesCard
              title="CDR 2026, RALLY COMPETITION RULES"
              bgColor="#333333"
              buttonBg="#15a067"
              isDark={true}
            />
            <RulesCard
              title="DIRT BIKE CDR 2026, RALLY COMPETITION RULES"
              bgColor="#15a067"
              buttonBg="#FFFFFF"
              isDark={false}
            />
          </div>

        </div>
      </div>
    </section>
  );
};

export default RallyRules;
