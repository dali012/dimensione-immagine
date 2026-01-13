import React, { useState } from "react";
import { MapPin, Filter, Store } from "lucide-react";
import { SEO } from "../components/SEO/SEO";
import { Button } from "../components/UI/Button";
import { Reveal } from "../components/UI/Reveal";

interface LocationData {
  name: string;
  region: string;
  address: string;
  isFranchise: boolean;
  image: string;
}

const LOCATIONS: LocationData[] = [
  {
    name: "Lolita Benevento",
    region: "Campania",
    address: "Via dei Longobardi, 82100 Benevento BN",
    isFranchise: true,
    image: "https://picsum.photos/800/400?random=1",
  },
  {
    name: "MS Royal Montesarchio",
    region: "Campania",
    address:
      "Centro Commerciale Liz Gallery, Via Benevento, 82016 Montesarchio BN",
    isFranchise: true,
    image: "https://picsum.photos/800/400?random=2",
  },
  {
    name: "Centriko C.so Garibaldi",
    region: "Campania",
    address: "Corso Garibaldi, 172/174, 82100 Benevento BN",
    isFranchise: true,
    image: "https://picsum.photos/800/400?random=3",
  },
  {
    name: "Centriko Il Noce",
    region: "Campania",
    address: "Galleria Comm. Il Noce, Via dei Dauni, 82100 Benevento BN",
    isFranchise: true,
    image: "https://picsum.photos/800/400?random=4",
  },
  {
    name: "Vulcano Buono",
    region: "Campania",
    address: "Via Boscofangone, 80035 Nola NA",
    isFranchise: false,
    image: "https://picsum.photos/800/400?random=5",
  },
  {
    name: "Le Porte Del Savuto",
    region: "Calabria",
    address: "Via Antonio Guarasci, 87056 Vallegianno (CS)",
    isFranchise: true,
    image: "https://picsum.photos/800/400?random=6",
  },
  {
    name: "Montesilvano Store",
    region: "Abruzzo",
    address: "Corso Umberto Primo, 610 (PE)",
    isFranchise: false,
    image: "https://picsum.photos/800/400?random=7",
  },
  {
    name: "Boutique Donna",
    region: "Sicilia",
    address: "Via Maddalena, 74, 98122 angolo Via dei Mille (ME)",
    isFranchise: false,
    image: "https://picsum.photos/800/400?random=8",
  },
  {
    name: "Torre Faro",
    region: "Sicilia",
    address: "Via Circuito, 177, 98164 Ex Lumachina (ME)",
    isFranchise: false,
    image: "https://picsum.photos/800/400?random=9",
  },
  {
    name: "Boutique Uomo",
    region: "Sicilia",
    address: "Via Giordano Bruno, 38/D, angolo Via Maddalena (ME)",
    isFranchise: false,
    image: "https://picsum.photos/800/400?random=10",
  },
];

const REGIONS = ["Tutte", "Abruzzo", "Calabria", "Campania", "Sicilia"];
const OWNERSHIP_TYPES = ["Tutti", "Proprietario", "Franchising"];

