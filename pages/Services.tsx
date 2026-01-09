import React from 'react';
import { Button } from '../components/UI/Button';
import { Check } from 'lucide-react';
import { SEO } from '../components/SEO/SEO';
import { ServiceItem } from '../types';

const SERVICES: ServiceItem[] = [
  {
    title: "Stampa Digitale & Grande Formato",
    description: "Tecnologie all'avanguardia per stampe nitide, durature e di grande impatto visivo su qualsiasi supporto.",
    items: [
      "Striscioni pubblicitari",
      "Vetrofanie e prespaziati",
      "Adesivi personalizzati ed etichette",
      "Cartellonistica",
      "Pannelli rigidi (Forex, Dibond, Plexiglass)",
      "Stampa su tela e tessuto"
    ]
  },
  {
    title: "Grafica Pubblicitaria & Branding",
    description: "Diamo un volto al tuo business. Dal logo alla corporate identity, curiamo ogni aspetto visivo.",
    items: [
      "Logo design & Restyling",
      "Immagine coordinata (Biglietti da visita, Carta intestata)",
      "Materiale promozionale (Flyer, Brochure, Cataloghi)",
      "Packaging design",
      "Grafica per social media e web"
    ]
  },
  {
    title: "Allestimenti Negozi e Uffici",
    description: "Trasformiamo i tuoi spazi commerciali in ambienti comunicativi che attraggono clienti.",
    items: [
      "Insegne luminose e non",
      "Allestimenti vetrine completi",
      "Espositori su misura",
      "Segnaletica interna ed esterna",
      "Restyling ambienti commerciali",
      "Decorazione automezzi (Car wrapping)"
    ]
  }
];

const SERVICE_IMAGES = [
  "/images/service-printing.png",
  "/images/service-branding.png", 
  "/images/service-install.png"
];



export const Services: React.FC = () => {
  const faqSchema = {
    // ... (keep existing schema)
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Offrite servizi di stampa a Messina?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Sì, offriamo servizi di stampa digitale e grande formato a Messina e provincia."
        }
      },
      {
        "@type": "Question",
        name: "Realizzate allestimenti per negozi?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Sì, realizziamo allestimenti per negozi, vetrine, uffici e spazi commerciali."
        }
      },
      {
        "@type": "Question",
        name: "È possibile richiedere un preventivo?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Sì, puoi contattarci online o telefonicamente per un preventivo personalizzato."
        }
      }
    ]
  };

  return (
    <div className="pt-24 min-h-screen bg-brand-black">
      <SEO
        title="Servizi di Stampa e Grafica a Messina"
        description="Stampa digitale, grande formato, branding e allestimenti per negozi e uffici a Messina e provincia."
        url="https://www.dimensioneimmagine.net/servizi"
        image="/og-servizi.jpg"
        structuredData={faqSchema}
      />
      <div className="container mx-auto px-6 py-12 text-center">
        <span className="text-brand-gold text-xs font-bold uppercase tracking-widest mb-4 block">Cosa Offriamo</span>
        <h1 className="font-serif text-5xl md:text-7xl mb-6">I nostri servizi</h1>
        <p className="text-white/60 max-w-2xl mx-auto font-light">
          Soluzioni complete per la comunicazione visiva, dalla progettazione grafica all'installazione finale.
        </p>
      </div>

      <div className="container mx-auto px-6 pb-24">
        <div className="space-y-24">
          {SERVICES.map((service, index) => (
            <div key={index} className={`flex flex-col md:flex-row gap-12 items-center ${index % 2 === 1 ? 'md:flex-row-reverse' : ''}`}>
              
              {/* Image Side */}
              <div className="w-full md:w-1/2">
                <div className="relative aspect-[4/3] overflow-hidden group">
                  <div className="absolute inset-0 bg-brand-gold/20 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <img 
                    src={SERVICE_IMAGES[index]} 
                    alt={service.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    width="800"
                    height="600"
                    loading="lazy"
                  />
                </div>
              </div>

              {/* Text Side */}
              <div className="w-full md:w-1/2 space-y-6">
                <h2 className="text-3xl font-serif text-white">{service.title}</h2>
                <div className="w-12 h-0.5 bg-brand-gold"></div>
                <p className="text-white/70 leading-relaxed font-light">
                  {service.description}
                </p>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                  {service.items.map((item, idx) => (
                    <li key={idx} className="flex items-start text-sm text-white/80">
                      <Check size={16} className="text-brand-gold mr-3 mt-0.5 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Bottom */}
      <section className="bg-brand-darkgray py-20 text-center">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-serif mb-6">Hai un progetto in mente?</h2>
          <p className="text-white/60 mb-8">Parliamone insieme. Troveremo la soluzione perfetta per te.</p>
          <Button to="/contatti" variant="primary">Richiedi consulenza</Button>
        </div>
      </section>
    </div>
  );
};