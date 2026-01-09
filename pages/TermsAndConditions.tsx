import React from "react";
import { SEO } from "../components/SEO/SEO";

export const TermsAndConditions: React.FC = () => {
  return (
    <div className="pt-24 min-h-screen bg-brand-black text-white">
      <SEO
        title="Termini e Condizioni | Dimensione Immagine"
        description="Termini e condizioni generali di utilizzo del sito Dimensione Immagine Abbigliamento."
        url="https://www.dimensioneimmagine.net/termini-condizioni"
      />
      <div className="container mx-auto px-6 py-12 max-w-4xl">
        <h1 className="font-serif text-4xl mb-8 text-brand-gold">
          Termini e Condizioni
        </h1>

        <div className="space-y-8 text-white/80 font-light leading-relaxed">
          <section>
            <h2 className="text-xl font-serif text-white mb-4">
              1. Introduzione
            </h2>
            <p>
              Le presenti Condizioni Generali regolano l'utilizzo di questo sito
              web e le transazioni che possono avvenire attraverso di esso.
              Utilizzando questo sito o effettuando un ordine attraverso di
              esso, accetti di essere vincolato da queste Condizioni.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-serif text-white mb-4">
              2. I nostri Dati
            </h2>
            <p>
              La vendita dei prodotti attraverso il presente sito è gestita da{" "}
              <strong>Dimensione Immagine Abbigliamento SRL</strong>, con sede
              legale in Via Maddalena 38/D, 98122 Messina (ME), P.IVA
              03812960833.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-serif text-white mb-4">
              3. Prodotti e Disponibilità
            </h2>
            <p>
              Tutti gli ordini dei prodotti sono soggetti alla disponibilità
              degli stessi. In tal senso, in caso di problemi di fornitura o se
              non fossero presenti articoli in stock, ci riserviamo il diritto
              di fornirti informazioni relative a prodotti sostitutivi di
              qualità e valore pari o superiore, che Tu potrai decidere di
              ordinare. Qualora Tu non desiderassi effettuare un ordine di tali
              prodotti sostitutivi, ti rimborseremo tutti gli importi
              eventualmente già da Te corrisposti.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-serif text-white mb-4">
              4. Prezzi e Pagamento
            </h2>
            <p className="mb-4">
              I prezzi dei prodotti saranno quelli indicati di volta in volta
              sul nostro sito, salvo laddove sussista un errore palese. I prezzi
              indicati sul sito web sono comprensivi di IVA.
            </p>
            <p>
              I prezzi possono subire variazioni in qualsiasi momento; tuttavia
              (salvo laddove stabilito precedentemente) le possibili modifiche
              non riguarderanno gli ordini per i quali abbiamo già inviato una
              Conferma dell'Ordine.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-serif text-white mb-4">
              5. Politica di Reso
            </h2>
            <p className="mb-4">
              Conformemente alle disposizioni legali in vigore, hai diritto di
              recedere dal contratto di acquisto (Diritto di Recesso) entro un
              termine di 14 giorni dalla data di ricezione dei prodotti.
            </p>
            <p>
              I prodotti dovranno essere restituiti nelle stesse condizioni in
              cui sono stati ricevuti.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-serif text-white mb-4">
              6. Proprietà Intellettuale
            </h2>
            <p>
              Riconosci e accetti che tutti i diritti di autore, marchi
              registrati e qualsivoglia diritto di proprietà intellettuale sui
              materiali o i contenuti presentati come parte integrante del sito
              web sono di nostra proprietà o di coloro che ci hanno concesso
              licenza per il loro uso.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-serif text-white mb-4">
              7. Legge Applicabile e Giurisdizione
            </h2>
            <p>
              L'uso del nostro sito web e i contratti di acquisto dei prodotti
              tramite tale sito web sono regolati dal diritto italiano. Per
              qualsiasi controversia derivante o relativa all'uso del sito web o
              a tali contratti, sarà competente il Giudice del luogo di
              residenza o di domicilio del consumatore.
            </p>
          </section>

          <div className="pt-8 text-sm text-white/40">
            Ultimo aggiornamento: {new Date().toLocaleDateString("it-IT")}
          </div>
        </div>
      </div>
    </div>
  );
};
