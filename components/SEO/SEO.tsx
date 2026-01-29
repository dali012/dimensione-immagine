import { generateArticleSchema } from "../../lib/generateArticleSchema";
import React, { useEffect } from "react";

interface SEOProps {
  // either provide a `post` object (preferred for blog posts)
  post?: any;
  // or provide explicit fields
  title?: string;
  description?: string;
  url?: string;
  image?: string;
  type?: string;
  structuredData?: object;

  siteUrl?: string;
  siteName?: string;
}

function upsertMeta(name: string, attr: string, value: string) {
  try {
    const selector = `${attr}="${name}"`;
    let el = document.querySelector(
      `meta[${selector}]`,
    ) as HTMLMetaElement | null;
    if (!el) {
      el = document.createElement("meta") as HTMLMetaElement;
      el.setAttribute(attr, name);
      document.head.appendChild(el);
    }
    el.setAttribute("content", value || "");
  } catch (e) {
    // ignore
  }
}

export const SEO: React.FC<SEOProps> = ({
  post,
  title: propTitle,
  description: propDescription,
  url: propUrl,
  image: propImage,
  type: propType,
  structuredData: propStructured,

  siteUrl = "https://www.dimensioneimmagineabbigliamento.it",
  siteName = "Dimensione Immagine",
}) => {
  // If `post` provided, prefer its seo fields, otherwise use explicit props
  const seo = post?.seo || {};
  const title = propTitle || seo.seoTitle || post?.title || siteName;
  const fullTitle = title.includes("|") ? title : `${title} | ${siteName}`;
  const description =
    propDescription || seo.seoDescription || post?.excerpt || "";

  const slug = post?.slug?.current ?? post?.slug ?? "";
  const canonical =
    propUrl ||
    seo.canonicalUrl ||
    `${siteUrl}/${slug}`.replace(/([^:]\/+)\/+/g, "$1");

  const noIndex = Boolean(seo.noIndex);

  const imageUrl =
    propImage ||
    seo.openGraphImage?.asset?.url ||
    seo.twitterImage?.asset?.url ||
    post?.heroImage?.asset?.url ||
    post?.imageUrl ||
    `${siteUrl}/og-image.jpg`;

  const tags: string[] = post?.tags || [];

  // Generate structured data using the shared util or explicit prop
  const structuredData =
    propStructured || (post ? generateArticleSchema(post, siteUrl) : undefined);

  useEffect(() => {
    if (typeof document === "undefined") return;

    // Title
    document.title = fullTitle;

    // Description
    let desc = document.head.querySelector(
      'meta[name="description"]',
    ) as HTMLMetaElement | null;
    if (!desc) {
      desc = document.createElement("meta");
      desc.setAttribute("name", "description");
      document.head.appendChild(desc);
    }
    desc.setAttribute("content", description || "");

    // Keywords (from tags)
    if (tags.length) {
      let kw = document.head.querySelector(
        'meta[name="keywords"]',
      ) as HTMLMetaElement | null;
      if (!kw) {
        kw = document.createElement("meta");
        kw.setAttribute("name", "keywords");
        document.head.appendChild(kw);
      }
      kw.setAttribute("content", tags.join(", "));
    }

    // Robots
    let robots = document.head.querySelector(
      'meta[name="robots"]',
    ) as HTMLMetaElement | null;
    if (noIndex) {
      if (!robots) {
        robots = document.createElement("meta");
        robots.setAttribute("name", "robots");
        document.head.appendChild(robots);
      }
      robots.setAttribute("content", "noindex, nofollow");
    } else if (robots) {
      robots.remove();
    }

    // Canonical
    let canon = document.head.querySelector(
      'link[rel="canonical"]',
    ) as HTMLLinkElement | null;
    if (!canon) {
      canon = document.createElement("link");
      canon.setAttribute("rel", "canonical");
      document.head.appendChild(canon);
    }
    canon.setAttribute("href", canonical || window.location.href);

    // Open Graph
    upsertMeta("og:type", "property", post ? "article" : "website");
    upsertMeta("og:title", "property", fullTitle);
    upsertMeta("og:description", "property", description || "");
    upsertMeta("og:url", "property", canonical || window.location.href);
    upsertMeta("og:site_name", "property", siteName);
    upsertMeta("og:image", "property", imageUrl || "");

    // Twitter
    upsertMeta("twitter:card", "name", "summary_large_image");
    upsertMeta("twitter:title", "name", fullTitle);
    upsertMeta("twitter:description", "name", description || "");
    upsertMeta("twitter:image", "name", imageUrl || "");

    // Structured Data script
    const existing = document.head.querySelector(
      'script[type="application/ld+json"][data-generated="seo"]',
    );
    if (existing) existing.remove();
    if (structuredData) {
      try {
        const s = document.createElement("script");
        s.type = "application/ld+json";
        s.setAttribute("data-generated", "seo");
        s.text = JSON.stringify(structuredData);
        document.head.appendChild(s);
      } catch (e) {
        // ignore JSON errors
      }
    }

    return () => {
      const s = document.head.querySelector(
        'script[type="application/ld+json"][data-generated="seo"]',
      );
      if (s) s.remove();
    };
  }, [
    fullTitle,
    description,
    canonical,
    imageUrl,
    siteName,
    JSON.stringify(tags),
    noIndex,
    structuredData,
  ]);

  return null;
};
