import React from "react";
import { useLocation } from "react-router-dom";
import { SEO } from "../components/SEO/SEO";
import { Reveal } from "../components/UI/Reveal";

interface ValueItem {
  title: string;
  description: string;
}

const VALUES: ValueItem[] = [
  {
    title: "Famiglia & Accoglienza",
    description:
      "Il nostro DNA é familiare: accogliere con calore, ascoltare con attenzione, rispettare con autenticita. Prestiamo la massima attenzione all'esposizione del prodotto, alla suddivisione dei colori, per creare outfit versabili e facilmente comprensibili. La perfetta concezione per un impatto diretto ed una lettura comprensibile del prodotto.",
  },
  {
    title: "Valore aggiunto",
    description:
      "Curiamo al massimo il prezzo di vendita, offriamo tutto l'anno promozioni e iniziative per rendere la moda accessibile a tutti. Con sconti dal 50% al 90% su una selezione di oltre 650.000 capi per stagione, ogni giorno é un'opportunita' per rinnovare il proprio stile senza compromessi.",
  },
  {
    title: "Stile & Tendenza",
    description:
      "Collezioni dinamiche, ricercate e sempre aggiornate, create per accompagnare ogni stagione e stato d'animo. In collaborazione con i nostri fornitori, con un accordo che ci rende esclusivisti a livello nazionale di molti marchi da noi trattati. ",
  },
  {
    title: "Qualita & Selezione Curata",
    description:
      "Ogni capo e scelto con attenzione ai materiali, i nostri fornitori curano ogni dettaglio  dalle finiture  al comfort, affinche duri e si indossi con piacere in un total look sempre aggiornato per stile e colore.",
  },
  {
    title: "Tradizione & Evoluzione",
    description:
      "Preserviamo oltre quarant'anni di esperienza con uno sguardo rivolto al futuro, innovando senza tradire le nostre radici.",
  },
  {
    title: "Fiducia & Relazione con il Cliente",
    description:
      "La fiducia si conquista con trasparenza, costanza e presenza. Per noi, ogni cliente e una relazione da coltivare.",
  },
];

