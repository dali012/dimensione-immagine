import React, { useEffect, Suspense } from "react";
import {
  HashRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { HelmetProvider } from "react-helmet-async";
import { Toaster } from "sonner";
import { Navbar } from "./components/Layout/Navbar";
import { Footer } from "./components/Layout/Footer";
import { BackToTop } from "./components/UI/BackToTop";
import { PageTransition } from "./components/Layout/PageTransition";
import { SEO } from "./components/SEO/SEO";

// Lazy load pages
const Home = React.lazy(() =>
  import("./pages/Home").then((module) => ({ default: module.Home })),
);
const About = React.lazy(() =>
  import("./pages/About").then((module) => ({ default: module.About })),
);
const Locations = React.lazy(() =>
  import("./pages/Locations").then((module) => ({ default: module.Locations })),
);
const Contact = React.lazy(() =>
  import("./pages/Contact").then((module) => ({ default: module.Contact })),
);
const PrivacyPolicy = React.lazy(() =>
  import("./pages/PrivacyPolicy").then((module) => ({
    default: module.PrivacyPolicy,
  })),
);
const CookiePolicy = React.lazy(() =>
  import("./pages/CookiePolicy").then((module) => ({
    default: module.CookiePolicy,
  })),
);
const TermsAndConditions = React.lazy(() =>
  import("./pages/TermsAndConditions").then((module) => ({
    default: module.TermsAndConditions,
  })),
);
const Catalog = React.lazy(() =>
  import("./pages/Catalog").then((module) => ({ default: module.Catalog })),
);
const Blog = React.lazy(() =>
  import("./pages/Blog").then((module) => ({ default: module.Blog })),
);
const BlogPost = React.lazy(() =>
  import("./pages/BlogPost").then((module) => ({ default: module.BlogPost })),
);
const NotFound = React.lazy(() =>
  import("./pages/NotFound").then((module) => ({ default: module.NotFound })),
);

const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-brand-bg">
    <img
      src="/images/loading-elephant.png"
      alt="Caricamento..."
      className="w-32 animate-pulse"
    />
  </div>
);

// ScrollToTop component to reset scroll on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <div key={location.pathname} className="w-full h-full">
        <Suspense fallback={<LoadingFallback />}>
          <Routes location={location}>
            <Route
              path="/"
              element={
                <PageTransition>
                  <Home />
                </PageTransition>
              }
            />
            <Route
              path="/chi-siamo"
              element={
                <PageTransition>
                  <About />
                </PageTransition>
              }
            />
            <Route
              path="/sedi"
              element={
                <PageTransition>
                  <Locations />
                </PageTransition>
              }
            />
            <Route
              path="/trovi-da-noi"
              element={
                <PageTransition>
                  <Catalog />
                </PageTransition>
              }
            />
            <Route
              path="/blog"
              element={
                <PageTransition>
                  <Blog />
                </PageTransition>
              }
            />
            <Route
              path="/blog/:slug"
              element={
                <PageTransition>
                  <BlogPost />
                </PageTransition>
              }
            />
            <Route
              path="/contatti"
              element={
                <PageTransition>
                  <Contact />
                </PageTransition>
              }
            />
            <Route
              path="/privacy-policy"
              element={
                <PageTransition>
                  <PrivacyPolicy />
                </PageTransition>
              }
            />
            <Route
              path="/cookie-policy"
              element={
                <PageTransition>
                  <CookiePolicy />
                </PageTransition>
              }
            />
            <Route
              path="/termini-condizioni"
              element={
                <PageTransition>
                  <TermsAndConditions />
                </PageTransition>
              }
            />
            <Route
              path="*"
              element={
                <PageTransition>
                  <NotFound />
                </PageTransition>
              }
            />
          </Routes>
        </Suspense>
      </div>
    </AnimatePresence>
  );
};

const App: React.FC = () => {
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": "https://www.dimensioneimmagineabbigliamento.it/#localbusiness",
    name: "Dimensione Immagine",
    url: "https://www.dimensioneimmagineabbigliamento.it",
    telephone: "+39 090 240 0474",
    priceRange: "€€",
    image: "https://www.dimensioneimmagineabbigliamento.it/og-image.jpg",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Via Maddalena 38/D",
      addressLocality: "Messina",
      addressRegion: "ME",
      postalCode: "98122",
      addressCountry: "IT",
    },
    areaServed: "Messina e provincia",
    sameAs: [
      "https://www.facebook.com/dimensioneimmaginepubblicita/",
      "https://www.instagram.com/dimensioneimmaginemessina/",
    ],
    department: [
      {
        "@type": "Store",
        name: "Kruder by Dimensione Immagine",
        address: {
          "@type": "PostalAddress",
          streetAddress: "Via Maddalena 38/D",
          addressLocality: "Messina",
          addressRegion: "ME",
          addressCountry: "IT",
        },
      },
      {
        "@type": "Store",
        name: "Dimensione Immagine – Torre Faro",
        address: {
          "@type": "PostalAddress",
          streetAddress: "Via Circuito, 177",
          addressLocality: "Messina",
          addressRegion: "ME",
          addressCountry: "IT",
        },
      },
      {
        "@type": "Store",
        name: "Dimensione Immagine – Tremestieri",
        address: {
          "@type": "PostalAddress",
          streetAddress: "SS 114 Km 6",
          addressLocality: "Messina",
          addressRegion: "ME",
          addressCountry: "IT",
        },
      },
    ],
  };

  return (
    <HelmetProvider>
      <Router>
        <SEO
          title="Dimensione Immagine | Stampa e Grafica a Messina"
          description="Agenzia di stampa e grafica a Messina specializzata in stampa digitale, grande formato e allestimenti professionali."
          type="business.business"
          image="/og-image.jpg"
          structuredData={localBusinessSchema}
        />
        <ScrollToTop />
        <Toaster closeButton position="bottom-left" />
        <div className="flex flex-col min-h-screen bg-brand-bg text-brand-text-primary selection:bg-brand-accent selection:text-white">
          <Navbar />
          <main className="grow">
            <AnimatedRoutes />
          </main>
          <Footer />
          <BackToTop />
        </div>
      </Router>
    </HelmetProvider>
  );
};

export default App;
