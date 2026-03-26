import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { SEO } from "../components/SEO/SEO";

const HERO_MEDIA = [
  {
    type: "video",
    src: "/images/video/women-hero-video-dimensione-immagine-1280.mp4",
    poster: "/images/video/women-hero-video-poster.jpg",
    posterWebp: "/images/video/women-hero-video-poster.webp",
    posterMobileWebp: "/images/video/women-hero-video-poster-640.webp",
    posterMobileJpg: "/images/video/women-hero-video-poster-640.jpg",
  },
  {
    type: "video",
    src: "/images/video/men-hero-video-dimensione-immagine-1280.mp4",
    poster: "/images/video/men-hero-video-poster.jpg",
    posterWebp: "/images/video/men-hero-video-poster.webp",
    posterMobileWebp: "/images/video/men-hero-video-poster-640.webp",
    posterMobileJpg: "/images/video/men-hero-video-poster-640.jpg",
  },
];

const STYLE_SPOTLIGHTS = [
  {
    title: "Uomo",
    eyebrow: "Linea 01",
    description:
      "Volumi misurati, toni neutri e una presenza discreta che richiama il gusto sartoriale in chiave contemporanea.",
    mood: "Sartoriale, netto, contemporaneo",
    image: "/images/men3.jpg",
    alt: "Linea uomo Dimensione Immagine",
    layoutClass: "lg:col-span-7 lg:row-span-2 min-h-[32rem]",
  },
  {
    title: "Donna",
    eyebrow: "Linea 02",
    description:
      "Linee fluide, texture luminose e un'eleganza morbida che accompagna il quotidiano con naturale raffinatezza.",
    mood: "Luminosa, fluida, ricercata",
    image: "/images/women3.jpg",
    alt: "Linea donna Dimensione Immagine",
    layoutClass: "lg:col-span-5 min-h-[18rem]",
  },
  {
    title: "Teen Donna",
    eyebrow: "Linea 03",
    description:
      "Una proposta giovane ma curata, con energia pulita, denim essenziale e dettagli moderni mai eccessivi.",
    mood: "Giovane, pulita, sofisticata",
    image: "/images/women6.jpg",
    alt: "Linea teen donna Dimensione Immagine",
    layoutClass: "lg:col-span-5 min-h-[18rem]",
  },
] as const;

