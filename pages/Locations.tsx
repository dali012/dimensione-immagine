import React from 'react';
import { MapPin, Phone, Clock } from 'lucide-react';
import { SEO } from '../components/SEO/SEO';

const LOCATIONS = [
  {
    name: "Sede Principale & Laboratorio",
    address: "Contrada S. Lucia, 46, Capo d’Orlando (ME)",
    phone: "+39 392 718 9875",
    type: "HQ",
    image: "https://picsum.photos/800/400?random=50"
  },
  {
    name: "Kruder by Dimensione Immagine",
    address: "Via Maddalena, 38, Messina",
    type: "Store",
    image: "https://picsum.photos/800/400?random=51"
  },
  {
    name: "Torre Faro",
    address: "Via Circuito, 177, Messina",
    type: "Store",
    image: "https://picsum.photos/800/400?random=52"
  },
  {
    name: "Centro Commerciale Tremestieri",
    address: "SS 114 Km 6, Messina",
    type: "Store",
    image: "https://picsum.photos/800/400?random=53"
  }
];

export const Locations: React.FC = () => {
  return (
    <div className="pt-24 min-h-screen bg-brand-black">
      <SEO
        title="Le nostre Sedi | Dimensione Immagine"
        description="Vieni a trovarci nelle nostre sedi a Capo d’Orlando e Messina. Laboratorio di stampa e negozi Kruder."
        image="/og-sedi.jpg"
      />
      <div className="container mx-auto px-6 py-12 text-center">
        <span className="text-brand-gold text-xs font-bold uppercase tracking-widest mb-4 block">Dove trovarci</span>
        <h1 className="font-serif text-5xl md:text-7xl mb-6">Negozi & Sedi</h1>
        <p className="text-white/60 max-w-xl mx-auto font-light">
          Vieni a trovarci nelle nostre sedi per discutere del tuo progetto.
        </p>
      </div>

      <div className="container mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 gap-12 max-w-4xl mx-auto">
          {LOCATIONS.map((loc, index) => (
            <div key={index} className="bg-brand-darkgray border border-white/5 overflow-hidden flex flex-col md:flex-row hover:border-brand-gold/30 transition-colors duration-300">
              <div className="md:w-1/2 h-64 md:h-auto relative">
                <img 
                  src={`${loc.image}&grayscale`} 
                  alt={`Sede ${loc.name}`} 
                  className="w-full h-full object-cover"
                  width="800"
                  height="400"
                  loading="lazy"
                />
                <div className="absolute top-4 left-4 bg-brand-black/80 px-3 py-1 text-xs text-brand-gold uppercase tracking-widest border border-brand-gold/20">
                  {loc.type}
                </div>
              </div>
              <div className="p-8 md:w-1/2 flex flex-col justify-center">
                <h3 className="text-2xl font-serif text-white mb-6">{loc.name}</h3>
                
                <div className="space-y-4 text-white/70">
                  <div className="flex items-start">
                    <MapPin size={20} className="text-brand-gold mr-3 shrink-0 mt-1" />
                    <span>{loc.address}</span>
                  </div>
                  {loc.phone && (
                    <div className="flex items-center">
                      <Phone size={20} className="text-brand-gold mr-3 shrink-0" />
                      <span>{loc.phone}</span>
                    </div>
                  )}
                   <div className="flex items-center">
                      <Clock size={20} className="text-brand-gold mr-3 shrink-0" />
                      <span>Lun - Ven: 09:00 - 18:00</span>
                    </div>
                </div>
                
                <div className="mt-8 pt-6 border-t border-white/10">
                  <a 
                    href={`https://maps.google.com/?q=${encodeURIComponent(loc.address)}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-sm text-brand-gold hover:text-white uppercase tracking-widest transition-colors"
                  >
                    Vedi su Mappa
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};