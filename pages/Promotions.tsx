import React, { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { SEO } from "../components/SEO/SEO";
import { Reveal } from "../components/UI/Reveal";
import { SectionHeader } from "../components/UI/SectionHeader";

type PromotionItem = {
  id: number;
  title: string;
  imageUrl: string;
  oldPriceCents: number;
  newPriceCents: number;
  discountPercent: number;
  startsAt: string | null;
  endsAt: string | null;
  sortOrder: number;
};

export const Promotions: React.FC = () => {
  const location = useLocation();
  const [items, setItems] = useState<PromotionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const run = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch("/api/promotions", {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        });
        const data = await response.json().catch(() => ({}));
        if (!response.ok) {
          throw new Error(data?.error || "Impossibile caricare le promozioni.");
        }
        if (!active) return;
        setItems(Array.isArray(data?.items) ? data.items : []);
      } catch (err: any) {
        if (!active) return;
        setError(err?.message || "Errore durante il caricamento.");
        setItems([]);
      } finally {
        if (active) setLoading(false);
      }
    };

    run();

    return () => {
      active = false;
    };
  }, []);

  const formatMoney = useMemo(
    () =>
      new Intl.NumberFormat("it-IT", {
        style: "currency",
        currency: "EUR",
      }),
    [],
  );

  const formatDate = (iso: string | null) => {
    if (!iso) return null;
    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) return null;
    return date.toLocaleDateString("it-IT", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <div className="pt-24 min-h-screen bg-brand-bg text-brand-text-primary">
      <SEO
        title="Promozioni e Offerte | Dimensione Immagine"
        description="Scopri promozioni e offerte attive del momento."
        url={`https://www.dimensioneimmagineabbigliamento.it${location.pathname}`}
        image="/og-image.jpg"
      />

      <section className="container mx-auto px-4 sm:px-6 py-12 md:py-20 text-center">
        <Reveal width="100%">
          <SectionHeader
            label="Risparmio"
            title="Promozioni e Offerte"
            subtitle="Le occasioni attive in questo momento."
            as="h1"
          />
        </Reveal>
      </section>

      <section className="container mx-auto px-4 sm:px-6 pb-20">
        {loading && (
          <div className="text-center text-brand-text-secondary py-10">
            Caricamento promozioni...
          </div>
        )}

        {!loading && error && (
          <div className="text-center text-red-600 py-10">{error}</div>
        )}

        {!loading && !error && items.length === 0 && (
          <div className="text-center text-brand-text-secondary py-10">
            Nessuna promozione attiva al momento.
          </div>
        )}

        {!loading && !error && items.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 items-stretch">
            {items.map((item, index) => (
              <Reveal key={item.id} width="100%" delay={index * 0.04} fullHeight>
                <article className="h-full bg-white border border-brand-border rounded-sm overflow-hidden flex flex-col">
                  <div className="relative aspect-[4/5] bg-brand-surface">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      decoding="async"
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    />
                    <div className="absolute top-3 right-3 bg-brand-accent text-white text-xs font-bold px-3 py-1 rounded-full">
                      -{item.discountPercent}%
                    </div>
                  </div>

                  <div className="p-5 sm:p-6 flex-1 flex flex-col">
                    <h2 className="text-xl sm:text-2xl font-serif text-brand-text-primary mb-3">
                      {item.title}
                    </h2>

                    <div className="flex items-end gap-3 mb-4">
                      <span className="text-brand-text-secondary line-through text-sm sm:text-base">
                        {formatMoney.format(item.oldPriceCents / 100)}
                      </span>
                      <span className="text-brand-accent font-bold text-xl sm:text-2xl">
                        {formatMoney.format(item.newPriceCents / 100)}
                      </span>
                    </div>

                    {(item.startsAt || item.endsAt) && (
                      <p className="text-xs sm:text-sm text-brand-text-secondary mt-auto">
                        {item.startsAt && (
                          <span>Dal {formatDate(item.startsAt)}</span>
                        )}
                        {item.startsAt && item.endsAt && <span> | </span>}
                        {item.endsAt && <span>Fino al {formatDate(item.endsAt)}</span>}
                      </p>
                    )}
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Promotions;
