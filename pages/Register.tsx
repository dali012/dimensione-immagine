import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export const Register: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const result = await register({
      name: name.trim(),
      surname: surname.trim(),
      phone: phone.trim(),
      email: email.trim(),
    });

    setSubmitting(false);

    if (!result.ok) {
      setError(result.error || "Impossibile completare la registrazione.");
      return;
    }

    navigate("/login", {
      replace: true,
      state: {
        registeredEmail: email.trim(),
        justRegistered: true,
      },
    });
  };

  return (
    <div className="pt-24 min-h-screen bg-brand-bg text-brand-text-primary flex items-center">
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-brand-border">
          <div className="p-8 md:p-10">
            <div className="mb-6 text-center">
              <picture>
                <source
                  type="image/webp"
                  srcSet="/images/logo-124.webp 1x, /images/logo-248.webp 2x"
                  sizes="124px"
                />
                <img
                  src="/images/logo-124.png"
                  srcSet="/images/logo-124.png 1x, /images/logo-248.png 2x"
                  sizes="124px"
                  alt="Logo"
                  className="mx-auto h-12 mb-4"
                  width="124"
                  height="48"
                />
              </picture>
              <h1 className="text-2xl font-serif font-bold">Registrazione B2B</h1>
              <p className="text-sm text-brand-text-secondary mt-2">
                Compila i dati richiesti. La password verra impostata dopo
                l&apos;approvazione del profilo.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wide text-brand-text-secondary mb-2">
                  Nome
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nome"
                  required
                  className="w-full p-3 border border-brand-border rounded"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wide text-brand-text-secondary mb-2">
                  Cognome
                </label>
                <input
                  type="text"
                  value={surname}
                  onChange={(e) => setSurname(e.target.value)}
                  placeholder="Cognome"
                  required
                  className="w-full p-3 border border-brand-border rounded"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wide text-brand-text-secondary mb-2">
                  Telefono
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+39..."
                  required
                  className="w-full p-3 border border-brand-border rounded"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wide text-brand-text-secondary mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tuo@email.com"
                  required
                  className="w-full p-3 border border-brand-border rounded"
                />
              </div>

              {error && <p className="text-sm text-red-600">{error}</p>}

              <div className="flex items-center justify-between">
                <button
                  disabled={submitting}
                  className="px-6 py-3 bg-brand-accent text-white rounded-lg font-semibold cursor-pointer disabled:opacity-70"
                >
                  {submitting ? "Invio..." : "Invia registrazione"}
                </button>
                <Link
                  to="/login"
                  className="text-sm text-brand-text-secondary underline"
                >
                  Hai gia un account? Accedi
                </Link>
              </div>
            </form>
          </div>
        </div>
        <AuthFooter />
      </div>
    </div>
  );
};

export default Register;

const AuthFooter: React.FC = () => (
  <div className="mt-6 text-center text-sm text-brand-text-secondary">
    <Link to="/privacy-policy" className="underline mr-4">
      Privacy Policy
    </Link>
    <Link to="/termini-condizioni" className="underline">
      Termini e Condizioni
    </Link>
  </div>
);
