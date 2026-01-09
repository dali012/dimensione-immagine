import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { SEO } from "../components/SEO/SEO";
import { PortfolioItem } from "../types";

const PORTFOLIO_ITEMS: PortfolioItem[] = [
  {
    id: 1,
    title: "Collezione Estate",
    category: "Donna",
    imageUrl: "/images/portfolio-branding.png",
  },
  {
    id: 2,
    title: "Eleganza Quotidiana",
    category: "Uomo",
    imageUrl: "/images/portfolio-shop.png",
  },
  {
    id: 3,
    title: "Nuovi Arrivi",
    category: "Plus Size",
    imageUrl: "/images/portfolio-sign.png",
  },
  {
    id: 4,
    title: "Evento Fashion",
    category: "Donna",
    imageUrl: "/images/portfolio-print.png",
  },
  {
    id: 5,
    title: "Accessori Chic",
    category: "Accessori",
    imageUrl: "/images/portfolio-cafe.png",
  },
  {
    id: 6,
    title: "Lookbook Autunno",
    category: "Donna",
    imageUrl: "/images/portfolio-wine.png",
  },
  {
    id: 7,
    title: "Casual Style",
    category: "Uomo",
    imageUrl: "/images/portfolio-hotel.png",
  },
  {
    id: 8,
    title: "Curvy & Cool",
    category: "Plus Size",
    imageUrl: "/images/portfolio-gym.png",
  },
];

const CATEGORIES = ["Tutti", "Donna", "Uomo", "Plus Size", "Accessori"];

export const Portfolio: React.FC = () => {
  const location = useLocation();
  const [filter, setFilter] = useState("Tutti");

  useEffect(() => {
    if (location.state && location.state.category) {
      setFilter(location.state.category);
    }
  }, [location.state]);

  const filteredItems =
    filter === "Tutti"
      ? PORTFOLIO_ITEMS
      : PORTFOLIO_ITEMS.filter((item) => item.category === filter);

  return (
    <div className="pt-24 min-h-screen bg-brand-black">
      <SEO
        title="Le Nostre Collezioni | Dimensione Immagine"
        description="Esplora i look delle nostre collezioni Uomo, Donna e Plus Size."
        image="/og-portfolio.jpg"
      />
      <div className="container mx-auto px-6 py-12 text-center">
        <span className="text-brand-gold text-xs font-bold uppercase tracking-widest mb-4 block">
          Lookbook
        </span>
        <h1 className="font-serif text-5xl md:text-7xl mb-6">I nostri look</h1>
        <p className="text-white/60 max-w-xl mx-auto font-light">
          Ogni outfit racconta una personalità unica. Lasciati ispirare.
        </p>
      </div>

      {/* Filter */}
      <div className="container mx-auto px-6 mb-12">
        <div className="flex flex-wrap justify-center gap-4 md:gap-8">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`text-sm uppercase tracking-widest pb-2 border-b-2 transition-all duration-300 ${
                filter === cat
                  ? "text-brand-gold border-brand-gold"
                  : "text-white/50 border-transparent hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="container mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="group relative aspect-square overflow-hidden cursor-pointer bg-brand-darkgray"
            >
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 group-hover:filter-none opacity-80 group-hover:opacity-100" // kept existing class for now, assumed behavior matches
                width="600"
                height="600"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-brand-black/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-6 text-center">
                <span className="text-brand-gold text-xs uppercase tracking-widest mb-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75">
                  {item.category}
                </span>
                <h3 className="text-white font-serif text-2xl transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  {item.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
