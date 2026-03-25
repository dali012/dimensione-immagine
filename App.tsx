import React, { useEffect, Suspense } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { Toaster } from "sonner";
import { Navbar } from "./components/Layout/Navbar";
import { PageTransition } from "./components/Layout/PageTransition";
import { SEO } from "./components/SEO/SEO";
import { RequireAuth } from "./contexts/AuthContext";
import { NewsletterPopup } from "./components/UI/NewsletterPopup";

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
const Promotions = React.lazy(() =>
  import("./pages/Promotions").then((module) => ({
    default: module.Promotions,
  })),
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
const ThankYou = React.lazy(() =>
  import("./pages/ThankYou").then((module) => ({ default: module.ThankYou })),
);
const NotFound = React.lazy(() =>
  import("./pages/NotFound").then((module) => ({ default: module.NotFound })),
);
const LavoraConNoi = React.lazy(() =>
  import("./pages/LavoraConNoi").then((module) => ({
    default: module.default,
  })),
);
const HrCvLink = React.lazy(() =>
  import("./pages/HrCvLink").then((module) => ({
    default: module.HrCvLink,
  })),
);
const PurchaseRequest = React.lazy(() =>
  import("./pages/PurchaseRequest").then((module) => ({
    default: module.default,
  })),
);
const Login = React.lazy(() =>
  import("./pages/Login").then((module) => ({ default: module.Login })),
);
const Register = React.lazy(() =>
  import("./pages/Register").then((module) => ({ default: module.Register })),
);
const WholesaleAdmin = React.lazy(() =>
  import("./pages/WholesaleAdmin").then((module) => ({
    default: module.WholesaleAdmin,
  })),
);
const PromotionsAdmin = React.lazy(() =>
  import("./pages/PromotionsAdmin").then((module) => ({
    default: module.PromotionsAdmin,
  })),
);
const Footer = React.lazy(() =>
  import("./components/Layout/Footer").then((module) => ({
    default: module.Footer,
  })),
);
const BackToTop = React.lazy(() =>
  import("./components/UI/BackToTop").then((module) => ({
    default: module.BackToTop,
  })),
);

const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-brand-bg">
    <picture>
      <source
        type="image/webp"
        srcSet="/images/loading-elephant-128.webp 1x, /images/loading-elephant-256.webp 2x"
        sizes="128px"
      />
      <img
        src="/images/loading-elephant-128.png"
        srcSet="/images/loading-elephant-128.png 1x, /images/loading-elephant-256.png 2x"
        sizes="128px"
        alt="Caricamento..."
        className="w-32 animate-pulse"
        width="128"
        height="129"
      />
    </picture>
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
              path="/promozioni-offerte"
              element={
                <PageTransition>
                  <Promotions />
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
              path="/lavora-con-noi"
              element={
                <PageTransition>
                  <LavoraConNoi />
                </PageTransition>
              }
            />
            <Route
              path="/hr-cv-link"
              element={
                <PageTransition>
                  <HrCvLink />
                </PageTransition>
              }
            />
            <Route
              path="/distribuzione-in-grosso"
              element={
                <RequireAuth>
                  <PageTransition>
                    <PurchaseRequest />
                  </PageTransition>
                </RequireAuth>
              }
            />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/admin-wholesale"
              element={
                <PageTransition>
                  <WholesaleAdmin />
                </PageTransition>
              }
            />
            <Route
              path="/admin-promozioni"
              element={
                <RequireAuth>
                  <PageTransition>
                    <PromotionsAdmin />
                  </PageTransition>
                </RequireAuth>
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
            <Route
              path="/thank-you"
              element={
                <PageTransition>
                  <ThankYou />
                </PageTransition>
              }
            />
        </Routes>
      </Suspense>
    </div>
  );
};

// Render Navbar only on non-auth pages
const HIDDEN_NAVBAR_PATHS = new Set([
  "/login",
  "/register",
  "/admin-wholesale",
  "/admin-promozioni",
]);

const ConditionalNavbar: React.FC = () => {
  const location = useLocation();
  if (HIDDEN_NAVBAR_PATHS.has(location.pathname)) return null;
  return <Navbar />;
};

const App: React.FC = () => {
  // Use the exported `RequireAuth` from `AuthContext` (no local override)
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
          <ConditionalNavbar />
          <NewsletterPopup />
          <main className="grow">
            <AnimatedRoutes />
          </main>
          <Suspense fallback={null}>
            <Footer />
            <BackToTop />
          </Suspense>
        </div>
      </Router>
    </HelmetProvider>
  );
};

export default App;
