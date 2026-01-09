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

export const About: React.FC = () => {
  return (
    <div className="pt-24 min-h-screen bg-brand-black">
      <SEO
        title="Chi Siamo | Dimensione Immagine"
        description="Da oltre quarant’anni selezioniamo capi che uniscono qualità, estetica e convenienza. Scopri la nostra mission."
        image="/og-chi-siamo.jpg"
      />
      {/* Header */}
      <div className="container mx-auto px-6 py-12 md:py-20 text-center">
        <span className="text-brand-gold text-xs font-bold uppercase tracking-widest mb-4 block">
          La nostra storia
        </span>
        <h1 className="font-serif text-5xl md:text-7xl mb-12">Chi Siamo</h1>
        <div className="w-px h-20 bg-gradient-to-b from-brand-gold to-transparent mx-auto"></div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Image */}
          <div className="relative">
            <div className="absolute -top-4 -left-4 w-24 h-24 border-t border-l border-brand-gold/30"></div>
            <img
              src="/images/about-team.png"
              alt="Il team di Dimensione Immagine"
              className="w-full h-auto object-cover filter grayscale contrast-110 hover:grayscale-0 transition-all duration-700"
              width="800"
              height="1000"
              loading="eager"
            />
            <div className="absolute -bottom-4 -right-4 w-24 h-24 border-b border-r border-brand-gold/30"></div>
          </div>

          {/* Copy */}
          <div className="space-y-8">
            <h2 className="text-3xl font-serif text-white">
              DIMENSIONE IMMAGINE È ELEGANTE, MODERNO, ICONICO, RAFFINATO,
              INCLUSIVO, AUTENTICO.
            </h2>
            <div className="space-y-6 text-white/70 font-light leading-relaxed">
              <p>
                Dal 1984 Dimensione Immagine, fondata da Fortunato Oteri,
                interpreta la moda come un gesto di accoglienza e identità. Nata
                in Sicilia come un’elegante realtà, la nostra storia affonda le
                radici nella cura del dettaglio, nel rispetto delle persone e
                nella volontà di creare un’esperienza che unisca stile e
                umanità.
              </p>
              <p>
                Nel corso dei decenni, quel primo negozio è diventato un punto
                di riferimento per il mondo Donna e Uomo, grazie a collezioni
                contemporanee, versatili e accuratamente selezionate. La nostra
                crescita è stata guidata da una visione chiara: ampliare la
                nostra presenza senza mai smarrire l’essenza che ci ha resi
                riconoscibili — la capacità di far sentire ogni cliente unico,
                compreso e valorizzato.
              </p>
              <p>
                Oggi Dimensione Immagine è una rete di store diretti e affiliati
                che combina tradizione, modernità e una cultura dell’accoglienza
                radicata e sincera. Un brand che evolve restando fedele alla
                propria anima.
              </p>
            </div>

            <div className="pt-8 border-t border-white/10">
              <h3 className="text-brand-gold text-lg font-serif mb-2">
                La nostra promessa
              </h3>
              <p className="text-white/80 italic">
                "Valorizzare ogni fisicità, ogni storia e ogni momento della
                vita."
              </p>
            </div>

            <div className="pt-4">
              <Button to="/contact" variant="outline">
                Contattaci
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats/Philosophy */}
      <section className="bg-brand-darkgray py-20">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center bg-brand-black/20 rounded-2xl border border-white/5 p-8">
            <div className="p-6">
              <span className="block text-4xl font-serif text-brand-gold mb-2">
                5000+
              </span>
              <h4 className="text-lg font-medium text-white/80">
                CAPI SUGLI SCAFFALI
              </h4>
            </div>
            <div className="p-6 border-y md:border-y-0 md:border-x border-white/10">
              <span className="block text-4xl font-serif text-brand-gold mb-2">
                15
              </span>
              <h4 className="text-lg font-medium text-white/80">
                PUNTI VENDITA ATTIVI
              </h4>
            </div>
            <div className="p-6">
              <span className="block text-4xl font-serif text-brand-gold mb-2">
                1500+
              </span>
              <h4 className="text-lg font-medium text-white/80">
                CLIENTI SODDISFATTI
              </h4>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 bg-brand-black">
        <div className="container mx-auto px-6 text-center mb-16">
          <span className="text-brand-gold text-xs font-bold uppercase tracking-widest mb-4 block">
            La nostra filosofia
          </span>
          <h2 className="font-serif text-4xl md:text-5xl mb-6">
            I Nostri Valori
          </h2>
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
                  <div className="flex items-center gap-4">
                    <span className="text-6xl font-serif text-brand-gold/20">
                      0{index + 1}
                    </span>
                    <h3 className="text-3xl font-serif text-white">
                      {value.title}
                    </h3>
                  </div>
                  <p className="text-lg text-white/70 font-light leading-relaxed pl-4 border-l border-brand-gold/30">
                    {value.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
