import React from "react";
import { Link } from "react-router-dom";
import { Facebook, FileText, IdCard, Instagram, Linkedin } from "lucide-react";
import { toast } from "sonner";
import { useSiteContent } from "../../contexts/SiteContentContext";

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

const renderSocialIcon = (platform: string) => {
  switch (platform) {
    case "facebook":
      return <Facebook size={18} />;
    case "instagram":
      return <Instagram size={18} />;
    case "tiktok":
      return <TikTokIcon size={18} />;
    case "linkedin":
      return <Linkedin size={18} />;
    default:
      return <FileText size={18} />;
  }
};

export const Footer: React.FC = () => {
  const [email, setEmail] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const { siteSettings } = useSiteContent();

  const companyLinks = siteSettings.navigationItems.filter((item) =>
    ["/chi-siamo", "/sedi", "/contatti"].includes(item.route),
  );

  return (
    <footer className="bg-brand-bg text-brand-text-primary border-t border-brand-border">
      <div className="container mx-auto px-6 py-8 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-12 lg:gap-4">
          <div className="flex flex-col space-y-6">
            <h3 className="font-serif font-bold text-xs tracking-widest uppercase text-brand-text-primary">
              Azienda
            </h3>
            <ul className="flex flex-col space-y-3 text-sm text-brand-text-secondary font-light">
              {companyLinks.map((item) => (
                <li key={item.route}>
                  <Link
                    to={item.route}
                    className="hover:text-brand-accent transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

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

          <div className="flex flex-col space-y-6 lg:pl-4">
            <div className="flex justify-between items-start gap-6">
              <h3 className="font-serif font-bold text-xs tracking-widest uppercase text-brand-text-primary leading-relaxed">
                {siteSettings.footerNewsletterTitle}
              </h3>
              <div className="flex space-x-3 text-brand-text-secondary">
                {siteSettings.socialLinks.map((item) => (
                  <a
                    key={item.url}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={item.label || item.platform}
                    className="hover:text-brand-accent transition-colors"
                  >
                    {renderSocialIcon(item.platform)}
                  </a>
                ))}
              </div>
            </div>
            <p className="text-sm text-brand-text-secondary font-light leading-relaxed">
              {siteSettings.footerNewsletterDescription}
            </p>

            <form
              className="w-full flex flex-col sm:flex-row sm:items-end gap-3 sm:gap-0 pt-2"
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
                } catch (error) {
                  console.error(error);
                  toast.error("Si e verificato un errore. Riprova piu tardi.");
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
                className="w-full grow bg-transparent border-b border-brand-text-secondary py-2 text-sm text-brand-text-primary placeholder-brand-text-secondary/60 outline-none focus:border-brand-accent transition-colors sm:mr-4"
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto bg-brand-accent text-white text-xs font-semibold uppercase px-6 py-3 hover:bg-brand-accent/80 transition-colors disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
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
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                      />
                    </svg>
                    <span>Invio...</span>
                  </span>
                ) : (
                  "Iscriviti"
                )}
              </button>
            </form>
            <p className="text-xs text-brand-text-secondary font-light leading-relaxed">
              {siteSettings.footerNewsletterDisclaimer}
            </p>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-brand-border flex flex-col items-center space-y-4 text-xs text-brand-text-secondary font-light">
          <p>
            &copy; {new Date().getFullYear()} {siteSettings.legalCompanyName}
          </p>
          <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6">
            {siteSettings.vatNumber && (
              <div className="flex items-center space-x-2">
                <FileText size={14} className="text-brand-accent h-4 w-4" />
                <span>P.IVA {siteSettings.vatNumber}</span>
              </div>
            )}
            {siteSettings.codiceUnivoco && (
              <div className="flex items-center space-x-2">
                <IdCard size={14} className="text-brand-accent h-4 w-4" />
                <span>COD. Univoco {siteSettings.codiceUnivoco}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};
