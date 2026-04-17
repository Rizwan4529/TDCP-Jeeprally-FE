import React from "react";

const logos = [
  "/assets/images/p1.png",
  "/assets/images/p2.jpg",
  "/assets/images/p3.png",
];

// Create a long enough list for the marquee
const marqueeLogos = [...logos, ...logos, ...logos, ...logos, ...logos, ...logos];

const LogoCard = ({ src }) => (
  <div className="bg-white rounded-md p-6 h-28 w-56 md:h-32 md:w-64 flex items-center justify-center mx-3 md:mx-4 shadow-sm border border-gray-50 flex-shrink-0">
    <img 
      src={src} 
      className="max-h-full max-w-full object-contain transition-all duration-500 hover:scale-110" 
      alt="Partner" 
    />
  </div>
);

const Partners = () => {
  return (
    <section className="py-24 bg-[#F2F7F2] overflow-hidden">
      <div className="container mx-auto px-4 mb-16">
        <h2 className="text-[42px] font-gilda text-black text-center">Our Partners</h2>
      </div>

      <div className="relative flex overflow-hidden">
        {/* First set of logos */}
        <div className="animate-marquee flex whitespace-nowrap">
          {marqueeLogos.map((logo, index) => (
            <LogoCard key={`logo-1-${index}`} src={logo} />
          ))}
        </div>
        
        {/* Second set of logos for seamless loop */}
        <div className="animate-marquee flex whitespace-nowrap">
          {marqueeLogos.map((logo, index) => (
            <LogoCard key={`logo-2-${index}`} src={logo} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Partners;
