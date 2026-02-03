import React from "react";
import { Link } from "react-router-dom";
import { Facebook, Instagram, FileText, IdCard } from "lucide-react";
import { toast } from "sonner";

// Custom TikTok Icon compatible with Lucide react styling
const TikTokIcon = ({
  size = 18,
  className,
}: {
  size?: number;
  className?: string;
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
  </svg>
);

export const Footer: React.FC = () => {
  const [email, setEmail] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  return (
    <footer className="bg-brand-bg text-brand-text-primary border-t border-brand-border">
      <div className="container mx-auto px-6 py-8 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-12 lg:gap-4">
          {/* Column 1: COMPANY */}
          <div className="flex flex-col space-y-6">
            <h3 className="font-serif font-bold text-xs tracking-widest uppercase text-brand-text-primary">
              Azienda
            </h3>
            <ul className="flex flex-col space-y-3 text-sm text-brand-text-secondary font-light">
              <li>
                <Link
                  to="/chi-siamo"
                  className="hover:text-brand-accent transition-colors"
                >
                  Chi Siamo
                </Link>
              </li>
              <li>
                <Link
                  to="/sedi"
                  className="hover:text-brand-accent transition-colors"
                >
                  Negozi & Franchising
                </Link>
              </li>
              <li>
                <Link
                  to="/contatti"
                  className="hover:text-brand-accent transition-colors"
                >
                  Contatti
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: TERMS & POLICY */}
          <div className="flex flex-col space-y-6">
            <h3 className="font-serif font-bold text-xs tracking-widest uppercase text-brand-text-primary">
              Termini & Policy
            </h3>
            <ul className="flex flex-col space-y-3 text-sm text-brand-text-secondary font-light">
              <li>
                <Link
                  to="/termini-condizioni"
                  className="hover:text-brand-accent transition-colors"
                >
                  Termini di Servizio
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy-policy"
                  className="hover:text-brand-accent transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/cookie-policy"
                  className="hover:text-brand-accent transition-colors"
                >
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: SUBSCRIBE */}
          <div className="flex flex-col space-y-6 lg:pl-4">
            <div className="flex justify-between items-start">
              <h3 className="font-serif font-bold text-xs tracking-widest uppercase text-brand-text-primary leading-relaxed">
                Rimani Ispirato.
                <br />
                Rimani Elegante.
              </h3>
              <div className="flex space-x-3 text-brand-text-secondary">
                <a
                  href="https://www.facebook.com/profile.php?id=61584264163679"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="hover:text-brand-accent transition-colors"
                >
                  <Facebook size={18} />
                </a>
                <a
                  href="https://www.instagram.com/dimensione.immagine/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="hover:text-brand-accent transition-colors"
                >
                  <Instagram size={18} />
                </a>
                <a
                  href="https://www.tiktok.com/@dimensioneimmagine"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="TikTok"
                  className="hover:text-brand-accent transition-colors"
                >
                  <TikTokIcon size={18} />
                </a>
              </div>
            </div>
            <p className="text-sm text-brand-text-secondary font-light leading-relaxed">
              Iscriviti alla nostra lista per aggiornamenti esclusivi, nuove
              collezioni e consigli di stile.
            </p>

            <form
              className="w-full flex items-end pt-2"
              onSubmit={async (e) => {
                e.preventDefault();

                if (isSubmitting) return;
                if (!email) return;

                setIsSubmitting(true);

                try {
                  const res = await fetch(
                    "https://newsletter.dimensioneimmagineabbigliamento.it/subscribe",
                    {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({ email }),
                    },
                  );

                  const data = await res.json();

                  if (!res.ok || !data.success) {
                    throw new Error(data?.error || "Subscription failed");
                  }

                  toast.success("Iscrizione avvenuta con successo!");
                  setEmail("");
                } catch (err) {
                  console.error(err);
                  toast.error("Si è verificato un errore. Riprova più tardi.");
                } finally {
                  setIsSubmitting(false);
                }
              }}
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Indirizzo e-mail"
                className="grow bg-transparent border-b border-brand-text-secondary py-2 text-sm text-brand-text-primary placeholder-brand-text-secondary/60 outline-none focus:border-brand-accent transition-colors mr-4"
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-brand-accent text-white text-xs font-semibold uppercase px-6 py-3 hover:bg-brand-accent/80 transition-colors disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
              >
                {isSubmitting ? (
                  <span className="flex items-center space-x-2">
                    <svg
                      className="h-4 w-4 animate-spin"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                      ></path>
                    </svg>
                    <span>Invio...</span>
                  </span>
                ) : (
                  "Iscriviti"
                )}
              </button>
            </form>
            <p className="text-xs text-brand-text-secondary font-light leading-relaxed">
              Inserendo la tua email acconsenti a ricevere comunicazioni e
              materiale marketing da Dimensione Immagine.
            </p>
          </div>
        </div>

        {/* Simple Copyright/Legal Line optional, kept minimal as per refined design request */}
        <div className="mt-8 pt-8 border-t border-brand-border flex flex-col items-center space-y-4 text-xs text-brand-text-secondary font-light">
          <p>
            &copy; {new Date().getFullYear()} Dimensione Immagine Abbigliamento
            SRL.
          </p>
          <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6">
            <div className="flex items-center space-x-2">
              <FileText size={14} className="text-brand-accent h-4 w-4" />
              <span>P.IVA 03812960833</span>
            </div>
            <div className="flex items-center space-x-2">
              <IdCard size={14} className="text-brand-accent h-4 w-4" />
              <span>COD. Univoco WY7PJ6K</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
