import { useState } from "react"
import Lightbox from "yet-another-react-lightbox"

const BentoGrid = ({ images }) => {
  const [open, setOpen] = useState(false)
  const [index, setIndex] = useState(0)

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {images.map((img, idx) => (
          <div
            key={idx}
            className="overflow-hidden rounded-lg shadow-md h-[250px] cursor-pointer"
            onClick={() => {
              setIndex(idx)
              setOpen(true)
            }}
          >
            <img
              src={img}
              alt={`gallery-${idx}`}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
        ))}
      </div>

      {/* Lightbox viewer */}
      <Lightbox
        open={open}
        close={() => setOpen(false)}
        index={index}
        slides={images.map((src) => ({ src }))}
      />
    </div>
  )
}

export default BentoGrid
