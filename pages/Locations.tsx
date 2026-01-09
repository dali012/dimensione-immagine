import React, { useState } from "react";
import { MapPin, Filter, Store } from "lucide-react";
import { SEO } from "../components/SEO/SEO";
import { Button } from "../components/UI/Button";

interface LocationData {
  name: string;
  region: string;
  address: string;
  isFranchise: boolean;
  image: string;
}

const LOCATIONS: LocationData[] = [
  {
    name: "LOLITA – CENTRO COMMERCIALE “I SANNITI”",
    region: "Campania",
    address: "Lolita Via dei Longobardi, 82100 Benevento BN",
    isFranchise: true,
    image: "https://picsum.photos/800/400?random=1",
  },
  {
    name: "MS ROYAL – CENTRO COMMERCIALE “LIZ GALLERY”",
    region: "Campania",
    address:
      "Centro Commerciale Liz Gallery Via Benevento, 82016 Montesarchio BN",
    isFranchise: true,
    image: "https://picsum.photos/800/400?random=2",
  },
  {
    name: "CENTRIKO – FASHION STORE CORSO GARIBALDI",
    region: "Campania",
    address:
      "Centriko - Fashion Store Corso Garibaldi, 172/174, 82100 Benevento BN",
    isFranchise: true,
    image: "https://picsum.photos/800/400?random=3",
  },
  {
    name: "CENTRIKO – FASHION STORE “IL NOCE GALLERIA COMMERCIALE”",
    region: "Campania",
    address: "Centriko - Fashion Store Via dei Dauni, 82100 Benevento BN",
    isFranchise: true,
    image: "https://picsum.photos/800/400?random=4",
  },
  {
    name: "CENTRO COMMERCIALE VULCANO BUONO",
    region: "Campania",
    address: "Vulcano Buono Via Boscofangone, 80035 Nola NA",
    isFranchise: false,
    image: "https://picsum.photos/800/400?random=5",
  },
  {
    name: "SHOPPING “CENTER LE PORTE DEL SAVUTO”",
    region: "Calabria",
    address:
      "Shopping Center - Le Porte Del Savuto Via Antonio Guarasci, 87056 Vallegianno (CS)",
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
    name: "TORRE FARO",
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
    <div className="pt-24 min-h-screen bg-brand-black">
      <SEO
        title="Le nostre Sedi | Dimensione Immagine"
        description="Vieni a trovarci nei nostri showroom a Capo d’Orlando e Messina. Scopri le collezioni dal vivo."
        image="/og-sedi.jpg"
      />
      <div className="container mx-auto px-6 py-12 text-center">
        <span className="text-brand-gold text-xs font-bold uppercase tracking-widest mb-4 block">
          Dove trovarci
        </span>
        <h1 className="font-serif text-5xl md:text-7xl mb-6">
          Negozi & Showroom
        </h1>
        <p className="text-white/60 max-w-xl mx-auto font-light">
          Vieni a trovarci nei nostri punti vendita per scoprire le nuove
          collezioni.
        </p>
      </div>

      {/* Filters */}
      <div className="container mx-auto px-6 mb-12">
        <div className="flex flex-col md:flex-row justify-center items-center gap-6 bg-brand-darkgray p-6 border border-white/5 rounded-lg max-w-3xl mx-auto">
          <div className="flex items-center gap-2 text-brand-gold mb-2 md:mb-0">
            <Filter size={20} />
            <span className="uppercase tracking-widest text-xs font-bold">
              Filtra per:
            </span>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="bg-brand-black text-white border border-white/20 px-4 py-2 rounded focus:border-brand-gold focus:outline-none"
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
              className="bg-brand-black text-white border border-white/20 px-4 py-2 rounded focus:border-brand-gold focus:outline-none"
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
      </div>

      <div className="container mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 gap-8 max-w-4xl mx-auto">
          {filteredLocations.map((loc, index) => (
            <div
              key={index}
              className="bg-brand-darkgray border border-white/5 overflow-hidden flex flex-col md:flex-row hover:border-brand-gold/30 transition-colors duration-300 group"
            >
              <div className="md:w-1/3 h-56 md:h-auto relative overflow-hidden">
                <img
                  src={`${loc.image}&grayscale`}
                  alt={`Sede ${loc.name}`}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  width="800"
                  height="400"
                  loading="lazy"
                />
                <div className="absolute top-4 left-4 bg-brand-black/90 px-3 py-1 text-xs text-brand-gold uppercase tracking-widest border border-brand-gold/20">
                  {loc.region}
                </div>
              </div>
              <div className="p-8 md:w-2/3 flex flex-col justify-center">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-serif text-white pr-4">
                    {loc.name}
                  </h3>
                  <span
                    className={`text-[10px] uppercase tracking-widest px-2 py-1 border rounded ${
                      loc.isFranchise
                        ? "border-white/20 text-white/50"
                        : "border-brand-gold/50 text-brand-gold"
                    }`}
                  >
                    {loc.isFranchise ? "Franchising" : "Proprietario"}
                  </span>
                </div>

                <div className="space-y-4 text-white/70 mb-6 flex-grow">
                  <div className="flex items-start">
                    <MapPin
                      size={20}
                      className="text-brand-gold mr-3 shrink-0 mt-1"
                    />
                    <span className="leading-relaxed">{loc.address}</span>
                  </div>
                  <div className="flex items-center">
                    <Store
                      size={20}
                      className="text-brand-gold mr-3 shrink-0"
                    />
                    <span>Lun - Dom: 09:30 - 13:00 / 16:30 - 20:30</span>
                  </div>
                </div>

                <div className="pt-6 border-t border-white/10 mt-auto">
                  <a
                    href={`https://maps.google.com/?q=${encodeURIComponent(
                      loc.address
                    )}`}
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

          {filteredLocations.length === 0 && (
            <div className="text-center py-12 border border-dashed border-white/10 rounded-lg">
              <p className="text-white/50">
                Nessun punto vendita trovato con i filtri selezionati.
              </p>
              <Button
                variant="text"
                onClick={() => {
                  setSelectedRegion("Tutte");
                  setSelectedOwnership("Tutti");
                }}
                className="mt-4"
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
