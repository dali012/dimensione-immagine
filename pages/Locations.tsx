import { Filter, MapPin, Phone, Store } from "lucide-react";
import React, { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { SEO } from "../components/SEO/SEO";
import { Button } from "../components/UI/Button";
import { Reveal } from "../components/UI/Reveal";
import { SectionHeader } from "../components/UI/SectionHeader";

interface LocationData {
  name: string;
  region: string;
  address: string;
  isFranchise: boolean;
  image: string;
  phone?: string;
}

const LOCATIONS: LocationData[] = [
  {
    name: "Vulcano Buono (Victor Benjamin)",
    region: "Campania",
    address: "https://maps.app.goo.gl/SgrSD6mEyAUuzmhz8",
    isFranchise: true,
    image: "/images/victor-benjamin.jpeg",
  },
  {
    name: "Dimensione immagine",
    region: "Sicilia",
    address: "https://maps.app.goo.gl/GKpBfNFA3L9iZLSD6",
    isFranchise: false,
    image: "/images/dimensione-immagine.jpeg",
    phone: "0902141746",
  },
  {
    name: "Vittoria Company",
    region: "Puglia",
    address: "https://maps.app.goo.gl/kpAaPAKXJ3YAGzSU7",
    isFranchise: true,
    image: "/images/vittoria-company.jpeg",
  },
  {
    name: "Le Porte Del Savuto (Aquino abbigliamento)",
    region: "Calabria",
    address: "https://maps.app.goo.gl/7vLK9Mf9nwBFTmyL7",
    isFranchise: true,
    image: "/images/calabria.jpeg",
  },
  {
    name: "Montesilvano Store",
    region: "Abruzzo",
    address: "https://maps.app.goo.gl/ok2jt8DpLFYcjMFz5",
    isFranchise: false,
    image: "/images/montesilvano.jpeg",
    phone: "0852034097",
  },
  {
    name: "Boutique Donna",
    region: "Sicilia",
    address: "https://maps.app.goo.gl/53LA8JTywzaJV5RGA",
    isFranchise: false,
    image: "/images/boutique-donna.jpeg",
    phone: "0902131218",
  },
  {
    name: "Torre Faro",
    region: "Sicilia",
    address: "https://maps.app.goo.gl/R2nNhbPdUjb9dMbQ6",
    isFranchise: false,
    image: "/images/torre-faro.jpeg",
    phone: "090326785",
  },
  {
    name: "Boutique Uomo",
    region: "Sicilia",
    address: "https://maps.app.goo.gl/2WrCVJGFWRrpueMf9",
    isFranchise: false,
    image: "/images/boutique-uomo.jpeg",
    phone: "0909074525",
  },
  {
    name: "Centro Commerciale Tremestieri",
    region: "Sicilia",
    address: "https://maps.app.goo.gl/RnTKwHm7rg97mDng8",
    isFranchise: false,
    image: "/images/tremestieri.jpeg",
    phone: "0902406782",
  },
];

const REGIONS = ["Tutte", "Abruzzo", "Calabria", "Campania", "Sicilia"];
const OWNERSHIP_TYPES = ["Tutti", "Proprietario", "Franchising"];

export const Locations: React.FC = () => {
  const location = useLocation();
  const [selectedRegion, setSelectedRegion] = useState("Tutte");
  const [selectedOwnership, setSelectedOwnership] = useState("Tutti");

  // Sort by Proprietario (isFranchise false first), then alphabetically by name
  const sortedLocations = useMemo(() => {
    return [...LOCATIONS].sort((a, b) => {
      if (a.isFranchise === b.isFranchise) {
        return a.name.localeCompare(b.name);
      }
      return a.isFranchise ? 1 : -1; // Proprietario (false) first
    });
  }, []);

  const filteredLocations = sortedLocations.filter((loc) => {
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

  const groupedLocations = useMemo(() => {
    return filteredLocations.reduce<Record<string, LocationData[]>>(
      (acc, loc) => {
        if (!acc[loc.region]) acc[loc.region] = [];
        acc[loc.region].push(loc);
        return acc;
      },
      {},
    );
  }, [filteredLocations]);

  const regionEntries = useMemo(
    () => Object.entries(groupedLocations),
    [groupedLocations],
  );

  const isOpenNow = () => {
    const now = new Date();
    const minutes = now.getHours() * 60 + now.getMinutes();
    const morningOpen = 9 * 60 + 30;
    const morningClose = 13 * 60;
    const afternoonOpen = 16 * 60 + 30;
    const afternoonClose = 20 * 60 + 30;
    return (
      (minutes >= morningOpen && minutes <= morningClose) ||
      (minutes >= afternoonOpen && minutes <= afternoonClose)
    );
  };

  const locationsContent =
    regionEntries.length > 0 ? (
      regionEntries.map(([region, locations]) => (
        <div key={region} className="mb-16">
          <h3 className="text-xl font-serif text-brand-text-primary mb-8">
            {region}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
            {locations.map((loc, index) => (
              <Reveal
                key={`${loc.name}-${index}`}
                width="100%"
                delay={index * 0.1}
                fullHeight
              >
                <a href={loc.address} target="_blank" rel="noopener noreferrer">
                  <div className="group flex flex-col h-full bg-white rounded-sm pb-6 transition-shadow duration-300 hover:shadow-sm border border-brand-border">
                    <div className="aspect-video relative overflow-hidden mb-6 bg-brand-surface">
                      <img
                        src={`${loc.image}`}
                        alt={`Sede ${loc.name}`}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        loading="lazy"
                        decoding="async"
                        sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                      />
                      <div className="absolute top-4 left-4 bg-white/90 px-3 py-1 text-[10px] text-brand-text-primary uppercase tracking-widest backdrop-blur-sm">
                        {loc.region}
                      </div>
                    </div>

                    <div className="px-6 grow flex flex-col">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="text-xl font-serif text-brand-text-primary pr-2 leading-tight">
                          {loc.name}
                        </h3>
                      </div>

                      <div
                        className={`text-[10px] tracking-widest pb-2 inline-block ${
                          loc.isFranchise
                            ? "text-brand-text-secondary"
                            : "text-brand-accent"
                        }`}
                      >
                        {loc.isFranchise ? (
                          <span className="text-brand-text-secondary uppercase font-bold">
                            Franchising
                          </span>
                        ) : (
                          <span className="text-brand-text-secondary uppercase font-bold">
                            Store Proprietario <br />
                            {isOpenNow() ? (
                              <span className="text-green-500">Aperto ora</span>
                            ) : (
                              <span className="text-red-500">Chiuso ora</span>
                            )}
                          </span>
                        )}
                      </div>

                      <div className="space-y-3 text-brand-text-secondary text-sm font-light mb-6">
                        <div className="flex items-start flex-col gap-3">
                          <div className="flex items-start">
                            <MapPin
                              size={16}
                              className="text-brand-accent mr-3 shrink-0 mt-0.5"
                            />
                            <span className="leading-relaxed">
                              {loc.address}
                            </span>
                          </div>
                          <div>
                            {!loc.isFranchise && (
                              <div className="flex items-center">
                                <Store
                                  size={16}
                                  className="text-brand-accent mr-3 shrink-0"
                                />
                                <span>
                                  {(() => {
                                    switch (loc.name) {
                                      case "Torre Faro":
                                        return "Orari: Lun-Sab 9:00-20:00, Dom 9:00-13:00 / 16:00-20:00";
                                      case "Boutique Uomo":
                                        return "Orari: Lun-Sab 9:00-20:00, Dom 9:00-13:00 / 16:00-20:00";
                                      case "Boutique Donna":
                                        return "Orari: Lun-Dom 9:00-13:00 / 16:00-20:00";
                                      case "Centro Commerciale Tremestieri":
                                        return "Orari: Lun-Sab 9:00-20:30, Dom e festivi: 9:30-20:30";
                                      case "Montesilvano Store":
                                        return "Orari: Lun-Sab 9:00-20:00, Dom 9:00-13:00 / 16:00-20:00";
                                      case "Dimensione immagine":
                                        return "Orari: Lun-Sab 9:00-13:00 / 16:00-20:00";
                                      default:
                                        return "Orari: Lun-Sab 9:30-13:00 / 16:30-20:30";
                                    }
                                  })()}
                                </span>
                              </div>
                            )}
                          </div>
                          {loc.phone && (
                            <div className="flex items-center">
                              <Phone
                                size={16}
                                className="text-brand-accent mr-3 shrink-0"
                              />
                              <a
                                href={`tel:${loc.phone}`}
                                className="hover:text-brand-accent transition-colors"
                              >
                                {loc.phone}
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </a>
              </Reveal>
            ))}
          </div>
        </div>
      ))
    ) : (
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
    );

  return (
    <div className="pt-24 min-h-screen bg-brand-bg text-brand-text-primary">
      <SEO
        title="Le nostre Sedi | Dimensione Immagine"
        description="Vieni a trovarci nei nostri franchising e punti vendita in tutta Italia."
        url={`https://www.dimensioneimmagineabbigliamento.it${location.pathname}`}
        image="/og-sedi.jpg"
      />

      {/* Editorial Header */}
      <section className="container mx-auto px-4 sm:px-6 py-12 md:py-20 text-center">
        <Reveal width="100%">
          <SectionHeader
            label="Dove trovarci"
            title="Negozi & Franchising"
            subtitle="Vieni a trovarci nei nostri punti vendita per scoprire le nuove collezioni."
            as="h1"
          />
        </Reveal>
      </section>

      {/* Map Embed */}
      <section className="container mx-auto px-4 sm:px-6 mb-16">
        <Reveal width="100%">
          <div className="bg-white border border-brand-border shadow-sm overflow-hidden rounded-sm">
            <iframe
              title="Mappa Dimensione Immagine"
              src="https://www.google.com/maps?q=Via%20Maddalena%2038%2FD%2C%20Messina&output=embed"
              className="w-full h-72"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </Reveal>
      </section>

      {/* Clean Filters */}
      <div className="container mx-auto px-4 sm:px-6 mb-16">
        <Reveal width="100%" delay={0.2} direction="down">
          <div className="flex flex-col md:flex-row justify-center items-center gap-6 md:gap-8 border-y border-brand-border py-6 md:py-8 max-w-4xl mx-auto">
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
                className="w-full sm:w-auto bg-transparent text-brand-text-primary border-b border-brand-border px-4 py-2 hover:border-brand-accent focus:border-brand-accent focus:outline-none transition-colors cursor-pointer"
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
                className="w-full sm:w-auto bg-transparent text-brand-text-primary border-b border-brand-border px-4 py-2 hover:border-brand-accent focus:border-brand-accent focus:outline-none transition-colors cursor-pointer"
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

      <div className="container mx-auto px-6 pb-24">{locationsContent}</div>
    </div>
  );
};
