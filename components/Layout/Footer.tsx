import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Mail, Phone, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-brand-darkgray text-white border-t border-white/5">
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
          
          {/* Brand */}
          <div className="col-span-1 sm:col-span-2 lg:col-span-1">
            <div className="flex flex-col items-start mb-6">
              <span className="font-serif text-xl font-bold tracking-tighter text-white">
                DIMENSIONE
              </span>
              <span className="text-[10px] tracking-[0.3em] uppercase text-brand-gold">
                Immagine
              </span>
            </div>
            <p className="text-white/60 text-sm leading-relaxed mb-6 max-w-sm">
              Stampa digitale, grafica e allestimenti professionali per aziende che vogliono distinguersi.
            </p>
            <div className="flex space-x-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-brand-gold transition-colors" aria-label="Facebook"><Facebook size={20} /></a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-brand-gold transition-colors" aria-label="Instagram"><Instagram size={20} /></a>
            </div>
          </div>

          {/* Links */}
          <div className="col-span-1">
            <h4 className="font-serif text-lg mb-6">Menu</h4>
            <ul className="space-y-3 text-sm text-white/60">
              <li><Link to="/chi-siamo" className="hover:text-brand-gold transition-colors">Chi Siamo</Link></li>
              <li><Link to="/servizi" className="hover:text-brand-gold transition-colors">Servizi</Link></li>
              <li><Link to="/portfolio" className="hover:text-brand-gold transition-colors">Portfolio</Link></li>
              <li><Link to="/sedi" className="hover:text-brand-gold transition-colors">Sedi</Link></li>
              <li><Link to="/contatti" className="hover:text-brand-gold transition-colors">Contatti</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div className="col-span-1">
            <h4 className="font-serif text-lg mb-6">Servizi</h4>
            <ul className="space-y-3 text-sm text-white/60">
              <li>Stampa Digitale</li>
              <li>Grafica Pubblicitaria</li>
              <li>Allestimento Negozi</li>
              <li>Insegne & Vetrofanie</li>
              <li>Branding</li>
            </ul>
          </div>

          {/* Contact */}
          <div className="col-span-1">
            <h4 className="font-serif text-lg mb-6">Contatti</h4>
            <ul className="space-y-4 text-sm text-white/60">
              <li className="flex items-start">
                <MapPin size={18} className="text-brand-gold mr-3 shrink-0 mt-0.5" />
                <span>Contrada S. Lucia, 46<br/>Capo d’Orlando (ME)</span>
              </li>
              <li className="flex items-center">
                <Phone size={18} className="text-brand-gold mr-3 shrink-0" />
                <span>+39 392 718 9875</span>
              </li>
              <li className="flex items-center">
                <Mail size={18} className="text-brand-gold mr-3 shrink-0" />
                <span>info@dimensioneimmagine.net</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-white/40 text-center md:text-left">
          <p>&copy; {new Date().getFullYear()} Dimensione Immagine. Tutti i diritti riservati.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <span className="hover:text-white cursor-pointer">Privacy Policy</span>
            <span className="hover:text-white cursor-pointer">Cookie Policy</span>
          </div>
        </div>
      </div>
    </footer>
  );
};