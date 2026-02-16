import { ArrowRight, Clock, Mail, MapPin, Phone } from "lucide-react";
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { SEO } from "../components/SEO/SEO";
import { Reveal } from "../components/UI/Reveal";

const CONTACT_ENDPOINT = "/api/contact";

export const Contact: React.FC = () => {
  const location = useLocation();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [termsAccepted, setTermsAccepted] = useState(false);
  const [marketingConsent, setMarketingConsent] = useState(false);
  const [honey, setHoney] = useState("");
  const [submitMessage, setSubmitMessage] = useState("");
  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    if (errors[e.target.name as keyof typeof errors]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  const validateForm = () => {
    const nextErrors = { name: "", email: "", phone: "", message: "" };
    let isValid = true;

    if (!formData.name.trim()) {
      nextErrors.name = "Il nome e obbligatorio.";
      isValid = false;
    }

    if (!formData.email.trim()) {
      nextErrors.email = "L'email e obbligatoria.";
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      nextErrors.email = "Inserisci un'email valida.";
      isValid = false;
    }

    if (!formData.message.trim()) {
      nextErrors.message = "Il messaggio e obbligatorio.";
      isValid = false;
    } else if (formData.message.trim().length < 10) {
      nextErrors.message = "Il messaggio deve avere almeno 10 caratteri.";
      isValid = false;
    }

    setErrors(nextErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;
    if (!termsAccepted) {
      setStatus("error");
      setSubmitMessage("Accetta la Privacy Policy.");
      return;
    }

    setStatus("submitting");
    setSubmitMessage("");

    try {
      const response = await fetch(CONTACT_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          message: formData.message.trim(),
          privacyAccepted: termsAccepted,
          marketingConsent,
          honey,
          sourcePage: location.pathname,
        }),
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok || !data.success) {
        throw new Error(
          data?.error || "Invio non riuscito. Riprova piu tardi.",
        );
      }

      setStatus("success");
      setSubmitMessage(
        "Grazie! La tua richiesta e stata inviata con successo.",
      );
      setFormData({ name: "", email: "", phone: "", message: "" });
      setTermsAccepted(false);
      setMarketingConsent(false);
      setHoney("");

      setTimeout(() => {
        setStatus("idle");
        setSubmitMessage("");
      }, 5000);
    } catch (err: any) {
      setStatus("error");
      setSubmitMessage(
        err?.message || "Invio non riuscito. Riprova piu tardi.",
      );
    }
  };

  const inputContainerClass = "relative group";
  const labelClass =
    "block text-xs uppercase tracking-widest text-gray-500 mb-1.5 font-medium group-focus-within:text-[#b89b5e] transition-colors";
  const inputClass =
    "w-full bg-transparent border-b border-gray-300 py-3 md:py-2 text-base md:text-sm text-gray-900 focus:outline-none focus:border-[#b89b5e] transition-all placeholder:text-gray-300 rounded-none";

  return (
    <div className="min-h-screen bg-white flex flex-col lg:flex-row font-sans">
      <SEO
        title="Contatti Dimensione Immagine"
        description="Contattaci per informazioni sulle nostre boutique a Messina."
        url={`https://www.dimensioneimmagineabbigliamento.it${location.pathname}`}
        image="/og-contatti.jpg"
      />

      <div className="hidden lg:flex lg:w-5/12 xl:w-1/2 relative bg-[#1a1a1a] items-center justify-center h-screen sticky top-0 overflow-hidden">
        <div
          className="absolute inset-0 opacity-70 bg-cover bg-center transition-transform duration-1000 hover:scale-105"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=1974&auto=format&fit=crop')",
          }}
        ></div>
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent"></div>

        <div className="relative z-10 text-center p-12">
          <Reveal>
            <h2 className="text-5xl xl:text-6xl font-serif text-white mb-6 leading-tight">
              Vieni a trovarci in <br />
              <span className="text-brand-gold italic font-light">Negozio</span>
            </h2>
          </Reveal>
          <Reveal delay={0.1} className="mx-auto">
            <a
              href="https://maps.app.goo.gl/cT5afaLH5wWfFhmp9"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-3 px-8 py-4 bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-all duration-300 mt-4 group"
            >
              Ottieni Indicazioni
              <ArrowRight
                size={16}
                className="transform group-hover:translate-x-1 transition-transform"
              />
            </a>
          </Reveal>
        </div>
      </div>

      <div className="w-full lg:w-7/12 xl:w-1/2 flex flex-col min-h-screen bg-white">
        <div className="lg:hidden relative h-64 w-full bg-[#1a1a1a] overflow-hidden mt-16 md:mt-0">
          <div
            className="absolute inset-0 opacity-60 bg-cover bg-center"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=1974&auto=format&fit=crop')",
            }}
          ></div>
          <div className="absolute inset-0 bg-black/40"></div>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
            <h1 className="text-3xl font-serif text-white mb-2">Contattaci</h1>
            <p className="text-white/80 text-sm max-w-xs">
              Il nostro team e a tua disposizione per ogni richiesta.
            </p>
          </div>
        </div>

        <div className="flex-1 px-6 md:px-12 lg:px-16 py-10 lg:py-20 w-full max-w-2xl mx-auto">
          <Reveal width="100%">
            <div className="mb-10 lg:mb-12">
              <span className="text-brand-gold font-bold tracking-[0.2em] text-[10px] uppercase mb-3 block">
                Assistenza Clienti
              </span>
              <h2 className="text-3xl md:text-4xl font-serif text-gray-900 leading-tight">
                Come possiamo aiutarti?
              </h2>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12 mb-12 border-b border-gray-100 pb-12">
            <Reveal delay={0.1}>
              <div className="flex items-start gap-4">
                <div className="mt-1 p-2 bg-brand-gold/10 rounded-full text-brand-gold shrink-0">
                  <MapPin size={18} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-xs uppercase tracking-wide mb-1">
                    Sede
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    Via Maddalena 38/D,
                    <br />
                    98122 Messina (ME)
                  </p>
                  <a
                    href="https://maps.app.goo.gl/rr5evPBvFgyBMhd68"
                    target="_blank"
                    rel="noreferrer"
                    className="text-[10px] text-brand-gold font-bold uppercase mt-2 inline-block border-b border-brand-gold/30 hover:border-brand-gold"
                  >
                    Vedi su mappa
                  </a>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.15}>
              <div className="flex items-start gap-4">
                <div className="mt-1 p-2 bg-brand-gold/10 rounded-full text-brand-gold shrink-0">
                  <Phone size={18} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-xs uppercase tracking-wide mb-1">
                    Telefono
                  </h3>
                  <a
                    href="tel:+390902400474"
                    className="block text-gray-600 text-sm hover:text-brand-gold transition-colors mb-1"
                  >
                    +39 090 240 0474
                  </a>
                  <a
                    href="https://wa.me/390902400474"
                    className="text-[10px] font-bold text-brand-gold uppercase tracking-wide flex items-center gap-1 hover:underline"
                  >
                    Chatta su WhatsApp
                  </a>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.2}>
              <div className="flex items-start gap-4">
                <div className="mt-1 p-2 bg-brand-gold/10 rounded-full text-brand-gold shrink-0">
                  <Mail size={18} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-xs uppercase tracking-wide mb-1">
                    Email
                  </h3>
                  <a
                    href="mailto:contact@dimensione.it"
                    className="text-gray-600 text-sm hover:text-brand-gold transition-colors break-all"
                  >
                    contact@dimensioneimmagineabbigliamento.it
                  </a>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.25}>
              <div className="flex items-start gap-4">
                <div className="mt-1 p-2 bg-brand-gold/10 rounded-full text-brand-gold shrink-0">
                  <Clock size={18} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-xs uppercase tracking-wide mb-1">
                    Orari
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    Lun - Ven: 09:00 - 13:00
                    <br />e 15:00 - 19:00
                  </p>
                </div>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.3}>
            <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">
              <div className="hidden" aria-hidden="true">
                <label htmlFor="company">
                  Company
                  <input
                    id="company"
                    name="company"
                    type="text"
                    value={honey}
                    onChange={(e) => setHoney(e.target.value)}
                    autoComplete="off"
                    tabIndex={-1}
                  />
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                <div className={inputContainerClass}>
                  <label htmlFor="name" className={labelClass}>
                    Nome *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder="Mario Rossi"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-[10px] mt-1 absolute">
                      {errors.name}
                    </p>
                  )}
                </div>

                <div className={inputContainerClass}>
                  <label htmlFor="phone" className={labelClass}>
                    Telefono
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder="+39..."
                  />
                </div>
              </div>

              <div className={inputContainerClass}>
                <label htmlFor="email" className={labelClass}>
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="mario@example.com"
                />
                {errors.email && (
                  <p className="text-red-500 text-[10px] mt-1 absolute">
                    {errors.email}
                  </p>
                )}
              </div>

              <div className={inputContainerClass}>
                <label htmlFor="message" className={labelClass}>
                  Messaggio *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={3}
                  className={`${inputClass} resize-none`}
                  placeholder="Scrivi qui la tua richiesta..."
                ></textarea>
                {errors.message && (
                  <p className="text-red-500 text-[10px] mt-1 absolute">
                    {errors.message}
                  </p>
                )}
              </div>

              <div className="pt-4 flex flex-col gap-4">
                <div className="flex items-start">
                  <div className="flex h-5 items-center">
                    <input
                      id="terms"
                      type="checkbox"
                      checked={termsAccepted}
                      onChange={(e) => setTermsAccepted(e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300 text-brand-gold focus:ring-brand-gold cursor-pointer"
                    />
                  </div>
                  <div className="ml-3 text-xs leading-5">
                    <label htmlFor="terms" className="text-gray-500">
                      Ho letto e accetto la{" "}
                      <Link
                        to="/privacy-policy"
                        className="font-medium text-gray-900 hover:text-brand-gold underline transition-colors"
                      >
                        Privacy Policy
                      </Link>
                      .
                    </label>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex h-5 items-center">
                    <input
                      id="marketing"
                      type="checkbox"
                      checked={marketingConsent}
                      onChange={(e) => setMarketingConsent(e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300 text-brand-gold focus:ring-brand-gold cursor-pointer"
                    />
                  </div>
                  <div className="ml-3 text-xs leading-5">
                    <label htmlFor="marketing" className="text-gray-500">
                      Acconsento a ricevere aggiornamenti commerciali
                      (opzionale).
                    </label>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row gap-6 md:items-center justify-between">
                  <button
                    type="submit"
                    disabled={status === "submitting" || status === "success"}
                    className={`w-full md:w-auto px-8 py-4 text-white uppercase tracking-[0.15em] font-bold text-xs transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 cursor-pointer ${
                      status === "submitting"
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-brand-gold hover:bg-brand-gold-dark"
                    }`}
                  >
                    {status === "submitting" ? "Invio..." : "Invia Messaggio"}
                  </button>
                </div>
              </div>

              {status === "success" && (
                <div className="text-center p-4 bg-green-50 text-green-800 text-sm rounded border border-green-100 animate-fade-in">
                  {submitMessage}
                </div>
              )}
              {status === "error" && (
                <div className="text-center p-4 bg-red-50 text-red-700 text-sm rounded border border-red-100 animate-fade-in">
                  {submitMessage}
                </div>
              )}
            </form>
          </Reveal>
        </div>
      </div>
    </div>
  );
};
