export const siteSettingsFallback = {
  siteName: "Dimensione Immagine",
  siteUrl: "https://www.dimensioneimmagineabbigliamento.it",
  logo: {
    src: "/images/logo-elephant-golden-2025.png",
    alt: "Logo Dimensione Immagine",
  },
  navigationItems: [
    { route: "/", label: "Home", visible: true },
    { route: "/chi-siamo", label: "Chi Siamo", visible: true },
    { route: "/trovi-da-noi", label: "Cosa Trovi da Noi", visible: true },
    { route: "/sedi", label: "Negozi & Sedi", visible: true },
    { route: "/lavora-con-noi", label: "Lavora con Noi", visible: true },
    {
      route: "/distribuzione-in-grosso",
      label: "Distribuzione Ingrosso",
      visible: true,
    },
    { route: "/contatti", label: "Contatti", visible: true },
  ],
  primaryPhone: "+39 090 240 0474",
  primaryWhatsapp: "390902400474",
  primaryEmail: "contact@dimensioneimmagineabbigliamento.it",
  primaryMapUrl: "https://maps.app.goo.gl/rr5evPBvFgyBMhd68",
  primaryAddressLine1: "Via Maddalena 38/D",
  primaryPostalCode: "98122",
  primaryCity: "Messina",
  primaryRegionCode: "ME",
  primaryCountryCode: "IT",
  officeHours: [
    { label: "Lun - Ven", value: "09:00 - 18:00" },
    { label: "Sab", value: "09:00 - 12:00" },
  ],
  areaServed: "Messina e provincia",
  priceRange: "EUR EUR",
  socialLinks: [
    {
      platform: "facebook",
      label: "Facebook",
      url: "https://www.facebook.com/profile.php?id=61584264163679",
    },
    {
      platform: "instagram",
      label: "Instagram",
      url: "https://www.instagram.com/dimensione.immagine/",
    },
    {
      platform: "tiktok",
      label: "TikTok",
      url: "https://www.tiktok.com/@dimensioneimmagine",
    },
  ],
  legalCompanyName: "Dimensione Immagine Abbigliamento SRL.",
  vatNumber: "03812960833",
  codiceUnivoco: "WY7PJ6K",
  footerNewsletterTitle: "Rimani Ispirato. Rimani Elegante.",
  footerNewsletterDescription:
    "Iscriviti alla nostra lista per aggiornamenti esclusivi, nuove collezioni e consigli di stile.",
  footerNewsletterDisclaimer:
    "Inserendo la tua email acconsenti a ricevere comunicazioni e materiale marketing da Dimensione Immagine.",
  defaultSeo: {
    title: "Dimensione Immagine | Moda Inclusiva e Accessibile",
    description:
      "Scopri la nostra moda accessibile e inclusiva. Collezioni Uomo, Donna e Taglie Forti che valorizzano ogni fisicita e personalita.",
    image: {
      src: "/og-image.jpg",
      alt: "Dimensione Immagine",
    },
  },
};

