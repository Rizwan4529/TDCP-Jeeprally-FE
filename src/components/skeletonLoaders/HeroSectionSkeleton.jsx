import SectionContainer from "../common/SectionContainer"

const HeroSectionSkeleton = () => {
  return (
    <div className="relative h-screen overflow-hidden animate-pulse">
      {/* Left Nav Button */}
      <div className="absolute top-1/2 left-6 -translate-y-1/2 z-20 md:block hidden">
        <div className="h-12 w-12 rounded-full bg-gray-400/50 backdrop-blur-[30px]" />
      </div>

      {/* Right Nav Button */}
      <div className="absolute top-1/2 right-6 -translate-y-1/2 z-20 md:block hidden">
        <div className="h-12 w-12 rounded-full bg-gray-400/50 backdrop-blur-[30px]" />
      </div>

      {/* Background skeleton */}
      <div className="absolute inset-0 bg-gray-700" />

      {/* Dark overlay to mimic actual UI */}
      <div className="absolute inset-0 bg-black/20"></div>

      {/* Text/Card Area */}
      <div className="absolute right-0 top-1/2 -translate-y-1/3 flex flex-col items-center justify-center text-white z-10">
        <SectionContainer>
        <div className="bg-[#2E2D2DCC] rounded-lg p-6 w-[500px] max-w-[500px] space-y-4">
          {/* Title skeleton */}
          <div className="h-8 w-3/4 bg-gray-500/50 rounded"></div>

          {/* Date skeleton */}
          <div className="h-4 w-1/3 bg-gray-500/50 rounded"></div>

          {/* Desc skeleton (multiple lines) */}
          <div className="h-4 w-full bg-gray-500/50 rounded"></div>
          <div className="h-4 w-5/6 bg-gray-500/50 rounded"></div>

          {/* Button skeleton */}
          <div className="h-10 w-32 bg-gray-500/50 rounded-lg mt-4"></div>
        </div>
        </SectionContainer>
      </div>
    </div>
  )
}

export default HeroSectionSkeleton
