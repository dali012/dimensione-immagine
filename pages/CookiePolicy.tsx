import React from "react";
import { SEO } from "../components/SEO/SEO";
import { Reveal } from "../components/UI/Reveal";

export const CookiePolicy: React.FC = () => {
  return (
    <div className="pt-24 min-h-screen bg-brand-bg text-brand-text-primary">
      <SEO
        title="Cookie Policy | Dimensione Immagine"
        description="Informativa sui cookie di Dimensione Immagine Abbigliamento."
        url="https://www.dimensioneimmagine.net/cookie-policy"
      />
      <div className="container mx-auto px-6 py-12 max-w-4xl">
        <Reveal width="100%">
          <h1 className="font-serif text-4xl mb-8 text-brand-accent">
            Cookie Policy
          </h1>

          <div className="space-y-8 text-brand-text-secondary font-light leading-relaxed">
            <section>
              <h2 className="text-xl font-serif text-brand-text-primary mb-4">
                1. Cosa sono i Cookie?
              </h2>
              <p className="mb-4">
                I cookie sono piccoli file di testo che i siti visitati
                dall'utente inviano e registrano sul suo computer o dispositivo
                mobile, per essere poi ritrasmessi agli stessi siti alla
                successiva visita. Proprio grazie ai cookie un sito ricorda le
                azioni e preferenze dell'utente (come, ad esempio, i dati di
                login, la lingua prescelta, le dimensioni dei caratteri, altre
                impostazioni di visualizzazione, ecc.) in modo che non debbano
                essere indicate nuovamente quando l'utente torni a visitare
                detto sito o navighi da una pagina all'altra di esso.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-serif text-brand-text-primary mb-4">
                2. Tipologie di Cookie utilizzati
              </h2>
              <p className="mb-4">
                Questo sito web utilizza diverse tipologie di cookie:
              </p>

              <div className="mb-6">
                <h3 className="text-md text-brand-text-primary mb-2">
                  - Cookie Tecnici
                </h3>
                <p>
                  Sono quelli utilizzati al solo fine di effettuare la
                  trasmissione di una comunicazione su una rete di comunicazione
                  elettronica, o nella misura strettamente necessaria per
                  erogare un servizio esplicitamente richiesto dall'utente. Non
                  vengono utilizzati per scopi ulteriori e sono normalmente
                  installati direttamente dal titolare o gestore del sito web.
                </p>
              </div>

              <div className="mb-6">
                <h3 className="text-md  text-brand-text-primary mb-2">
                  - Cookie di Analisi (Analytics)
                </h3>
                <p>
                  Sono assimilati ai cookie tecnici laddove utilizzati
                  direttamente dal gestore del sito per raccogliere
                  informazioni, in forma aggregata, sul numero degli utenti e su
                  come questi visitano il sito stesso.
                </p>
              </div>

              <div className="mb-6">
                <h3 className="text-md  text-brand-text-primary mb-2">
                  - Cookie di Profilazione e Marketing
                </h3>
                <p>
                  Sono volti a creare profili relativi all'utente e vengono
                  utilizzati al fine di inviare messaggi pubblicitari in linea
                  con le preferenze manifestate dallo stesso nell'ambito della
                  navigazione in rete.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-serif text-brand-text-primary mb-4">
                3. Gestione dei Cookie
              </h2>
              <p className="mb-4">
                L'utente può decidere se accettare o meno i cookie utilizzando
                le impostazioni del proprio browser. Attenzione: la
                disabilitazione totale o parziale dei cookie tecnici può
                compromettere l'utilizzo delle funzionalità del sito riservate
                agli utenti registrati. Al contrario, la fruibilità dei
                contenuti pubblici è possibile anche disabilitando completamente
                i cookie.
              </p>
              <p>
                La disabilitazione dei cookie "terze parti" non pregiudica in
                alcun modo la navigabilità.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-serif text-brand-text-primary mb-4">
                4. Titolare del Trattamento
              </h2>
              <p>
                <strong>Dimensione Immagine Abbigliamento SRL</strong>
                <br />
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(
                    " Via Maddalena 38/D, 98122 Messina (ME)",
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-xs font-bold hover:text-brand-accent uppercase tracking-widest transition-colors"
                >
                  Via Maddalena 38/D, 98122 Messina (ME)
                </a>
                <br />
                Email:{" "}
                <strong>
                  <a
                    href="mailto:contact@dimensioneimmagineabbigliamento.it"
                    className="hover:text-brand-accent font-bold"
                  >
                    contact@dimensioneimmagineabbigliamento.it
                  </a>
                </strong>
              </p>
            </section>
          </div>
        </Reveal>
      </div>
    </div>
  );
};