export const About: React.FC = () => {
  const location = useLocation();

  return (
    <div className="pt-24 min-h-screen bg-brand-bg text-brand-text-primary">
      <SEO
        title="Chi Siamo | Dimensione Immagine"
        description="Dal 1984 a Messina, interpreti della moda come gesto di accoglienza. Scopri la nostra storia."
        url={`https://www.dimensioneimmagineabbigliamento.it${location.pathname}`}
        image="/og-chi-siamo.jpg"
      />

      <section className="container mx-auto px-4 sm:px-6 py-14 sm:py-16 lg:py-28">
        <Reveal width="100%">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
            <div className="lg:col-span-4">
              <span className="block text-xs font-bold uppercase tracking-widest text-brand-text-secondary mb-5">
                Dal 1984
              </span>
              <h1 className="font-serif text-4xl sm:text-5xl md:text-7xl leading-[0.95]">
                Chi Siamo
              </h1>
            </div>

            <div className="lg:col-span-8 border-l border-brand-accent/30 pl-4 sm:pl-8 lg:pl-10">
              <div className="space-y-6 text-brand-text-secondary text-base md:text-lg leading-relaxed font-light">
                <p>
                  Un racconto di stile, autenticita e visione curato da un team
                  proffesionale e altamente specializzato.{" "}
                </p>
                <p>
                  Dal 1984 Dimensione Immagine, interpreta la moda come un gesto
                  di accoglienza e identita. Nata in Sicilia, la nostra storia
                  affonda le radici nella cura del dettaglio, nel rispetto delle
                  persone e nella volonta di creare un'esperienza che unisce
                  stile e umanita.
                </p>
                <p>
                  Nel corso dei decenni, quel primo negozio e diventato un
                  riferimento per il mondo Donna e Uomo, grazie a collezioni
                  contemporanee, versatili e attentamente selezionate. La nostra
                  crescita e stata guidata da una visione chiara: ampliare la
                  nostra presenza senza smarrire l'essenza che ci ha resi
                  riconoscibili, la capacita di far sentire ogni cliente unico,
                  compreso e valorizzato.
                </p>
                <p>
                  Oggi Dimensione Immagine é una rete di store diretti e
                  affiliati che combina tradizione, modernita e cultura
                  dell'accoglienza. Un brand che evolve restando fedele alla
                  propria anima.
                </p>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      <section className="container mx-auto px-4 sm:px-6 pb-16 sm:pb-20 lg:pb-24">
        <Reveal width="100%">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
            <div className="lg:col-span-4">
              <span className="block text-xs font-bold uppercase tracking-widest text-brand-text-secondary mb-5">
                Valori in Azione
              </span>
              <h2 className="font-serif text-4xl sm:text-5xl md:text-7xl leading-[0.95]">
                La Nostra Mission
              </h2>
            </div>

            <div className="lg:col-span-8 border-l border-brand-accent/30 pl-4 sm:pl-8 lg:pl-10">
              <div className="space-y-6 text-brand-text-secondary text-base md:text-lg leading-relaxed font-light">
                <p>Moda che parla alle persone, non alle taglie.</p>
                <p>
                  La nostra mission e offrire una moda accessibile, inclusiva e
                  in grado di valorizzare ogni fisicita, ogni storia, ogni
                  momento della vita.
                </p>
                <p>
                  Da oltre quarant'anni selezioniamo capi che uniscono qualita,
                  estetica e convenienza, trasformando l'atto di vestirsi in un
                  linguaggio personale, libero e sofisticato.
                </p>
                <p>
                  Crediamo in una moda che vive nella quotidianita:
                  contemporanea, confortevole, profondamente autentica.
                </p>
                <p>
                  Per questo sviluppiamo collezioni{" "}
                  <span className="font-bold">Uomo, Donna e Taglie Forti</span>{" "}
                  che non vestono soltanto il corpo, ma interpretano la
                  personalita di chi le sceglie.
                </p>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      <section className="py-16 sm:py-20 md:py-24 border-y border-brand-border bg-white">
        <div className="container mx-auto px-6">
          <Reveal width="100%">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12 text-center">
              <div>
                <span className="block text-5xl font-serif text-brand-accent mb-4">
                  650.000+
                </span>
                <span className="text-xs uppercase tracking-widest text-brand-text-secondary">
                  Capi Disponibili
                </span>
              </div>
              <div>
                <span className="block text-5xl font-serif text-brand-accent mb-4">
                  10
                </span>
                <span className="text-xs uppercase tracking-widest text-brand-text-secondary">
                  Punti Vendita
                </span>
              </div>
              <div>
                <span className="block text-5xl font-serif text-brand-accent mb-4">
                  30.000+
                </span>
                <span className="text-xs uppercase tracking-widest text-brand-text-secondary">
                  Clienti fidelizzati
                </span>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="py-16 sm:py-20 lg:py-32 bg-brand-surface/40">
        <div className="container mx-auto px-4 sm:px-6">
          <Reveal className="mb-14 sm:mb-16 lg:mb-20 mx-auto">
            <h2 className="font-serif text-4xl lg:text-5xl mb-2 text-center">
              I Nostri Valori
            </h2>
            <div className="h-px bg-brand-accent/50 mx-auto max-w-md"></div>
            <p className="mt-4 text-center text-brand-text-secondary">
              I principi che definiscono la nostra identita.
            </p>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 items-stretch">
            {VALUES.map((value, index) => (
              <Reveal key={value.title} width="100%" fullHeight>
                <div className="h-full border border-brand-border bg-white p-6 sm:p-8 lg:p-10 rounded-sm">
                  <div className="flex items-center gap-4 mb-6">
                    <span className="inline-flex items-center justify-center w-10 h-10 rounded-full border border-brand-accent/30 text-brand-accent text-sm font-semibold shrink-0">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div className="h-px w-full bg-brand-accent/20"></div>
                  </div>
                  <h3 className="text-2xl lg:text-3xl font-serif uppercase mb-5 tracking-wide text-brand-text-primary leading-tight">
                    {value.title}
                  </h3>
                  <p className="text-base sm:text-lg text-brand-text-secondary font-light leading-relaxed">
                    {value.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
