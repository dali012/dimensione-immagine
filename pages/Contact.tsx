import { Link, useLocation } from "react-router-dom";
import React, { useState } from "react";
import { Button } from "../components/UI/Button";
import { Mail, MapPin, Phone } from "lucide-react";
import ReCAPTCHA from "react-google-recaptcha";
import { SEO } from "../components/SEO/SEO";
import { Reveal } from "../components/UI/Reveal";
import { SectionHeader } from "../components/UI/SectionHeader";

const CONTACT_ENDPOINT = "/api/contact";
const RATE_LIMIT_MS = 60 * 1000;

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

  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [marketingConsent, setMarketingConsent] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRecaptchaChange = (token: string | null) => {
    setRecaptchaToken(token);
  };

  const validateForm = () => {
    const nextErrors = { name: "", email: "", phone: "", message: "" };
    if (!formData.name.trim()) nextErrors.name = "Il nome è obbligatorio.";
    if (!formData.email.trim()) {
      nextErrors.email = "L'email è obbligatoria.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      nextErrors.email = "Inserisci un'email valida.";
    }
    if (formData.phone.trim()) {
      const digits = formData.phone.replace(/\D/g, "");
      if (digits.length < 8) {
        nextErrors.phone = "Inserisci un numero valido.";
      }
    }
    if (!formData.message.trim())
      nextErrors.message = "Il messaggio è obbligatorio.";

    setErrors(nextErrors);
    return !Object.values(nextErrors).some(Boolean);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const lastSubmission = localStorage.getItem("contact-last-submit");
    if (lastSubmission) {
      const lastTime = Number(lastSubmission);
      if (Date.now() - lastTime < RATE_LIMIT_MS) {
        alert("Attendi qualche secondo prima di inviare un'altra richiesta.");
        return;
      }
    }

    if (!validateForm()) return;

    if (!recaptchaToken) {
      alert("Per favore conferma di non essere un robot.");
      return;
    }

    if (!termsAccepted) {
      alert(
        "Per inviare la richiesta devi accettare la Privacy Policy e i Termini di Servizio.",
      );
      return;
    }

    try {
      const res = await fetch(CONTACT_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          marketingConsent,
          recaptchaToken,
        }),
      });

      if (!res.ok) throw new Error("Request failed");

      localStorage.setItem("contact-last-submit", String(Date.now()));
      alert(
        "Grazie! La tua richiesta è stata inviata. Ti risponderemo presto.",
      );
      setFormData({ name: "", email: "", phone: "", message: "" });
      setRecaptchaToken(null);
      setTermsAccepted(false);
      setMarketingConsent(false);
      setErrors({ name: "", email: "", phone: "", message: "" });
    } catch (err) {
      console.error(err);
      alert("Si è verificato un errore. Riprova più tardi.");
    }
  };

  return (
    <div className="pt-24 min-h-screen bg-brand-bg">
      <SEO
        title="Contatti Dimensione Immagine | Moda a Messina"
        description="Contatta Dimensione Immagine per informazioni sulle collezioni Uomo, Donna e Taglie Forti a Messina."
        url={`https://www.dimensioneimmagineabbigliamento.it${location.pathname}`}
        image="/og-contatti.jpg"
      />
      <div className="container mx-auto px-6 py-12 text-center">
        <Reveal width="100%">
          <SectionHeader
            label="Parla con noi"
            title="Contattaci"
            subtitle="Richiedi informazioni sulle nostre collezioni o vieni a trovarci in boutique."
            as="h1"
          />
        </Reveal>
      </div>

      <div className="container mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Info Side */}
          <Reveal className="h-full">
            <div className="bg-white p-10 border border-brand-border h-fit shadow-sm">
              <h3 className="text-2xl font-serif text-brand-text-primary mb-8">
                Informazioni di Contatto
              </h3>

              <div className="space-y-8">
                <div className="flex items-start">
                  <div className="w-12 h-12 border border-brand-border/10 flex items-center justify-center mr-6 shrink-0 text-brand-accent">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h4 className="text-brand-text-primary text-sm uppercase tracking-widest font-bold mb-2">
                      Sede Principale
                    </h4>
                    <a
                      href="https://www.google.com/maps/dir/?api=1&destination=Via+Maddalena+38/D+98122+Messina+Italia"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-brand-text-secondary leading-relaxed hover:text-brand-accent transition-colors"
                    >
                      Via Maddalena 38/D, <br /> 98122 Messina (ME), Italia
                    </a>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-12 h-12 border border-brand-border/10 flex items-center justify-center mr-6 shrink-0 text-brand-accent">
                    <Phone size={24} />
                  </div>
                  <div>
                    <h4 className="text-brand-text-primary text-sm uppercase tracking-widest font-bold mb-2">
                      Telefono
                    </h4>
                    <a
                      href="tel:+390902400474"
                      className="text-brand-text-secondary leading-relaxed hover:text-brand-accent transition-colors"
                    >
                      +39 090 240 0474
                    </a>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-12 h-12 border border-brand-border/10 flex items-center justify-center mr-6 shrink-0 text-brand-accent">
                    <Mail size={24} />
                  </div>
                  <div>
                    <h4 className="text-brand-text-primary text-sm uppercase tracking-widest font-bold mb-2">
                      Email
                    </h4>
                    <a
                      href="mailto:contact@dimensioneimmagineabbigliamento.it"
                      className="text-brand-text-secondary leading-relaxed break-all hover:text-brand-accent transition-colors"
                    >
                      contact@dimensioneimmagineabbigliamento.it
                    </a>
                  </div>
                </div>
              </div>

              <div className="mt-12 pt-8 border-t border-brand-border">
                <p className="text-brand-text-secondary/80 text-sm italic">
                  Siamo aperti dal Lunedì al Venerdì, dalle 09:00 alle 13:00 e
                  dalle 15:00 alle 19:00.
                </p>
                <div className="mt-6">
                  <Button
                    to="https://wa.me/390902400474"
                    variant="outline"
                    ariaLabel="Chatta su WhatsApp"
                  >
                    Chatta su WhatsApp
                  </Button>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Form Side */}
          <Reveal delay={0.2} className="h-full">
            <div>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-xs uppercase tracking-widest text-brand-text-secondary mb-2"
                    >
                      Nome
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full bg-transparent border-b border-brand-border py-3 text-brand-text-primary focus:outline-none focus:border-brand-accent transition-colors placeholder-brand-text-secondary/40"
                      placeholder="Il tuo nome"
                    />
                    {errors.name && (
                      <p className="text-xs text-brand-accent mt-2">
                        {errors.name}
                      </p>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-xs uppercase tracking-widest text-brand-text-secondary mb-2"
                    >
                      Telefono
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full bg-transparent border-b border-brand-border py-3 text-brand-text-primary focus:outline-none focus:border-brand-accent transition-colors placeholder-brand-text-secondary/40"
                      placeholder="Il tuo numero"
                    />
                    {errors.phone && (
                      <p className="text-xs text-brand-accent mt-2">
                        {errors.phone}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-xs uppercase tracking-widest text-brand-text-secondary mb-2"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full bg-transparent border-b border-brand-border py-3 text-brand-text-primary focus:outline-none focus:border-brand-accent transition-colors placeholder-brand-text-secondary/40"
                    placeholder="La tua email"
                  />
                  {errors.email && (
                    <p className="text-xs text-brand-accent mt-2">
                      {errors.email}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-xs uppercase tracking-widest text-brand-text-secondary mb-2"
                  >
                    Messaggio
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full bg-transparent border-b border-brand-border py-3 text-brand-text-primary focus:outline-none focus:border-brand-accent transition-colors placeholder-brand-text-secondary/40 resize-none"
                    placeholder="Descrivi il tuo progetto..."
                  ></textarea>
                  {errors.message && (
                    <p className="text-xs text-brand-accent mt-2">
                      {errors.message}
                    </p>
                  )}
                </div>

                {/* ReCAPTCHA */}
                <div className="py-2">
                  <ReCAPTCHA
                    sitekey="6Ld1BEgsAAAAADaK7qe0T4ACh-PkF1gPpMnITtkX"
                    onChange={handleRecaptchaChange}
                  />
                </div>

                {/* Terms and Privacy Checkbox */}
                <div className="flex items-center">
                  <input
                    id="terms"
                    type="checkbox"
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                    className="mt-1 h-4 w-4 text-brand-accent focus:ring-brand-accent border-gray-300 rounded"
                    required
                  />
                  <label
                    htmlFor="terms"
                    className="ml-2 block text-xs text-brand-text-secondary"
                  >
                    Ho letto e accetto la{" "}
                    <Link
                      to="/privacy-policy"
                      className="underline hover:text-brand-accent"
                    >
                      Privacy Policy
                    </Link>{" "}
                    e i{" "}
                    <Link
                      to="/termini-condizioni"
                      className="underline hover:text-brand-accent"
                    >
                      Termini e Condizioni
                    </Link>
                    .
                  </label>
                </div>

                {/* Optional Marketing Consent */}
                <div className="flex items-center">
                  <input
                    id="marketing"
                    type="checkbox"
                    checked={marketingConsent}
                    onChange={(e) => setMarketingConsent(e.target.checked)}
                    className="mt-1 h-4 w-4 text-brand-accent focus:ring-brand-accent border-gray-300 rounded"
                  />
                  <label
                    htmlFor="marketing"
                    className="ml-2 block text-xs text-brand-text-secondary"
                  >
                    Desidero ricevere aggiornamenti e comunicazioni marketing
                    via email. (Opzionale)
                  </label>
                </div>

                <div className="pt-4">
                  <Button
                    type="submit"
                    variant="primary"
                    className="w-full md:w-auto"
                  >
                    Invia Richiesta
                  </Button>
                </div>
              </form>
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  );
};
