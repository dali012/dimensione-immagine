import React, { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { X } from "lucide-react";
import { toast } from "sonner";

const STORAGE_KEY = "di_newsletter_popup_v1";
const DISMISS_DAYS = 14;
const SHOW_DELAY_MS = 4000;

const isDismissed = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return false;
    const data = JSON.parse(raw) as { dismissedUntil?: number };
    return typeof data.dismissedUntil === "number" && Date.now() < data.dismissedUntil;
  } catch {
    return false;
  }
};

const dismissForDays = (days: number) => {
  try {
    const dismissedUntil = Date.now() + days * 24 * 60 * 60 * 1000;
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ dismissedUntil }));
  } catch {
    // Ignore storage errors and let the popup reappear next time.
  }
};

export const NewsletterPopup: React.FC = () => {
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const shouldHide = useMemo(() => {
    return ["/login", "/register"].includes(location.pathname);
  }, [location.pathname]);

  useEffect(() => {
    if (shouldHide) return;
    if (isDismissed()) return;

    const timer = setTimeout(() => setIsOpen(true), SHOW_DELAY_MS);
    return () => clearTimeout(timer);
  }, [shouldHide]);

  const handleClose = () => {
    dismissForDays(DISMISS_DAYS);
    setIsOpen(false);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting || !email) return;

    setIsSubmitting(true);

    try {
      const res = await fetch(
        "https://newsletter.dimensioneimmagineabbigliamento.it/subscribe",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        },
      );

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data?.error || "Subscription failed");
      }

      toast.success("Iscrizione avvenuta! Controlla la tua email per il coupon.");
      setEmail("");
      handleClose();
    } catch (err) {
      console.error(err);
      toast.error("Si è verificato un errore. Riprova più tardi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen || shouldHide) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-black/40 px-4 py-6"
      role="dialog"
      aria-modal="true"
      aria-label="Iscrizione newsletter"
    >
      <div className="relative w-full max-w-lg bg-white text-brand-text-primary shadow-xl">
        <button
          type="button"
          onClick={handleClose}
          className="absolute right-4 top-4 text-brand-text-secondary hover:text-brand-text-primary transition-colors"
          aria-label="Chiudi"
        >
          <X size={18} />
        </button>

        <div className="px-6 py-8 sm:px-10 sm:py-10">
          <p className="text-xs uppercase tracking-widest text-brand-text-secondary mb-3">
            Benvenuto
          </p>
          <h2 className="text-3xl sm:text-4xl font-serif text-brand-text-primary mb-4">
            -10% sul tuo primo acquisto
          </h2>
          <p className="text-sm sm:text-base text-brand-text-secondary leading-relaxed mb-6">
            Iscriviti alla newsletter per ricevere il coupon e scoprire in anteprima
            nuove collezioni e offerte esclusive.
          </p>

          <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="La tua email"
              className="w-full border border-brand-border px-4 py-3 text-sm text-brand-text-primary placeholder-brand-text-secondary/60 outline-none focus:border-brand-accent transition-colors"
              required
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-brand-accent text-white text-xs font-semibold uppercase px-6 py-3 hover:bg-brand-accent/80 transition-colors disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
            >
              {isSubmitting ? "Invio..." : "Sblocca il 10%"}
            </button>
          </form>

          <button
            type="button"
            onClick={handleClose}
            className="mt-4 text-xs text-brand-text-secondary hover:text-brand-text-primary transition-colors"
          >
            No grazie, magari dopo
          </button>
          <p className="mt-4 text-[11px] text-brand-text-secondary leading-relaxed">
            Iscrivendoti accetti di ricevere comunicazioni e materiale marketing da
            Dimensione Immagine.
          </p>
        </div>
      </div>
    </div>
  );
};
