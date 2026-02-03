import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Eye, EyeOff } from "lucide-react";

export const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation() as any;
  const from = location.state?.from || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const ok = await login(email.trim(), password);
    if (ok) navigate(from, { replace: true });
    else setError("Credenziali non valide. Controlla email e password.");
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
              <h1 className="text-2xl font-serif font-bold">Accedi</h1>
              <p className="text-sm text-brand-text-secondary mt-2">
                Accedi per richiedere distribuzione all'ingrosso e preventivi
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
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

              <div>
                <label className="block text-xs uppercase tracking-wide text-brand-text-secondary mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    required
                    className="w-full p-3 border border-brand-border rounded"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-text-secondary"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {error && <p className="text-sm text-red-600">{error}</p>}

              <div className="flex items-center justify-between">
                <button className="px-6 py-3 bg-brand-accent text-white rounded-lg font-semibold cursor-pointer">
                  Entra
                </button>
                <Link
                  to="/register"
                  className="text-sm text-brand-text-secondary underline"
                >
                  Crea un account
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

export default Login;

// Small footer for auth pages
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