export const homePageFallback = {
  seo: {
    title: "Dimensione Immagine | Moda Inclusiva e Accessibile",
    description:
      "Scopri la nostra moda accessibile e inclusiva. Collezioni Uomo, Donna e Taglie Forti che valorizzano ogni fisicita e personalita.",
    image: {
      src: "/og-image.jpg",
      alt: "Homepage Dimensione Immagine",
    },
  },
  heroTitle: "Lo stile che ami,",
  heroAccent: "al prezzo che sogni",
  heroDescription:
    "La nostra mission e offrire una moda accessibile, inclusiva e in grado di valorizzare ogni fisicita, ogni storia e ogni momento della vita.",
  heroCta: {
    label: "Scopri di piu",
    href: "/chi-siamo",
  },
  heroSlides: [
    {
      id: "women-hero-video",
      mediaType: "video",
      video: {
        src: "/images/video/women-hero-video-dimensione-immagine-1280.mp4",
        poster: {
          src: "/images/video/women-hero-video-poster.jpg",
          alt: "Hero donna Dimensione Immagine",
        },
        mobilePoster: {
          src: "/images/video/women-hero-video-poster-640.jpg",
          alt: "Hero donna Dimensione Immagine mobile",
        },
      },
    },
    {
      id: "men-hero-video",
      mediaType: "video",
      video: {
        src: "/images/video/men-hero-video-dimensione-immagine-1280.mp4",
        poster: {
          src: "/images/video/men-hero-video-poster.jpg",
          alt: "Hero uomo Dimensione Immagine",
        },
        mobilePoster: {
          src: "/images/video/men-hero-video-poster-640.jpg",
          alt: "Hero uomo Dimensione Immagine mobile",
        },
      },
    },
  ],
  stats: [
    { value: "40+", label: "Anni di Storia" },
    { value: "100%", label: "Moda" },
    { value: "Unique", label: "Stile Personale" },
  ],
  styleSectionLabel: "Linee di Stile",
  styleSectionTitle: "Tre linee, una visione piu editoriale dello stile.",
  styleSectionDescription:
    "Uomo, Donna e Teen Donna convivono in una proposta piu raffinata, pensata per chi cerca un'immagine curata, attuale e mai forzata: non troppo casual, non troppo formale, sempre distintiva.",
  styleTags: ["Everyday Chic", "Occasioni Smart", "Stile Trasversale"],
  spotlightCards: [
    {
      eyebrow: "Linea 01",
      title: "Uomo",
      description:
        "Volumi misurati, toni neutri e una presenza discreta che richiama il gusto sartoriale in chiave contemporanea.",
      mood: "Sartoriale, netto, contemporaneo",
      image: {
        src: "/images/men3.jpg",
        alt: "Linea uomo Dimensione Immagine",
      },
      cta: {
        label: "Scoprila in negozio",
        href: "/sedi",
      },
    },
    {
      eyebrow: "Linea 02",
      title: "Donna",
      description:
        "Linee fluide, texture luminose e un'eleganza morbida che accompagna il quotidiano con naturale raffinatezza.",
      mood: "Luminosa, fluida, ricercata",
      image: {
        src: "/images/women3.jpg",
        alt: "Linea donna Dimensione Immagine",
      },
      cta: {
        label: "Scoprila in negozio",
        href: "/sedi",
      },
    },
    {
      eyebrow: "Linea 03",
      title: "Teen Donna",
      description:
        "Una proposta giovane ma curata, con energia pulita, denim essenziale e dettagli moderni mai eccessivi.",
      mood: "Giovane, pulita, sofisticata",
      image: {
        src: "/images/women6.jpg",
        alt: "Linea teen donna Dimensione Immagine",
      },
      cta: {
        label: "Scoprila in negozio",
        href: "/sedi",
      },
    },
  ],
  bottomBannerDescription:
    "Nei nostri store trovi capi e combinazioni pensati per accompagnare il ritmo reale della giornata: lavoro, tempo libero, appuntamenti e occasioni speciali con la stessa coerenza di stile.",
  bottomCta: {
    label: "Vedi i negozi",
    href: "/sedi",
  },
};

