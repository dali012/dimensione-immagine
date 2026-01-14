import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { SEO } from "../components/SEO/SEO";
import { Reveal } from "../components/UI/Reveal";
import { blogPosts } from "../data/blog";
import { Calendar, User, Tag } from "lucide-react";

export const Blog: React.FC = () => {
  return (
    <div className="pt-24 min-h-screen bg-brand-bg text-brand-text-primary">
      <SEO
        title="Blog e News | Dimensione Immagine"
        description="Leggi le ultime novità dal mondo della moda, consigli di stile e tendenze direttamente dal blog di Dimensione Immagine."
        image="/og-blog.jpg" // You might want to ensure this image exists or use a generic one
      />

      <div className="container mx-auto px-6 py-12">
        <Reveal width="100%">
          <div className="text-center mb-16">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-serif font-bold text-brand-primary mb-6"
            >
              Il Nostro Blog
            </motion.h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Esplora le ultime tendenze, i consigli di stile e le novità del
              mondo fashion selezionate per te.
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <Reveal key={post.id} width="100%">
              <article className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 h-full flex flex-col">
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
                  <div className="flex items-center text-xs text-gray-500 mb-4 space-x-4">
                    <span className="flex items-center">
                      <Calendar size={14} className="mr-1" />
                      {post.date}
                    </span>
                    <span className="flex items-center">
                      <User size={14} className="mr-1" />
                      {post.author}
                    </span>
                    <span className="flex items-center text-brand-primary font-semibold">
                      <Tag size={14} className="mr-1" />
                      {post.category}
                    </span>
                  </div>

                  <Link
                    to={`/blog/${post.slug}`}
                    className="text-2xl font-serif font-bold text-gray-800 mb-3 hover:text-brand-primary transition-colors"
                  >
                    {post.title}
                  </Link>

                  <p className="text-gray-600 mb-4 line-clamp-3 grow">
                    {post.excerpt}
                  </p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  );
};
