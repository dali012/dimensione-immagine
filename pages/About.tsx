import React from "react";
import { Button } from "../components/UI/Button";
import { SEO } from "../components/SEO/SEO";

export const About: React.FC = () => {
  return (
    <div className="pt-24 min-h-screen bg-brand-black">
      <SEO
        title="Chi Siamo | Dimensione Immagine"
        description="Da oltre quarant’anni selezioniamo capi che uniscono qualità, estetica e convenienza. Scopri la nostra mission."
        image="/og-chi-siamo.jpg"
      />
      {/* Header */}
      <div className="container mx-auto px-6 py-12 md:py-20 text-center">
        <span className="text-brand-gold text-xs font-bold uppercase tracking-widest mb-4 block">
          La nostra storia
        </span>
        <h1 className="font-serif text-5xl md:text-7xl mb-12">Chi Siamo</h1>
        <div className="w-px h-20 bg-gradient-to-b from-brand-gold to-transparent mx-auto"></div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Image */}
          <div className="relative">
            <div className="absolute -top-4 -left-4 w-24 h-24 border-t border-l border-brand-gold/30"></div>
            <img
              src="/images/about-team.png"
              alt="Il team di Dimensione Immagine"
              className="w-full h-auto object-cover filter grayscale contrast-110 hover:grayscale-0 transition-all duration-700"
              width="800"
              height="1000"
              loading="eager"
            />
            <div className="absolute -bottom-4 -right-4 w-24 h-24 border-b border-r border-brand-gold/30"></div>
          </div>

          {/* Copy */}
          <div className="space-y-8">
            <h2 className="text-3xl font-serif text-white">
              DIMENSIONE IMMAGINE È ELEGANTE, MODERNO, ICONICO, RAFFINATO,
              INCLUSIVO, AUTENTICO.
            </h2>
            <div className="space-y-6 text-white/70 font-light leading-relaxed">
              <p>
                Dal 1984 Dimensione Immagine, fondata da Fortunato Oteri,
                interpreta la moda come un gesto di accoglienza e identità. Nata
                in Sicilia come un’elegante realtà, la nostra storia affonda le
                radici nella cura del dettaglio, nel rispetto delle persone e
                nella volontà di creare un’esperienza che unisca stile e
                umanità.
              </p>
              <p>
                Nel corso dei decenni, quel primo negozio è diventato un punto
                di riferimento per il mondo Donna e Uomo, grazie a collezioni
                contemporanee, versatili e accuratamente selezionate. La nostra
                crescita è stata guidata da una visione chiara: ampliare la
                nostra presenza senza mai smarrire l’essenza che ci ha resi
                riconoscibili — la capacità di far sentire ogni cliente unico,
                compreso e valorizzato.
              </p>
              <p>
                Oggi Dimensione Immagine è una rete di store diretti e affiliati
                che combina tradizione, modernità e una cultura dell’accoglienza
                radicata e sincera. Un brand che evolve restando fedele alla
                propria anima.
              </p>
            </div>

            <div className="pt-8 border-t border-white/10">
              <h3 className="text-brand-gold text-lg font-serif mb-2">
                La nostra promessa
              </h3>
              <p className="text-white/80 italic">
                "Valorizzare ogni fisicità, ogni storia e ogni momento della
                vita."
              </p>
            </div>

            <div className="pt-4">
              <Button to="/portfolio" variant="outline">
                Guarda le collezioni
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats/Philosophy */}
      <section className="bg-brand-darkgray py-20">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center bg-brand-black/20 rounded-2xl border border-white/5 p-8">
            <div className="p-6">
              <span className="block text-4xl font-serif text-brand-gold mb-2">
                5000+
              </span>
              <h4 className="text-lg font-medium text-white/80">
                CAPI SUGLI SCAFFALI
              </h4>
            </div>
            <div className="p-6 border-y md:border-y-0 md:border-x border-white/10">
              <span className="block text-4xl font-serif text-brand-gold mb-2">
                15
              </span>
              <h4 className="text-lg font-medium text-white/80">
                PUNTI VENDITA ATTIVI
              </h4>
            </div>
            <div className="p-6">
              <span className="block text-4xl font-serif text-brand-gold mb-2">
                1500+
              </span>
              <h4 className="text-lg font-medium text-white/80">
                CLIENTI SODDISFATTI
              </h4>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
