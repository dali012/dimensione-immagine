import React, { useEffect, useState } from "react";
import { SEO } from "@/components/SEO/SEO";

export const HrCvLink: React.FC = () => {
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState("");
  const [signedUrl, setSignedUrl] = useState("");
  const [pageAuthed, setPageAuthed] = useState(false);
  const [pagePassword, setPagePassword] = useState("");
  const requiredPassword = import.meta.env.VITE_HR_PAGE_PASSWORD as
    | string
    | undefined;

  useEffect(() => {
    const saved = localStorage.getItem("hr_api_token");
    if (saved) setToken(saved);
  }, []);

  useEffect(() => {
    if (token) localStorage.setItem("hr_api_token", token);
  }, [token]);

  useEffect(() => {
    const ok = sessionStorage.getItem("hr_page_authed") === "1";
    if (ok) setPageAuthed(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setMessage("");
    setSignedUrl("");

    try {
      const res = await fetch("/api/lavora-con-noi-cv-link", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || "Request failed");
      }

      const data = await res.json();
      setSignedUrl(data.signedUrl || "");
      setStatus("success");
      setMessage("Link generato con successo.");
    } catch (err: any) {
      setStatus("error");
      setMessage(err?.message || "Errore durante la richiesta.");
    }
  };

  const handleGateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!requiredPassword) {
      setPageAuthed(true);
      sessionStorage.setItem("hr_page_authed", "1");
      return;
    }
    if (pagePassword === requiredPassword) {
      setPageAuthed(true);
      sessionStorage.setItem("hr_page_authed", "1");
      setPagePassword("");
      return;
    }
    setStatus("error");
    setMessage("Password non valida.");
  };

  return (
    <div className="pt-24 min-h-screen bg-brand-bg text-brand-text-primary">
      <SEO
        title="HR - CV Link | Dimensione Immagine"
        description="Genera un link temporaneo per il CV."
        url="https://www.dimensioneimmagineabbigliamento.it/hr-cv-link"
      />

      <div className="container mx-auto px-6 py-12">
        <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-xl border border-brand-border p-8">
          <h1 className="text-2xl font-serif font-bold mb-2">
            Genera Link CV
          </h1>
          <p className="text-sm text-brand-text-secondary mb-6">
            Inserisci email candidato e token HR per ottenere un link firmato
            valido 7 giorni.
          </p>

          {!pageAuthed && (
            <form onSubmit={handleGateSubmit} className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wide text-brand-text-secondary mb-2">
                  Password HR
                </label>
                <input
                  type="password"
                  value={pagePassword}
                  onChange={(e) => setPagePassword(e.target.value)}
                  required
                  className="w-full p-3 border border-brand-border rounded"
                  placeholder="Password"
                />
              </div>
              <button
                type="submit"
                className="px-6 py-3 bg-brand-accent text-white rounded-lg font-semibold cursor-pointer"
              >
                Accedi
              </button>
            </form>
          )}

          {pageAuthed && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-wide text-brand-text-secondary">
                  Accesso HR attivo
                </span>
                <button
                  type="button"
                  onClick={() => {
                    sessionStorage.removeItem("hr_page_authed");
                    setPageAuthed(false);
                  }}
                  className="text-xs uppercase tracking-widest text-brand-accent hover:underline"
                >
                  Logout
                </button>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-brand-text-secondary mb-2">
                  Email Candidato
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full p-3 border border-brand-border rounded"
                  placeholder="candidato@example.com"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wide text-brand-text-secondary mb-2">
                  HR Token
                </label>
                <input
                  type="password"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  required
                  className="w-full p-3 border border-brand-border rounded"
                  placeholder="HR API token"
                />
              </div>

              <button
                type="submit"
                disabled={status === "loading"}
                className="px-6 py-3 bg-brand-accent text-white rounded-lg font-semibold cursor-pointer"
              >
                {status === "loading" ? "Generazione..." : "Genera Link"}
              </button>
            </form>
          )}

          {message && (
            <div
              className={`mt-4 text-sm ${
                status === "success" ? "text-green-700" : "text-red-600"
              }`}
            >
              {message}
            </div>
          )}

          {signedUrl && (
            <div className="mt-4 text-sm break-all">
              <span className="font-semibold">Link:</span>{" "}
              <a
                href={signedUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-accent underline"
              >
                {signedUrl}
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HrCvLink;
