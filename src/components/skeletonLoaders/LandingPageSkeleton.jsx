import React from "react"

const LandingPageSkeleton = () => {
  return (
    <div className="w-full h-screen">
      {/* ===== Hero Skeleton ===== */}
      <div className="relative w-full h-full bg-gray-300 animate-pulse overflow-hidden">
        {/* Dark overlay for contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/40"></div>

        {/* Centered text placeholders */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center space-y-6 px-6">
          <div className="w-32 h-4 bg-gray-400/60 rounded-md"></div>
          <div className="w-3/4 h-10 bg-gray-400/60 rounded-md"></div>
          <div className="w-1/3 h-4 bg-gray-400/60 rounded-md"></div>
        </div>

        {/* Navigation arrows */}
        <div className="absolute left-6 top-1/2 -translate-y-1/2 w-10 h-10 bg-gray-400/50 rounded-full"></div>
        <div className="absolute right-6 top-1/2 -translate-y-1/2 w-10 h-10 bg-gray-400/50 rounded-full"></div>

        {/* Slider counter */}
        <div className="absolute bottom-10 w-full flex justify-center items-center space-x-3">
          <div className="w-10 h-4 bg-gray-400/50 rounded-md"></div>
          <div className="w-24 h-1 bg-gray-400/50 rounded-md"></div>
          <div className="w-10 h-4 bg-gray-400/50 rounded-md"></div>
        </div>
      </div>
    </div>
  )
}

export default LandingPageSkeleton
