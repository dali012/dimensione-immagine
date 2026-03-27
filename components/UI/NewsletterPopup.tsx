import { X } from "lucide-react";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "sonner";
import { useSiteContent } from "../../contexts/SiteContentContext";

const NEWSLETTER_ENDPOINT = "/api/newsletter-subscribe";

export const NewsletterPopup: React.FC = () => {
  const location = useLocation();
  const { siteSettings } = useSiteContent();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const hasShownRef = useRef(false);

  const shouldHide = useMemo(() => {
    return ["/login", "/register", "/admin-wholesale"].includes(
      location.pathname,
    );
  }, [location.pathname]);

  useEffect(() => {
    if (shouldHide) {
      setIsOpen(false);
      return;
    }

    if (hasShownRef.current) return;

    hasShownRef.current = true;
    setIsOpen(true);
  }, [shouldHide]);

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting || !email) return;

    setIsSubmitting(true);

    try {
      const res = await fetch(NEWSLETTER_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          sourcePage: location.pathname,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data.success) {
        throw new Error(data?.error || "Subscription failed");
      }

      toast.success(
        data?.confirmationEmailSent
          ? "Iscrizione avvenuta! Ti abbiamo inviato una email di conferma."
          : "Iscrizione avvenuta con successo!",
      );
      setEmail("");
      handleClose();
    } catch (error) {
      console.error(error);
      toast.error("Si e verificato un errore. Riprova piu tardi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen || shouldHide) return null;

  return (
    <div
      className="fixed inset-0 z-60 flex items-end sm:items-center justify-center bg-black/40 px-4 py-6 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label="Iscrizione newsletter"
    >
      <div className="relative w-full max-w-lg bg-white text-brand-text-primary shadow-xl rounded-t-2xl sm:rounded-lg max-h-[90svh] sm:max-h-none overflow-hidden">
        <button
          type="button"
          onClick={handleClose}
          className="absolute right-3 top-3 h-10 w-10 inline-flex items-center justify-center text-brand-text-secondary hover:text-brand-text-primary transition-colors"
          aria-label="Chiudi"
        >
          <X size={18} className="cursor-pointer" />
        </button>

        <div className="px-6 py-8 sm:px-10 sm:py-10 overflow-y-auto max-h-[90svh] sm:max-h-none">
          <p className="text-xs uppercase tracking-widest text-brand-text-secondary mb-3">
            Newsletter
          </p>
          <h2 className="text-3xl sm:text-4xl font-serif text-brand-text-primary mb-4">
            {siteSettings.footerNewsletterTitle}
          </h2>
          <p className="text-sm sm:text-base text-brand-text-secondary leading-relaxed mb-6">
            {siteSettings.footerNewsletterDescription}
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
              {isSubmitting ? "Invio..." : "Iscriviti"}
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
            {siteSettings.footerNewsletterDisclaimer}
          </p>
        </div>
      </div>
    </div>
  );
};
