// this slider component is only for the scenario where the buttons are inside the card and not outside since the the swiper slide slides the buttons with the slide too and
import { useState, useEffect } from "react"
import {
  ARROW_LEFT_ICON,
  ARROW_RIGHT_ICON,
  ARROW_UP_RIGHT_ICON,
} from "../../assets"
import AnimatedButton from "./AnimatedButton"

const ReusableSlider = ({
  items = [],
  renderItem,
  showNavigation = true,
  showCounter = false,
  className = "",
  containerClassName = "bg-section h-full rounded-lg p-4",
}) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isImageLoading, setIsImageLoading] = useState(false)
  const [loadedImages, setLoadedImages] = useState(new Set())

  const handleRoute = (id) => {
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(today.getDate() + 1)

    // Format dates as YYYY-MM-DD
    const checkInDate = today.toISOString().split("T")[0]
    const checkOutDate = tomorrow.toISOString().split("T")[0]

    const url = `https://resorts.tdcp.gop.pk/hoteldetail?AccommodationId=${id}&checkIn=${checkInDate}&checkOut=${checkOutDate}`

    window.scrollTo(0, 0)

    // open in new tab
    window.open(url, "_blank")
  }

  // Preload image function
  const preloadImage = (src) => {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.onload = () => resolve(src)
      img.onerror = reject
      img.src = src
    })
  }

  // Handle navigation with image preloading
  const handleNavigation = async (newIndex) => {
    const nextItem = items[newIndex]
    if (!nextItem?.image) {
      setCurrentIndex(newIndex)
      return
    }

    // If image is already loaded, switch immediately
    if (loadedImages.has(nextItem.image)) {
      setCurrentIndex(newIndex)
      return
    }

    // Show loading state and preload image
    setIsImageLoading(true)
    try {
      await preloadImage(nextItem.image)
      setLoadedImages(prev => new Set([...prev, nextItem.image]))
      setCurrentIndex(newIndex)
    } catch (error) {
      console.error('Failed to load image:', error)
      // Still switch even if image fails to load
      setCurrentIndex(newIndex)
    } finally {
      setIsImageLoading(false)
    }
  }

  const goToNext = () => {
    const nextIndex = currentIndex === items.length - 1 ? 0 : currentIndex + 1
    handleNavigation(nextIndex)
  }

  const goToPrevious = () => {
    const prevIndex = currentIndex === 0 ? items.length - 1 : currentIndex - 1
    handleNavigation(prevIndex)
  }

  // Preload first image on mount
  useEffect(() => {
    if (items.length > 0 && items[0]?.image) {
      preloadImage(items[0].image).then(() => {
        setLoadedImages(prev => new Set([...prev, items[0].image]))
      }).catch(console.error)
    }
  }, [items])

  if (!items.length) return null

  const currentItem = items[currentIndex]
  const shouldShowContent = !isImageLoading

  return (
    <div className={`${containerClassName} ${className} md:!p-lg`}>
      <div className='flex flex-col md:flex-row gap-lg md:gap-xl h-full'>
        <div className='h-full flex-1'>
          {renderItem ? (
            renderItem(currentItem, currentIndex)
          ) : (
            <div className="relative">
              <img
                src={currentItem.image}
                alt={currentItem.title}
                className='rounded-lg w-full h-[360px] min-h-[360px] max-h-[360px] object-cover'
              />
              {isImageLoading && (
                <div className="absolute inset-0 bg-black/20 rounded-lg flex items-center justify-center">
                  <div className="bg-white/90 px-4 py-2 rounded-lg">
                    <span className="text-sm font-medium">Loading...</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        <div className='flex flex-col flex-[1.5]'>
          <div className='flex-1 flex flex-col justify-center spacing-y-md'>
            {shouldShowContent ? (
              <>
                <h2 className='sub-heading font-gilda'>{currentItem.title}</h2>
                <p className='para text-muted line-clamp-2 md:line-clamp-2'>
                  {currentItem.description}
                </p>
                {/* <p className='para text-muted'>
                  <strong>Address:</strong> {currentItem.address}
                </p> */}

                <div className='hidden md:grid grid-cols-1 md:grid-cols-[5fr_1fr_6fr]'>
                  <div className=''>
                    <h5 className='heading-20 font-gilda'>Facilities</h5>
                    <ul className='list-disc list-inside para'>
                      {currentItem.facilities.slice(0, 3).map((facility, index) => (
                        <li key={index} className="">{facility}</li>
                      ))}
                    </ul>
                  </div>
                  {/* <div className='relative'>
                    <div className='bg-black/10 w-px absolute h-full' />
                  </div> */}
                  {/* <div className=''>
                    <h5 className='heading-20 font-gilda'>Nearby Attractions</h5>
                    <ul className='list-disc list-inside para'>
                      {currentItem.nearbyAttractions.slice(0, 3).map((attraction, index) => (
                        <li key={index} className="">{attraction}</li>
                      ))}
                    </ul>
                  </div> */}
                </div>

                {currentItem.buttonText && (
                  <div className='mb-2'>
                    <AnimatedButton
                      text={currentItem.buttonText}
                      onClick={() => handleRoute(currentItem.id)}
                      Icon={ARROW_UP_RIGHT_ICON}
                    />
                  </div>
                )}
              </>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center spacing-y-sm">
                  <div className="animate-pulse">
                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                  </div>
                  <p className="text-sm text-muted mt-4">Loading content...</p>
                </div>
              </div>
            )}
          </div>

          <div className='flex items-center justify-end'>
            {/* {showCounter && (
              <div className='heading-20 font-gilda'>
                {shouldShowContent ? `${currentIndex + 1}/${items.length}` : "..."}
              </div>
            )} */}

            {showNavigation && (
              <div className='flex items-center gap-4'>
                <button
                  className='bg-primary rounded-full md:w-11 md:h-11 min-w-9 min-h-9 md:min-w-11 md:min-h-11 grid place-items-center hover:bg-primary-dark transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'
                  onClick={goToPrevious}
                  disabled={isImageLoading}
                >
                  <ARROW_LEFT_ICON fill='#fff' />
                </button>
                <button
                  className='bg-primary rounded-full md:w-11 md:h-11 min-w-9 min-h-9 md:min-w-11 md:min-h-11 grid place-items-center hover:bg-primary-dark transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'
                  onClick={goToNext}
                  disabled={isImageLoading}
                >
                  <ARROW_RIGHT_ICON fill='#fff' />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ReusableSlider
