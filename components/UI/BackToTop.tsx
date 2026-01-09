import React, { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";

export const BackToTop: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    if (window.scrollY > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);
    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, []);

  return (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-8 right-8 z-40 p-3 bg-brand-gold text-white shadow-lg transition-all duration-500 ease-in-out hover:bg-white hover:text-brand-black border border-transparent hover:border-brand-gold focus:outline-none cursor-pointer ${
        isVisible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-10 pointer-events-none"
      }`}
      aria-label="Torna su"
    >
      <ArrowUp size={24} strokeWidth={1.5} />
    </button>
  );
};
