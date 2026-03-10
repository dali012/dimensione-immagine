import { MapPin, Sparkles } from "lucide-react";
import React from "react";

interface NewOpeningBannerProps {
  className?: string;
  locationName?: string;
  province?: string;
  region?: string;
  openingNote?: string;
}

export const NewOpeningBanner: React.FC<NewOpeningBannerProps> = ({
  className = "",
  locationName = "Silvi",
  province = "Teramo",
  region = "Abruzzo",
  openingNote = "Nuovo punto vendita in arrivo",
}) => {
  return (
    <div
      className={`banner-gradient-drift motion-reduce:animate-none fixed inset-x-0 top-0 z-60 h-8 overflow-hidden bg-linear-to-r from-[#17120c] via-[#0f0f0f] to-[#1d160d] text-white shadow-[0_0_20px_rgba(245,158,11,0.18)] ${className}`}
      role="region"
      aria-label="Annuncio nuova apertura"
    >
      <div className="banner-border-beam motion-reduce:animate-none pointer-events-none absolute inset-x-0 top-0 h-[2px]" />
      <div className="banner-border-beam-reverse motion-reduce:animate-none pointer-events-none absolute inset-x-0 bottom-0 h-[2px]" />
      <div className="banner-glow-breathe motion-reduce:animate-none pointer-events-none absolute inset-0 bg-linear-to-r from-brand-accent/10 via-transparent to-brand-accent/10" />
      <div className="banner-glow-breathe motion-reduce:animate-none pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_50%,rgba(245,158,11,0.24),transparent_45%),radial-gradient(circle_at_82%_50%,rgba(56,189,248,0.2),transparent_45%)]" />
      <div className="container relative mx-auto flex h-full items-center justify-center px-2 sm:px-6">
        <p className="banner-text-shift motion-reduce:animate-none flex min-w-0 items-center justify-center gap-0 truncate text-center text-[11px] font-semibold uppercase tracking-[0.08em] text-white/85 sm:text-xs sm:tracking-[0.16em] md:text-[13px]">
          <span className="banner-accent-pulse motion-reduce:animate-none inline-flex items-center gap-1 text-brand-accent sm:gap-1.5">
            <Sparkles className="size-3 sm:size-3.5" />
            Nuova Apertura
          </span>
          <span className="mx-1.5 text-white/35 sm:mx-2">|</span>
          <span className="inline-flex items-center gap-1 text-current">
            <MapPin className="size-3 sm:size-3.5" />
            {locationName}
            <span className="sm:hidden"> - {region}</span>
            <span className="hidden sm:inline">
              {" "}
              ({province}) - {region}
            </span>
          </span>
          <span className="hidden md:inline text-current">
            <span className="mx-2 text-white/35">|</span>
            {openingNote}
          </span>
        </p>
      </div>
    </div>
  );
};
