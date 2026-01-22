import React from "react";
import { Helmet } from "react-helmet-async";

interface SEOProps {
  title: string;
  description: string;
  url?: string;
  image?: string;
  type?: string;
  structuredData?: object;
  siteName?: string;
}

export const SEO: React.FC<SEOProps> = ({
  title,
  description,
  url = "https://www.dimensioneimmagineabbigliamento.it",
  image = "/og-image.jpg",
  type = "website",
  structuredData,
  siteName = "Dimensione Immagine",
}) => {
  const fullTitle = title.includes("|") ? title : `${title} | ${siteName}`;

  return (
    <Helmet>
      {/* Standard Metadata */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:image" content={image} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
};
