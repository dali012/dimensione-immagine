import React from "react";
import { Button } from "../components/UI/Button";
import { SEO } from "../components/SEO/SEO";
import { Reveal } from "../components/UI/Reveal";

export const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen bg-brand-bg flex items-center justify-center px-6">
      <SEO
        title="Pagina non trovata | Dimensione Immagine"
        description="La pagina che stai cercando non esiste."
      />
      <Reveal width="100%">
        <div className="text-center max-w-lg mx-auto">
          <h1 className="font-serif text-9xl text-brand-accent mb-6">404</h1>
          <h2 className="text-3xl md:text-4xl font-serif text-brand-text-primary mb-6">
            Pagina non trovata
          </h2>
          <p className="text-brand-text-secondary mb-10 text-lg font-light leading-relaxed">
            Sembra che la pagina che stai cercando non esista o sia stata
            spostata. Torna alla home per scoprire le nostre collezioni.
          </p>
          <Button to="/" variant="primary">
            Torna alla Home
          </Button>
        </div>
      </Reveal>
    </div>
  );
};
