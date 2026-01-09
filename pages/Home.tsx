import React from "react";
import { Button } from "../components/UI/Button";
import { SEO } from "../components/SEO/SEO";

export const Home: React.FC = () => {
  return (
    <div className="flex flex-col">
      <SEO
        title="Dimensione Immagine | Moda Inclusiva e Accessibile"
        description="Scopri la nostra moda accessibile e inclusiva. Collezioni Uomo, Donna e Taglie Forti che valorizzano ogni fisicità e personalità."
        image="/og-image.jpg"
      />
      {/* Hero Section */}
      <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 z-0">
          <img
            src="/images/hero-bg.jpg"
            alt="Laboratorio di stampa Dimensione Immagine"
            className="w-full h-full object-cover opacity-40"
            width="1920"
            height="1080"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-brand-black/60 to-transparent"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 container mx-auto px-6 text-center">
          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight animate-fade-in-up">
            Moda che parla
            <br />
            <span className="italic text-brand-gold">
              alle persone, non alle taglie.
            </span>
          </h1>
          <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-10 font-light tracking-wide">
            La nostra mission è offrire una moda accessibile, inclusiva e in
            grado di valorizzare ogni fisicità, ogni storia e ogni momento della
            vita.
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
            <Button to="/chi-siamo" variant="primary" ariaLabel="Chi Siamo">
              Chi Siamo
            </Button>
          </div>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="py-24 bg-brand-black">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 divide-y md:divide-y-0 md:divide-x divide-white/10">
            <div className="px-6 text-center md:text-left pt-8 md:pt-0">
              <span className="block text-4xl font-serif text-brand-gold mb-4">
                40+
              </span>
              <h3 className="text-xl font-medium mb-3">Anni di Storia</h3>
              <p className="text-white/60 text-sm leading-relaxed">
                Da oltre quarant’anni selezioniamo capi che uniscono qualità,
                estetica e convenienza.
              </p>
            </div>
            <div className="px-6 text-center md:text-left pt-8 md:pt-0">
              <span className="block text-4xl font-serif text-brand-gold mb-4">
                100%
              </span>
              <h3 className="text-xl font-medium mb-3">Inclusività</h3>
              <p className="text-white/60 text-sm leading-relaxed">
                Collezioni Uomo, Donna e Plus Size per valorizzare ogni
                fisicità.
              </p>
            </div>
            <div className="px-6 text-center md:text-left pt-8 md:pt-0">
              <span className="block text-4xl font-serif text-brand-gold mb-4">
                Unique
              </span>
              <h3 className="text-xl font-medium mb-3">Stile Personale</h3>
              <p className="text-white/60 text-sm leading-relaxed">
                Ogni capo è unico, pensato per esaltare la tua personalità.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-brand-gold/10"></div>
        <div className="container mx-auto px-6 relative z-10 text-center">
          <h2 className="text-4xl md:text-5xl font-serif mb-6">
            Scopri il tuo stile personale oggi.
          </h2>
          <p className="text-white/70 mb-10 max-w-xl mx-auto">
            Siamo pronti a rendere unico il tuo guardaroba con professionalità e
            stile.
          </p>
          <Button to="/contatti" variant="primary">
            Contattaci
          </Button>
        </div>
      </section>
    </div>
  );
};
