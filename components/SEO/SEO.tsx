import React, { useEffect } from "react";

interface SEOProps {
  title?: string;
  description?: string;
  url?: string;
  image?: string;
  type?: string;
  structuredData?: object;
  noIndex?: boolean;

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
  title: propTitle,
  description: propDescription,
  url: propUrl,
  image: propImage,
  type = "website",
  structuredData,
  noIndex = false,

  siteUrl = "https://www.dimensioneimmagineabbigliamento.it",
  siteName = "Dimensione Immagine",
}) => {
  const title = propTitle || siteName;
  const fullTitle = title.includes("|") ? title : `${title} | ${siteName}`;
  const description = propDescription || "";
  const canonical = propUrl || siteUrl;
  const imageUrl = propImage || `${siteUrl}/og-image.jpg`;

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
    upsertMeta("og:type", "property", type);
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
    upsertMeta("robots", "name", noIndex ? "noindex,nofollow" : "index,follow");

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
    type,
    siteName,
    structuredData,
    noIndex,
  ]);

  return null;
};
