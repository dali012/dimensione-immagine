import React from "react";
import { useLocation } from "react-router-dom";
import { SEO } from "../components/SEO/SEO";
import { Reveal } from "../components/UI/Reveal";
import { useSiteContent } from "../contexts/SiteContentContext";
import { splitParagraphs, useAboutPageContent } from "../sanity/publicContent";

export const About: React.FC = () => {
  const location = useLocation();
  const content = useAboutPageContent();
  const { siteSettings } = useSiteContent();
  const introParagraphs = splitParagraphs(content.introText);
  const missionParagraphs = splitParagraphs(content.missionText);

  return (
    <div className="pt-24 min-h-screen bg-brand-bg text-brand-text-primary">
      <SEO
        title={content.seo.title}
        description={content.seo.description}
        url={`${siteSettings.siteUrl}${location.pathname}`}
        image={content.seo.image?.src}
        noIndex={content.seo.noIndex}
        siteUrl={siteSettings.siteUrl}
        siteName={siteSettings.siteName}
      />

      <section className="container mx-auto px-4 sm:px-6 py-14 sm:py-16 lg:py-28">
        <Reveal width="100%">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
            <div className="lg:col-span-4">
              <span className="block text-xs font-bold uppercase tracking-widest text-brand-text-secondary mb-5">
                {content.introEyebrow}
              </span>
              <h1 className="font-serif text-4xl sm:text-5xl md:text-7xl leading-[0.95]">
                {content.introTitle}
              </h1>
            </div>

            <div className="lg:col-span-8 border-l border-brand-accent/30 pl-4 sm:pl-8 lg:pl-10">
              <div className="space-y-6 text-brand-text-secondary text-base md:text-lg leading-relaxed font-light">
                {introParagraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      <section className="container mx-auto px-4 sm:px-6 pb-16 sm:pb-20 lg:pb-24">
        <Reveal width="100%">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
            <div className="lg:col-span-4">
              <span className="block text-xs font-bold uppercase tracking-widest text-brand-text-secondary mb-5">
                {content.missionEyebrow}
              </span>
              <h2 className="font-serif text-4xl sm:text-5xl md:text-7xl leading-[0.95]">
                {content.missionTitle}
              </h2>
            </div>

            <div className="lg:col-span-8 border-l border-brand-accent/30 pl-4 sm:pl-8 lg:pl-10">
              <div className="space-y-6 text-brand-text-secondary text-base md:text-lg leading-relaxed font-light">
                {missionParagraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      <section className="py-16 sm:py-20 md:py-24 border-y border-brand-border bg-white">
        <div className="container mx-auto px-6">
          <Reveal width="100%">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12 text-center">
              {content.stats.map((stat) => (
                <div key={`${stat.value}-${stat.label}`}>
                  <span className="block text-5xl font-serif text-brand-accent mb-4">
                    {stat.value}
                  </span>
                  <span className="text-xs uppercase tracking-widest text-brand-text-secondary">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="py-16 sm:py-20 lg:py-32 bg-brand-surface/40">
        <div className="container mx-auto px-4 sm:px-6">
          <Reveal className="mb-14 sm:mb-16 lg:mb-20 mx-auto">
            <h2 className="font-serif text-4xl lg:text-5xl mb-2 text-center">
              {content.valuesTitle}
            </h2>
            <div className="h-px bg-brand-accent/50 mx-auto max-w-md" />
            <p className="mt-4 text-center text-brand-text-secondary">
              {content.valuesSubtitle}
            </p>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 items-stretch">
            {content.values.map((value, index) => (
              <Reveal key={value.title} width="100%" fullHeight>
                <div className="h-full border border-brand-border bg-white p-6 sm:p-8 lg:p-10 rounded-sm">
                  <div className="flex items-center gap-4 mb-6">
                    <span className="inline-flex items-center justify-center w-10 h-10 rounded-full border border-brand-accent/30 text-brand-accent text-sm font-semibold shrink-0">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div className="h-px w-full bg-brand-accent/20" />
                  </div>
                  <h3 className="text-2xl lg:text-3xl font-serif uppercase mb-5 tracking-wide text-brand-text-primary leading-tight">
                    {value.title}
                  </h3>
                  <p className="text-base sm:text-lg text-brand-text-secondary font-light leading-relaxed">
                    {value.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
