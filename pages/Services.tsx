import React from "react";
import { Button } from "../components/UI/Button";
import { SEO } from "../components/SEO/SEO";

interface ValueItem {
  title: string;
  description: string;
}

const VALUES: ValueItem[] = [
  {
    title: "Famiglia & Accoglienza",
    description:
      "Il nostro DNA è familiare: accogliere con calore, ascoltare con attenzione, rispettare con autenticità.",
  },
  {
    title: "Accessibilità e Prezzi Giusti",
    description:
      "Crediamo che la bellezza debba essere condivisa. La nostra moda resta accessibile senza rinunciare alla qualità.",
  },
  {
    title: "Stile & Tendenza",
    description:
      "Collezioni dinamiche, ricercate e sempre aggiornate, create per accompagnare ogni stagione e stato d’animo.",
  },
  {
    title: "Inclusività e Valorizzazione delle Fisicità",
    description:
      "Celebriamo la diversità. Le nostre linee sono pensate per vestire, valorizzare e rispettare ogni corpo.",
  },
  {
    title: "Qualità e Selezione Curata",
    description:
      "Ogni capo è scelto con attenzione ai materiali, alle finiture e al comfort, affinché duri e si indossi con piacere.",
  },
  {
    title: "Tradizione & Evoluzione",
    description:
      "Preserviamo oltre quarant’anni di esperienza con uno sguardo rivolto al futuro, innovando senza mai tradire le nostre radici.",
  },
  {
    title: "Fiducia & Relazione con il Cliente",
    description:
      "La fiducia si conquista con trasparenza, costanza e presenza. Per noi, ogni cliente è una relazione da coltivare.",
  },
];

const VALUE_IMAGES = [
  "https://picsum.photos/800/600?random=10",
  "https://picsum.photos/800/600?random=11",
  "https://picsum.photos/800/600?random=12",
  "https://picsum.photos/800/600?random=13",
  "https://picsum.photos/800/600?random=14",
  "https://picsum.photos/800/600?random=15",
  "https://picsum.photos/800/600?random=16",
];

export const Services: React.FC = () => {
  return (
    <div className="pt-24 min-h-screen bg-brand-black">
      <SEO
        title="I Nostri Valori | Dimensione Immagine"
        description="Scopri i valori che guidano Dimensione Immagine: Famiglia, Accessibilità, Stile, Inclusività e Tradizione."
        url="https://www.dimensioneimmagine.net/servizi"
        image="/og-servizi.jpg"
      />
      <div className="container mx-auto px-6 py-12 text-center">
        <span className="text-brand-gold text-xs font-bold uppercase tracking-widest mb-4 block">
          La nostra filosofia
        </span>
        <h1 className="font-serif text-5xl md:text-7xl mb-6">
          I Nostri Valori
        </h1>
        <p className="text-white/60 max-w-2xl mx-auto font-light">
          Principi che guidano ogni nostra scelta, da oltre quarant'anni.
        </p>
      </div>

      <div className="container mx-auto px-6 pb-24">
        <div className="space-y-24">
          {VALUES.map((value, index) => (
            <div
              key={index}
              className={`flex flex-col md:flex-row gap-12 items-center ${
                index % 2 === 1 ? "md:flex-row-reverse" : ""
              }`}
            >
              {/* Image Side */}
              <div className="w-full md:w-1/2">
                <div className="relative aspect-[4/3] overflow-hidden group">
                  <div className="absolute inset-0 bg-brand-gold/20 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <img
                    src={VALUE_IMAGES[index]}
                    alt={value.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 filter grayscale hover:grayscale-0"
                    width="800"
                    height="600"
                    loading="lazy"
                  />
                </div>
              </div>

              {/* Text Side */}
              <div className="w-full md:w-1/2 space-y-6">
                <h2 className="text-3xl font-serif text-white">
                  {value.title}
                </h2>
                <div className="w-12 h-0.5 bg-brand-gold"></div>
                <p className="text-white/70 leading-relaxed font-light text-lg">
                  {value.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Bottom */}
      <section className="bg-brand-darkgray py-20 text-center">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-serif mb-6">
            Condividi i nostri valori?
          </h2>
          <p className="text-white/60 mb-8">
            Vieni a trovarci e scopri la nostra realtà.
          </p>
          <Button to="/contatti" variant="primary">
            Contattaci
          </Button>
        </div>
      </section>
    </div>
  );
};
