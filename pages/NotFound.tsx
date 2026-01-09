import React from "react";
import { Button } from "../components/UI/Button";
import { SEO } from "../components/SEO/SEO";

export const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen bg-brand-black flex items-center justify-center px-6">
      <SEO
        title="Pagina non trovata | Dimensione Immagine"
        description="La pagina che stai cercando non esiste."
      />
      <div className="text-center max-w-lg">
        <h1 className="font-serif text-9xl text-brand-gold mb-6 opacity-20">
          404
        </h1>
        <h2 className="text-3xl md:text-4xl font-serif text-white mb-6">
          Pagina non trovata
        </h2>
        <p className="text-white/60 mb-10 text-lg font-light leading-relaxed">
          Sembra che la pagina che stai cercando non esista o sia stata
          spostata. Torna alla home per scoprire le nostre collezioni.
        </p>
        <Button to="/" variant="primary">
          Torna alla Home
        </Button>
      </div>
    </div>
  );
};
