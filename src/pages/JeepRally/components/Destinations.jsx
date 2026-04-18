import React, { useState, useEffect } from "react";

const destinations = [
  { title: "Choilistan", image: "/assets/images/heroimg.png" },
  { title: "Rahim Yar Khan", image: "/assets/images/journey2.jpg" },
  { title: "Bhawalpur", image: "/assets/images/img1.png" },
  { title: "Badshahi Mosque", image: "/assets/images/lahore.png" },
  { title: "Lahore City", image: "/assets/images/journey1.jpg" },
];

const DestinationSlot = ({ data, isLarge = false }) => {
  const [displayData, setDisplayData] = useState(data);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    if (data.image !== displayData.image) {
      setIsTransitioning(true);
      const timer = setTimeout(() => {
        setDisplayData(data);
        setIsTransitioning(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [data, displayData.image]);

  return (
    <div
      className={`
        transition-all duration-700 ease-in-out
        ${isLarge ? 'flex-[1.4] h-[480px] md:h-[550px]' : 'flex-1 h-[380px] md:h-[450px]'}
        relative group cursor-pointer
      `}
    >
      <div
        className={`
          w-full h-full rounded-md overflow-hidden shadow-sm group-hover:shadow-2xl transition-all duration-500
          ${isTransitioning ? 'opacity-80 scale-95 blur-sm' : 'opacity-100 scale-100 blur-0'}
        `}
      >
        <img
          src={displayData.image}
          alt={displayData.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
        />
      </div>
      <div className={`mt-6 transition-all duration-500 ${isTransitioning ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'}`}>
        <h3 className="text-2xl font-gilda text-black group-hover:text-brand-green transition-colors">
          {displayData.title}
        </h3>
      </div>
    </div>
  );
};

const Destinations = () => {
  const [startIndex, setStartIndex] = useState(0);

  const handleNext = () => {
    setStartIndex((prev) => (prev + 1) % destinations.length);
  };

  const handlePrev = () => {
    setStartIndex((prev) => (prev - 1 + destinations.length) % destinations.length);
  };

  // Get exactly 4 items for the fixed slots
  const visibleItems = [];
  for (let i = 0; i < 4; i++) {
    visibleItems.push(destinations[(startIndex + i) % destinations.length]);
  }

  return (
    <section className="py-12 bg-[#F2F7F2]">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex justify-between items-end mb-16 px-4">
          <h2 className="text-[29px] md:text-[42px] font-gilda text-black">
            Rally Destinations
          </h2>

          <div className="flex gap-4">
            <button
              onClick={handlePrev}
              className="w-12 h-12 rounded-full border border-black/10 flex items-center justify-center bg-white hover:bg-black hover:text-white transition-all duration-300 shadow-sm"
              aria-label="Previous destination"
            >
              <span className="text-xl rotate-180">→</span>
            </button>
            <button
              onClick={handleNext}
              className="w-12 h-12 rounded-full bg-brand-green text-white flex items-center justify-center hover:bg-brand-green-hover transition-all duration-300 shadow-md shadow-brand-green/20"
              aria-label="Next destination"
            >
              <span className="text-xl">→</span>
            </button>
          </div>
        </div>

        {/* Fixed Slot Grid */}
        <div className="flex flex-col md:flex-row items-start gap-6 md:gap-8 max-w-7xl mx-auto overflow-hidden px-4">
          <DestinationSlot data={visibleItems[0]} />
          <DestinationSlot data={visibleItems[1]} isLarge={true} />
          <DestinationSlot data={visibleItems[2]} />
          <div className="hidden lg:block flex-1">
            <DestinationSlot data={visibleItems[3]} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Destinations;
