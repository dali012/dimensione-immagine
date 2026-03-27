import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Heart } from "lucide-react";
import { SEO } from "../components/SEO/SEO";
import { Reveal } from "../components/UI/Reveal";
import { SectionHeader } from "../components/UI/SectionHeader";
import { useSiteContent } from "../contexts/SiteContentContext";
import {
  useCatalogItems,
  useCatalogPageContent,
} from "../sanity/publicContent";

const FILTERS = ["Tutto", "Accessori", "Donna", "Uomo"] as const;

export const Catalog: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const content = useCatalogPageContent();
  const items = useCatalogItems();
  const { siteSettings } = useSiteContent();
  const [activeFilter, setActiveFilter] = useState("Tutto");
  const [search, setSearch] = useState("");
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const filterParam = params.get("filter");
    if (filterParam && FILTERS.includes(filterParam as (typeof FILTERS)[number])) {
      setActiveFilter(filterParam);
    } else {
      setActiveFilter("Tutto");
    }
  }, [location.search]);

  useEffect(() => {
    const stored = localStorage.getItem("catalog-favorites");
    if (!stored) return;

    try {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) {
        setFavorites(parsed.filter((value) => typeof value === "string"));
      }
    } catch {
      setFavorites([]);
    }
  }, []);

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const updated = prev.includes(id)
        ? prev.filter((favoriteId) => favoriteId !== id)
        : [...prev, id];
      localStorage.setItem("catalog-favorites", JSON.stringify(updated));
      return updated;
    });
  };

  const handleFilterClick = (filter: string) => {
    setActiveFilter(filter);
    if (filter === "Tutto") {
      navigate("/trovi-da-noi");
      return;
    }
    navigate(`/trovi-da-noi?filter=${filter}`);
  };

  const filteredItems = useMemo(() => {
    const activeItems =
      activeFilter === "Tutto"
        ? items
        : items.filter((item) => item.category === activeFilter);
    const query = search.trim().toLowerCase();
    if (!query) return activeItems;

    return activeItems.filter((item) => {
      const haystack = `${item.title} ${item.caption || ""} ${item.image.alt}`.toLowerCase();
      return haystack.includes(query);
    });
  }, [activeFilter, items, search]);

  const activeDescription = useMemo(
    () =>
      content.filterDescriptions.find(
        (item) => item.category === activeFilter,
      ) || null,
    [activeFilter, content.filterDescriptions],
  );

  return (
    <div className="pt-24 min-h-screen bg-brand-bg text-brand-text-primary">
      <SEO
        title={content.seo.title}
        description={content.seo.description}
        url={`${siteSettings.siteUrl}${location.pathname}${location.search}`}
        image={content.seo.image?.src}
        noIndex={content.seo.noIndex}
        siteUrl={siteSettings.siteUrl}
        siteName={siteSettings.siteName}
      />

      <div className="container mx-auto px-6 py-12">
        <Reveal width="100%">
          <div className="text-center mb-12">
            <SectionHeader
              label={content.headerLabel}
              title={content.headerTitle}
              subtitle={content.headerSubtitle}
              as="h1"
            />

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
                placeholder={content.searchPlaceholder}
                className="w-full bg-transparent border-b border-brand-border py-3 text-brand-text-primary focus:outline-none focus:border-brand-accent transition-colors placeholder-brand-text-secondary/60"
                aria-label="Cerca nella collezione"
              />
            </div>

            {activeFilter !== "Tutto" && activeDescription && (
              <div className="mt-6 text-brand-text-secondary text-sm md:text-base leading-relaxed">
                <p className="uppercase tracking-widest text-xs text-brand-accent mb-3">
                  {activeFilter}
                </p>
                <ul className="space-y-2">
                  {activeDescription.items.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </Reveal>

        <motion.div
          layout
          className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8"
        >
          <AnimatePresence>
            {filteredItems.map((item) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
                key={item.id}
                className="break-inside-avoid relative group overflow-hidden bg-white border border-brand-border shadow-sm"
              >
                <button
                  onClick={() => toggleFavorite(item.id)}
                  className="absolute top-4 right-4 z-10 bg-white/80 backdrop-blur-sm p-2 rounded-full border border-brand-border hover:border-brand-accent transition-colors"
                  aria-label={
                    favorites.includes(item.id)
                      ? "Rimuovi dai preferiti"
                      : "Aggiungi ai preferiti"
                  }
                >
                  <Heart
                    size={16}
                    className={
                      favorites.includes(item.id)
                        ? "text-brand-accent fill-brand-accent"
                        : "text-brand-text-secondary"
                    }
                  />
                </button>
                <img
                  src={item.image.src}
                  alt={item.image.alt}
                  className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0"
                  loading="lazy"
                  decoding="async"
                  sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                  style={{ aspectRatio: "3 / 4" }}
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-300" />
                <div className="absolute bottom-6 left-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-white text-xs font-bold uppercase tracking-widest bg-brand-accent px-2 py-1 mb-2 inline-block">
                    {item.category}
                  </span>
                  <p className="text-white font-serif italic text-lg shadow-black drop-shadow-md">
                    {item.title}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredItems.length === 0 && (
          <div className="text-center py-20">
            <p className="text-brand-text-secondary italic">
              {content.emptyStateText}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
