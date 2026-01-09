import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { NavItem } from '../../types';

const NAV_ITEMS: NavItem[] = [
  { label: 'Home', path: '/' },
  { label: 'Chi Siamo', path: '/chi-siamo' },
  { label: 'Servizi', path: '/servizi' },
  { label: 'Portfolio', path: '/portfolio' },
  { label: 'Negozi & Sedi', path: '/sedi' },
  { label: 'Contatti', path: '/contatti' },
];

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  // Prevent scrolling when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <>
      <nav className={`fixed w-full z-50 transition-all duration-500 ${scrolled || isOpen ? 'bg-brand-black/95 backdrop-blur-md py-4 border-b border-white/10' : 'bg-transparent py-6'}`}>
        <div className="container mx-auto flex justify-between items-center px-6">
          
          {/* Logo */}
          <Link to="/" className="z-50 group relative" onClick={() => setIsOpen(false)}>
            <div className="flex flex-col items-start">
              <span className="font-serif text-2xl font-bold tracking-tighter text-white group-hover:text-brand-gold transition-colors duration-300">
                DIMENSIONE
              </span>
              <span className="text-[10px] tracking-[0.3em] uppercase text-brand-gold font-medium">
                Immagine
              </span>
            </div>
          </Link>

          {/* Desktop Menu - Hidden on tablets/mobile (< 1024px) */}
          <div className="hidden lg:flex space-x-6 xl:space-x-8 items-center">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`text-sm uppercase tracking-widest transition-colors duration-300 hover:text-brand-gold ${
                  location.pathname === item.path ? 'text-brand-gold font-medium' : 'text-white/80'
                }`}
              >
                {item.label}
              </Link>
            ))}
            <Link 
              to="/contatti" 
              className="ml-4 px-5 py-2 border border-brand-gold text-brand-gold text-xs uppercase tracking-widest hover:bg-brand-gold hover:text-white transition-all duration-300"
            >
              Preventivo
            </Link>
          </div>

          {/* Mobile/Tablet Toggle - Visible until desktop (> 1024px) */}
          <button 
            onClick={() => setIsOpen(!isOpen)} 
            className="lg:hidden text-white hover:text-brand-gold transition-colors z-50 focus:outline-none p-2 -mr-2"
            aria-label={isOpen ? "Chiudi menu" : "Apri menu"}
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay - Rendered outside nav to prevent clipping/context issues */}
      <div 
        className={`fixed inset-0 bg-brand-black z-40 overflow-y-auto transition-all duration-500 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="min-h-screen flex flex-col justify-center items-center py-24 px-6 text-center">
          <div className="flex flex-col space-y-6 md:space-y-8 w-full">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`font-serif text-2xl sm:text-3xl md:text-4xl text-white hover:text-brand-gold transition-colors duration-300 ${
                  location.pathname === item.path ? 'text-brand-gold italic' : ''
                }`}
              >
                {item.label}
              </Link>
            ))}
            <div className="pt-8 animate-fade-in-up flex justify-center">
              <Link 
                to="/contatti" 
                className="inline-block px-8 py-3 border border-brand-gold text-brand-gold text-sm uppercase tracking-widest hover:bg-brand-gold hover:text-white transition-all duration-300"
              >
                Richiedi Preventivo
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};