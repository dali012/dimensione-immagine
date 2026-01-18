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