export const aboutPageFallback = {
  seo: {
    title: "Chi Siamo | Dimensione Immagine",
    description:
      "Dal 1984 a Messina, interpreti della moda come gesto di accoglienza. Scopri la nostra storia.",
    image: {
      src: "/og-image.jpg",
      alt: "Chi siamo Dimensione Immagine",
    },
  },
  introEyebrow: "Dal 1984",
  introTitle: "Chi Siamo",
  introText:
    "Un racconto di stile, autenticita e visione curato da un team professionale e altamente specializzato.\n\nDal 1984 Dimensione Immagine interpreta la moda come un gesto di accoglienza e identita. Nata in Sicilia, la nostra storia affonda le radici nella cura del dettaglio, nel rispetto delle persone e nella volonta di creare un'esperienza che unisce stile e umanita.\n\nNel corso dei decenni, quel primo negozio e diventato un riferimento per il mondo Donna e Uomo, grazie a collezioni contemporanee, versatili e attentamente selezionate. La nostra crescita e stata guidata da una visione chiara: ampliare la nostra presenza senza smarrire l'essenza che ci ha resi riconoscibili, la capacita di far sentire ogni cliente unico, compreso e valorizzato.\n\nOggi Dimensione Immagine e una rete di store diretti e affiliati che combina tradizione, modernita e cultura dell'accoglienza. Un brand che evolve restando fedele alla propria anima.",
  missionEyebrow: "Valori in Azione",
  missionTitle: "La Nostra Mission",
  missionText:
    "Moda che parla alle persone, non alle taglie.\n\nLa nostra mission e offrire una moda accessibile, inclusiva e in grado di valorizzare ogni fisicita, ogni storia, ogni momento della vita.\n\nDa oltre quarant'anni selezioniamo capi che uniscono qualita, estetica e convenienza, trasformando l'atto di vestirsi in un linguaggio personale, libero e sofisticato.\n\nCrediamo in una moda che vive nella quotidianita: contemporanea, confortevole, profondamente autentica.\n\nPer questo sviluppiamo collezioni Uomo, Donna e Taglie Forti che non vestono soltanto il corpo, ma interpretano la personalita di chi le sceglie.",
  stats: [
    { value: "650.000+", label: "Capi Disponibili" },
    { value: "10", label: "Punti Vendita" },
    { value: "30.000+", label: "Clienti fidelizzati" },
  ],
  valuesTitle: "I Nostri Valori",
  valuesSubtitle: "I principi che definiscono la nostra identita.",
  values: [
    {
      title: "Famiglia & Accoglienza",
      description:
        "Il nostro DNA e familiare: accogliere con calore, ascoltare con attenzione, rispettare con autenticita. Prestiamo la massima attenzione all'esposizione del prodotto, alla suddivisione dei colori, per creare outfit versatili e facilmente comprensibili.",
    },
    {
      title: "Valore aggiunto",
      description:
        "Curiamo al massimo il prezzo di vendita, offriamo tutto l'anno promozioni e iniziative per rendere la moda accessibile a tutti.",
    },
    {
      title: "Stile & Tendenza",
      description:
        "Collezioni dinamiche, ricercate e sempre aggiornate, create per accompagnare ogni stagione e stato d'animo.",
    },
    {
      title: "Qualita & Selezione Curata",
      description:
        "Ogni capo e scelto con attenzione ai materiali, alle finiture e al comfort, affinche duri e si indossi con piacere.",
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
  ],
};

export const locationsPageFallback = {
  seo: {
    title: "Le nostre Sedi | Dimensione Immagine",
    description:
      "Esplora la rete Dimensione Immagine su una mappa interattiva e apri ogni punto vendita direttamente in Google Maps.",
    image: {
      src: "/og-image.jpg",
      alt: "Negozi e sedi Dimensione Immagine",
    },
  },
  heroLabel: "Dove trovarci",
  heroTitle: "Negozi & Sedi",
  heroSubtitle:
    "Una mappa interattiva per esplorare tutta la rete Dimensione Immagine e raggiungere ogni negozio in un click.",
  mapEyebrow: "Mappa Italia",
  mapTitle: "Esplora le sedi sull'Italia",
  mapDescription:
    "Passa su un pin o su una card per mettere a fuoco il negozio. Quando clicchi, si apre direttamente la scheda su Google Maps.",
  listEyebrow: "Lista negozi",
  listTitle: "Tutte le sedi cliccabili",
  listDescription:
    "Ogni card apre la relativa scheda su Google Maps. Passandoci sopra aggiorni anche il focus della mappa.",
};

export const contactPageFallback = {
  seo: {
    title: "Contatti Dimensione Immagine",
    description:
      "Contattaci per informazioni sulle nostre boutique a Messina.",
    image: {
      src: "/og-image.jpg",
      alt: "Contatti Dimensione Immagine",
    },
  },
  heroTitle: "Vieni a trovarci in",
  heroAccent: "Negozio",
  heroSubtitle:
    "Il nostro team e a tua disposizione per ogni richiesta.",
  heroImage: {
    src: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=1974&auto=format&fit=crop",
    alt: "Boutique Dimensione Immagine",
  },
  heroCtaLabel: "Ottieni Indicazioni",
  formLabel: "Assistenza Clienti",
  formTitle: "Come possiamo aiutarti?",
  formDescription: "",
  locationBlockTitle: "Sede",
  locationLinkLabel: "Vedi su mappa",
  phoneBlockTitle: "Telefono",
  phoneLinkLabel: "Chatta su WhatsApp",
  emailBlockTitle: "Email",
  hoursBlockTitle: "Orari",
};

export const catalogPageFallback = {
  seo: {
    title: "Trovi da Noi | Dimensione Immagine",
    description:
      "Esplora le nostre collezioni Uomo, Donna e Accessori. Il meglio della moda a Messina.",
    image: {
      src: "/og-image.jpg",
      alt: "Trovi da noi Dimensione Immagine",
    },
  },
  headerLabel: "La Nostra Selezione",
  headerTitle: "Trovi da Noi",
  headerSubtitle:
    "Esplora le collezioni Uomo, Donna e Accessori. Filtra per categoria e salva i preferiti.",
  searchPlaceholder: "Cerca nella collezione...",
  emptyStateText:
    "Nessun elemento trovato in questa categoria al momento.",
  filterDescriptions: [
    {
      category: "Donna",
      items: [
        "Mode eleganti",
        "Casual e cerimonia",
        "Maglieria",
        "Denim",
        "Cappotti",
        "Linea Donna Calibrata (taglie forti)",
      ],
    },
    {
      category: "Uomo",
      items: [
        "Stile casual",
        "Urban e classico",
        "Camiceria",
        "Pantaloni",
        "Denim",
        "Linea Uomo Calibrata (taglie forti)",
        "Capispalla",
        "Parka",
        "Piumini",
      ],
    },
    {
      category: "Accessori",
      items: [
        "Borse",
        "Cinture",
        "Portafogli",
        "Sciarpe",
        "Cappelli",
        "Accessori Moda",
      ],
    },
  ],
};

export const storeLocationsFallback = [
  {
    id: "kreazioni-uomo",
    name: "Kreazioni Uomo",
    ownershipType: "franchise",
    region: "Campania",
    city: "Area Vesuviana",
    mapUrl: "https://maps.app.goo.gl/SgrSD6mEyAUuzmhz8",
    address: "Indirizzo disponibile su Google Maps",
    image: { src: "/images/victor-benjamin.jpeg", alt: "Kreazioni Uomo" },
    hours: [{ label: "Orari", value: "Consulta gli orari direttamente su Google Maps" }],
    latitude: 40.949674,
    longitude: 14.4859061,
    markerOffsetX: -8,
    markerOffsetY: -8,
    active: true,
    displayOrder: 1,
  },
  {
    id: "vittoria-company",
    name: "Vittoria Company",
    ownershipType: "franchise",
    region: "Puglia",
    city: "Lecce",
    mapUrl: "https://maps.app.goo.gl/kpAaPAKXJ3YAGzSU7",
    address: "De Donno Essence",
    image: { src: "/images/vittoria-company.jpeg", alt: "Vittoria Company" },
    hours: [{ label: "Orari", value: "Consulta gli orari direttamente su Google Maps" }],
    latitude: 40.3538269,
    longitude: 18.1812054,
    markerOffsetX: 10,
    markerOffsetY: -10,
    active: true,
    displayOrder: 2,
  },
  {
    id: "le-porte-del-savuto",
    name: "Le Porte Del Savuto",
    ownershipType: "franchise",
    region: "Calabria",
    city: "Vallegianno",
    mapUrl: "https://maps.app.goo.gl/7vLK9Mf9nwBFTmyL7",
    address: "Via Antonio Guarasci, 87056 Vallegianno CS",
    image: { src: "/images/calabria.jpeg", alt: "Le Porte Del Savuto" },
    hours: [{ label: "Orari", value: "Consulta gli orari direttamente su Google Maps" }],
    latitude: 39.1992582,
    longitude: 16.3065286,
    markerOffsetX: -16,
    markerOffsetY: 10,
    active: true,
    displayOrder: 3,
  },
  {
    id: "montesilvano",
    name: "Dimensione Immagine Montesilvano",
    ownershipType: "direct",
    region: "Abruzzo",
    city: "Montesilvano",
    mapUrl: "https://maps.app.goo.gl/ok2jt8DpLFYcjMFz5",
    address: "SS16, 610, Montesilvano, Abruzzo",
    image: { src: "/images/montesilvano.jpeg", alt: "Dimensione Immagine Montesilvano" },
    phone: "0852034097",
    hours: [
      { label: "Lun-Sab", value: "9:00-20:00" },
      { label: "Dom", value: "9:00-13:00 / 16:00-20:00" },
    ],
    latitude: 42.496547,
    longitude: 14.1739818,
    markerOffsetX: -6,
    markerOffsetY: -14,
    active: true,
    displayOrder: 4,
  },
  {
    id: "donna-messina",
    name: "Dimensione Immagine Donna",
    ownershipType: "direct",
    region: "Sicilia",
    city: "Messina",
    mapUrl: "https://maps.app.goo.gl/53LA8JTywzaJV5RGA",
    address: "Via Maddalena, 74, 98123 Messina ME",
    image: { src: "/images/boutique-donna.jpeg", alt: "Dimensione Immagine Donna" },
    phone: "0902131218",
    hours: [{ label: "Lun-Dom", value: "9:00-13:00 / 16:00-20:00" }],
    latitude: 38.1848977,
    longitude: 15.5541789,
    markerOffsetX: -22,
    markerOffsetY: 16,
    active: true,
    displayOrder: 5,
  },
  {
    id: "torre-faro",
    name: "Dimensione Immagine Torre Faro",
    ownershipType: "direct",
    region: "Sicilia",
    city: "Torre Faro",
    mapUrl: "https://maps.app.goo.gl/R2nNhbPdUjb9dMbQ6",
    address: "Via Circuito, 177, 98164 Torre Faro ME",
    image: { src: "/images/torre-faro.jpeg", alt: "Dimensione Immagine Torre Faro" },
    phone: "090326785",
    hours: [
      { label: "Lun-Sab", value: "9:00-20:00" },
      { label: "Dom", value: "9:00-13:00 / 16:00-20:00" },
    ],
    latitude: 38.2644723,
    longitude: 15.6372869,
    markerOffsetX: 16,
    markerOffsetY: -18,
    active: true,
    displayOrder: 6,
  },
  {
    id: "uomo-messina",
    name: "Dimensione Immagine Uomo",
    ownershipType: "direct",
    region: "Sicilia",
    city: "Messina",
    mapUrl: "https://maps.app.goo.gl/2WrCVJGFWRrpueMf9",
    address: "Via Maddalena & Via Giordano Bruno, 98123 Messina ME",
    image: { src: "/images/boutique-uomo.jpeg", alt: "Dimensione Immagine Uomo" },
    phone: "0909074525",
    hours: [
      { label: "Lun-Sab", value: "9:00-20:00" },
      { label: "Dom", value: "9:00-13:00 / 16:00-20:00" },
    ],
    latitude: 38.1841094,
    longitude: 15.5553877,
    markerOffsetX: 20,
    markerOffsetY: 14,
    active: true,
    displayOrder: 7,
  },
  {
    id: "tremestieri",
    name: "Dimensione Immagine Tremestieri",
    ownershipType: "direct",
    region: "Sicilia",
    city: "Messina",
    mapUrl: "https://maps.app.goo.gl/RnTKwHm7rg97mDng8",
    address: "Centro Commerciale Tremestieri",
    image: { src: "/images/tremestieri.jpeg", alt: "Dimensione Immagine Tremestieri" },
    phone: "0902406782",
    hours: [
      { label: "Lun-Sab", value: "9:00-20:30" },
      { label: "Dom e festivi", value: "9:30-20:30" },
    ],
    latitude: 38.1368911,
    longitude: 15.5218852,
    markerOffsetX: -10,
    markerOffsetY: 28,
    active: true,
    displayOrder: 8,
  },
];

export const catalogItemsFallback = [
  {
    id: "catalog-accessori-1",
    category: "Accessori",
    title: "Borsa in pelle lavorata",
    image: {
      src: "https://images.unsplash.com/photo-1559563458-527698bf5295?q=80&w=800&auto=format&fit=crop",
      alt: "Borsa in pelle lavorata",
    },
    active: true,
    displayOrder: 1,
  },
  {
    id: "catalog-uomo-1",
    category: "Uomo",
    title: "Abito Uomo Sartoriale",
    image: {
      src: "/images/men1.jpg",
      alt: "Abito Uomo Sartoriale",
    },
    active: true,
    displayOrder: 2,
  },
  {
    id: "catalog-accessori-2",
    category: "Accessori",
    title: "Gioielli minimal",
    image: {
      src: "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?q=80&w=800&auto=format&fit=crop",
      alt: "Gioielli minimal",
    },
    active: true,
    displayOrder: 3,
  },
  {
    id: "catalog-uomo-2",
    category: "Uomo",
    title: "Casual Uomo",
    image: {
      src: "/images/men2.jpg",
      alt: "Casual Uomo",
    },
    active: true,
    displayOrder: 4,
  },
  {
    id: "catalog-uomo-3",
    category: "Uomo",
    title: "Ritratto Uomo Elegante",
    image: {
      src: "/images/men3.jpg",
      alt: "Ritratto Uomo Elegante",
    },
    active: true,
    displayOrder: 5,
  },
  {
    id: "catalog-accessori-3",
    category: "Accessori",
    title: "Borsa a mano",
    image: {
      src: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=800&auto=format&fit=crop",
      alt: "Borsa a mano",
    },
    active: true,
    displayOrder: 6,
  },
  {
    id: "catalog-uomo-4",
    category: "Uomo",
    title: "Look Urbano Uomo",
    image: {
      src: "/images/men4.jpg",
      alt: "Look Urbano Uomo",
    },
    active: true,
    displayOrder: 7,
  },
  {
    id: "catalog-uomo-5",
    category: "Uomo",
    title: "Look Urbano Uomo 2",
    image: {
      src: "/images/men5.jpg",
      alt: "Look Urbano Uomo",
    },
    active: true,
    displayOrder: 8,
  },
  {
    id: "catalog-uomo-6",
    category: "Uomo",
    title: "Look Urbano Uomo 3",
    image: {
      src: "/images/men6.jpg",
      alt: "Look Urbano Uomo",
    },
    active: true,
    displayOrder: 9,
  },
];

