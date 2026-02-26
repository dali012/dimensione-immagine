import React from "react";
import { MapPin, Sparkles, X } from "lucide-react";

interface NewOpeningBannerProps {
  className?: string;
  locationName?: string;
  province?: string;
  region?: string;
  openingNote?: string;
  onClose?: () => void;
}

export const NewOpeningBanner: React.FC<NewOpeningBannerProps> = ({
  className = "",
  locationName = "Silvi",
  province = "Pescara",
  region = "Abruzzo",
  openingNote = "Nuovo punto vendita in arrivo",
  onClose,
}) => {
  return (
    <div
      className={`fixed inset-x-0 top-0 z-60 h-6 overflow-hidden border-b border-brand-accent/35 bg-linear-to-r from-[#16120d] via-[#0f0f0f] to-[#1a1510] text-white ${className}`}
      role="region"
      aria-label="Annuncio nuova apertura"
    >
      <div className="pointer-events-none absolute inset-0 bg-linear-to-r from-brand-accent/10 via-transparent to-brand-accent/10" />
      <div className="container relative mx-auto flex h-full items-center justify-between gap-2 px-3 sm:px-6">
        <p className="min-w-0 truncate text-[10px] font-medium uppercase tracking-[0.2em] text-white/90">
          <span className="inline-flex items-center gap-1.5 text-brand-accent">
            <Sparkles size={11} />
            Nuova Apertura
          </span>
          <span className="mx-2 text-white/35">|</span>
          <span className="inline-flex items-center gap-1 text-white/90">
            <MapPin size={11} />
            {locationName} ({province}) - {region}
          </span>
          <span className="hidden sm:inline">
            <span className="mx-2 text-white/35">|</span>
            {openingNote}
          </span>
        </p>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white/85 transition-colors hover:bg-white/20"
            aria-label="Chiudi annuncio nuova apertura"
          >
            <X size={12} />
          </button>
        )}
      </div>
    </div>
  );
};
