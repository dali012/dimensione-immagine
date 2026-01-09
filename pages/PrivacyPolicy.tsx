import React from "react";
import { SEO } from "../components/SEO/SEO";

export const PrivacyPolicy: React.FC = () => {
  return (
    <div className="pt-24 min-h-screen bg-brand-black text-white">
      <SEO
        title="Privacy Policy | Dimensione Immagine"
        description="Informativa sulla privacy di Dimensione Immagine Abbigliamento."
        url="https://www.dimensioneimmagine.net/privacy-policy"
      />
      <div className="container mx-auto px-6 py-12 max-w-4xl">
        <h1 className="font-serif text-4xl mb-8 text-brand-gold">
          Privacy Policy
        </h1>

        <div className="space-y-8 text-white/80 font-light leading-relaxed">
          <section>
            <h2 className="text-xl font-serif text-white mb-4">
              1. Titolare del Trattamento dei Dati
            </h2>
            <p className="mb-4">
              <strong>Dimensione Immagine Abbigliamento SRL</strong>
              <br />
              Via Maddalena 38/D, 98122 Messina (ME)
              <br />
              P.IVA: 03812960833
              <br />
              Email: info@dimensioneimmagineabbigliamento.it
            </p>
          </section>

          <section>
            <h2 className="text-xl font-serif text-white mb-4">
              2. Tipologie di Dati raccolti
            </h2>
            <p className="mb-2">
              Tra i Dati Personali raccolti da questa Applicazione, in modo
              autonomo o tramite terze parti, ci sono:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Cookie e Dati di utilizzo;</li>
              <li>Email, Nome e Cognome (tramite modulo di contatto);</li>
              <li>
                Numero di telefono (opzionale, tramite modulo di contatto).
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-serif text-white mb-4">
              3. Modalità e luogo del trattamento dei Dati raccolti
            </h2>
            <p className="mb-2">
              <strong>Modalità di trattamento</strong>
            </p>
            <p className="mb-4">
              Il Titolare adotta le opportune misure di sicurezza volte ad
              impedire l’accesso, la divulgazione, la modifica o la distruzione
              non autorizzate dei Dati Personali. Il trattamento viene
              effettuato mediante strumenti informatici e/o telematici, con
              modalità organizzative e con logiche strettamente correlate alle
              finalità indicate.
            </p>
            <p className="mb-2">
              <strong>Luogo</strong>
            </p>
            <p className="mb-4">
              I Dati sono trattati presso le sedi operative del Titolare ed in
              ogni altro luogo in cui le parti coinvolte nel trattamento siano
              localizzate.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-serif text-white mb-4">
              4. Finalità del Trattamento dei Dati raccolti
            </h2>
            <p>
              I Dati dell’Utente sono raccolti per consentire al Titolare di
              fornire il servizio, rispondere alle richieste di contatto,
              inviare comunicazioni promozionali (se acconsentito), analizzare
              statistiche di traffico e proteggere da spam e comportamenti
              illeciti.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-serif text-white mb-4">
              5. Diritti dell’Utente
            </h2>
            <p className="mb-2">
              Gli Utenti possono esercitare determinati diritti con riferimento
              ai Dati trattati dal Titolare. In particolare, l’Utente ha il
              diritto di:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Revocare il consenso in ogni momento;</li>
              <li>Opporsi al trattamento dei propri Dati;</li>
              <li>Accedere ai propri Dati;</li>
              <li>Verificare e chiedere la rettificazione;</li>
              <li>Ottenere la limitazione del trattamento;</li>
              <li>
                Ottenere la cancellazione o rimozione dei propri Dati Personali;
              </li>
              <li>
                Ricevere i propri Dati o farli trasferire ad altro titolare
                (portabilità).
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-serif text-white mb-4">
              6. Modifiche a questa privacy policy
            </h2>
            <p>
              Il Titolare del Trattamento si riserva il diritto di apportare
              modifiche a questa privacy policy in qualunque momento dandone
              informazione agli Utenti su questa pagina.
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
