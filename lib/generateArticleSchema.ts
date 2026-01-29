export function generateArticleSchema(
  post: any,
  siteUrl = "https://www.dimensioneimmagineabbigliamento.it",
) {
  // Support both raw Sanity post objects and the frontend-mapped post shape
  const imageUrl =
    post?.seo?.openGraphImage?.asset?.url ||
    post?.heroImage?.asset?.url ||
    post?.imageUrl ||
    (post?.heroImage && typeof post.heroImage === "string"
      ? post.heroImage
      : undefined);

  const slugCurrent = post?.slug?.current ?? post?.slug ?? "";
  const canonical = post?.seo?.canonicalUrl || `${siteUrl}/${slugCurrent}`;

  const authorName =
    post?.author?.name || post?.author || "Dimensione Immagine";

  const published = post?.publishedAt || post?.date || null;
  const modified = post?.updatedAt || post?.date || post?.publishedAt || null;

  const headline = post?.seo?.seoTitle || post?.title;
  const description = post?.seo?.seoDescription || post?.excerpt || "";

  const schema: any = {
    "@context": "https://schema.org",
    "@type": post?.schemaType || "BlogPosting",
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": canonical,
    },
    headline,
    description,
    author: {
      "@type": "Person",
      name: authorName,
    },
    publisher: {
      "@type": "Organization",
      name: "Dimensione Immagine",
    },
    datePublished: published,
    dateModified: modified,
  };

  if (imageUrl) schema.image = [imageUrl];

  return schema;
}
