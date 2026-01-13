import { Link } from "react-router-dom";
import React, { useState } from "react";
import { Button } from "../components/UI/Button";
import { Mail, MapPin, Phone } from "lucide-react";
import ReCAPTCHA from "react-google-recaptcha";
import { SEO } from "../components/SEO/SEO";
import { Reveal } from "../components/UI/Reveal";

export const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRecaptchaChange = (token: string | null) => {
    setRecaptchaToken(token);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!recaptchaToken) {
      alert("Per favore conferma di non essere un robot.");
      return;
    }

    if (!termsAccepted) {
      alert(
        "Per inviare la richiesta devi accettare la Privacy Policy e i Termini di Servizio."
      );
      return;
    }

    // Add logic to handle submission
    alert("Grazie! La tua richiesta è stata inviata. Ti risponderemo presto.");
    setFormData({ name: "", email: "", phone: "", message: "" });
    setRecaptchaToken(null);
    setTermsAccepted(false);
  };

  return (
    <div className="pt-24 min-h-screen bg-brand-bg">
      <SEO
        title="Contatti Dimensione Immagine | Moda a Messina"
        description="Contatta Dimensione Immagine per informazioni sulle collezioni Uomo, Donna e Taglie Forti a Messina."
        image="/og-contatti.jpg"
      />
      <div className="container mx-auto px-6 py-12 text-center">
        <Reveal width="100%">
          <span className="text-brand-accent text-xs font-bold uppercase tracking-widest mb-4 block">
            Parla con noi
          </span>
          <h1 className="font-serif text-5xl md:text-7xl mb-6 text-brand-text-primary">
            Contattaci
          </h1>
          <p className="text-brand-text-secondary max-w-xl mx-auto font-light">
            Richiedi informazioni sulle nostre collezioni o vieni a trovarci in
            boutique.
          </p>
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
                    <p className="text-brand-text-secondary leading-relaxed">
                      Contrada S. Lucia, 46
                      <br />
                      Capo d’Orlando (ME)
                    </p>
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
                    <p className="text-brand-text-secondary leading-relaxed">
                      +39 392 718 9875
                    </p>
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
                    <p className="text-brand-text-secondary leading-relaxed break-all">
                      info@dimensioneimmagine.net
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-12 pt-8 border-t border-brand-border">
                <p className="text-brand-text-secondary/80 text-sm italic">
                  Siamo aperti dal Lunedì al Venerdì, dalle 09:00 alle 13:00 e
                  dalle 15:00 alle 19:00.
                </p>
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