export const Home: React.FC = () => {
  const location = useLocation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showVideo, setShowVideo] = useState(true);
  const [videoFailed, setVideoFailed] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (HERO_MEDIA[currentIndex].type === "image") {
      const timer = setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % HERO_MEDIA.length);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [currentIndex]);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setShowVideo(!mq.matches);
    update();
    if (mq.addEventListener) {
      mq.addEventListener("change", update);
      return () => mq.removeEventListener("change", update);
    }
    mq.addListener(update);
    return () => mq.removeListener(update);
  }, []);

  useEffect(() => {
    setVideoFailed(false);
  }, [currentIndex, showVideo]);

  useEffect(() => {
    if (!showVideo || videoFailed || HERO_MEDIA[currentIndex].type !== "video") {
      return;
    }

    const video = videoRef.current;
    if (!video) {
      return;
    }

    // Force a fresh load/play cycle for production browsers that don't
    // reliably autoplay when only the src changes on an existing node.
    video.load();

    const tryPlay = async () => {
      try {
        await video.play();
      } catch {
        setVideoFailed(true);
      }
    };

    void tryPlay();
  }, [currentIndex, showVideo, videoFailed]);

  return (
    <div className="flex flex-col bg-brand-bg min-h-screen">
      <SEO
        title="Dimensione Immagine | Moda Inclusiva e Accessibile"
        description="Scopri la nostra moda accessibile e inclusiva. Collezioni Uomo, Donna e Taglie Forti che valorizzano ogni fisicita e personalita."
        url={`https://www.dimensioneimmagineabbigliamento.it${location.pathname}`}
        image="/og-image.jpg"
      />

      <section className="relative min-h-[75svh] md:min-h-screen flex items-center overflow-hidden pt-20 md:pt-0">
        <div className="absolute inset-0 w-full h-full">
          <div className="absolute inset-0 w-full h-full">
            {HERO_MEDIA[currentIndex].type === "video" ? (
              <>
                {showVideo && !videoFailed && (
                  <video
                    key={HERO_MEDIA[currentIndex].src}
                    ref={videoRef}
                    className="w-full h-full object-cover object-top md:object-center"
                    autoPlay
                    muted
                    defaultMuted
                    playsInline
                    preload="metadata"
                    poster={HERO_MEDIA[currentIndex].poster}
                    onCanPlay={() => {
                      const video = videoRef.current;
                      if (!video) {
                        return;
                      }

                      void video.play().catch(() => {
                        setVideoFailed(true);
                      });
                    }}
                    onError={() => setVideoFailed(true)}
                    onEnded={() =>
                      setCurrentIndex((prev) => (prev + 1) % HERO_MEDIA.length)
                    }
                  >
                    <source src={HERO_MEDIA[currentIndex].src} type="video/mp4" />
                  </video>
                )}
                {(!showVideo || videoFailed) && (
                  <picture className="block w-full h-full">
                    <source
                      type="image/webp"
                      srcSet={`${HERO_MEDIA[currentIndex].posterMobileWebp} 1x`}
                    />
                    <img
                      src={HERO_MEDIA[currentIndex].posterMobileJpg}
                      alt={`Slide ${currentIndex + 1}`}
                      className="w-full h-full object-cover object-top"
                      loading="eager"
                      decoding="async"
                      fetchPriority="high"
                    />
                  </picture>
                )}
              </>
            ) : (
              <img
                src={HERO_MEDIA[currentIndex].src}
                alt={`Slide ${currentIndex + 1}`}
                className="w-full h-full object-cover object-top md:object-center"
                loading="eager"
                decoding="async"
                sizes="100vw"
                fetchPriority="high"
              />
            )}
          </div>
        </div>

        <div className="absolute inset-0 bg-linear-to-r from-brand-bg via-brand-bg/85 to-transparent z-10 w-full md:w-[75%] lg:w-[60%]"></div>
        <div className="absolute inset-0 bg-linear-to-t from-brand-bg via-transparent to-transparent z-10 md:hidden h-1/2 mt-auto"></div>

        <div className="container mx-auto px-4 sm:px-6 relative z-20 h-full flex items-center">
          <div className="max-w-2xl pt-20 md:pt-0">
            <h1 className="font-serif text-4xl sm:text-5xl md:text-7xl text-brand-text-primary mb-6 leading-[1.1]">
              Lo stile che ami,
              <span className="block italic text-brand-accent">al prezzo che sogni</span>
            </h1>
            <div className="h-px w-24 bg-brand-accent mb-8"></div>
            <p className="text-base sm:text-lg md:text-xl text-brand-text-secondary max-w-lg mb-10 font-light leading-relaxed">
              La nostra mission e offrire una moda accessibile, inclusiva e in
              grado di valorizzare ogni fisicita, ogni storia e ogni momento
              della vita.
            </p>
            <Link
              to="/chi-siamo"
              aria-label="Chi Siamo"
              className="inline-flex items-center justify-center px-8 py-3 text-sm font-medium tracking-wide rounded-md transition-all duration-300 ease-out focus:outline-none focus:ring-2 focus:ring-brand-accent focus:ring-offset-2 focus:ring-offset-white cursor-pointer bg-brand-accent text-white hover:opacity-90 border border-transparent"
            >
              Scopri di piu
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20 md:py-32 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="sr-only">I nostri valori</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-8">
            <div className="flex flex-col items-start border-l border-brand-border pl-6">
              <span className="block text-5xl font-serif text-brand-accent mb-6">40+</span>
              <h3 className="text-2xl font-serif text-brand-text-primary mb-4">Anni di Storia</h3>
              <p className="text-brand-text-secondary leading-relaxed max-w-xs">
                Da oltre quarant'anni selezioniamo capi che uniscono qualita,
                estetica e convenienza.
              </p>
            </div>

            <div className="flex flex-col items-start border-l border-brand-border pl-6">
              <span className="block text-5xl font-serif text-brand-accent mb-6">100%</span>
              <h3 className="text-2xl font-serif text-brand-text-primary mb-4">Moda</h3>
              <p className="text-brand-text-secondary leading-relaxed max-w-xs">
                Indossare qualita, vivere autenticita. Tradizione che evolve,
                stile che rimane.
              </p>
            </div>

            <div className="flex flex-col items-start border-l border-brand-border pl-6">
              <span className="block text-5xl font-serif text-brand-accent mb-6">Unique</span>
              <h3 className="text-2xl font-serif text-brand-text-primary mb-4">Stile Personale</h3>
              <p className="text-brand-text-secondary leading-relaxed max-w-xs">
                Ogni capo e unico, pensato per esaltare la tua personalita.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden border-t border-brand-accent/15 bg-[linear-gradient(180deg,#f7f2e9_0%,#fbf8f2_48%,#efe5d3_100%)] py-20 sm:py-24 md:py-32">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(184,155,94,0.16),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(138,111,42,0.1),transparent_34%)]" />

        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:items-end">
            <div className="max-w-xl">
              <span className="block text-[11px] font-semibold uppercase tracking-[0.24em] text-brand-accent/80">
                Linee di Stile
              </span>
              <h2 className="mt-4 font-serif text-4xl text-brand-text-primary sm:text-5xl leading-[1.02]">
                Tre linee, una visione piu editoriale dello stile.
              </h2>
            </div>

            <div className="lg:justify-self-end lg:max-w-xl">
              <p className="text-base sm:text-lg leading-relaxed text-brand-text-secondary font-light">
                Uomo, Donna e Teen Donna convivono in una proposta piu raffinata,
                pensata per chi cerca un'immagine curata, attuale e mai forzata:
                non troppo casual, non troppo formale, sempre distintiva.
              </p>
              <div className="mt-6 flex flex-wrap gap-3 text-[11px] font-medium uppercase tracking-[0.2em] text-brand-accent/80">
                <span className="rounded-full border border-brand-accent/18 bg-white/70 px-4 py-2 backdrop-blur-sm">
                  Everyday Chic
                </span>
                <span className="rounded-full border border-brand-accent/18 bg-white/70 px-4 py-2 backdrop-blur-sm">
                  Occasioni Smart
                </span>
                <span className="rounded-full border border-brand-accent/18 bg-white/70 px-4 py-2 backdrop-blur-sm">
                  Stile Trasversale
                </span>
              </div>
            </div>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-4 lg:grid-cols-12 lg:auto-rows-[minmax(17rem,1fr)]">
            {STYLE_SPOTLIGHTS.map((item) => (
              <Link
                key={item.title}
                to="/sedi"
                className={`group relative overflow-hidden rounded-[30px] border border-[#d9c7a5] bg-[#f8f3ea] shadow-[0_18px_50px_rgba(86,65,24,0.08)] ${item.layoutClass}`}
              >
                <img
                  src={item.image}
                  alt={item.alt}
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
                      Scoprila in negozio
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-8 flex flex-col gap-4 rounded-[26px] border border-brand-accent/12 bg-white/72 px-5 py-5 sm:px-6 sm:py-6 lg:flex-row lg:items-center lg:justify-between shadow-[0_12px_36px_rgba(86,65,24,0.06)] backdrop-blur-sm">
            <p className="max-w-2xl text-sm sm:text-base leading-relaxed text-brand-text-secondary">
              Nei nostri store trovi capi e combinazioni pensati per accompagnare
              il ritmo reale della giornata: lavoro, tempo libero, appuntamenti e
              occasioni speciali con la stessa coerenza di stile.
            </p>
            <Link
              to="/sedi"
              className="inline-flex items-center justify-center rounded-full border border-brand-accent/25 bg-transparent px-5 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-brand-text-primary transition-colors hover:border-brand-accent hover:bg-brand-accent hover:text-white"
            >
              Vedi i negozi
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
