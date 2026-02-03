import React, { useState, useRef, useEffect } from "react";
import { PageTransition } from "../components/Layout/PageTransition";
import { SEO } from "@/components/SEO/SEO";
import { Reveal } from "@/components/UI/Reveal";
import { useLocation } from "react-router-dom";
import { getActiveJobPositions } from "../sanity/jobPositions";

// Updated input classes with the new brand color on focus
const inputClasses =
  "w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-[#b89b5e] focus:ring-1 focus:ring-[#b89b5e] transition-all";

const LavoraConNoi: React.FC = () => {
  const location = useLocation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [position, setPosition] = useState("Commessa / Commesso");
  const [positions, setPositions] = useState<string[]>([]);
  const [positionsLoaded, setPositionsLoaded] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);

  // UI States
  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [feedbackMsg, setFeedbackMsg] = useState("");
  const [deleteStatus, setDeleteStatus] = useState<
    "idle" | "deleting" | "deleted" | "error"
  >("idle");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY as
    | string
    | undefined;

  useEffect(() => {
    if (!siteKey) return;
    const scriptId = "recaptcha-v3";
    if (document.getElementById(scriptId)) return;
    const script = document.createElement("script");
    script.id = scriptId;
    script.async = true;
    script.defer = true;
    script.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}`;
    document.head.appendChild(script);
  }, [siteKey]);

  useEffect(() => {
    let mounted = true;
    getActiveJobPositions()
      .then((items) => {
        if (!mounted) return;
        setPositionsLoaded(true);
        if (items.length > 0) {
          setPositions(items);
          if (!items.includes(position)) {
            setPosition(items[0]);
          }
        }
      })
      .catch(() => {
        if (mounted) setPositionsLoaded(true);
        // Keep fallback positions on error
      });
    return () => {
      mounted = false;
    };
  }, []);
  const showNoPositions = positionsLoaded && positions.length === 0;
  const fallbackPositions = [
    "Commessa / Commesso",
    "Responsabile di Negozio",
    "Visual Merchandiser",
    "Magazzino / Logistica",
    "Amministrazione",
    "Candidatura Spontanea",
  ];
  const selectOptions = showNoPositions
    ? ["Nessuna posizione disponibile"]
    : positionsLoaded && positions.length > 0
      ? positions
      : fallbackPositions;

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const deleteToken = params.get("deleteToken");
    const emailParam = params.get("email");
    if (!deleteToken || !emailParam) return;

    const runDelete = async () => {
      setDeleteStatus("deleting");
      try {
        const res = await fetch("/api/lavora-con-noi-delete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ deleteToken, email: emailParam }),
        });
        if (!res.ok) throw new Error("Delete failed");
        setDeleteStatus("deleted");
      } catch {
        setDeleteStatus("error");
      }
    };

    runDelete();
  }, [location.search]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.size > 5 * 1024 * 1024) {
        setFeedbackMsg("Il file è troppo grande (Max 5MB).");
        return;
      }
      setFile(selectedFile);
      setFeedbackMsg("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!name || !email || !phone || !position || !file) {
      setStatus("error");
      setFeedbackMsg(
        "Per favore compila tutti i campi obbligatori e carica il tuo CV.",
      );
      return;
    }

    if (!privacyAccepted) {
      setStatus("error");
      setFeedbackMsg(
        "Devi accettare la normativa sulla privacy per procedere.",
      );
      return;
    }

    setStatus("submitting");
    setFeedbackMsg("");

    if (!siteKey || !window.grecaptcha) {
      setStatus("error");
      setFeedbackMsg("reCAPTCHA non disponibile. Riprova tra qualche secondo.");
      return;
    }

    let token: string;
    try {
      token = await window.grecaptcha.execute(siteKey, { action: "submit" });
      setRecaptchaToken(token);
    } catch {
      setStatus("error");
      setFeedbackMsg("reCAPTCHA non disponibile. Riprova tra qualche secondo.");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("position", position);
    formData.append("cv", file);
    formData.append("message", message);
    formData.append("recaptchaToken", token);

    try {
      const res = await fetch("/api/lavora-con-noi", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || "Submission failed");
      }

      setStatus("success");
      setFeedbackMsg(
        "Grazie! La tua candidatura è stata inviata con successo.",
      );

      // Reset form
      setName("");
      setEmail("");
      setPhone("");
      setPosition("Commessa / Commesso");
      setFile(null);
      setMessage("");
      setPrivacyAccepted(false);
      setRecaptchaToken(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      setStatus("error");
      setFeedbackMsg("Si è verificato un errore. Riprova più tardi.");
    }
  };

  return (
    <PageTransition>
      <div className="pt-24 min-h-screen bg-gray-50 text-gray-900">
        <SEO
          title="Lavora con Noi | Dimensione Immagine"
          description="Invia la tua candidatura per far parte del team Dimensione Immagine."
          url={`https://www.dimensioneimmagineabbigliamento.it/lavora-con-noi`}
          image="/og-sedi.jpg"
        />

        <section className="container mx-auto px-6 py-12 md:py-20">
          <Reveal width="100%">
            <div className="text-center mb-12">
              <span className="text-[#b89b5e] font-medium tracking-widest uppercase text-sm mb-2 block">
                Carriere
              </span>
              <h1 className="text-3xl md:text-5xl font-serif mb-4">
                Lavora con Dimensione Immagine
              </h1>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Unisciti al nostro team dinamico. Siamo sempre alla ricerca di
                nuovi talenti appassionati di moda.
              </p>
              {deleteStatus !== "idle" && (
                <div
                  className={`mt-4 inline-flex items-center px-4 py-2 rounded-md text-sm font-medium ${
                    deleteStatus === "deleted"
                      ? "bg-green-50 text-green-700 border border-green-200"
                      : deleteStatus === "deleting"
                        ? "bg-gray-50 text-gray-700 border border-gray-200"
                        : "bg-red-50 text-red-700 border border-red-200"
                  }`}
                >
                  {deleteStatus === "deleting" && "Rimozione in corso..."}
                  {deleteStatus === "deleted" &&
                    "Dati rimossi correttamente."}
                  {deleteStatus === "error" &&
                    "Impossibile rimuovere i dati. Contattaci per assistenza."}
                </div>
              )}
            </div>
          </Reveal>

          <Reveal width="100%">
            <div className="max-w-2xl mx-auto bg-white p-8 md:p-10 rounded-2xl shadow-xl border-t-4 border-[#b89b5e]">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name & Phone */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      Nome e Cognome *
                    </label>
                    <input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className={inputClasses}
                      placeholder="Mario Rossi"
                      disabled={status === "submitting"}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      Telefono *
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className={inputClasses}
                      placeholder="+39 333 1234567"
                      disabled={status === "submitting"}
                    />
                  </div>
                </div>

                {/* Email & Position */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      Email *
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={inputClasses}
                      placeholder="mario@example.com"
                      disabled={status === "submitting"}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="position"
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      Posizione Desiderata *
                    </label>
                    <div className="relative">
                      <select
                        id="position"
                        value={position}
                        onChange={(e) => setPosition(e.target.value)}
                        className={`${inputClasses} appearance-none cursor-pointer`}
                        disabled={status === "submitting" || showNoPositions}
                      >
                        {selectOptions.map((p) => (
                          <option key={p} value={p}>
                            {p}
                          </option>
                        ))}
                      </select>
                      {showNoPositions && (
                        <p className="mt-2 text-xs text-red-600">
                          Al momento non ci sono posizioni aperte.
                        </p>
                      )}
                      {/* Custom Arrow for select */}
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-[#b89b5e]">
                        <svg
                          className="h-4 w-4 fill-current"
                          viewBox="0 0 20 20"
                        >
                          <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                {/* File Upload */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Curriculum Vitae (PDF, DOC) *
                  </label>
                  <div className="relative group">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileChange}
                      className="hidden"
                      id="cv-upload"
                      disabled={status === "submitting"}
                    />
                    <label
                      htmlFor="cv-upload"
                      className={`flex items-center justify-between w-full px-4 py-3 border-2 border-dashed rounded-lg cursor-pointer transition-all ${
                        file
                          ? "bg-[#b89b5e]/10 border-[#b89b5e] text-[#b89b5e]"
                          : "bg-gray-50 border-gray-300 hover:border-[#b89b5e] hover:bg-[#b89b5e]/5"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {/* Icon */}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className={`w-5 h-5 ${file ? "text-[#b89b5e]" : "text-gray-400 group-hover:text-[#b89b5e]"}`}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                          />
                        </svg>
                        <span
                          className={`truncate ${file ? "font-semibold" : "text-gray-500"}`}
                        >
                          {file ? file.name : "Clicca per caricare il tuo CV"}
                        </span>
                      </div>

                      {!file && (
                        <span className="text-xs uppercase bg-white border border-gray-200 px-2 py-1 rounded text-gray-500 font-medium group-hover:border-[#b89b5e] group-hover:text-[#b89b5e] transition-colors">
                          Sfoglia
                        </span>
                      )}
                    </label>
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Messaggio (Opzionale)
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className={inputClasses}
                    placeholder="Raccontaci brevemente perché vuoi lavorare con noi..."
                    disabled={status === "submitting"}
                  />
                </div>

                {/* Privacy Checkbox (GDPR) */}
                <div className="flex items-start gap-3">
                  <div className="flex h-6 items-center">
                    <input
                      id="privacy"
                      name="privacy"
                      type="checkbox"
                      checked={privacyAccepted}
                      onChange={(e) => setPrivacyAccepted(e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300 text-[#b89b5e] focus:ring-[#b89b5e] cursor-pointer"
                    />
                  </div>
                  <div className="text-sm leading-6">
                    <label htmlFor="privacy" className="text-gray-600">
                      Acconsento al trattamento dei dati personali secondo la{" "}
                      <a
                        href="/privacy-policy"
                        className="text-[#b89b5e] hover:underline font-medium"
                      >
                        Privacy Policy
                      </a>
                      .
                    </label>
                  </div>
                </div>

                {/* Feedback Messages */}
                {feedbackMsg && (
                  <div
                    className={`p-4 rounded-lg text-sm text-center font-medium ${
                      status === "success"
                        ? "bg-green-50 text-green-700 border border-green-200"
                        : "bg-red-50 text-red-700 border border-red-200"
                    }`}
                  >
                    {feedbackMsg}
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={
                    status === "submitting" ||
                    status === "success" ||
                    showNoPositions
                  }
                  className={`w-full py-4 rounded-lg font-bold text-white uppercase tracking-wider transition-all transform hover:-translate-y-1 shadow-md hover:shadow-lg cursor-pointer ${
                    status === "submitting"
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-[#b89b5e] hover:bg-[#a38a53]"
                  }`}
                >
                  {status === "submitting" ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg
                        className="animate-spin h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Invio in corso...
                    </span>
                  ) : (
                    "Invia Candidatura"
                  )}
                </button>
              </form>
            </div>
          </Reveal>
        </section>
      </div>
    </PageTransition>
  );
};

export default LavoraConNoi;
