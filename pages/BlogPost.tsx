import React from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { SEO } from "../components/SEO/SEO";
import { Reveal } from "../components/UI/Reveal";
import { blogPosts } from "../data/blog";
import { Calendar, User, Tag, ArrowLeft } from "lucide-react";

export const BlogPost: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) {
    // Redirect to blog list if slug is invalid
    navigate("/blog", { replace: true });
    return null;
  }

  const related = blogPosts.filter((p) => p.id !== post.id).slice(0, 3);

  return (
    <div className="pt-24 min-h-screen bg-brand-bg text-brand-text-primary">
      <SEO
        title={`${post.title} | Dimensione Immagine Blog`}
        description={post.excerpt}
        image={post.imageUrl}
      />

      <div className="container mx-auto px-6 py-12 max-w-5xl">
        <div className="flex items-center gap-3 text-sm text-brand-primary mb-6">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-brand-primary hover:text-brand-accent transition-colors cursor-pointer"
            aria-label="Torna indietro"
          >
            <ArrowLeft size={16} />
            Torna indietro
          </button>
        </div>

        <Reveal width="100%">
          <article className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="h-80 w-full overflow-hidden">
              <img
                src={post.imageUrl}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="p-8 md:p-10">
              <div className="flex flex-wrap items-center text-xs text-gray-500 mb-4 gap-4">
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

              <h1 className="text-4xl font-serif font-bold text-gray-900 mb-6">
                {post.title}
              </h1>

              <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
                {post.content.map((paragraph, idx) => (
                  <p key={idx} className="mb-5">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </article>
        </Reveal>

        {related.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6">
              Potrebbe interessarti anche
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {related.map((rel) => (
                <Link
                  key={rel.id}
                  to={`/blog/${rel.slug}`}
                  className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden"
                >
                  <div className="h-36 overflow-hidden">
                    <img
                      src={rel.imageUrl}
                      alt={rel.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <p className="text-xs text-brand-primary font-semibold mb-2">
                      {rel.category}
                    </p>
                    <h3 className="text-lg font-semibold text-gray-900 leading-snug line-clamp-2">
                      {rel.title}
                    </h3>
                    <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                      {rel.excerpt}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
