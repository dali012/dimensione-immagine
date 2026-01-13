import React from "react";
import { SEO } from "../components/SEO/SEO";
import { Reveal } from "../components/UI/Reveal";

export const TermsAndConditions: React.FC = () => {
  return (
    <div className="pt-24 min-h-screen bg-brand-bg text-brand-text-primary">
      <SEO
        title="Termini e Condizioni | Dimensione Immagine"
        description="Termini e condizioni generali di utilizzo del sito Dimensione Immagine Abbigliamento."
        url="https://www.dimensioneimmagine.net/termini-condizioni"
      />
      <div className="container mx-auto px-6 py-12 max-w-4xl">
        <Reveal width="100%">
          <h1 className="font-serif text-4xl mb-8 text-brand-accent">
            Termini e Condizioni
          </h1>

          <div className="space-y-8 text-brand-text-secondary font-light leading-relaxed">
            <section>
              <h2 className="text-xl font-serif text-brand-text-primary mb-4">
                1. Introduzione
              </h2>
              <p>
                Le presenti Condizioni Generali regolano l'accesso e l'utilizzo
                del sito web di{" "}
                <strong>Dimensione Immagine Abbigliamento SRL</strong>.
                Utilizzando questo sito, l'utente accetta di essere vincolato da
                questi termini. Se non sei d'accordo con una qualsiasi parte dei
                termini, ti invitiamo a non utilizzare il sito.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-serif text-brand-text-primary mb-4">
                2. Informazioni sulla Società
              </h2>
              <p>
                Il sito è di proprietà di{" "}
                <strong>Dimensione Immagine Abbigliamento SRL</strong>.
                <br />
                Sede legale: Contrada S. Lucia, 46, Capo d’Orlando (ME)
                <br />
                P.IVA: 03812960833
                <br />
                Email: info@dimensioneimmagine.net
              </p>
            </section>

            <section>
              <h2 className="text-xl font-serif text-brand-text-primary mb-4">
                3. Utilizzo del Sito e dei Servizi
              </h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Newsletter:</strong> L'utente può iscriversi
                  volontariamente alla nostra newsletter per ricevere
                  aggiornamenti. L'utente garantisce che l'indirizzo email
                  fornito è corretto e di sua proprietà.
                </li>
                <li>
                  <strong>Modulo di Contatto:</strong> L'utente si impegna a
                  fornire dati veritieri e corretti (Nome, Email, Telefono)
                  quando invia richieste tramite il form di contatto.
                </li>
                <li>
                  <strong>Contenuti:</strong> Il sito ha scopo illustrativo
                  delle collezioni moda. Le immagini dei prodotti sono il più
                  possibile fedeli alla realtà, ma potrebbero differire per
                  effetto delle impostazioni del monitor.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-serif text-brand-text-primary mb-4">
                4. Proprietà Intellettuale
              </h2>
              <p>
                Tutti i contenuti presenti sul sito (testi, immagini, loghi,
                grafica, layout) sono di proprietà esclusiva di Dimensione
                Immagine Abbigliamento SRL o dei suoi licenziatari e sono
                protetti dalle leggi italiane e internazionali sul diritto
                d'autore. È vietata la riproduzione, anche parziale, senza il
                consenso scritto.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-serif text-brand-text-primary mb-4">
                5. Limitazione di Responsabilità
              </h2>
              <p>
                Dimensione Immagine Abbigliamento SRL non sarà responsabile per
                eventuali danni diretti o indiretti derivanti dall'uso o
                dall'impossibilità di usare il sito. Il sito può contenere link
                a siti esterni di terze parti su cui non abbiamo alcun controllo
                e per i quali non assumiamo responsabilità.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-serif text-brand-text-primary mb-4">
                6. Privacy e Cookie
              </h2>
              <p>
                La gestione dei dati personali dell'utente è regolata dalla
                nostra{" "}
                <a
                  href="/privacy-policy"
                  className="underline hover:text-brand-accent"
                >
                  Privacy Policy
                </a>{" "}
                e{" "}
                <a
                  href="/cookie-policy"
                  className="underline hover:text-brand-accent"
                >
                  Cookie Policy
                </a>
                , che costituiscono parte integrante di queste condizioni.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-serif text-brand-text-primary mb-4">
                7. Legge Applicabile e Foro Competente
              </h2>
              <p>
                Le presenti Condizioni sono regolate dalla legge italiana. Per
                qualsiasi controversia relativa all'interpretazione o esecuzione
                delle presenti condizioni, sarà competente in via esclusiva il
                Foro di Messina, fatte salve le norme inderogabili a tutela del
                consumatore.
              </p>
            </section>

            <div className="pt-8 text-sm text-brand-text-secondary/60">
              Ultimo aggiornamento: {new Date().toLocaleDateString("it-IT")}
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  );
};
