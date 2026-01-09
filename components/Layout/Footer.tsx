import React from "react";
import { Link } from "react-router-dom";
import {
  Facebook,
  Instagram,
  Mail,
  Phone,
  MapPin,
  IdCard,
  ReceiptText,
} from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-brand-darkgray text-white border-t border-white/5">
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-8">
          {/* 1. Brand Section */}
          <div className="space-y-6">
            <div className="flex flex-col items-start">
              <span className="font-serif text-2xl font-bold tracking-tighter text-white">
                DIMENSIONE
              </span>
              <span className="text-[10px] tracking-[0.3em] uppercase text-brand-gold">
                Immagine
              </span>
            </div>
            <p className="text-white/60 text-sm leading-relaxed max-w-sm">
              Moda accessibile, inclusiva e in grado di valorizzare ogni
              fisicità, ogni storia e ogni momento della vita.
            </p>
            <div className="flex space-x-4 pt-2">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/60 hover:bg-brand-gold hover:text-brand-black transition-all duration-300"
                aria-label="Facebook"
              >
                <Facebook size={18} />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/60 hover:bg-brand-gold hover:text-brand-black transition-all duration-300"
                aria-label="Instagram"
              >
                <Instagram size={18} />
              </a>
            </div>
          </div>

          {/* 2. Navigation */}
          <div>
            <h4 className="font-serif text-lg mb-6 text-white">Esplora</h4>
            <ul className="space-y-4 text-sm text-white/60">
              <li>
                <Link
                  to="/chi-siamo"
                  className="hover:text-brand-gold transition-colors inline-block"
                >
                  Chi Siamo
                </Link>
              </li>
              <li>
                <Link
                  to="/sedi"
                  className="hover:text-brand-gold transition-colors inline-block"
                >
                  Negozi & Sedi
                </Link>
              </li>
              <li>
                <Link
                  to="/contatti"
                  className="hover:text-brand-gold transition-colors inline-block"
                >
                  Contatti
                </Link>
              </li>
            </ul>
          </div>

          {/* 3. Contact & Legal Combined */}
          <div>
            <h4 className="font-serif text-lg mb-6 text-white">
              Contatti & Info
            </h4>
            <div className="flex flex-col space-y-4 text-sm text-white/60">
              <div className="flex items-start group">
                <MapPin
                  size={18}
                  className="text-brand-gold mr-3 shrink-0 mt-0.5 group-hover:text-white transition-colors"
                />
                <span>
                  Via Maddalena 38/D
                  <br />
                  98122 Messina (ME)
                </span>
              </div>
              <div className="flex items-center group">
                <Phone
                  size={18}
                  className="text-brand-gold mr-3 shrink-0 group-hover:text-white transition-colors"
                />
                <span>+39 090 240 0474</span>
              </div>
              <div className="flex items-center group">
                <Mail
                  size={18}
                  className="text-brand-gold mr-3 shrink-0 group-hover:text-white transition-colors"
                />
                <a
                  href="mailto:info@dimensioneimmagineabbigliamento.it"
                  className="hover:text-brand-gold transition-colors truncate"
                >
                  info@dimensioneimmagineabbigliamento.it
                </a>
              </div>

              <div className="h-px bg-white/10 my-4 w-1/2"></div>

              <div className="flex items-center group">
                <ReceiptText
                  size={16}
                  className="text-brand-gold/70 mr-3 shrink-0"
                />
                <span className="text-xs">P.IVA 03812960833</span>
              </div>
              <div className="flex items-center group">
                <IdCard
                  size={16}
                  className="text-brand-gold/70 mr-3 shrink-0"
                />
                <span className="text-xs">SDI: WY7PJ6K</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/5 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-white/30">
          <p className="text-center md:text-left mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} Dimensione Immagine Abbigliamento
            SRL. Tutti i diritti riservati.
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            <Link
              to="/privacy-policy"
              className="hover:text-brand-gold cursor-pointer transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              to="/cookie-policy"
              className="hover:text-brand-gold cursor-pointer transition-colors"
            >
              Cookie Policy
            </Link>
            <Link
              to="/termini-condizioni"
              className="hover:text-brand-gold cursor-pointer transition-colors"
            >
              Termini & Condizioni
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
