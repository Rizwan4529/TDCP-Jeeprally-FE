const Skeleton = () => {
  return (
    <div className="w-full max-h-96 bg-white rounded-lg p-3">
      {/* Image placeholder */}
      <div className="w-full h-40 rounded-lg bg-gray-200 animate-pulse" />

      {/* Title placeholder */}
      <div className="h-5 w-3/4 mt-3 rounded-md bg-gray-200 animate-pulse" />

      {/* Description placeholders */}
      <div className="h-3 w-full mt-2 rounded-md bg-gray-200 animate-pulse" />
      <div className="h-3 w-5/6 mt-1 rounded-md bg-gray-200 animate-pulse" />

      {/* Button placeholder */}
      <div className="h-9 w-32 mt-4 rounded-full bg-gray-200 animate-pulse" />
    </div>
  )
}

const TourCardSkeleton = ({ count = 4 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} />
      ))}
    </div>
  )
}

export default TourCardSkeleton