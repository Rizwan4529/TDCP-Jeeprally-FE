import React, { useState } from 'react';

const champions = [
  {
    id: 2,
    rank: "2",
    name: "Furqan Ali",
    team: "Team",
    image: "/assets/images/pp1.png",
    height: "h-[320px] md:h-[400px]",
    order: "order-1"
  },
  {
    id: 1,
    rank: "1",
    name: "Furqan Ali",
    team: "Team",
    image: "/assets/images/pp2.png",
    height: "h-[360px] md:h-[460px]",
    order: "order-2"
  },
  {
    id: 3,
    rank: "3",
    name: "Furqan Ali",
    team: "Team",
    image: "/assets/images/pp3.png",
    height: "h-[320px] md:h-[400px]",
    order: "order-3"
  }
];
const tabs = ['Stock & Prepaid', 'Quad Bike', 'Dirt Bike', '4x4', 'Truck Race'];

const ChampionsSection = () => {
  const [activeTab, setActiveTab] = useState('Stock & Prepaid');
  return (
    <section className="py-10 md:py-10 bg-[#F2F7F2]">
      <div className="container mx-auto px-4 lg:px-20">
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <h2 className="font-gilda text-[32px] md:text-[42px] text-primary leading-tight">
            Champions of the Rally
          </h2>
          <p className="para text-gray-500 max-w-2xl mx-auto">
            Celebrating the top performers who conquered the desert track
          </p>
        </div>
        {/* Filters Section */}
        <div className="players-filters flex overflow-x-auto no-scrollbar gap-2 md:gap-4 mb-12">
          {tabs.map((tab) => (
            <button
              key={tab}
              className={`px-6 py-2 rounded-full text-sm transition-all duration-300 whitespace-nowrap ${activeTab === tab
                ? 'bg-brand-green text-white shadow-md'
                : 'bg-white/50 text-gray-600 hover:bg-white'
                }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
        {/* Podium Layout */}
        <div className="flex flex-col md:flex-row items-end justify-center gap-6 lg:gap-8 max-w-5xl mx-auto">
          {champions.sort((a, b) => {
            // Desktop: 2, 1, 3. Mobile: 1, 2, 3
            const desktopOrder = [2, 1, 3];
            return desktopOrder.indexOf(a.id) - desktopOrder.indexOf(b.id);
          }).map((player) => (
            <div
              key={player.id}
              className={`relative w-full md:w-1/3 flex flex-col justify-end ${player.order} group`}
            >
              {/* Card Container with Gradient */}
              <div className={`relative ${player.height} w-full rounded-[15px] overflow-hidden bg-gradient-to-b from-[#81D7A5] to-[#19492E] shadow-lg transition-transform duration-500 hover:-translate-y-2`}>

                {/* Rank Number - Large White */}
                <div className="absolute top-1 left-2 text-white/40 font-bold text-[140px] lg:text-[160px] leading-none select-none pointer-events-none">
                  {player.rank}
                </div>

                {/* Player Image */}
                <div className="absolute inset-0 flex items-end justify-center pointer-events-none">
                  <img
                    src={player.image}
                    alt={player.name}
                    className="w-auto h-[120%] object-contain"
                  />
                </div>

                {/* Name Bar */}
                <div className="absolute bottom-0 left-0 right-0 py-3 px-4 bg-[#48AA71]  text-white text-center font-gilda text-lg tracking-wide">
                  {player.name} ( {player.team} )
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        @media (max-width: 767px) {
          .order-1 { order: 2; }
          .order-2 { order: 1; }
          .order-3 { order: 3; }
        }
      `}} />
    </section>
  );
};

export default ChampionsSection;
