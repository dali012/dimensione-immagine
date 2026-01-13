import React from "react";
import { Button } from "../components/UI/Button";
import { SEO } from "../components/SEO/SEO";
import { Reveal } from "../components/UI/Reveal";

interface ValueItem {
  title: string;
  description: string;
  image: string;
}

const VALUES: ValueItem[] = [
  {
    title: "Famiglia & Accoglienza",
    description:
      "Il nostro DNA è familiare: accogliere con calore, ascoltare con attenzione, rispettare con autenticità.",
    image: "/images/about-team.png",
  },
  {
    title: "Accessibilità",
    description:
      "Crediamo che la bellezza debba essere condivisa. La nostra moda resta accessibile senza rinunciare alla qualità.",
    image: "/images/hero-bg.jpg",
  },
  {
    title: "Stile & Tendenza",
    description:
      "Collezioni dinamiche, ricercate e sempre aggiornate, create per accompagnare ogni stagione e stato d’animo.",
    image: "/images/hero-bg2.jpg",
  },
  {
    title: "Inclusività",
    description:
      "Celebriamo la diversità. Le nostre linee sono pensate per vestire, valorizzare e rispettare ogni corpo.",
    image: "/images/about-team.png",
  },
  {
    title: "Qualità Curata",
    description:
      "Ogni capo è scelto con attenzione ai materiali, alle finiture e al comfort, affinché duri e si indossi con piacere.",
    image: "/images/hero-bg.jpg",
  },
  {
    title: "Tradizione & Evoluzione",
    description:
      "Preserviamo oltre quarant’anni di esperienza con uno sguardo rivolto al futuro.",
    image: "/images/hero-bg2.jpg",
  },
  {
    title: "Fiducia",
    description:
      "La fiducia si conquista con trasparenza, costanza e presenza. Per noi, ogni cliente è una relazione da coltivare.",
    image: "/images/about-team.png",
  },
];

export const About: React.FC = () => {
  return (
    <div className="pt-24 min-h-screen bg-brand-bg text-brand-text-primary">
      <SEO
        title="Chi Siamo | Dimensione Immagine"
        description="Dal 1984 a Messina, interpreti della moda come gesto di accoglienza. Scopri la nostra storia."
        image="/og-chi-siamo.jpg"
      />

      {/* Editorial Header */}
      <section className="container mx-auto px-6 py-20 lg:py-32">
        <Reveal width="100%">
          <div className="max-w-4xl mx-auto text-center md:text-left">
            <span className="block text-xs font-bold uppercase tracking-widest text-brand-text-secondary mb-6">
              Dal 1984
            </span>
            <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl mb-12 leading-[0.9]">
              Chi Siamo
            </h1>
            <div className="md:pl-24 lg:pl-32 border-l border-brand-accent/30 pl-6">
              <p className="text-xl md:text-3xl text-brand-text-primary font-serif italic mb-8">
                "Dimensione Immagine è elegante, moderno, iconico, raffinato,
                inclusivo, autentico."
              </p>
              <p className="text-brand-text-secondary text-base md:text-lg leading-relaxed font-light max-w-2xl">
                Dal 1984 Dimensione Immagine, fondata da{" "}
                <strong>Fortunato Oteri</strong>, interpreta la moda come un
                gesto di accoglienza e identità. Nata a <strong>Messina</strong>{" "}
                come un’elegante realtà, la nostra storia affonda le radici
                nella cura del dettaglio.
              </p>
            </div>
          </div>
        </Reveal>
      </section>

      {/* Main Image & Story */}
      <section className="py-12 lg:py-24">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Image Span */}
            <div className="lg:col-span-7 h-[60vh] relative overflow-hidden bg-brand-surface rounded-sm">
              <Reveal width="100%" className="h-full">
                <img
                  src="/images/about-team.png"
                  alt="Il team di Dimensione Immagine"
                  className="w-full h-full object-cover"
                  loading="eager"
                />
              </Reveal>
            </div>

            {/* Text Content */}
            <div className="lg:col-span-1"></div>
            <div className="lg:col-span-4 space-y-8">
              <Reveal delay={0.2}>
                <h2 className="text-3xl font-serif mb-6">
                  Evoluzione Continua
                </h2>
                <div className="space-y-6 text-brand-text-secondary text-sm leading-relaxed text-justify">
                  <p>
                    Nel corso dei decenni, quel primo negozio è diventato un
                    punto di riferimento per il mondo Donna e Uomo. La nostra
                    crescita è stata guidata da una visione chiara: ampliare la
                    nostra presenza senza mai smarrire l’essenza che ci ha resi
                    riconoscibili — la capacità di far sentire ogni cliente
                    unico.
                  </p>
                  <p>
                    Oggi Dimensione Immagine è una rete di store diretti e
                    affiliati che combina tradizione e modernità.
                  </p>
                </div>
                <div className="pt-8 border-t border-brand-border">
                  <h3 className="text-brand-accent text-lg font-serif mb-2">
                    La nostra promessa
                  </h3>
                  <p className="text-brand-text-primary italic mb-6">
                    "Valorizzare ogni fisicità, ogni storia e ogni momento della
                    vita."
                  </p>
                  <Button to="/contatti" variant="outline">
                    Entra in contatto
                  </Button>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* Stats - Minimal */}
      <section className="py-24 border-y border-brand-border bg-white">
        <div className="container mx-auto px-6">
          <Reveal width="100%">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
              <div>
                <span className="block text-5xl font-serif text-brand-accent mb-4">
                  5000+
                </span>
                <span className="text-xs uppercase tracking-widest text-brand-text-secondary">
                  Capi Disponibili
                </span>
              </div>
              <div>
                <span className="block text-5xl font-serif text-brand-accent mb-4">
                  15
                </span>
                <span className="text-xs uppercase tracking-widest text-brand-text-secondary">
                  Punti Vendita
                </span>
              </div>
              <div>
                <span className="block text-5xl font-serif text-brand-accent mb-4">
                  1500+
                </span>
                <span className="text-xs uppercase tracking-widest text-brand-text-secondary">
                  Clienti Felici
                </span>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Values List - Alternating Layout like Photo */}
      <section className="py-24 lg:py-32">
        <div className="container mx-auto px-6">
          <Reveal className="mb-24 text-center">
            <h2 className="font-serif text-4xl lg:text-5xl mb-6">
              I Nostri Valori
            </h2>
            <div className="h-px w-24 bg-brand-accent mx-auto"></div>
          </Reveal>

          <div className="space-y-24 lg:space-y-32">
            {VALUES.map((value, index) => (
              <Reveal key={index} width="100%">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
                  {/* Text Column */}
                  <div
                    className={`flex flex-col justify-center ${
                      index % 2 === 0 ? "lg:order-1" : "lg:order-2"
                    }`}
                  >
                    <div className="mb-8 h-px w-12 bg-brand-accent"></div>
                    <h3 className="text-3xl lg:text-5xl font-serif uppercase mb-8 tracking-wide text-brand-text-primary leading-tight">
                      {value.title}
                    </h3>
                    <p className="text-lg text-brand-text-secondary font-light leading-relaxed max-w-lg">
                      {value.description}
                    </p>
                  </div>

                  {/* Image Column */}
                  <div
                    className={`${
                      index % 2 === 0 ? "lg:order-2" : "lg:order-1"
                    }`}
                  >
                    <div className="relative aspect-[16/9] lg:aspect-[3/2] overflow-hidden bg-brand-surface rounded-sm shadow-sm group">
                      <img
                        src={value.image}
                        alt={value.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
