import React from 'react';
import { Button } from '../components/UI/Button';
import { SEO } from '../components/SEO/SEO';

export const About: React.FC = () => {
  return (
    <div className="pt-24 min-h-screen bg-brand-black">
      <SEO
        title="Chi Siamo | Dimensione Immagine"
        description="Scopri la storia e il team di Dimensione Immagine, agenzia di comunicazione visiva e stampa a Messina dal 2008."
        image="/og-chi-siamo.jpg"
      />
      {/* Header */}
      <div className="container mx-auto px-6 py-12 md:py-20 text-center">
        <span className="text-brand-gold text-xs font-bold uppercase tracking-widest mb-4 block">La nostra storia</span>
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
              alt="Il team di Dimensione Immagine al lavoro" 
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
              Dimensione Immagine è un’agenzia di comunicazione visiva e laboratorio di stampa.
            </h2>
            <div className="space-y-6 text-white/70 font-light leading-relaxed">
              <p>
                Da oltre quindici anni affianchiamo aziende, negozi e professionisti nella creazione di un’immagine forte, coerente e riconoscibile. Operiamo in tutta la provincia di Messina con dedizione e competenza.
              </p>
              <p>
                Uniamo creatività, competenza tecnica e passione per offrire soluzioni di stampa, grafica e allestimento che valorizzano ogni brand. Il nostro approccio è sartoriale: ascoltiamo le tue esigenze per cucire su misura la soluzione perfetta.
              </p>
            </div>
            
            <div className="pt-8 border-t border-white/10">
              <h3 className="text-brand-gold text-lg font-serif mb-2">La nostra missione</h3>
              <p className="text-white/80 italic">
                "Aiutare le aziende a comunicare meglio attraverso immagini di qualità, materiali professionali e soluzioni visive efficaci."
              </p>
            </div>

            <div className="pt-4">
              <Button to="/portfolio" variant="outline">Guarda i nostri lavori</Button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats/Philosophy */}
      <section className="bg-brand-darkgray py-20">
        <div className="container mx-auto px-6">
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
             <div className="p-6">
                <div className="w-16 h-16 rounded-full border border-brand-gold/30 flex items-center justify-center mx-auto mb-6 text-brand-gold">
                   <span className="font-serif text-2xl">01</span>
                </div>
                <h4 className="text-lg font-medium mb-2">Ascolto</h4>
                <p className="text-sm text-white/50">Analizziamo a fondo le tue necessità per capire i tuoi obiettivi.</p>
             </div>
             <div className="p-6">
                <div className="w-16 h-16 rounded-full border border-brand-gold/30 flex items-center justify-center mx-auto mb-6 text-brand-gold">
                   <span className="font-serif text-2xl">02</span>
                </div>
                <h4 className="text-lg font-medium mb-2">Progettazione</h4>
                <p className="text-sm text-white/50">Sviluppiamo idee creative e funzionali, curate in ogni dettaglio.</p>
             </div>
             <div className="p-6">
                <div className="w-16 h-16 rounded-full border border-brand-gold/30 flex items-center justify-center mx-auto mb-6 text-brand-gold">
                   <span className="font-serif text-2xl">03</span>
                </div>
                <h4 className="text-lg font-medium mb-2">Realizzazione</h4>
                <p className="text-sm text-white/50">Stampiamo e allestiamo con materiali di prima qualità.</p>
             </div>
           </div>
        </div>
      </section>
    </div>
  );
};