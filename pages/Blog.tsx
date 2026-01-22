import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { SEO } from "../components/SEO/SEO";
import { Reveal } from "../components/UI/Reveal";
import { blogPosts } from "../data/blog";
import { Calendar, User, Tag } from "lucide-react";
import { SectionHeader } from "../components/UI/SectionHeader";

export const Blog: React.FC = () => {
  const location = useLocation();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Tutte");

  const categories = useMemo(
    () => ["Tutte", ...Array.from(new Set(blogPosts.map((p) => p.category)))],
    [],
  );

  const filteredPosts = useMemo(() => {
    const query = search.trim().toLowerCase();
    return blogPosts.filter((post) => {
      const matchesCategory =
        category === "Tutte" || post.category === category;
      const matchesQuery =
        !query ||
        post.title.toLowerCase().includes(query) ||
        post.excerpt.toLowerCase().includes(query) ||
        post.content.some((p) => p.toLowerCase().includes(query));
      return matchesCategory && matchesQuery;
    });
  }, [search, category]);

  return (
    <div className="pt-24 min-h-screen bg-brand-bg text-brand-text-primary">
      <SEO
        title="Blog e News | Dimensione Immagine"
        description="Leggi le ultime novità dal mondo della moda, consigli di stile e tendenze direttamente dal blog di Dimensione Immagine."
        url={`https://www.dimensioneimmagineabbigliamento.it${location.pathname}`}
        image="/og-blog.jpg" // You might want to ensure this image exists or use a generic one
      />

      <div className="container mx-auto px-6 py-12">
        <Reveal width="100%">
          <div className="mb-12">
            <SectionHeader
              label="Novità"
              title="Il Nostro Blog"
              subtitle="Esplora le ultime tendenze, i consigli di stile e le novità del mondo fashion selezionate per te."
              as="h1"
            />
          </div>
        </Reveal>

        <div className="max-w-3xl mx-auto mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cerca articoli, tendenze, accessori..."
              className="w-full bg-transparent border-b border-brand-border py-3 text-brand-text-primary focus:outline-none focus:border-brand-accent transition-colors placeholder-brand-text-secondary/60"
              aria-label="Cerca nel blog"
            />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-transparent border-b border-brand-border py-3 text-brand-text-primary focus:outline-none focus:border-brand-accent transition-colors cursor-pointer"
              aria-label="Filtra per categoria"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post) => (
            <Reveal key={post.id} width="100%">
              <article className="bg-white rounded-lg overflow-hidden border border-brand-border shadow-sm hover:shadow-md transition-shadow duration-300 h-full flex flex-col">
                <Link
                  to={`/blog/${post.slug}`}
                  className="block h-64 overflow-hidden"
                >
                  <img
                    src={post.imageUrl}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                </Link>
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex items-center text-xs text-brand-text-secondary mb-4 space-x-4">
                    <span className="flex items-center">
                      <Calendar size={14} className="mr-1" />
                      {post.date}
                    </span>
                    <span className="flex items-center">
                      <User size={14} className="mr-1" />
                      {post.author}
                    </span>
                    <span className="flex items-center text-brand-accent font-semibold">
                      <Tag size={14} className="mr-1" />
                      {post.category}
                    </span>
                  </div>

                  <Link
                    to={`/blog/${post.slug}`}
                    className="text-2xl font-serif font-bold text-brand-text-primary mb-3 hover:text-brand-accent transition-colors"
                  >
                    {post.title}
                  </Link>

                  <p className="text-brand-text-secondary mb-4 line-clamp-3 grow">
                    {post.excerpt}
                  </p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        {filteredPosts.length === 0 && (
          <div className="text-center py-16">
            <p className="text-brand-text-secondary italic">
              Nessun articolo trovato con i filtri selezionati.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
