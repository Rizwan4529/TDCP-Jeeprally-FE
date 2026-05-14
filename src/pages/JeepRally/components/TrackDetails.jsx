import React from "react";

const TrackDetails = ({ content }) => {
  return (
    <section className="py-8 bg-white relative overflow-hidden">
      {/* Decorative Finish Pattern */}
      <div className="absolute top-0 right-0 w-64 h-64 opacity-5 pointer-events-none -translate-y-12 translate-x-12">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `radial-gradient(#000 2px, transparent 2px)`,
            backgroundSize: '20px 20px',
            maskImage: 'linear-gradient(to top left, black, transparent)'
          }}
        ></div>
      </div>

      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-10">
          <h2 className="text-[29px] md:text-[42px] font-gilda text-black leading-tight">
            {content?.title || "Rally Track Details"}
          </h2>
          <p className="para text-gray-500">
            {content?.subtitle || "Get a closer look at the terrain, distance, and key checkpoints of the race."}
          </p>
        </div>

        {/* Map Image */}
        <div className="max-w-7xl mx-auto">
          <div className="bg-[#E7D6A7] p-4 md:p-8 rounded-md shadow-2xl shadow-black/10">
            <img
              src="/assets/images/map_7.png"
              alt="Rally Route Map"
              className="w-full h-auto rounded-sm border border-black/5"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrackDetails;
