# Dimensione Immagine - Website

Sito web per Dimensione Immagine realizzato con React + Vite e un design editoriale basato su Tailwind. Include pagine istituzionali, catalogo, contatti e sedi.

## Stack

- React + TypeScript
- Vite
- Tailwind CSS
- Framer Motion
- React Router
- react-helmet-async
- Sanity CMS

## Avvio locale

**Prerequisiti:** Node.js (LTS)

1. Installa le dipendenze:
   `npm install`
2. Avvia il progetto:
   `npm run dev`

## Script disponibili

- `npm run dev` - Avvio in sviluppo
- `npm run build` - Build di produzione
- `npm run preview` - Anteprima build
- `npm run studio` - Avvio Sanity Studio locale
- `npm run studio:deploy` - Deploy di Sanity Studio
- `npm run seed:cms` - Popola Sanity con i contenuti pubblici attuali

## Struttura progetto

- `pages/` - pagine principali
- `components/` - componenti UI e layout
- `public/` - asset statici
- `schema/` - schemi Sanity Studio
- `sanity/` - client, query, fallback e modelli CMS
- `scripts/` - script di seed/migrazione contenuti

## Note importanti

- Router: usa `BrowserRouter`. Se il sito e servito su hosting statico, assicurati di configurare il fallback a `index.html`.
- Form contatti: il form invia dati a `/api/contact`. Configura un endpoint serverless o un backend per la gestione delle richieste.

## Deploy

Esegui la build e pubblica la cartella `dist/` sul tuo hosting:

`npm run build`

## CMS pubblico con Sanity

Il sito pubblico ora legge i contenuti da Sanity Studio con fallback ai contenuti locali, quindi:

- il boss puo modificare testi, immagini, video hero, sedi, contatti, footer e catalogo da Sanity
- il sito continua a funzionare anche se i documenti non sono ancora stati pubblicati
- le pagine legali, auth, B2B e workflow serverless restano gestiti via codice

### Setup editor

1. Avvia lo studio locale:
   `npm run studio`
2. Oppure pubblica/aggiorna lo studio ospitato:
   `npm run studio:deploy`

### Seed iniziale contenuti

Per copiare in Sanity i contenuti pubblici attuali:

1. imposta `SANITY_AUTH_TOKEN`
2. opzionale: imposta `SANITY_PROJECT_ID` e `SANITY_DATASET` se non usi `zqo9eojr/production`
3. esegui:
   `npm run seed:cms`

Lo script carica gli asset locali/remoti e crea o aggiorna:

- `siteSettings`
- `homePage`
- `aboutPage`
- `locationsPage`
- `contactPage`
- `catalogPage`
- documenti `storeLocation`
- documenti `catalogItem`

## Licenza

Proprieta privata. Tutti i diritti riservati.

## Contact form backend

Il form contatti usa `POST /api/contact` (Vercel serverless), con:

- validazione server-side
- rate limit per IP + honeypot
- salvataggio su PostgreSQL (`DATABASE_URL`)
- notifica email opzionale al team via Resend (`RESEND_API_KEY`, `RESEND_CONTACT_TO_EMAIL` o `RESEND_TO_EMAIL`, `RESEND_FROM_EMAIL`)
- email di conferma opzionale al cliente (`RESEND_CONTACT_CONFIRMATION_FROM_EMAIL`, con fallback a `RESEND_APPLICANT_FROM_EMAIL` o `RESEND_FROM_EMAIL`)

Imposta anche `CONTACT_IP_SALT` in produzione per hashare gli IP nei log DB. Se vuoi controllare il destinatario delle risposte, usa `CONTACT_REPLY_TO_EMAIL` per il team e `RESEND_CONTACT_CONFIRMATION_REPLY_TO_EMAIL` per la conferma cliente.

## Newsletter popup backend

Il popup newsletter usa `POST /api/newsletter-subscribe` (Vercel serverless), con:

- inoltro al servizio newsletter esistente (`NEWSLETTER_SUBSCRIBE_ENDPOINT`, fallback al dominio newsletter attuale)
- email di conferma opzionale al cliente via Resend (`RESEND_NEWSLETTER_CONFIRMATION_FROM_EMAIL`, con fallback a `RESEND_APPLICANT_FROM_EMAIL` o `RESEND_FROM_EMAIL`)

Se vuoi controllare il reply-to della conferma newsletter, usa `RESEND_NEWSLETTER_CONFIRMATION_REPLY_TO_EMAIL`.

## Auth Distribuzione Ingrosso (B2B)

La pagina `/distribuzione-in-grosso` usa autenticazione reale lato server (PostgreSQL + cookie `HttpOnly`), separata dal resto del sito.

### Flusso utente

1. Registrazione con campi obbligatori:
- `name`
- `surname`
- `phone`
- `email`
2. Profilo in stato `pending_approval`.
3. Dopo approvazione, l'utente imposta la password tramite link/token di setup.
4. Solo dopo approvazione + password impostata, il login e l'accesso B2B sono consentiti.

### API principali

- `POST /api/wholesale-auth-register`
- `POST /api/wholesale-auth-status`
- `POST /api/wholesale-auth-request-password-setup`
- `POST /api/wholesale-auth-complete-password-setup`
- `POST /api/wholesale-auth-login`
- `GET /api/wholesale-auth-me`
- `POST /api/wholesale-auth-logout`
- `POST /api/wholesale-auth-approve` (admin, richiede `WHOLESALE_AUTH_ADMIN_TOKEN`)
- `GET /api/wholesale-auth-approve` (admin list, richiede `WHOLESALE_AUTH_ADMIN_TOKEN`)

### UI amministrazione richieste

- pagina: `/admin-wholesale`
- inserisci `WHOLESALE_AUTH_ADMIN_TOKEN` nel form della pagina
- azioni disponibili:
  - approva profilo
  - approva + invia link setup password
  - rimetti in attesa

### Variabili env aggiuntive

Vedi `.env.example`:

- `WHOLESALE_AUTH_COOKIE_NAME`
- `WHOLESALE_AUTH_SESSION_DAYS`
- `WHOLESALE_AUTH_SETUP_TOKEN_MINUTES`
- `WHOLESALE_AUTH_ADMIN_TOKEN`
- `RESEND_WHOLESALE_REVIEW_TO_EMAIL` (opzionale)

Nota: il setup password via email richiede `RESEND_API_KEY` e `RESEND_FROM_EMAIL`.

### Comandi con Bun

- install: `bun install`
- dev: `bun run dev`
- build: `bun run build`
