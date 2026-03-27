import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useSiteContent } from "../../contexts/SiteContentContext";

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { siteSettings } = useSiteContent();

  const navigationItems = useMemo(
    () => siteSettings.navigationItems.filter((item) => item.visible),
    [siteSettings.navigationItems],
  );

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia("(min-width: 1280px)");
    const closeMenuOnDesktop = (event?: MediaQueryListEvent) => {
      if ((event ? event.matches : mediaQuery.matches) && isOpen) {
        setIsOpen(false);
      }
    };

    closeMenuOnDesktop();

    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", closeMenuOnDesktop);
      return () => mediaQuery.removeEventListener("change", closeMenuOnDesktop);
    }

    mediaQuery.addListener(closeMenuOnDesktop);
    return () => mediaQuery.removeListener(closeMenuOnDesktop);
  }, [isOpen]);

  return (
    <>
      <nav className="fixed top-0 w-full z-50 bg-brand-text-primary border-b border-brand-accent/40 h-16 flex items-center transition-all duration-300">
        <div className="container mx-auto flex justify-between items-center gap-4 px-4 sm:px-6 lg:px-8 h-full">
          <Link
            to="/"
            className="z-50 group relative flex min-w-0 items-center"
            onClick={() => setIsOpen(false)}
            aria-label={`Torna alla home di ${siteSettings.siteName}`}
          >
            <span className="flex items-center gap-2 sm:gap-3">
              <span className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-visible sm:h-12 sm:w-12">
                <span className="pointer-events-none absolute inset-0 blur-[14px] opacity-35 bg-[radial-gradient(circle,rgba(184,155,94,0.26),transparent_70%)]" />
                <img
                  src={
                    siteSettings.logo?.src ||
                    "/images/logo-elephant-golden-2025.png"
                  }
                  alt=""
                  aria-hidden="true"
                  className="relative h-full w-full object-cover opacity-95"
                  loading="eager"
                  decoding="async"
                  style={{
                    clipPath: "inset(0 25% 0 0)",
                    objectPosition: "26% center",
                    transform: "translateX(-4%) scale(1.18)",
                  }}
                />
              </span>
              <span className="flex min-w-0 flex-col justify-center leading-none text-brand-gold">
                <span className="whitespace-nowrap text-[1.02rem] font-semibold uppercase tracking-[0.2em] sm:text-[1.16rem]">
                  DIMMI
                </span>
                <span className="mt-1 whitespace-nowrap font-serif text-[10px] tracking-[0.015em] text-brand-gold/88 max-[340px]:hidden sm:text-[13px]">
                  {siteSettings.siteName}
                </span>
              </span>
            </span>
          </Link>

          <div className="hidden xl:flex xl:items-center xl:justify-end xl:flex-1 xl:gap-4 2xl:gap-6">
            {navigationItems.map((item) => {
              const isActive = location.pathname === item.route;
              return (
                <Link
                  key={item.route}
                  to={item.route}
                  className={`relative whitespace-nowrap text-[11px] 2xl:text-sm font-medium tracking-wide transition-colors duration-300 ${
                    isActive
                      ? "text-brand-gold"
                      : "text-brand-gold/78 hover:text-brand-gold"
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute left-0 -bottom-1 h-px bg-brand-accent w-full" />
                  )}
                </Link>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="xl:hidden inline-flex h-11 w-11 items-center justify-center rounded-full border border-brand-gold/45 text-brand-gold hover:text-brand-gold hover:border-brand-gold transition-colors z-50 focus:outline-none"
            aria-label={isOpen ? "Chiudi menu" : "Apri menu"}
            aria-expanded={isOpen}
            aria-controls="site-navigation-drawer"
          >
            {isOpen ? (
              <X size={24} className="cursor-pointer" />
            ) : (
              <Menu size={24} className="cursor-pointer" />
            )}
          </button>
        </div>
      </nav>

      <div
        id="site-navigation-drawer"
        className={`fixed inset-x-0 top-16 bottom-0 z-40 overflow-y-auto border-t border-brand-accent/30 bg-brand-text-primary/96 backdrop-blur-sm transition-all duration-300 xl:hidden ${
          isOpen
            ? "translate-y-0 opacity-100 pointer-events-auto"
            : "-translate-y-2 opacity-0 pointer-events-none"
        }`}
      >
        <div className="mx-auto min-h-full w-full max-w-5xl px-4 py-5 sm:px-6 sm:py-6 lg:px-8">
          <div className="mb-4 px-1 text-[11px] font-medium uppercase tracking-[0.2em] text-brand-gold/70">
            Navigazione
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {navigationItems.map((item) => (
              <Link
                key={item.route}
                to={item.route}
                onClick={() => setIsOpen(false)}
                className={`rounded-2xl border px-4 py-4 sm:px-5 sm:py-5 text-left transition-colors duration-300 ${
                  location.pathname === item.route
                    ? "border-brand-gold bg-brand-gold/10 text-brand-gold"
                    : "border-brand-gold/20 bg-white/3 text-brand-gold/82 hover:border-brand-gold hover:text-brand-gold"
                }`}
              >
                <span className="block font-serif text-xl sm:text-2xl leading-tight">
                  {item.label}
                </span>
                <span className="mt-1 block text-[11px] font-medium uppercase tracking-[0.18em] text-brand-gold/55">
                  Vai alla sezione
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};