export const Locations: React.FC = () => {
  const [selectedRegion, setSelectedRegion] = useState("Tutte");
  const [selectedOwnership, setSelectedOwnership] = useState("Tutti");

  const filteredLocations = LOCATIONS.filter((loc) => {
    const regionMatch =
      selectedRegion === "Tutte" ||
      loc.region.toLowerCase() === selectedRegion.toLowerCase();

    let ownershipMatch = true;
    if (selectedOwnership === "Franchising") {
      ownershipMatch = loc.isFranchise;
    } else if (selectedOwnership === "Proprietario") {
      ownershipMatch = !loc.isFranchise;
    }

    return regionMatch && ownershipMatch;
  });

  return (
    <div className="pt-24 min-h-screen bg-brand-bg text-brand-text-primary">
      <SEO
        title="Le nostre Sedi | Dimensione Immagine"
        description="Vieni a trovarci nei nostri showroom e punti vendita in tutta Italia."
        image="/og-sedi.jpg"
      />

      {/* Editorial Header */}
      <section className="container mx-auto px-6 py-12 md:py-20 text-center">
        <Reveal width="100%">
          <span className="text-brand-text-secondary text-xs font-bold uppercase tracking-widest mb-4 block">
            Dove trovarci
          </span>
          <h1 className="font-serif text-5xl md:text-7xl mb-8">
            Negozi & Showroom
          </h1>
          <p className="text-brand-text-secondary text-lg font-light max-w-xl mx-auto">
            Vieni a trovarci nei nostri punti vendita per scoprire le nuove
            collezioni.
          </p>
        </Reveal>
      </section>

      {/* Clean Filters */}
      <div className="container mx-auto px-6 mb-16">
        <Reveal width="100%" delay={0.2} direction="down">
          <div className="flex flex-col md:flex-row justify-center items-center gap-8 border-y border-brand-border py-8 max-w-4xl mx-auto">
            <div className="flex items-center gap-2 text-brand-text-primary mb-2 md:mb-0">
              <Filter size={18} />
              <span className="uppercase tracking-widest text-xs font-bold">
                Filtra
              </span>
            </div>

            <div className="flex flex-wrap justify-center gap-4">
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="bg-transparent text-brand-text-primary border-b border-brand-border px-4 py-2 hover:border-brand-accent focus:border-brand-accent focus:outline-none transition-colors cursor-pointer"
                aria-label="Filtra per regione"
              >
                {REGIONS.map((region) => (
                  <option key={region} value={region}>
                    {region}
                  </option>
                ))}
              </select>

              <select
                value={selectedOwnership}
                onChange={(e) => setSelectedOwnership(e.target.value)}
                className="bg-transparent text-brand-text-primary border-b border-brand-border px-4 py-2 hover:border-brand-accent focus:border-brand-accent focus:outline-none transition-colors cursor-pointer"
                aria-label="Filtra per tipologia"
              >
                {OWNERSHIP_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </Reveal>
      </div>

      <div className="container mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
          {filteredLocations.map((loc, index) => (
            <Reveal key={index} width="100%" delay={index * 0.1} fullHeight>
              <div className="group flex flex-col h-full bg-white rounded-sm pb-6 transition-shadow duration-300 hover:shadow-sm border border-transparent hover:border-brand-border">
                <div className="aspect-video relative overflow-hidden mb-6 bg-brand-surface">
                  <img
                    src={`${loc.image}&grayscale`}
                    alt={`Sede ${loc.name}`}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute top-4 left-4 bg-white/90 px-3 py-1 text-[10px] text-brand-text-primary uppercase tracking-widest backdrop-blur-sm">
                    {loc.region}
                  </div>
                </div>

                <div className="px-6 flex-grow flex flex-col">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-serif text-brand-text-primary pr-2 leading-tight">
                      {loc.name}
                    </h3>
                  </div>

                  <span
                    className={`text-[10px] uppercase tracking-widest mb-4 inline-block ${
                      loc.isFranchise
                        ? "text-brand-text-secondary"
                        : "text-brand-accent"
                    }`}
                  >
                    {loc.isFranchise ? "Franchising" : "Store Proprietario"}
                  </span>

                  <div className="space-y-3 text-brand-text-secondary text-sm font-light mb-6">
                    <div className="flex items-start">
                      <MapPin
                        size={16}
                        className="text-brand-accent mr-3 shrink-0 mt-0.5"
                      />
                      <span className="leading-relaxed">{loc.address}</span>
                    </div>
                    <div className="flex items-center">
                      <Store
                        size={16}
                        className="text-brand-accent mr-3 shrink-0"
                      />
                      <span>Lun-Dom: 09:30-13:00 / 16:30-20:30</span>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-brand-border mt-auto">
                    <a
                      href={`https://maps.google.com/?q=${encodeURIComponent(
                        loc.address
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-xs font-bold text-brand-text-primary hover:text-brand-accent uppercase tracking-widest transition-colors"
                    >
                      Indicazioni
                    </a>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}

          {filteredLocations.length === 0 && (
            <div className="col-span-full text-center py-20">
              <p className="text-brand-text-secondary mb-6 font-light text-lg">
                Nessun punto vendita trovato con i filtri selezionati.
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedRegion("Tutte");
                  setSelectedOwnership("Tutti");
                }}
              >
                Resetta Filtri
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
