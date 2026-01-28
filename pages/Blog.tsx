import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { SEO } from "../components/SEO/SEO";
import { Reveal } from "../components/UI/Reveal";
import { getAllPosts } from "../sanity/posts";
import type { BlogPost as BlogPostType } from "../types";
import { Calendar, User, Tag } from "lucide-react";
import { SectionHeader } from "../components/UI/SectionHeader";

export const Blog: React.FC = () => {
  const location = useLocation();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Tutte");
  const [posts, setPosts] = useState<BlogPostType[]>([]);
  const [loading, setLoading] = useState(true);

  const categories = useMemo(() => {
    return [
      "Tutte",
      ...Array.from(new Set((posts || []).map((p) => p.category || ""))).filter(
        (c) => c && c !== "",
      ),
    ];
  }, [posts]);

  const filteredPosts = useMemo(() => {
    const query = search.trim().toLowerCase();
    return (posts || []).filter((post) => {
      const matchesCategory =
        category === "Tutte" || post.category === category;
      const plain = ((post as any)._plainText as string) || "";
      const matchesQuery =
        !query ||
        (post.title || "").toLowerCase().includes(query) ||
        (post.excerpt || "").toLowerCase().includes(query) ||
        plain.toLowerCase().includes(query);
      return matchesCategory && matchesQuery;
    });
  }, [posts, search, category]);

  const formatDate = (iso?: string) => {
    if (!iso) return "";
    try {
      return new Date(iso).toLocaleDateString("it-IT", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      });
    } catch (e) {
      return iso;
    }
  };

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    getAllPosts()
      .then((res) => {
        if (mounted) setPosts(res);
      })
      .catch((err) => {
        console.error("Failed to load posts", err);
        if (mounted) setPosts([]);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

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

        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          style={{ gridAutoRows: "1fr" }}
        >
          {loading ? (
            <div className="col-span-full text-center py-12">
              Caricamento articoli…
            </div>
          ) : (
            filteredPosts.map((post) => (
              <div key={post.id} className="h-full">
                <Reveal width="100%">
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
                    <div className="p-6 flex-1 flex flex-col min-h-0">
                      <div className="flex items-center text-xs text-brand-text-secondary mb-4 space-x-4">
                        <span className="flex items-center">
                          <Calendar size={14} className="mr-1" />
                          {formatDate(post.date)}
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

                      <div>
                        <p className="text-brand-text-secondary mb-4 line-clamp-3">
                          {post.excerpt}
                        </p>
                      </div>

                      <div className="mt-auto pt-4 border-t border-brand-border flex flex-wrap gap-2">
                        {(post.tags || []).map((t) => (
                          <span
                            key={t}
                            className="text-xs px-2 py-1 bg-brand-bg/60 text-brand-text-secondary rounded-full"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </article>
                </Reveal>
              </div>
            ))
          )}
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
