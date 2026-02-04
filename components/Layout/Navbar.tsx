import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { NavItem } from "../../types";

const NAV_ITEMS: NavItem[] = [
  { label: "Home", path: "/" },
  { label: "Chi Siamo", path: "/chi-siamo" },
  { label: "Cosa Trovi da Noi", path: "/trovi-da-noi" },
  { label: "Blog", path: "/blog" },
  { label: "Negozi & Sedi", path: "/sedi" },
  { label: "Lavora con Noi", path: "/lavora-con-noi" },
  { label: "Distribuzione Ingrosso", path: "/distribuzione-in-grosso" },
  { label: "Contatti", path: "/contatti" },
];

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  // Prevent scrolling when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <>
      <nav className="fixed w-full z-50 bg-white border-b border-brand-border h-18 flex items-center transition-all duration-300">
        <div className="container mx-auto flex justify-between items-center px-6 h-full">
          {/* Logo */}
          <Link
            to="/"
            className="z-50 group relative flex items-center"
            onClick={() => setIsOpen(false)}
          >
            <picture>
              <source
                type="image/webp"
                srcSet="/images/logo-124.webp"
                sizes="(max-width: 640px) 108px, 124px"
              />
              <img
                src="/images/logo-124.png"
                srcSet="/images/logo-124.png"
                sizes="(max-width: 640px) 108px, 124px"
                alt="Dimensione Immagine"
                className="h-10 sm:h-12 w-auto object-contain transition-opacity duration-300"
                width="124"
                height="48"
                style={{ filter: "invert(1) grayscale(1) brightness(0.2)" }}
              />
            </picture>
          </Link>

          {/* Desktop Menu - Hidden on tablets/mobile (< 1024px) */}
          <div className="hidden lg:flex space-x-8 items-center">
            {NAV_ITEMS.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`relative text-sm font-medium tracking-wide transition-colors duration-300 ${
                    isActive
                      ? "text-brand-accent"
                      : "text-brand-text-secondary hover:text-brand-accent"
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <motion.span
                      className="absolute left-0 -bottom-1 h-px bg-brand-accent w-full"
                      layoutId="navbar-underline"
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Mobile/Tablet Toggle - Visible until desktop (> 1024px) */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden text-brand-text-primary hover:text-brand-accent transition-colors z-50 focus:outline-none p-2 -mr-2"
            aria-label={isOpen ? "Chiudi menu" : "Apri menu"}
          >
            {isOpen ? (
              <X size={24} className="cursor-pointer" />
            ) : (
              <Menu size={24} className="cursor-pointer" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 bg-brand-bg z-40 overflow-y-auto transition-all duration-500 ${
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="min-h-screen flex flex-col justify-center items-center py-24 px-6 text-center">
          <div className="flex flex-col space-y-6 md:space-y-8 w-full">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`font-serif text-2xl sm:text-3xl md:text-4xl hover:text-brand-accent transition-colors duration-300 ${
                  location.pathname === item.path
                    ? "text-brand-accent italic"
                    : "text-brand-text-secondary"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};
