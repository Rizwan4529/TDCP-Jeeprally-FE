import { useCallback, useEffect, useRef, useState } from "react";
import RallyStagesMenu from "./RallyStagesMenu.jsx";

const RoutesNavDropdown = ({
  title,
  className,
  align = "right",
  variant = "dropdown",
  onNavigateAway,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);
  const closeTimerRef = useRef(null);

  const clearCloseTimer = useCallback(() => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  }, []);

  const openMenu = useCallback(() => {
    clearCloseTimer();
    setIsOpen(true);
  }, [clearCloseTimer]);

  const closeMenu = useCallback(() => {
    clearCloseTimer();
    setIsOpen(false);
  }, [clearCloseTimer]);

  const scheduleClose = useCallback(() => {
    clearCloseTimer();
    closeTimerRef.current = setTimeout(() => setIsOpen(false), 160);
  }, [clearCloseTimer]);

  const isDesktopDropdown = variant === "dropdown";

  useEffect(() => {
    if (!isOpen || !isDesktopDropdown) return undefined;

    const handlePointerDown = (event) => {
      if (!containerRef.current?.contains(event.target)) {
        closeMenu();
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [closeMenu, isDesktopDropdown, isOpen]);

  useEffect(() => () => clearCloseTimer(), [clearCloseTimer]);

  return (
    <div
      ref={containerRef}
      className={variant === "inline" ? "w-full" : "relative"}
      onMouseEnter={isDesktopDropdown ? openMenu : undefined}
      onMouseLeave={isDesktopDropdown ? scheduleClose : undefined}
    >
      <button
        type="button"
        className={className}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        onClick={(event) => {
          event.preventDefault();
          setIsOpen((open) => !open);
          onNavigateAway?.();
        }}
      >
        {title}
      </button>

      <RallyStagesMenu
        isOpen={isOpen}
        onClose={closeMenu}
        align={align}
        variant={variant}
      />
    </div>
  );
};

export default RoutesNavDropdown;
