import React, { useState } from "react";
import { Button } from "../components/UI/Button";
import { Mail, MapPin, Phone } from "lucide-react";
import { SEO } from "../components/SEO/SEO";

export const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted", formData);
    // Add logic to handle submission
    alert("Grazie! La tua richiesta è stata inviata. Ti risponderemo presto.");
    setFormData({ name: "", email: "", phone: "", message: "" });
  };

  return (
    <div className="pt-24 min-h-screen bg-brand-black">
      <SEO
        title="Contatti Dimensione Immagine | Moda a Messina"
        description="Contatta Dimensione Immagine per informazioni sulle collezioni Uomo, Donna e Taglie Forti a Messina."
        image="/og-contatti.jpg"
      />
      <div className="container mx-auto px-6 py-12 text-center">
        <span className="text-brand-gold text-xs font-bold uppercase tracking-widest mb-4 block">
          Parla con noi
        </span>
        <h1 className="font-serif text-5xl md:text-7xl mb-6">Contattaci</h1>
        <p className="text-white/60 max-w-xl mx-auto font-light">
          Richiedi informazioni sulle nostre collezioni o vieni a trovarci in
          boutique.
        </p>
      </div>

      <div className="container mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Info Side */}
          <div className="bg-brand-darkgray p-10 border border-white/5 h-fit">
            <h3 className="text-2xl font-serif text-white mb-8">
              Informazioni di Contatto
            </h3>

            <div className="space-y-8">
              <div className="flex items-start">
                <div className="w-12 h-12 bg-black border border-white/10 flex items-center justify-center mr-6 shrink-0 text-brand-gold">
                  <MapPin size={24} />
                </div>
                <div>
                  <h4 className="text-white text-sm uppercase tracking-widest font-bold mb-2">
                    Sede Principale
                  </h4>
                  <p className="text-white/60 leading-relaxed">
                    Contrada S. Lucia, 46
                    <br />
                    Capo d’Orlando (ME)
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-12 h-12 bg-black border border-white/10 flex items-center justify-center mr-6 shrink-0 text-brand-gold">
                  <Phone size={24} />
                </div>
                <div>
                  <h4 className="text-white text-sm uppercase tracking-widest font-bold mb-2">
                    Telefono
                  </h4>
                  <p className="text-white/60 leading-relaxed">
                    +39 392 718 9875
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-12 h-12 bg-black border border-white/10 flex items-center justify-center mr-6 shrink-0 text-brand-gold">
                  <Mail size={24} />
                </div>
                <div>
                  <h4 className="text-white text-sm uppercase tracking-widest font-bold mb-2">
                    Email
                  </h4>
                  <p className="text-white/60 leading-relaxed break-all">
                    info@dimensioneimmagine.net
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-12 pt-8 border-t border-white/10">
              <p className="text-white/40 text-sm italic">
                Siamo aperti dal Lunedì al Venerdì, dalle 09:00 alle 13:00 e
                dalle 15:00 alle 19:00.
              </p>
            </div>
          </div>

          {/* Form Side */}
          <div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-xs uppercase tracking-widest text-white/50 mb-2"
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
                    className="w-full bg-transparent border-b border-white/20 py-3 text-white focus:outline-none focus:border-brand-gold transition-colors placeholder-white/10"
                    placeholder="Il tuo nome"
                  />
                </div>
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-xs uppercase tracking-widest text-white/50 mb-2"
                  >
                    Telefono
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full bg-transparent border-b border-white/20 py-3 text-white focus:outline-none focus:border-brand-gold transition-colors placeholder-white/10"
                    placeholder="Il tuo numero"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-xs uppercase tracking-widest text-white/50 mb-2"
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
                  className="w-full bg-transparent border-b border-white/20 py-3 text-white focus:outline-none focus:border-brand-gold transition-colors placeholder-white/10"
                  placeholder="La tua email"
                />
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-xs uppercase tracking-widest text-white/50 mb-2"
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
                  className="w-full bg-transparent border-b border-white/20 py-3 text-white focus:outline-none focus:border-brand-gold transition-colors placeholder-white/10 resize-none"
                  placeholder="Descrivi il tuo progetto..."
                ></textarea>
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
        </div>
      </div>
    </div>
  );
};
