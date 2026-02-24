import React, { useEffect, useMemo, useState } from "react";
import {
  useNavigate,
  useLocation,
  Link,
  useSearchParams,
} from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Eye, EyeOff } from "lucide-react";

type AuthStep =
  | "email"
  | "pending"
  | "login"
  | "setupRequest"
  | "setupPassword";

export const Login: React.FC = () => {
  const {
    login,
    getAccountStatus,
    requestPasswordSetup,
    completePasswordSetup,
    isAuthenticated,
    user,
  } = useAuth();
  const navigate = useNavigate();
  const location = useLocation() as {
    state?: {
      from?: string;
      registeredEmail?: string;
      justRegistered?: boolean;
    };
  };
  const [searchParams] = useSearchParams();

  const from = location.state?.from || "/distribuzione-in-grosso";
  const setupTokenFromQuery = searchParams.get("setupToken") || "";
  const emailFromQuery = searchParams.get("email") || "";
  const initialEmail =
    emailFromQuery || location.state?.registeredEmail || "";

  const [step, setStep] = useState<AuthStep>(
    setupTokenFromQuery && emailFromQuery ? "setupPassword" : "email",
  );
  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [setupToken, setSetupToken] = useState(setupTokenFromQuery);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      const isPasswordSetupFlow =
        step === "setupPassword" || Boolean(setupTokenFromQuery);
      if (isPasswordSetupFlow && user?.canManagePromotions) {
        navigate("/admin-promozioni", { replace: true });
        return;
      }
      navigate(from, { replace: true });
    }
  }, [
    isAuthenticated,
    navigate,
    from,
    step,
    setupTokenFromQuery,
    user?.canManagePromotions,
  ]);

  useEffect(() => {
    if (location.state?.justRegistered) {
      setInfo(
        "Registrazione ricevuta. Attendi l'approvazione del profilo per impostare la password.",
      );
    }
  }, [location.state?.justRegistered]);

  useEffect(() => {
    const verifySetupEntry = async () => {
      if (step !== "setupPassword" || !email || !setupToken) return;
      const statusResult = await getAccountStatus(email.trim());
      if (!statusResult.ok || statusResult.status !== "approved_setup_required") {
        setStep("email");
        setSetupToken("");
        setError(
          "Il link di setup non e valido per questo account. Verifica lo stato del profilo.",
        );
      }
    };

    verifySetupEntry();
  }, [step, email, setupToken]);

  const emailLocked = useMemo(
    () => step !== "email" && step !== "pending",
    [step],
  );

  const resetToEmailStep = () => {
    setStep("email");
    setPassword("");
    setConfirmPassword("");
    setSetupToken("");
    setError(null);
    setInfo(null);
  };

  const handleCheckEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setInfo(null);
    setSubmitting(true);

    const statusResult = await getAccountStatus(email.trim());
    setSubmitting(false);

    if (!statusResult.ok || !statusResult.status) {
      setError(statusResult.error || "Impossibile verificare l'account.");
      return;
    }

    switch (statusResult.status) {
      case "not_found":
        setStep("email");
        setError(
          "Profilo non trovato. Registrati prima per richiedere accesso B2B.",
        );
        break;
      case "pending_approval":
        setStep("pending");
        setInfo(
          "Profilo registrato ma ancora in verifica. Ti avviseremo quando sara approvato.",
        );
        break;
      case "approved_password_required":
        setStep("login");
        setInfo("Profilo approvato. Inserisci la password per accedere.");
        break;
      case "approved_setup_required":
        if (setupToken) {
          setStep("setupPassword");
        } else {
          setStep("setupRequest");
        }
        setInfo(
          "Profilo approvato. Richiedi il link per impostare la password.",
        );
        break;
      default:
        setError("Stato account non gestito.");
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setInfo(null);
    setSubmitting(true);

    const result = await login(email.trim(), password);
    setSubmitting(false);

    if (result.ok) {
      navigate(from, { replace: true });
      return;
    }

    setError(result.error || "Credenziali non valide.");
  };

  const handleRequestSetupLink = async () => {
    setError(null);
    setInfo(null);
    setSubmitting(true);

    const result = await requestPasswordSetup(email.trim());
    setSubmitting(false);

    if (!result.ok) {
      setError(result.error || "Impossibile inviare il link di setup.");
      return;
    }

    if (result.setupToken) {
      setSetupToken(result.setupToken);
      setStep("setupPassword");
      setInfo(
        "Token setup generato (modalita sviluppo). Imposta ora la password.",
      );
      return;
    }

    setInfo(
      "Link inviato via email. Apri il link ricevuto e completa l'impostazione password.",
    );
  };

  const handleCompleteSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setInfo(null);

    if (!setupToken.trim()) {
      setError("Inserisci il setup token.");
      return;
    }
    if (password.length < 8) {
      setError("La password deve avere almeno 8 caratteri.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Le password non coincidono.");
      return;
    }

    setSubmitting(true);
    const result = await completePasswordSetup({
      email: email.trim(),
      setupToken: setupToken.trim(),
      password,
    });
    setSubmitting(false);

    if (!result.ok) {
      setError(result.error || "Impossibile completare il setup password.");
      return;
    }
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
              <h1 className="text-2xl font-serif font-bold">Accesso B2B</h1>
              <p className="text-sm text-brand-text-secondary mt-2">
                Accesso riservato alla pagina Distribuzione Ingrosso
              </p>
            </div>

            <form
              onSubmit={
                step === "login"
                  ? handleLogin
                  : step === "setupPassword"
                    ? handleCompleteSetup
                    : handleCheckEmail
              }
              className="space-y-4"
            >
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
                  disabled={emailLocked}
                  className="w-full p-3 border border-brand-border rounded disabled:bg-gray-100 disabled:text-gray-500"
                />
                {emailLocked && (
                  <button
                    type="button"
                    onClick={resetToEmailStep}
                    className="mt-2 text-xs text-brand-text-secondary underline cursor-pointer"
                  >
                    Modifica email
                  </button>
                )}
              </div>

              {step === "login" && (
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
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-text-secondary cursor-pointer"
                      aria-label="Toggle password visibility"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
              )}

              {step === "setupPassword" && (
                <>
                  <div>
                    <label className="block text-xs uppercase tracking-wide text-brand-text-secondary mb-2">
                      Setup Token
                    </label>
                    <input
                      type="text"
                      value={setupToken}
                      onChange={(e) => setSetupToken(e.target.value)}
                      placeholder="Token ricevuto via email"
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
                        placeholder="Crea password (min 8 caratteri)"
                        required
                        className="w-full p-3 border border-brand-border rounded"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-text-secondary cursor-pointer"
                        aria-label="Toggle password visibility"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wide text-brand-text-secondary mb-2">
                      Conferma Password
                    </label>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Ripeti password"
                      required
                      className="w-full p-3 border border-brand-border rounded"
                    />
                  </div>
                </>
              )}

              {step === "setupRequest" && (
                <div className="rounded-lg border border-brand-border p-4 bg-brand-bg/40">
                  <p className="text-sm text-brand-text-secondary">
                    Il profilo e approvato ma non hai ancora una password.
                    Richiedi il link per impostarla.
                  </p>
                  <button
                    type="button"
                    onClick={handleRequestSetupLink}
                    disabled={submitting}
                    className="mt-3 px-4 py-2 bg-brand-accent text-white rounded-lg font-semibold disabled:opacity-70 cursor-pointer"
                  >
                    {submitting ? "Invio..." : "Invia link setup password"}
                  </button>
                </div>
              )}

              {step === "pending" && (
                <div className="rounded-lg border border-brand-border p-4 bg-brand-bg/40 text-sm text-brand-text-secondary">
                  Profilo in verifica. Appena approvato riceverai il link per
                  impostare la password.
                  <button
                    type="submit"
                    disabled={submitting}
                    className="mt-3 block px-4 py-2 bg-brand-accent text-white rounded-lg font-semibold disabled:opacity-70 cursor-pointer"
                  >
                    {submitting ? "Verifica..." : "Ricontrolla stato"}
                  </button>
                </div>
              )}

              {error && <p className="text-sm text-red-600">{error}</p>}
              {info && <p className="text-sm text-brand-text-secondary">{info}</p>}

              {step === "email" && (
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full px-6 py-3 bg-brand-accent text-white rounded-lg font-semibold disabled:opacity-70 cursor-pointer"
                >
                  {submitting ? "Verifica..." : "Continua"}
                </button>
              )}

              {step === "login" && (
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full px-6 py-3 bg-brand-accent text-white rounded-lg font-semibold disabled:opacity-70 cursor-pointer"
                >
                  {submitting ? "Accesso..." : "Entra"}
                </button>
              )}

              {step === "setupPassword" && (
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full px-6 py-3 bg-brand-accent text-white rounded-lg font-semibold disabled:opacity-70 cursor-pointer"
                >
                  {submitting ? "Salvataggio..." : "Imposta password"}
                </button>
              )}

              <div className="text-sm text-brand-text-secondary">
                Non hai un profilo?
                <Link to="/register" className="underline ml-1">
                  Registrati
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
