import React from "react";
import { Link } from "react-router-dom";
import { Facebook, FileText, IdCard, Instagram, Linkedin } from "lucide-react";
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
            <h3 className="font-serif font-bold text-xs tracking-widest uppercase text-brand-text-primary leading-relaxed">
              Seguici
            </h3>
            <p className="text-sm text-brand-text-secondary font-light leading-relaxed">
              Rimani aggiornato sulle novita di Dimensione Immagine attraverso i
              nostri canali social ufficiali.
            </p>
            <div className="flex flex-wrap gap-3 text-brand-text-secondary">
              {siteSettings.socialLinks.map((item) => (
                <a
                  key={item.url}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={item.label || item.platform}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-brand-border hover:border-brand-accent hover:text-brand-accent transition-colors"
                >
                  {renderSocialIcon(item.platform)}
                </a>
              ))}
            </div>
            <div className="flex flex-col space-y-2 text-sm text-brand-text-secondary font-light">
              {siteSettings.primaryEmail && (
                <a
                  href={`mailto:${siteSettings.primaryEmail}`}
                  className="hover:text-brand-accent transition-colors break-all"
                >
                  {siteSettings.primaryEmail}
                </a>
              )}
              {siteSettings.primaryPhone && (
                <a
                  href={`tel:${siteSettings.primaryPhone.replace(/\s+/g, "")}`}
                  className="hover:text-brand-accent transition-colors"
                >
                  {siteSettings.primaryPhone}
                </a>
              )}
            </div>
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
