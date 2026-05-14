import { useState, useEffect } from "react";
import { FaArrowUp } from "react-icons/fa6";

const BackToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-6 right-6 z-50 h-12 w-12 rounded-full bg-primary hover:bg-primary-dark text-white flex items-center justify-center cursor-pointer shadow-lg transition-all duration-300 ease-in-out hover:scale-110 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
        }`}
      title="Back to Top"
      aria-label="Back to top"
    >
      <FaArrowUp className="text-lg" />
    </button>
  );
};

export default BackToTop;
