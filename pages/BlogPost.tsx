import React from "react";
import {
  useParams,
  Link,
  useNavigate,
  useLocation,
  Navigate,
} from "react-router-dom";
import { SEO } from "../components/SEO/SEO";
import { Reveal } from "../components/UI/Reveal";
import { blogPosts } from "../data/blog";
import { Calendar, User, Tag, ArrowLeft, Link as LinkIcon } from "lucide-react";
import { toast } from "sonner";

export const BlogPost: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) {
    return <Navigate to="/blog" replace />;
  }

  const sameCategory = blogPosts.filter(
    (p) => p.id !== post.id && p.category === post.category,
  );
  const related = (
    sameCategory.length
      ? sameCategory
      : blogPosts.filter((p) => p.id !== post.id)
  ).slice(0, 3);

  const shareUrl = `https://www.dimensioneimmagineabbigliamento.it${location.pathname}`;
  const shareText = `${post.title} | Dimensione Immagine`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast.success("Link copiato negli appunti");
    } catch (err) {
      console.error(err);
      toast.error("Impossibile copiare il link");
    }
  };

  return (
    <div className="pt-24 min-h-screen bg-brand-bg text-brand-text-primary">
      <SEO
        title={`${post.title} | Dimensione Immagine Blog`}
        description={post.excerpt}
        image={post.imageUrl}
        url={shareUrl}
      />

      <div className="container mx-auto px-6 py-12 max-w-5xl">
        <div className="flex items-center gap-3 text-sm text-brand-accent mb-6">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-brand-accent hover:text-brand-text-primary transition-colors cursor-pointer"
            aria-label="Torna indietro"
          >
            <ArrowLeft size={16} />
            Torna indietro
          </button>
        </div>

        <Reveal width="100%">
          <article className="bg-white rounded-lg shadow-sm border border-brand-border overflow-hidden">
            <div className="h-80 w-full overflow-hidden">
              <img
                src={post.imageUrl}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="p-8 md:p-10">
              <div className="flex flex-wrap items-center text-xs text-brand-text-secondary mb-4 gap-4">
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

              <h1 className="text-4xl font-serif font-bold text-brand-text-primary mb-6">
                {post.title}
              </h1>

              <div className="prose prose-lg max-w-none text-brand-text-secondary leading-relaxed">
                {post.content.map((paragraph, idx) => (
                  <p key={idx} className="mb-5">
                    {paragraph}
                  </p>
                ))}
              </div>

              <div className="mt-10 pt-8 border-t border-brand-border">
                <h3 className="text-sm uppercase tracking-widest text-brand-text-secondary mb-4">
                  Condividi
                </h3>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={handleCopy}
                    className="inline-flex items-center gap-2 px-4 py-2 text-xs uppercase tracking-widest border border-brand-border text-brand-text-primary hover:border-brand-accent hover:text-brand-accent transition-colors"
                  >
                    <LinkIcon size={14} />
                    Copia link
                  </button>
                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(
                      `${shareText} ${shareUrl}`,
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 text-xs uppercase tracking-widest border border-brand-border text-brand-text-primary hover:border-brand-accent hover:text-brand-accent transition-colors"
                  >
                    WhatsApp
                  </a>
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                      shareUrl,
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 text-xs uppercase tracking-widest border border-brand-border text-brand-text-primary hover:border-brand-accent hover:text-brand-accent transition-colors"
                  >
                    Facebook
                  </a>
                </div>
              </div>
            </div>
          </article>
        </Reveal>

        {related.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-serif font-bold text-brand-text-primary mb-6">
              Potrebbe interessarti anche
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {related.map((rel) => (
                <Link
                  key={rel.id}
                  to={`/blog/${rel.slug}`}
                  className="bg-white rounded-lg border border-brand-border shadow-sm hover:shadow-md transition-shadow overflow-hidden"
                >
                  <div className="h-36 overflow-hidden">
                    <img
                      src={rel.imageUrl}
                      alt={rel.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <p className="text-xs text-brand-accent font-semibold mb-2">
                      {rel.category}
                    </p>
                    <h3 className="text-lg font-semibold text-brand-text-primary leading-snug line-clamp-2">
                      {rel.title}
                    </h3>
                    <p className="text-sm text-brand-text-secondary mt-2 line-clamp-2">
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
