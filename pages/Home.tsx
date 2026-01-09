import React from "react";
import { Link } from "react-router-dom";
import { Button } from "../components/UI/Button";
import { ArrowRight, Layers, PenTool, Printer } from "lucide-react";
import { SEO } from "../components/SEO/SEO";

const ServiceCard: React.FC<{
  title: string;
  desc: string;
  icon: React.ReactNode;
  filterCategory: string;
}> = ({ title, desc, icon, filterCategory }) => (
  <div className="group p-8 border border-white/10 hover:border-brand-gold/50 bg-white/5 hover:bg-white/10 transition-all duration-500 flex flex-col items-start h-full">
    <div className="mb-6 text-brand-gold opacity-80 group-hover:opacity-100 transition-opacity">
      {icon}
    </div>
    <h3 className="text-xl font-serif font-semibold mb-4 text-white group-hover:text-brand-gold transition-colors">
      {title}
    </h3>
    <p className="text-white/60 leading-relaxed mb-6 font-light text-sm flex-grow">
      {desc}
    </p>
    <Link
      to="/portfolio"
      state={{ category: filterCategory }}
      className="inline-flex items-center text-xs uppercase tracking-widest text-white/50 group-hover:text-white transition-colors mt-auto"
    >
      Scopri di più{" "}
      <ArrowRight
        size={14}
        className="ml-2 group-hover:translate-x-1 transition-transform"
      />
    </Link>
  </div>
);

export const Home: React.FC = () => {
  return (
    <div className="flex flex-col">
      <SEO
        title="Dimensione Immagine | Moda Inclusiva e Accessibile"
        description="Scopri la nostra moda accessibile e inclusiva. Collezioni Uomo, Donna e Taglie Forti che valorizzano ogni fisicità e personalità."
        image="/og-image.jpg"
      />
      {/* Hero Section */}
      <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 z-0">
          <img
            src="/images/hero-bg.png"
            alt="Laboratorio di stampa Dimensione Immagine"
            className="w-full h-full object-cover opacity-40"
            width="1920"
            height="1080"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-brand-black/60 to-transparent"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 container mx-auto px-6 text-center">
          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight animate-fade-in-up">
            Moda che parla
            <br />
            <span className="italic text-brand-gold">
              alle persone, non alle taglie.
            </span>
          </h1>
          <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-10 font-light tracking-wide">
            La nostra mission è offrire una moda accessibile, inclusiva e in
            grado di valorizzare ogni fisicità, ogni storia e ogni momento della
            vita.
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
            <Button to="/chi-siamo" variant="primary" ariaLabel="Chi Siamo">
              Chi Siamo
            </Button>
          </div>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="py-24 bg-brand-black">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 divide-y md:divide-y-0 md:divide-x divide-white/10">
            <div className="px-6 text-center md:text-left pt-8 md:pt-0">
              <span className="block text-4xl font-serif text-brand-gold mb-4">
                40+
              </span>
              <h3 className="text-xl font-medium mb-3">Anni di Storia</h3>
              <p className="text-white/60 text-sm leading-relaxed">
                Da oltre quarant’anni selezioniamo capi che uniscono qualità,
                estetica e convenienza.
              </p>
            </div>
            <div className="px-6 text-center md:text-left pt-8 md:pt-0">
              <span className="block text-4xl font-serif text-brand-gold mb-4">
                100%
              </span>
              <h3 className="text-xl font-medium mb-3">Inclusività</h3>
              <p className="text-white/60 text-sm leading-relaxed">
                Collezioni Uomo, Donna e Plus Size per valorizzare ogni
                fisicità.
              </p>
            </div>
            <div className="px-6 text-center md:text-left pt-8 md:pt-0">
              <span className="block text-4xl font-serif text-brand-gold mb-4">
                Unique
              </span>
              <h3 className="text-xl font-medium mb-3">Stile Personale</h3>
              <p className="text-white/60 text-sm leading-relaxed">
                Ogni capo è unico, pensato per esaltare la tua personalità.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="py-24 bg-brand-darkgray">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-16">
            <div>
              <span className="text-brand-gold text-xs font-bold uppercase tracking-widest mb-2 block">
                Cosa offriamo
              </span>
              <h2 className="text-4xl md:text-5xl font-serif">
                Le nostre collezioni
              </h2>
            </div>
            <Button
              to="/portfolio"
              variant="text"
              className="hidden md:inline-flex"
              ariaLabel="Visualizza tutte le collezioni"
            >
              Visualizza tutte le collezioni
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ServiceCard
              title="Collezioni Donna"
              desc="Capi contemporanei e confortevoli che interpretano la personalità di chi li sceglie."
              icon={<Layers size={32} strokeWidth={1} />}
              filterCategory="Donna"
            />
            <ServiceCard
              title="Collezioni Uomo"
              desc="Stile libero e sofisticato per la quotidianità moderna."
              icon={<PenTool size={32} strokeWidth={1} />}
              filterCategory="Uomo"
            />
            <ServiceCard
              title="Plus Size"
              desc="Moda inclusiva che valorizza ogni fisicità senza compromessi sullo stile."
              icon={<Layers size={32} strokeWidth={1} />}
              filterCategory="Plus Size"
            />
          </div>

          <div className="mt-10 text-center md:hidden">
            <Button
              to="/servizi"
              variant="outline"
              ariaLabel="Tutte le collezioni"
            >
              Tutte le collezioni
            </Button>
          </div>
        </div>
      </section>

      {/* Image Strip / Portfolio Teaser */}
      <section className="py-24 bg-brand-black">
        <div className="container mx-auto px-6 mb-12">
          <h2 className="text-3xl md:text-4xl font-serif text-center mb-4">
            Ultimi Progetti
          </h2>
          <div className="w-24 h-1 bg-brand-gold mx-auto"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 h-96 md:h-80">
          <div className="relative group overflow-hidden h-full">
            <img
              src="/images/portfolio-branding.png"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0"
              alt="Progetto di Branding e Identità Visiva"
              width="600"
              height="800"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-brand-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="text-white font-serif italic text-xl">
                Donna
              </span>
            </div>
          </div>
          <div className="relative group overflow-hidden h-full">
            <img
              src="/images/portfolio-sign.png"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0"
              alt="Collezioni Uomo"
              width="600"
              height="800"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-brand-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="text-white font-serif italic text-xl">Uomo</span>
            </div>
          </div>
          <div className="relative group overflow-hidden h-full">
            <img
              src="/images/portfolio-print.png"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0"
              alt="Taglie Forti"
              width="600"
              height="800"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-brand-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="text-white font-serif italic text-xl">
                Taglie Forti
              </span>
            </div>
          </div>
          <div className="relative group overflow-hidden h-full">
            <img
              src="/images/portfolio-shop.png"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0"
              alt="Accessori"
              width="600"
              height="800"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-brand-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="text-white font-serif italic text-xl">
                Accessori
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-brand-gold/10"></div>
        <div className="container mx-auto px-6 relative z-10 text-center">
          <h2 className="text-4xl md:text-5xl font-serif mb-6">
            Scopri il tuo stile personale oggi.
          </h2>
          <p className="text-white/70 mb-10 max-w-xl mx-auto">
            Siamo pronti a rendere unico il tuo guardaroba con professionalità e
            stile.
          </p>
          <Button to="/contatti" variant="primary">
            Contattaci
          </Button>
        </div>
      </section>
    </div>
  );
};
