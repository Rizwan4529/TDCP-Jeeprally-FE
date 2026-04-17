import { ARROW_UP_RIGHT_ICON } from "../../assets"

const AnimatedButton = ({
  text = "Book Now",
  onClick = () => {},
  Icon = ARROW_UP_RIGHT_ICON,
  className = "",
  variant = "solid", // "solid" | "ghost" | "inverse"
}) => {
  const isGhost = variant === "ghost"
  const isInverse = variant === "inverse"

  return (
    <div className="group/btn w-fit m-px">
      <button
        onClick={onClick}
        className={`relative flex items-center gap-2 rounded-full p-1 overflow-hidden cursor-pointer transition-all duration-500 hover:outline
          ${
            isGhost
              ? "bg-transparent border border-white"
              : isInverse
              ? "bg-white group-hover/btn:bg-transparent"
              : "bg-black group-hover/btn:bg-transparent"
          }
          ${className}
        `}
      >
        {/* Background animation */}
        <span
          className={`absolute inset-0 scale-x-0 origin-right group-hover/btn:scale-x-100 transition-transform duration-500 ease-out
            ${
              isGhost
                ? "bg-white/20"
                : isInverse
                ? "bg-black"
                : "bg-white"
            }
          `}
        />

        {/* Button text */}
        <span
          className={`relative z-10 pl-4 transition-colors duration-500
            ${Icon === null ? "pr-4 py-1" : ""}
            ${
              isGhost
                ? "text-white"
                : isInverse
                ? "text-black group-hover/btn:text-white"
                : "text-white group-hover/btn:text-black"
            }
          `}
        >
          {text}
        </span>

        {/* Icon wrapper */}
        {Icon && (
          <div
            className={`relative z-10 rounded-full w-8 h-8 min-w-8 min-h-8 grid place-items-center
              ${
                isGhost
                  ? "bg-white/50"
                  : isInverse
                  ? "bg-black"
                  : "bg-white"
              }
            `}
          >
            <Icon
              className="icon"
              fill={
                isGhost
                  ? "#fff"
                  : isInverse
                  ? "#fff"
                  : "#000"
              }
            />
          </div>
        )}
      </button>
    </div>
  )
}

export default AnimatedButton
