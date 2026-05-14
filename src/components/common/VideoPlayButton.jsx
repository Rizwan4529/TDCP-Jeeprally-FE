const SIZE_STYLES = {
  sm: {
    button: "h-14 w-14 md:h-16 md:w-16",
    icon: "border-y-[10px] border-l-[16px]",
  },
  lg: {
    button: "h-18 w-18 md:h-22 md:w-22",
    icon: "border-y-[14px] border-l-[22px] md:border-y-[16px] md:border-l-[26px]",
  },
};

const VideoPlayButton = ({
  size = "sm",
  className = "",
  ariaLabel = "Play video",
  isPlaying = false,
  isLoading = false,
  onClick,
  disabled = false,
}) => {
  const styles = SIZE_STYLES[size] || SIZE_STYLES.sm;

  return (
    <button
      type="button"
      aria-label={ariaLabel}
      aria-pressed={isPlaying}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center rounded-full bg-secondary shadow-[0_14px_28px_rgba(0,0,0,0.18)] transition-transform duration-300 hover:scale-105 disabled:cursor-wait ${styles.button} ${className}`}
    >
      {isLoading ? (
        <span className="h-6 w-6 animate-spin rounded-full border-2 border-white/35 border-t-white" />
      ) : isPlaying ? (
        <span className="flex items-center gap-1">
          <span className="h-5 w-1.5 rounded-sm bg-white" />
          <span className="h-5 w-1.5 rounded-sm bg-white" />
        </span>
      ) : (
        <span
          className={`ml-1 h-0 w-0 border-y-transparent border-l-white ${styles.icon}`}
        />
      )}
    </button>
  );
};

export default VideoPlayButton;
