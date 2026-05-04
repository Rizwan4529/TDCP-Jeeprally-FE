import { useState } from "react"
import { MINUS_ICON, PLUS_ICON } from "../../assets"
import { FaChevronDown, FaChevronUp } from "react-icons/fa"

const Accordion = ({ items }) => {
  const [openIndex, setOpenIndex] = useState(0)

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <div className="w-full divide-y divide-[#EEEFF6]">
      {items.map((item, index) => (
        <div key={index}>
          {/* Header */}
          <button
            onClick={() => toggle(index)}
            className="heading-20 w-full flex justify-between items-center text-left p-4 hover:bg-gray-100 transition-colors"
          >
            <span>{item.question}</span>
            {openIndex === index ? (
              <FaChevronUp className="icon text-muted" />
            ) : (
              <FaChevronDown className="icon text-muted" />
            )}
          </button>

          {/* Content */}
          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${openIndex === index ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
              }`}
          >
            <div className="p-4 para text-muted max-h-60 overflow-y-auto">
              {item.answer}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default Accordion
