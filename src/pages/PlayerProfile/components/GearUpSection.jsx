import React from 'react';

const specs = {
  left: [
    { label: 'Model', value: '450 RALLY', top: '20%', left: "10%" },
    { label: 'Engine', value: 'MONOCILINDRICO DE 449.5cc', top: '41%', left: "-25%" },
    { label: 'Frame', value: 'ACERO CROMO MOLIBDENO', top: '62%', left: "-20%" },
    { label: 'Power', value: '82', top: '79%', left: "32%" },
  ],
  right: [
    { label: 'Weight', value: '140', top: '20%', left: "45%" },
    { label: 'Length', value: '220', top: '39%', left: "66%" },
    { label: 'Tank capacity', value: '35', top: '58%', left: "65%" },
    { label: 'Class', value: 'Rally GP', top: '75%', left: "30%" },
  ]
};

const GearUpSection = () => {
  return (
    <section className="py-20 bg-[#F2F7F2] overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start mb-16 gap-8 max-w-6xl mx-auto">
          <h2 className="font-gilda text-[36px] md:text-[42px] text-primary leading-tight max-w-[500px]">
            Gear Up For Cholistan Challenge
          </h2>
          <p className="para text-gray-500 max-w-[500px] text-sm md:text-base">
            Cholistan Desert Rally started back in 2005 and has since grown in
            leaps and bounds. The upcoming rally will mark this event's 21st edition
            which reflects its ever-increasing popularity.
          </p>
        </div>

        {/* Infographic Container */}
        <div className="relative max-w-5xl mx-auto min-h-[500px] md:min-h-[650px] flex items-center justify-center">

          {/* Background Circles & Skeleton */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-[300px] h-[300px] md:w-[500px] md:h-[500px] border border-brand-green/20 rounded-full animate-pulse"></div>
            <div className="absolute w-[200px] h-[200px] md:w-[350px] md:h-[350px] bg-brand-green/5 rounded-full"></div>
            <img
              src="/assets/images/skeleton.png"
              alt="Skeleton"
              className="absolute w-[90%] md:w-[80%] opacity-40 mix-blend-multiply pointer-events-none select-none"
            />
          </div>

          {/* Central Car Image */}
          <div className="relative z-10 w-[30%] md:w-[200px] lg:w-[350px] transition-transform duration-700 hover:scale-105">
            <img
              src="/assets/images/redcar.png"
              alt="Rally Car"
              className="w-full h-auto drop-shadow-2xl"
            />
          </div>

          {/* Left Callouts (Desktop) */}
          <div className="hidden lg:block absolute left-0 h-full w-1/3">
            {specs.left.map((spec, idx) => (
              <div
                key={idx}
                className="absolute right-0 flex items-center gap-4 transition-all duration-500 hover:translate-x-[-10px]"
                style={{ top: spec.top, left: spec.left }}
              >
                <div className="text-right">
                  <h4 className="font-gilda text-xl text-black">{spec.label}</h4>
                  <p className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">
                    {spec.value}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Right Callouts (Desktop) */}
          <div className="hidden lg:block absolute right-0 h-full w-1/4">
            {specs.right.map((spec, idx) => (
              <div
                key={idx}
                className="absolute left-0 flex items-center gap-4 transition-all duration-500 hover:translate-x-[10px]"
                style={{ top: spec.top, left: spec.left }}
              >
                <div className="text-left">
                  <h4 className="font-gilda text-lg text-primary">{spec.label}</h4>
                  <p className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">
                    {spec.value}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:hidden mt-20 grid grid-cols-2 gap-8 w-full">
            {[...specs.left, ...specs.right].map((spec, idx) => (
              <div key={idx} className="text-center p-4 bg-white/50 rounded-sm border border-brand-green/10">
                <h4 className="font-gilda text-lg text-primary">{spec.label}</h4>
                <p className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">
                  {spec.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default GearUpSection;
