const EventCardSkeleton = () => {
  return (
    <div className="bg-[#EFF4EF] rounded-lg shadow-md p-4 relative spacing-y-sm animate-pulse">
      {/* Image placeholder */}
      <div className="w-full h-110 md:h-[250px] rounded-lg bg-gray-300" />

      {/* Date placeholder */}
      <div className="absolute top-6 left-0 px-8 py-2 bg-gray-200 rounded-sm" />

      <div className="spacing-y-sm px-1 mt-4">
        {/* Title placeholder */}
        <div className="h-5 w-3/4 bg-gray-300 rounded" />

        {/* Location placeholder */}
        <div className="flex items-center gap-2 mt-2">
          <div className="h-4 w-4 bg-gray-300 rounded-full" />
          <div className="h-4 w-1/2 bg-gray-300 rounded" />
        </div>

        {/* Description placeholder */}
        <div className="h-4 w-full bg-gray-300 rounded mt-3" />
        <div className="h-4 w-5/6 bg-gray-300 rounded mt-2" />
        <div className="h-4 w-2/3 bg-gray-300 rounded mt-2" />

        {/* Button placeholder */}
        <div className="h-5 w-24 bg-gray-300 rounded mt-4" />
      </div>
    </div>
  )
}

export default EventCardSkeleton
