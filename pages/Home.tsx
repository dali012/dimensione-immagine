import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Button } from "../components/UI/Button";
import { SEO } from "../components/SEO/SEO";
import { Reveal } from "../components/UI/Reveal";
import { AnimatePresence, motion } from "framer-motion";

const HERO_MEDIA = [
  { type: "image", src: "/images/hero-bg.jpg" },
  {
    type: "video",
    src: "/images/video/women-hero-video-dimensione-immagine.mp4",
  },
  {
    type: "video",
    src: "/images/video/men-hero-video-dimensione-immagine.mp4",
  },
];

export const Home: React.FC = () => {
  const location = useLocation();
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (HERO_MEDIA[currentIndex].type === "image") {
      const timer = setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % HERO_MEDIA.length);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [currentIndex]);

  return (
    <div className="flex flex-col bg-brand-bg min-h-screen">
      <SEO
        title="Dimensione Immagine | Moda Inclusiva e Accessibile"
        description="Scopri la nostra moda accessibile e inclusiva. Collezioni Uomo, Donna e Taglie Forti che valorizzano ogni fisicità e personalità."
        url={`https://www.dimensioneimmagineabbigliamento.it${location.pathname}`}
        image="/og-image.jpg"
      />

      {/* Full Screen Hero with Carousel and Fade */}
      <section className="relative h-screen min-h-150 flex items-center overflow-hidden">
        {/* Carousel Background */}
        <div className="absolute inset-0 w-full h-full">
          <AnimatePresence mode="popLayout">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5 }}
              className="absolute inset-0 w-full h-full"
            >
              {HERO_MEDIA[currentIndex].type === "video" ? (
                <video
                  src={HERO_MEDIA[currentIndex].src}
                  className="w-full h-full object-cover object-top md:object-center"
                  autoPlay
                  muted
                  playsInline
                  onEnded={() =>
                    setCurrentIndex((prev) => (prev + 1) % HERO_MEDIA.length)
                  }
                />
              ) : (
                <img
                  src={HERO_MEDIA[currentIndex].src}
                  alt={`Slide ${currentIndex + 1}`}
                  className="w-full h-full object-cover object-top md:object-center"
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Gradient Overlay for Text Readability */}
        <div className="absolute inset-0 bg-linear-to-r from-brand-bg via-brand-bg/85 to-transparent z-10 w-full md:w-[75%] lg:w-[60%]"></div>
        {/* Additional mobile gradient for bottom text readability if needed */}
        <div className="absolute inset-0 bg-linear-to-t from-brand-bg via-transparent to-transparent z-10 md:hidden h-1/2 mt-auto"></div>

        {/* Content */}
        <div className="container mx-auto px-6 relative z-20 h-full flex items-center">
          <div className="max-w-2xl pt-20 md:pt-0">
            <Reveal width="100%">
              <h1 className="font-serif text-5xl md:text-7xl text-brand-text-primary mb-6 leading-[1.1]">
                Moda che parla
                <span className="block italic text-brand-accent">
                  alle persone.
                </span>
              </h1>
              <div className="h-px w-24 bg-brand-accent mb-8"></div>
              <p className="text-lg md:text-xl text-brand-text-secondary max-w-lg mb-10 font-light leading-relaxed">
                La nostra mission è offrire una moda accessibile, inclusiva e in
                grado di valorizzare ogni fisicità, ogni storia e ogni momento
                della vita.
              </p>
              <Button to="/chi-siamo" variant="primary" ariaLabel="Chi Siamo">
                Scopri di più
              </Button>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Philosophy / Value Proposition */}
      <section className="py-24 md:py-32 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-8">
            <Reveal
              delay={0.2}
              className="flex flex-col items-start border-l border-brand-border pl-6"
            >
              <span className="block text-5xl font-serif text-brand-accent mb-6">
                40+
              </span>
              <h3 className="text-2xl font-serif text-brand-text-primary mb-4">
                Anni di Storia
              </h3>
              <p className="text-brand-text-secondary leading-relaxed max-w-xs">
                Da oltre quarant’anni selezioniamo capi che uniscono qualità,
                estetica e convenienza.
              </p>
            </Reveal>

            <Reveal
              delay={0.4}
              className="flex flex-col items-start border-l border-brand-border pl-6"
            >
              <span className="block text-5xl font-serif text-brand-accent mb-6">
                100%
              </span>
              <h3 className="text-2xl font-serif text-brand-text-primary mb-4">
                Moda
              </h3>
              <p className="text-brand-text-secondary leading-relaxed max-w-xs">
                Indossare qualità, vivere autenticità. Tradizione che evolve,
                stile che rimane.
              </p>
            </Reveal>

            <Reveal
              delay={0.6}
              className="flex flex-col items-start border-l border-brand-border pl-6"
            >
              <span className="block text-5xl font-serif text-brand-accent mb-6">
                Unique
              </span>
              <h3 className="text-2xl font-serif text-brand-text-primary mb-4">
                Stile Personale
              </h3>
              <p className="text-brand-text-secondary leading-relaxed max-w-xs">
                Ogni capo è unico, pensato per esaltare la tua personalità.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Minimal CTA Section */}
      <section className="py-32 bg-brand-bg border-t border-brand-border text-center mx-auto">
        <div className="container mx-auto px-6 max-w-3xl">
          <Reveal className="flex flex-col items-center">
            <h2 className="text-4xl md:text-5xl font-serif text-brand-text-primary mb-8">
              Scopri il tuo stile personale.
            </h2>
            <p className="text-brand-text-secondary mb-12 text-lg font-light leading-relaxed">
              Siamo pronti a rendere unico il tuo guardaroba con professionalità
              e stile.
            </p>
            <Button to="/contatti" variant="outline">
              Contattaci
            </Button>
          </Reveal>
        </div>
      </section>
    </div>
  );
};
