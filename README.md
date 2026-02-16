# Dimensione Immagine — Website

Sito web per Dimensione Immagine realizzato con React + Vite e un design editoriale basato su Tailwind. Include pagine istituzionali, catalogo, blog, contatti e sedi.

## Stack

- React + TypeScript
- Vite
- Tailwind CSS
- Framer Motion
- React Router
- react-helmet-async

## Avvio locale

**Prerequisiti:** Node.js (LTS)

1. Installa le dipendenze:
   `npm install`
2. Avvia il progetto:
   `npm run dev`

## Script disponibili

- `npm run dev` — Avvio in sviluppo
- `npm run build` — Build di produzione
- `npm run preview` — Anteprima build

## Struttura progetto

- pages/ — pagine principali
- components/ — componenti UI e layout
- data/ — contenuti e dati mock
- public/ — asset statici

## Note importanti

- Router: usa BrowserRouter. Se il sito è servito su hosting statico, assicurati di configurare il fallback a `index.html`.
- Form contatti: il form invia dati a `/api/contact`. Configura un endpoint serverless o un backend per la gestione delle richieste.

## Deploy

Esegui la build e pubblica la cartella `dist/` sul tuo hosting:

`npm run build`

## Licenza

Proprietà privata. Tutti i diritti riservati.

## Contact form backend

Il form contatti usa `POST /api/contact` (Vercel serverless), con:
- validazione server-side
- rate limit per IP + honeypot
- salvataggio su PostgreSQL (`DATABASE_URL`)
- notifica email opzionale via Resend (`RESEND_API_KEY`, `RESEND_TO_EMAIL`, `RESEND_FROM_EMAIL`)

Imposta anche `CONTACT_IP_SALT` in produzione per hashare gli IP nei log DB.

## Auth Distribuzione Ingrosso (B2B)

La pagina `/distribuzione-in-grosso` usa ora autenticazione reale lato server (PostgreSQL + cookie `HttpOnly`), separata dal resto del sito.

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
