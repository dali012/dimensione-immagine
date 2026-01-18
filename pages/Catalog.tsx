import React, { useMemo, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { SEO } from "../components/SEO/SEO";
import { Reveal } from "../components/UI/Reveal";
import { catalogImages } from "../data/catalog";
import { SectionHeader } from "../components/UI/SectionHeader";
import { Heart } from "lucide-react";

const FILTERS = ["Tutto", "Accessori", "Donna", "Uomo"];

const FILTER_DESCRIPTIONS: Record<"Donna" | "Uomo" | "Accessori", string[]> = {
  Donna: [
    "Mode eleganti, casual e cerimonia",
    "Maglieria, cappotti, denim",
    "Linea Donna Calibrata (taglie forti)",
  ],
  Uomo: [
    "Stile casual, urban e classico",
    "Camiceria, pantaloni, denim",
    "Linea Uomo Calibrata (taglie forti)",
    "Capispalla tecnici, parka, piumini",
  ],
  Accessori: [
    "Borse, cinture, portafogli",
    "Sciarpe, cappelli e accessori moda",
  ],
};

export const Catalog: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState("Tutto");
  const [search, setSearch] = useState("");
  const [favorites, setFavorites] = useState<number[]>([]);

  // Sync state with URL params on mount and update
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const filterParam = params.get("filter");
    if (filterParam && FILTERS.includes(filterParam)) {
      setActiveFilter(filterParam);
    } else {
      setActiveFilter("Tutto");
    }
  }, [location.search]);

  useEffect(() => {
    const stored = localStorage.getItem("catalog-favorites");
    if (stored) {
      try {
        setFavorites(JSON.parse(stored));
      } catch {
        setFavorites([]);
      }
    }
  }, []);

  const toggleFavorite = (id: number) => {
    setFavorites((prev) => {
      const updated = prev.includes(id)
        ? prev.filter((fav) => fav !== id)
        : [...prev, id];
      localStorage.setItem("catalog-favorites", JSON.stringify(updated));
      return updated;
    });
  };

  const handleFilterClick = (filter: string) => {
    setActiveFilter(filter);
    if (filter === "Tutto") {
      navigate("/trovi-da-noi");
    } else {
      navigate(`/trovi-da-noi?filter=${filter}`);
    }
  };

  const filteredImages = useMemo(() => {
    const byCategory =
      activeFilter === "Tutto"
        ? catalogImages
        : catalogImages.filter((img) => img.category === activeFilter);
    const query = search.trim().toLowerCase();
    if (!query) return byCategory;
    return byCategory.filter((img) => img.alt.toLowerCase().includes(query));
  }, [activeFilter, search]);

  return (
    <div className="pt-24 min-h-screen bg-brand-bg text-brand-text-primary">
      <SEO
        title="Trovi da Noi | Dimensione Immagine"
        description="Esplora le nostre collezioni Uomo, Donna e Accessori. Il meglio della moda a Messina."
        url={`https://www.dimensioneimmagine.net${location.pathname}${location.search}`}
        image="/og-catalog.jpg"
      />

      <div className="container mx-auto px-6 py-12">
        <Reveal width="100%">
          <div className="text-center mb-12">
            <SectionHeader
              label="La Nostra Selezione"
              title="Trovi da Noi"
              subtitle="Esplora le collezioni Uomo, Donna e Accessori. Filtra per categoria e salva i preferiti."
              as="h1"
            />

            {/* Filter Buttons */}
            <div className="flex flex-wrap justify-center gap-4 mt-8">
              {FILTERS.map((filter) => (
                <button
                  key={filter}
                  onClick={() => handleFilterClick(filter)}
                  className={`px-6 py-2 text-sm uppercase tracking-widest transition-all duration-300 border border-brand-accent cursor-pointer ${
                    activeFilter === filter
                      ? "bg-brand-accent text-white"
                      : "bg-transparent text-brand-text-primary hover:bg-brand-accent/10"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>

            <div className="max-w-2xl mx-auto mt-6">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cerca nella collezione..."
                className="w-full bg-transparent border-b border-brand-border py-3 text-brand-text-primary focus:outline-none focus:border-brand-accent transition-colors placeholder-brand-text-secondary/60"
                aria-label="Cerca nella collezione"
              />
            </div>

            {activeFilter !== "Tutto" &&
              FILTER_DESCRIPTIONS[
                activeFilter as "Donna" | "Uomo" | "Accessori"
              ] && (
                <div className="mt-6 text-brand-text-secondary text-sm md:text-base leading-relaxed">
                  <p className="uppercase tracking-widest text-xs text-brand-accent mb-3">
                    {activeFilter}
                  </p>
                  <ul className="space-y-2">
                    {FILTER_DESCRIPTIONS[
                      activeFilter as "Donna" | "Uomo" | "Accessori"
                    ].map((line) => (
                      <li key={line}>{line}</li>
                    ))}
                  </ul>
                </div>
              )}
          </div>
        </Reveal>

        {/* Masonry Grid */}
        <motion.div
          layout
          className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8"
        >
          <AnimatePresence>
            {filteredImages.map((image) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
                key={image.id}
                className="break-inside-avoid relative group overflow-hidden bg-white border border-brand-border shadow-sm"
              >
                <button
                  onClick={() => toggleFavorite(image.id)}
                  className="absolute top-4 right-4 z-10 bg-white/80 backdrop-blur-sm p-2 rounded-full border border-brand-border hover:border-brand-accent transition-colors"
                  aria-label={
                    favorites.includes(image.id)
                      ? "Rimuovi dai preferiti"
                      : "Aggiungi ai preferiti"
                  }
                >
                  <Heart
                    size={16}
                    className={
                      favorites.includes(image.id)
                        ? "text-brand-accent fill-brand-accent"
                        : "text-brand-text-secondary"
                    }
                  />
                </button>
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-300" />
                <div className="absolute bottom-6 left-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-white text-xs font-bold uppercase tracking-widest bg-brand-accent px-2 py-1 mb-2 inline-block">
                    {image.category}
                  </span>
                  <p className="text-white font-serif italic text-lg shadow-black drop-shadow-md">
                    {image.alt}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredImages.length === 0 && (
          <div className="text-center py-20">
            <p className="text-brand-text-secondary italic">
              Nessun elemento trovato in questa categoria al momento.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
