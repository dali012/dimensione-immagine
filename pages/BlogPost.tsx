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
import { getPostBySlug, getAllPosts } from "../sanity/posts";
import { PortableText } from "@portabletext/react";
import type { BlogPost as BlogPostType } from "../types";
import { Calendar, User, Tag, ArrowLeft, Link as LinkIcon } from "lucide-react";
import { generateArticleSchema } from "../lib/generateArticleSchema";
import { toast } from "sonner";

export const BlogPost: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [post, setPost] = React.useState<BlogPostType | null>(null);
  const [related, setRelated] = React.useState<BlogPostType[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    let mounted = true;
    setLoading(true);
    if (!slug) {
      setLoading(false);
      return;
    }

    Promise.all([getPostBySlug(slug), getAllPosts()])
      .then(([p, all]) => {
        if (!mounted) return;
        if (!p) {
          setPost(null);
          setRelated([]);
          return;
        }
        setPost(p);

        const sameCategory = all.filter(
          (x) => x.id !== p.id && x.category === p.category,
        );
        const rel = (
          sameCategory.length ? sameCategory : all.filter((x) => x.id !== p.id)
        ).slice(0, 3);
        setRelated(rel);
      })
      .catch((err) => {
        console.error("Failed to load post or related posts", err);
        if (mounted) {
          setPost(null);
          setRelated([]);
        }
      })
      .finally(() => mounted && setLoading(false));

    return () => {
      mounted = false;
    };
  }, [slug]);

  const shareUrl = `https://www.dimensioneimmagineabbigliamento.it${location.pathname}`;
  const shareText = `${post?.title ?? ""} | Dimensione Immagine`;

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

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast.success("Link copiato negli appunti");
    } catch (err) {
      console.error(err);
      toast.error("Impossibile copiare il link");
    }
  };

  // Prepare structured data early so hooks stay in same order across renders
  const structuredData = post ? generateArticleSchema(post) : undefined;

  if (!slug) return <Navigate to="/blog" replace />;

  if (loading) {
    return (
      <div className="pt-24 min-h-screen bg-brand-bg text-brand-text-primary">
        <div className="container mx-auto px-6 py-12 text-center">
          Caricamento articolo…
        </div>
      </div>
    );
  }

  if (!post) {
    return <Navigate to="/blog" replace />;
  }

  return (
    <div className="pt-24 min-h-screen bg-brand-bg text-brand-text-primary">
      <SEO
        title={`${post.title} | Dimensione Immagine Blog`}
        description={post.excerpt}
        image={post.imageUrl}
        url={shareUrl}
        structuredData={structuredData}
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

              <h1 className="text-4xl font-serif font-bold text-brand-text-primary mb-6">
                {post.title}
              </h1>

              <div className="prose prose-lg max-w-none text-brand-text-secondary leading-relaxed">
                <PortableText value={post.content || []} />
              </div>

              <div className="mt-10 pt-8 border-t border-brand-border">
                <h3 className="text-sm uppercase tracking-widest text-brand-text-secondary mb-4">
                  Condividi
                </h3>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={handleCopy}
                    className="inline-flex items-center gap-2 px-4 py-2 text-xs uppercase tracking-widest border border-brand-border text-brand-text-primary hover:border-brand-accent hover:text-brand-accent transition-colors cursor-pointer"
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
