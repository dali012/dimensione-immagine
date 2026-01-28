import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PageTransition } from "../components/Layout/PageTransition";
import { SEO } from "@/components/SEO/SEO";
import { Reveal } from "@/components/UI/Reveal";
import {
  Building2,
  ShoppingBag,
  Send,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

// --- Types ---
interface FormData {
  // Common
  email: string;
  phone: string;
  productDetails: string;
  message: string;
  // B2B Specific
  companyName: string;
  vatId: string; // P.IVA
  sdiCode: string; // Codice Univoco
  contactPerson: string;
}

const PurchaseRequest: React.FC = () => {
  // always B2B flow
  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const navigate = useNavigate();
  const [privacyAccepted, setPrivacyAccepted] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    email: "",
    phone: "",
    productDetails: "",
    message: "",
    companyName: "",
    vatId: "",
    sdiCode: "",
    contactPerson: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic Validation
    if (!formData.email || !formData.productDetails || !privacyAccepted) {
      alert("Compila i campi obbligatori e accetta la privacy.");
      return;
    }

    // B2B validation
    if (!formData.companyName || !formData.vatId) {
      alert("Inserisci i dati aziendali obbligatori.");
      return;
    }

    setStatus("submitting");

    // Simulate API Call
    setTimeout(() => {
      setStatus("success");
      // short delay for UX then redirect to thank-you page
      setTimeout(() => navigate("/thank-you"), 800);
    }, 2000);
  };

  const inputContainerClass = "relative group";
  const labelClass =
    "block text-[10px] uppercase tracking-widest text-gray-500 mb-1.5 font-medium group-focus-within:text-[#b89b5e] transition-colors";
  const inputClass =
    "w-full bg-transparent border-b border-gray-300 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-[#b89b5e] transition-all placeholder:text-gray-300 rounded-none";

  return (
    <PageTransition>
      <div className="pt-24 min-h-screen bg-gray-50 font-sans">
        <SEO
          title="Distribuzione in grosso & Preventivi | Dimensione Immagine"
          description="Richiedi un preventivo per acquisti all'ingrosso (B2B) o ordina capi specifici (B2C)."
          url="https://www.dimensioneimmagineabbigliamento.it/distribuzione-in-grosso"
        />

        <section className="container mx-auto px-6 py-12 pb-24 max-w-4xl">
          <Reveal width="100%">
            <div className="text-center mb-12">
              <span className="text-[#b89b5e] font-bold tracking-[0.2em] text-xs uppercase mb-3 block">
                Shop & Ordini
              </span>
              <h1 className="text-3xl md:text-5xl font-serif text-gray-900 mb-6">
                Distribuzione in grosso
              </h1>
              <p className="text-gray-500 max-w-xl mx-auto font-light text-lg">
                Compila il modulo qui sotto per richiedere informazioni su
                disponibilità, prezzi per quantità o per ordinare un articolo
                specifico.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.1} className="mx-auto max-w-4xl">
            {/* Top action cards: Ecommerce link for clients + quick access to B2B form */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-6 flex items-start gap-4">
                <ShoppingBag size={28} className="text-[#b89b5e]" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Compra online
                  </h3>
                  <p className="text-sm text-gray-500 mb-3">
                    Vai al nostro e-commerce per acquistare capi singoli e
                    scoprire le collezioni.
                  </p>
                  <a
                    href="https://shop.dimensioneimmagineabbigliamento.it"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-block px-4 py-2 bg-[#b89b5e] text-white rounded font-medium text-sm"
                  >
                    Vai allo Shop
                  </a>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-6 flex items-start gap-4">
                <Building2 size={28} className="text-[#b89b5e]" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Distribuzione in grosso
                  </h3>
                  <p className="text-sm text-gray-500 mb-3">
                    Se sei un rivenditore o un'azienda, compila il modulo per
                    richiedere prezzi per quantità e condizioni B2B.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      const el = document.getElementById("purchase-form");
                      if (el)
                        el.scrollIntoView({
                          behavior: "smooth",
                          block: "start",
                        });
                    }}
                    className="inline-block px-4 py-2 bg-transparent border border-[#b89b5e] text-[#b89b5e] rounded font-medium text-sm cursor-pointer"
                  >
                    Compila il modulo
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
              {/* B2B only: simplified header */}
              <div className="flex border-b border-gray-100">
                <div className="flex-1 py-6 flex items-center justify-center gap-3 bg-white text-[#b89b5e]">
                  <Building2 size={20} className="stroke-[2.5px]" />
                  <span className="text-sm uppercase tracking-widest font-bold">
                    Azienda (B2B)
                  </span>
                </div>
              </div>

              {/* --- Form Body --- */}
              <div className="p-8 md:p-12">
                <form
                  id="purchase-form"
                  onSubmit={handleSubmit}
                  className="space-y-8"
                >
                  {/* Mode Header */}
                  <div className="flex items-center gap-2 mb-6 opacity-70">
                    <AlertCircle size={16} className="text-[#b89b5e]" />
                    <p className="text-xs text-gray-500 uppercase tracking-wide">
                      Stai compilando il modulo come:{" "}
                      <strong className="text-gray-900">
                        Business / Partita IVA
                      </strong>
                    </p>
                  </div>

                  {/* --- DYNAMIC FIELDS: B2C vs B2B --- */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fade-in">
                    <>
                      <div className={`${inputContainerClass} md:col-span-2`}>
                        <label htmlFor="companyName" className={labelClass}>
                          Ragione Sociale *
                        </label>
                        <input
                          required
                          type="text"
                          name="companyName"
                          value={formData.companyName}
                          onChange={handleChange}
                          className={inputClass}
                          placeholder="Nome Azienda SRL"
                        />
                      </div>
                      <div className={inputContainerClass}>
                        <label htmlFor="vatId" className={labelClass}>
                          Partita IVA *
                        </label>
                        <input
                          required
                          type="text"
                          name="vatId"
                          value={formData.vatId}
                          onChange={handleChange}
                          className={inputClass}
                          placeholder="IT00000000000"
                        />
                      </div>
                      <div className={inputContainerClass}>
                        <label htmlFor="sdiCode" className={labelClass}>
                          Codice SDI / PEC
                        </label>
                        <input
                          type="text"
                          name="sdiCode"
                          value={formData.sdiCode}
                          onChange={handleChange}
                          className={inputClass}
                          placeholder="XXXXXXX"
                        />
                      </div>
                      <div className={`${inputContainerClass} md:col-span-2`}>
                        <label htmlFor="contactPerson" className={labelClass}>
                          Persona di Riferimento
                        </label>
                        <input
                          type="text"
                          name="contactPerson"
                          value={formData.contactPerson}
                          onChange={handleChange}
                          className={inputClass}
                          placeholder="Responsabile Acquisti"
                        />
                      </div>
                    </>
                  </div>

                  {/* Product details (required) */}
                  <div className="mt-4">
                    <label htmlFor="productDetails" className={labelClass}>
                      Dettagli prodotto / Quantità richieste *
                    </label>
                    <textarea
                      id="productDetails"
                      name="productDetails"
                      value={formData.productDetails}
                      onChange={handleChange}
                      required
                      className="w-full h-32 p-3 border border-gray-200 rounded resize-none text-sm text-gray-900 focus:outline-none focus:border-[#b89b5e]"
                      placeholder="Dettaglia articoli, taglie, colori, quantità desiderata..."
                    />
                  </div>

                  {/* --- COMMON FIELDS --- */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-gray-100 pt-8">
                    <div className={inputContainerClass}>
                      <label htmlFor="email" className={labelClass}>
                        Email *
                      </label>
                      <input
                        required
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={inputClass}
                        placeholder="email@esempio.com"
                      />
                    </div>
                    <div className={inputContainerClass}>
                      <label htmlFor="phone" className={labelClass}>
                        Telefono / Cellulare
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className={inputClass}
                        placeholder="+39..."
                      />
                    </div>
                  </div>

                  {/* --- FOOTER --- */}
                  <div className="pt-6">
                    <div className="flex items-start mb-6">
                      <input
                        id="privacy"
                        type="checkbox"
                        checked={privacyAccepted}
                        onChange={(e) => setPrivacyAccepted(e.target.checked)}
                        className="mt-1 h-4 w-4 text-[#b89b5e] focus:ring-[#b89b5e] border-gray-300 rounded cursor-pointer"
                      />
                      <label
                        htmlFor="privacy"
                        className="ml-3 text-xs text-gray-500 leading-relaxed"
                      >
                        Acconsento al trattamento dei dati personali secondo la
                        <a
                          href="/privacy-policy"
                          target="_blank"
                          rel="noreferrer"
                          className="text-[#b89b5e] underline mx-1"
                        >
                          Privacy Policy
                        </a>
                        e ai sensi del GDPR. *
                      </label>
                    </div>

                    {status === "success" ? (
                      <div className="w-full py-4 bg-green-50 border border-green-200 rounded-lg flex items-center justify-center gap-3 text-green-800 animate-fade-in">
                        <CheckCircle2 size={24} />
                        <span className="font-medium">
                          Richiesta inviata con successo! Ti risponderemo a
                          breve.
                        </span>
                      </div>
                    ) : (
                      <button
                        type="submit"
                        disabled={status === "submitting"}
                        className={`w-full py-4 md:py-5 text-white uppercase tracking-[0.2em] font-bold text-sm transition-all shadow-xl hover:shadow-2xl flex items-center justify-center gap-3 cursor-pointer ${
                          status === "submitting"
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-[#b89b5e] hover:bg-[#a38a53] transform hover:-translate-y-1"
                        }`}
                      >
                        {status === "submitting" ? (
                          "Elaborazione..."
                        ) : (
                          <>
                            <span>Invia Richiesta</span>
                            <Send size={16} />
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </div>
          </Reveal>
        </section>
      </div>
    </PageTransition>
  );
};

export default PurchaseRequest;
