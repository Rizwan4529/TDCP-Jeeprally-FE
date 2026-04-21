
const AdventureSection = () => {
  return (
    <section className="py-12 md:py-20 bg-white overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Header Row - 3 Columns */}
        {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12 mb-16 md:mb-20">
          <div className="space-y-4 md:space-y-6">
            <h2 className="text-[28px] md:text-[42px] font-gilda leading-tight text-black border-l-4 border-brand-green pl-6">
              High-Speed <br /> Desert Adventure
            </h2>
            <p className="para text-gray-600">
              Experience the thrill of racing across vast desert landscapes at high speed,
              surrounded by raw natural beauty.
            </p>
          </div>

          <div className="space-y-4 md:space-y-6">
            <h2 className="text-[28px] md:text-[42px] font-gilda leading-tight text-black border-l-4 border-brand-green pl-6">
              Thrilling Off- <br /> Road Experience
            </h2>
            <p className="para text-gray-600 border-t border-gray-100 pt-6">
              An adrenaline-filled experience combining high-speed action,
              desert adventure, and unforgettable moments.
            </p>
          </div>

          <div className="relative space-y-4 md:space-y-6 md:col-span-2 lg:col-span-1">
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 opacity-10 pointer-events-none">
              <img src="/assets/images/flag_3.png" alt="" className="w-32 md:w-40" />
            </div>
            <h2 className="text-[28px] md:text-[42px] font-gilda leading-tight text-black border-l-4 border-brand-green pl-6">
              Unforgettable <br /> Rally Excitement
            </h2>
            <p className="para text-gray-600">
              Navigate rugged terrain and challenging tracks for an adrenaline-pumping
              off-road adventure.
            </p>
          </div>
        </div> */}

        {/* Image Grid Row */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-16 md:mb-20">
          {/* Main Large Image */}
          <div className="md:col-span-12 lg:col-span-6 relative group overflow-hidden rounded-md h-[400px] lg:h-auto">
            <img
              src="/assets/images/jeep_3_1.jpg"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              alt="Jeep Rally"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 bg-white/30 backdrop-blur-md rounded-md flex items-center justify-center cursor-pointer hover:bg-white/50 transition-all">
                <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[15px] border-l-white border-b-[10px] border-b-transparent ml-1"></div>
              </div>
            </div>
          </div>

          {/* Sub-grids that stack on mobile/tablet */}
          <div className="md:col-span-6 lg:col-span-3 space-y-6">
            <div className="relative group overflow-hidden rounded-md h-[280px]">
              <img src="/assets/images/jeep_3_2.jpg" className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700" alt="" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-12 h-12 bg-white/30 backdrop-blur-md rounded-md flex items-center justify-center cursor-pointer hover:bg-white/50">
                  <div className="w-0 h-0 border-t-[8px] border-t-transparent border-l-[12px] border-l-white border-b-[8px] border-b-transparent ml-1"></div>
                </div>
              </div>
            </div>
            <div className="relative group overflow-hidden rounded-md h-[280px]">
              <img src="/assets/images/jeep_3_4.jpg" className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700" alt="" />
            </div>
          </div>

          <div className="md:col-span-6 lg:col-span-3 space-y-6">
            <div className="relative group overflow-hidden rounded-md h-[220px]">
              <img src="/assets/images/jeep_3_3.jpg" className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700" alt="" />
            </div>
            <div className="relative group overflow-hidden rounded-md h-[340px]">
              <img src="/assets/images/jeep_3_5.jpg" className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700" alt="" />
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 py-0 md:py-0 ">
          <div className="flex items-center gap-4 md:gap-6">
            <span className="text-[42px] lg:text-[64px] font-sans font-medium text-brand-green leading-none">600+</span>
            <p className="text-sm text-gray-500 leading-snug">
              Registered Racers <br /> competing each year
            </p>
          </div>
          <div className="flex items-center gap-4 md:gap-6">
            <span className="text-[42px] lg:text-[64px] font-sans font-medium text-brand-green leading-none">95+</span>
            <p className="text-sm text-gray-500 leading-snug">
              Professional Routes <br /> carefully mapped
            </p>
          </div>
          <div className="flex items-center gap-4 md:gap-6">
            <span className="text-[42px] lg:text-[64px] font-sans font-medium text-brand-green leading-none">500+</span>
            <p className="text-sm text-gray-500 leading-snug">
              Dedicated Volunteers <br /> supporting the event
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdventureSection;
