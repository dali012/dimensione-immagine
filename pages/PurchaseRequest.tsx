import React, { useState } from "react";
import { PageTransition } from "../components/Layout/PageTransition";
import { SEO } from "@/components/SEO/SEO";
import { Reveal } from "@/components/UI/Reveal";
import {
  Building2,
  User,
  ShoppingBag,
  Send,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

// --- Types ---
type RequestType = "b2c" | "b2b";

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
  // B2C Specific
  firstName: string;
  lastName: string;
}

const PurchaseRequest: React.FC = () => {
  const [requestType, setRequestType] = useState<RequestType>("b2b"); // Default to B2B or B2C
  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
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
    firstName: "",
    lastName: "",
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

    // Type specific validation
    if (requestType === "b2b" && (!formData.companyName || !formData.vatId)) {
      alert("Inserisci i dati aziendali obbligatori.");
      return;
    }
    if (requestType === "b2c" && (!formData.firstName || !formData.lastName)) {
      alert("Inserisci il tuo nome e cognome.");
      return;
    }

    setStatus("submitting");

    // Simulate API Call
    setTimeout(() => {
      setStatus("success");
      // Reset form logic here if needed
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
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
              {/* --- Toggle Switch --- */}
              <div className="flex border-b border-gray-100">
                <button
                  onClick={() => setRequestType("b2c")}
                  className={`flex-1 py-6 flex items-center justify-center gap-3 transition-all duration-300 ${
                    requestType === "b2c"
                      ? "bg-white text-[#b89b5e]"
                      : "bg-gray-50 text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <User
                    size={20}
                    className={requestType === "b2c" ? "stroke-[2.5px]" : ""}
                  />
                  <span
                    className={`text-sm uppercase tracking-widest font-bold ${requestType === "b2c" ? "" : "font-medium"}`}
                  >
                    Cliente Privato
                  </span>
                  {requestType === "b2c" && (
                    <div className="absolute top-0 left-0 w-1/2 h-1 bg-[#b89b5e]" />
                  )}
                </button>

                <button
                  onClick={() => setRequestType("b2b")}
                  className={`flex-1 py-6 flex items-center justify-center gap-3 transition-all duration-300 ${
                    requestType === "b2b"
                      ? "bg-white text-[#b89b5e]"
                      : "bg-gray-50 text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <Building2
                    size={20}
                    className={requestType === "b2b" ? "stroke-[2.5px]" : ""}
                  />
                  <span
                    className={`text-sm uppercase tracking-widest font-bold ${requestType === "b2b" ? "" : "font-medium"}`}
                  >
                    Azienda (B2B)
                  </span>
                  {requestType === "b2b" && (
                    <div className="absolute top-0 right-0 w-1/2 h-1 bg-[#b89b5e]" />
                  )}
                </button>
              </div>

              {/* --- Form Body --- */}
              <div className="p-8 md:p-12">
                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Mode Header */}
                  <div className="flex items-center gap-2 mb-6 opacity-70">
                    <AlertCircle size={16} className="text-[#b89b5e]" />
                    <p className="text-xs text-gray-500 uppercase tracking-wide">
                      Stai compilando il modulo come:{" "}
                      <strong className="text-gray-900">
                        {requestType === "b2b"
                          ? "Business / Partita IVA"
                          : "Cliente Privato"}
                      </strong>
                    </p>
                  </div>

                  {/* --- DYNAMIC FIELDS: B2C vs B2B --- */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fade-in">
                    {requestType === "b2c" ? (
                      <>
                        <div className={inputContainerClass}>
                          <label htmlFor="firstName" className={labelClass}>
                            Nome *
                          </label>
                          <input
                            required
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            className={inputClass}
                            placeholder="Il tuo nome"
                          />
                        </div>
                        <div className={inputContainerClass}>
                          <label htmlFor="lastName" className={labelClass}>
                            Cognome *
                          </label>
                          <input
                            required
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            className={inputClass}
                            placeholder="Il tuo cognome"
                          />
                        </div>
                      </>
                    ) : (
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
                    )}
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
                        Privacy Policy.
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
