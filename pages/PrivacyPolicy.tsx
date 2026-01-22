import React from "react";
import { SEO } from "../components/SEO/SEO";
import { Reveal } from "../components/UI/Reveal";

export const PrivacyPolicy: React.FC = () => {
  return (
    <div className="pt-24 min-h-screen bg-brand-bg text-brand-text-primary">
      <SEO
        title="Privacy Policy | Dimensione Immagine"
        description="Informativa sulla privacy di Dimensione Immagine Abbigliamento."
        url="https://www.dimensioneimmagine.net/privacy-policy"
      />
      <div className="container mx-auto px-6 py-12 max-w-4xl">
        <Reveal width="100%">
          <h1 className="font-serif text-4xl mb-8 text-brand-accent">
            Privacy Policy
          </h1>

          <div className="space-y-8 text-brand-text-secondary font-light leading-relaxed">
            <section>
              <h2 className="text-xl font-serif text-brand-text-primary mb-4">
                1. Titolare del Trattamento dei Dati
              </h2>
              <p className="mb-4">
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
                P.IVA:{" "}
                <span className="hover:text-brand-accent font-bold">
                  03812960833
                </span>
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

            <section>
              <h2 className="text-xl font-serif text-brand-text-primary mb-4">
                2. Tipologie di Dati raccolti
              </h2>
              <p className="mb-2">
                In qualità di utenti del sito, potremmo raccogliere i seguenti
                dati personali, forniti volontariamente:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Dati di Contatto:</strong> Nome, indirizzo email e
                  numero di telefono forniti durante la compilazione del modulo
                  di contatto o l'iscrizione alla newsletter.
                </li>
                <li>
                  <strong>Dati di Navigazione:</strong> Indirizzi IP, log di
                  sistema e cookie necessari al funzionamento del sito.
                </li>
              </ul>
              <p className="mt-2">
                Il conferimento dei dati è facoltativo, ma necessario per
                usufruire dei servizi di contatto e newsletter.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-serif text-brand-text-primary mb-4">
                3. Finalità e Base Giuridica del Trattamento
              </h2>
              <p className="mb-2">
                Trattiamo i tuoi dati per le seguenti finalità:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Risposta a richieste (Modulo Contatti):</strong> Per
                  rispondere alle domande inviate tramite il form "Parla con
                  noi". La base giuridica è l'esecuzione di misure
                  precontrattuali o contrattuali.
                </li>
                <li>
                  <strong>Newsletter e Marketing:</strong> Per inviare
                  comunicazioni commerciali, aggiornamenti sulle nuove
                  collezioni e promozioni, solo previo tuo esplicito consenso.
                </li>
                <li>
                  <strong>Obblighi di Legge:</strong> Per adempiere a obblighi
                  previsti da leggi, regolamenti o normative comunitarie (es.
                  fatturazione).
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-serif text-brand-text-primary mb-4">
                4. Modalità di Trattamento e Conservazione
              </h2>
              <p className="mb-4">
                Il trattamento è svolto con strumenti informatici e telematici,
                adottando misure di sicurezza idonee a prevenire la perdita,
                l'uso illecito o l'accesso non autorizzato ai dati.
              </p>
              <p className="mb-2">
                <strong>Tempi di conservazione:</strong>
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  I dati raccolti per rispondere alle richieste saranno
                  conservati per il tempo necessario a gestire la richiesta.
                </li>
                <li>
                  I dati per la newsletter saranno conservati fino alla revoca
                  del consenso (disiscrizione).
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-serif text-brand-text-primary mb-4">
                5. Condivisione dei Dati
              </h2>
              <p>
                I dati non saranno diffusi. Potranno essere comunicati a terzi
                fornitori di servizi (es. provider di hosting, piattaforme di
                gestione email) che agiscono come Responsabili del Trattamento,
                operanti in conformità al GDPR (Regolamento UE 2016/679).
              </p>
            </section>

            <section>
              <h2 className="text-xl font-serif text-brand-text-primary mb-4">
                6. Diritti dell’Utente
              </h2>
              <p className="mb-2">Ai sensi del GDPR, hai il diritto di:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  Chiedere l'accesso ai tuoi dati personali, la rettifica o la
                  cancellazione degli stessi.
                </li>
                <li>
                  Revocare il consenso alla newsletter in qualsiasi momento.
                </li>
                <li>Opporti al trattamento o richiederne la limitazione.</li>
                <li>Richiedere la portabilità dei dati.</li>
              </ul>
              <p className="mt-4">
                Per esercitare i tuoi diritti, puoi contattare il Titolare
                all'indirizzo email:{" "}
                <strong>
                  {" "}
                  <a
                    href="mailto:contact@dimensioneimmagineabbigliamento.it"
                    className="hover:text-brand-accent"
                  >
                    contact@dimensioneimmagineabbigliamento.it
                  </a>
                </strong>
                .
              </p>
            </section>

            <section>
              <h2 className="text-xl font-serif text-brand-text-primary mb-4">
                7. Modifiche a questa Privacy Policy
              </h2>
              <p>
                Il Titolare si riserva il diritto di apportare modifiche alla
                presente Privacy Policy in qualunque momento dandone
                informazione agli Utenti su questa pagina.
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
