import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { SEO } from "../components/SEO/SEO";
import { useSiteContent } from "../contexts/SiteContentContext";
import { useHomePageContent } from "../sanity/publicContent";

const spotlightLayouts = [
  "lg:col-span-7 lg:row-span-2 min-h-[32rem]",
  "lg:col-span-5 min-h-[18rem]",
  "lg:col-span-5 min-h-[18rem]",
];

const isInternalLink = (href: string) => href.startsWith("/");

export const Home: React.FC = () => {
  const location = useLocation();
  const content = useHomePageContent();
  const { siteSettings } = useSiteContent();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [videoFailed, setVideoFailed] = useState(false);

  const heroSlides = useMemo(
    () => content.heroSlides.filter((item) => item.mediaType === "image" || item.mediaType === "video"),
    [content.heroSlides],
  );
  const activeSlide = heroSlides[currentIndex] || heroSlides[0];

  useEffect(() => {
    if (!activeSlide || heroSlides.length <= 1) return;
    if (activeSlide.mediaType !== "image") return;

    const timer = window.setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % heroSlides.length);
    }, 5000);

    return () => window.clearTimeout(timer);
  }, [activeSlide, heroSlides]);

  useEffect(() => {
    setVideoFailed(false);
  }, [currentIndex]);

  return (
    <div className="flex flex-col bg-brand-bg min-h-screen">
      <SEO
        title={content.seo.title}
        description={content.seo.description}
        url={`${siteSettings.siteUrl}${location.pathname}`}
        image={content.seo.image?.src}
        noIndex={content.seo.noIndex}
        siteUrl={siteSettings.siteUrl}
        siteName={siteSettings.siteName}
      />

      <section className="relative min-h-[75svh] md:min-h-screen flex items-center overflow-hidden pt-20 md:pt-0">
        <div className="absolute inset-0 w-full h-full">
          <div className="absolute inset-0 w-full h-full">
            {activeSlide?.mediaType === "video" && activeSlide.video ? (
              <>
                {!videoFailed && (
                  <video
                    key={activeSlide.video.src}
                    className="w-full h-full object-cover object-top md:object-center"
                    autoPlay
                    muted
                    playsInline
                    preload="metadata"
                    poster={activeSlide.video.poster?.src}
                    onError={() => setVideoFailed(true)}
                    onEnded={() =>
                      setCurrentIndex((prev) => (prev + 1) % heroSlides.length)
                    }
                  >
                    <source src={activeSlide.video.src} type="video/mp4" />
                  </video>
                )}
                {videoFailed && (
                  <img
                    src={
                      activeSlide.video.mobilePoster?.src ||
                      activeSlide.video.poster?.src
                    }
                    alt={
                      activeSlide.video.mobilePoster?.alt ||
                      activeSlide.video.poster?.alt ||
                      `Slide ${currentIndex + 1}`
                    }
                    className="w-full h-full object-cover object-top"
                    loading="eager"
                    decoding="async"
                    fetchPriority="high"
                  />
                )}
              </>
            ) : (
              <img
                src={activeSlide?.image?.src}
                alt={activeSlide?.image?.alt || `Slide ${currentIndex + 1}`}
                className="w-full h-full object-cover object-top md:object-center"
                loading="eager"
                decoding="async"
                sizes="100vw"
                fetchPriority="high"
              />
            )}
          </div>
        </div>

        <div className="absolute inset-0 bg-linear-to-r from-brand-bg via-brand-bg/85 to-transparent z-10 w-full md:w-[75%] lg:w-[60%]" />
        <div className="absolute inset-0 bg-linear-to-t from-brand-bg via-transparent to-transparent z-10 md:hidden h-1/2 mt-auto" />

        <div className="container mx-auto px-4 sm:px-6 relative z-20 h-full flex items-center">
          <div className="max-w-2xl pt-20 md:pt-0">
            <h1 className="font-serif text-4xl sm:text-5xl md:text-7xl text-brand-text-primary mb-6 leading-[1.1]">
              {content.heroTitle}
              <span className="block italic text-brand-accent">
                {content.heroAccent}
              </span>
            </h1>
            <div className="h-px w-24 bg-brand-accent mb-8" />
            <p className="text-base sm:text-lg md:text-xl text-brand-text-secondary max-w-lg mb-10 font-light leading-relaxed">
              {content.heroDescription}
            </p>
            {isInternalLink(content.heroCta.href) ? (
              <Link
                to={content.heroCta.href}
                aria-label={content.heroCta.label}
                className="inline-flex items-center justify-center px-8 py-3 text-sm font-medium tracking-wide rounded-md transition-all duration-300 ease-out focus:outline-none focus:ring-2 focus:ring-brand-accent focus:ring-offset-2 focus:ring-offset-white cursor-pointer bg-brand-accent text-white hover:opacity-90 border border-transparent"
              >
                {content.heroCta.label}
              </Link>
            ) : (
              <a
                href={content.heroCta.href}
                target={content.heroCta.newTab ? "_blank" : undefined}
                rel={content.heroCta.newTab ? "noreferrer" : undefined}
                aria-label={content.heroCta.label}
                className="inline-flex items-center justify-center px-8 py-3 text-sm font-medium tracking-wide rounded-md transition-all duration-300 ease-out focus:outline-none focus:ring-2 focus:ring-brand-accent focus:ring-offset-2 focus:ring-offset-white cursor-pointer bg-brand-accent text-white hover:opacity-90 border border-transparent"
              >
                {content.heroCta.label}
              </a>
            )}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20 md:py-32 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="sr-only">I nostri valori</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-8">
            {content.stats.map((stat) => (
              <div
                key={`${stat.value}-${stat.label}`}
                className="flex flex-col items-start border-l border-brand-border pl-6"
              >
                <span className="block text-5xl font-serif text-brand-accent mb-6">
                  {stat.value}
                </span>
                <h3 className="text-2xl font-serif text-brand-text-primary mb-4">
                  {stat.label}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden border-t border-brand-accent/15 bg-[linear-gradient(180deg,#f7f2e9_0%,#fbf8f2_48%,#efe5d3_100%)] py-20 sm:py-24 md:py-32">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(184,155,94,0.16),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(138,111,42,0.1),transparent_34%)]" />

        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:items-end">
            <div className="max-w-xl">
              <span className="block text-[11px] font-semibold uppercase tracking-[0.24em] text-brand-accent/80">
                {content.styleSectionLabel}
              </span>
              <h2 className="mt-4 font-serif text-4xl text-brand-text-primary sm:text-5xl leading-[1.02]">
                {content.styleSectionTitle}
              </h2>
            </div>

            <div className="lg:justify-self-end lg:max-w-xl">
              <p className="text-base sm:text-lg leading-relaxed text-brand-text-secondary font-light">
                {content.styleSectionDescription}
              </p>
              <div className="mt-6 flex flex-wrap gap-3 text-[11px] font-medium uppercase tracking-[0.2em] text-brand-accent/80">
                {content.styleTags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-brand-accent/18 bg-white/70 px-4 py-2 backdrop-blur-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-4 lg:grid-cols-12 lg:auto-rows-[minmax(17rem,1fr)]">
            {content.spotlightCards.map((item, index) => {
              const href = item.cta?.href || "/sedi";
              const label = item.cta?.label || "Scoprila in negozio";
              const layoutClass =
                spotlightLayouts[index] || "lg:col-span-4 min-h-[18rem]";

              return isInternalLink(href) ? (
                <Link
                  key={`${item.title}-${index}`}
                  to={href}
                  className={`group relative overflow-hidden rounded-[30px] border border-[#d9c7a5] bg-[#f8f3ea] shadow-[0_18px_50px_rgba(86,65,24,0.08)] ${layoutClass}`}
                >
                  <img
                    src={item.image.src}
                    alt={item.image.alt}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                    decoding="async"
                    sizes="(min-width: 1024px) 50vw, 100vw"
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(248,243,234,0.06)_0%,rgba(248,243,234,0.16)_34%,rgba(248,243,234,0.96)_100%)]" />
                  <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(184,155,94,0.18),transparent_42%)] opacity-90" />

                  <div className="relative flex h-full flex-col justify-end p-6 sm:p-8">
                    <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-brand-accent/80">
                      {item.eyebrow}
                    </span>
                    <h3 className="mt-3 font-serif text-3xl text-brand-text-primary sm:text-4xl">
                      {item.title}
                    </h3>
                    <p className="mt-4 max-w-md text-sm sm:text-base leading-relaxed text-brand-text-secondary font-light">
                      {item.description}
                    </p>
                    <div className="mt-5 flex flex-wrap items-center gap-3">
                      <span className="rounded-full border border-brand-accent/14 bg-white/82 px-3 py-2 text-[10px] font-medium uppercase tracking-[0.18em] text-brand-text-secondary backdrop-blur-sm">
                        {item.mood}
                      </span>
                      <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-accent">
                        {label}
                      </span>
                    </div>
                  </div>
                </Link>
              ) : (
                <a
                  key={`${item.title}-${index}`}
                  href={href}
                  target={item.cta?.newTab ? "_blank" : undefined}
                  rel={item.cta?.newTab ? "noreferrer" : undefined}
                  className={`group relative overflow-hidden rounded-[30px] border border-[#d9c7a5] bg-[#f8f3ea] shadow-[0_18px_50px_rgba(86,65,24,0.08)] ${layoutClass}`}
                >
                  <img
                    src={item.image.src}
                    alt={item.image.alt}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                    decoding="async"
                    sizes="(min-width: 1024px) 50vw, 100vw"
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(248,243,234,0.06)_0%,rgba(248,243,234,0.16)_34%,rgba(248,243,234,0.96)_100%)]" />
                  <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(184,155,94,0.18),transparent_42%)] opacity-90" />

                  <div className="relative flex h-full flex-col justify-end p-6 sm:p-8">
                    <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-brand-accent/80">
                      {item.eyebrow}
                    </span>
                    <h3 className="mt-3 font-serif text-3xl text-brand-text-primary sm:text-4xl">
                      {item.title}
                    </h3>
                    <p className="mt-4 max-w-md text-sm sm:text-base leading-relaxed text-brand-text-secondary font-light">
                      {item.description}
                    </p>
                    <div className="mt-5 flex flex-wrap items-center gap-3">
                      <span className="rounded-full border border-brand-accent/14 bg-white/82 px-3 py-2 text-[10px] font-medium uppercase tracking-[0.18em] text-brand-text-secondary backdrop-blur-sm">
                        {item.mood}
                      </span>
                      <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-accent">
                        {label}
                      </span>
                    </div>
                  </div>
                </a>
              );
            })}
          </div>

          <div className="mt-8 flex flex-col gap-4 rounded-[26px] border border-brand-accent/12 bg-white/72 px-5 py-5 sm:px-6 sm:py-6 lg:flex-row lg:items-center lg:justify-between shadow-[0_12px_36px_rgba(86,65,24,0.06)] backdrop-blur-sm">
            <p className="max-w-2xl text-sm sm:text-base leading-relaxed text-brand-text-secondary">
              {content.bottomBannerDescription}
            </p>
            {isInternalLink(content.bottomCta.href) ? (
              <Link
                to={content.bottomCta.href}
                className="inline-flex items-center justify-center rounded-full border border-brand-accent/25 bg-transparent px-5 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-brand-text-primary transition-colors hover:border-brand-accent hover:bg-brand-accent hover:text-white"
              >
                {content.bottomCta.label}
              </Link>
            ) : (
              <a
                href={content.bottomCta.href}
                target={content.bottomCta.newTab ? "_blank" : undefined}
                rel={content.bottomCta.newTab ? "noreferrer" : undefined}
                className="inline-flex items-center justify-center rounded-full border border-brand-accent/25 bg-transparent px-5 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-brand-text-primary transition-colors hover:border-brand-accent hover:bg-brand-accent hover:text-white"
              >
                {content.bottomCta.label}
              </a>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
