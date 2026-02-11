import React, { useEffect, useMemo, useRef, useState } from "react";
import { jsPDF } from "jspdf";
import { useLocation } from "react-router-dom";
import { PageTransition } from "../components/Layout/PageTransition";
import { SEO } from "@/components/SEO/SEO";
import { Reveal } from "@/components/UI/Reveal";
import {
  getActiveJobPositions,
  type JobPositionOffer,
} from "../sanity/jobPositions";

const inputClasses =
  "w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-[#b89b5e] focus:ring-1 focus:ring-[#b89b5e] transition-all";

type SkillLevel = "none" | "basic" | "intermediate" | "advanced" | "expert";

const SKILL_LEVELS: { value: SkillLevel; label: string }[] = [
  { value: "none", label: "Nessuna conoscenza" },
  { value: "basic", label: "Base" },
  { value: "intermediate", label: "Intermedio" },
  { value: "advanced", label: "Avanzato" },
  { value: "expert", label: "Esperto" },
];

const FALLBACK_POSITIONS: JobPositionOffer[] = [
  {
    id: "fallback-commessa",
    title: "Commessa / Commesso",
    tasks: [
      {
        id: "accoglienza",
        label: "Accoglienza cliente in negozio",
        required: true,
        order: 1,
      },
      {
        id: "vendita",
        label: "Assistenza alla vendita",
        required: true,
        order: 2,
      },
      {
        id: "cassa",
        label: "Gestione cassa e pagamenti",
        required: true,
        order: 3,
      },
      {
        id: "riordino",
        label: "Riordino e presentazione reparto",
        required: false,
        order: 4,
      },
    ],
  },
  {
    id: "fallback-responsabile",
    title: "Responsabile di Negozio",
    tasks: [
      {
        id: "coordinamento",
        label: "Coordinamento team vendita",
        required: true,
        order: 1,
      },
      {
        id: "kpi",
        label: "Gestione KPI e obiettivi",
        required: true,
        order: 2,
      },
      {
        id: "turni",
        label: "Organizzazione turni",
        required: true,
        order: 3,
      },
      {
        id: "criticita",
        label: "Gestione criticita clienti",
        required: false,
        order: 4,
      },
    ],
  },
  {
    id: "fallback-spontanea",
    title: "Candidatura Spontanea",
    tasks: [
      {
        id: "relazione",
        label: "Relazione con il cliente",
        required: true,
        order: 1,
      },
      {
        id: "organizzazione",
        label: "Organizzazione e precisione",
        required: true,
        order: 2,
      },
      {
        id: "problem-solving",
        label: "Problem solving",
        required: false,
        order: 3,
      },
      {
        id: "team",
        label: "Lavoro in team",
        required: true,
        order: 4,
      },
    ],
  },
];

type TaskRatingItem = {
  task: string;
  level: SkillLevel;
};

const levelToLabel = (value: SkillLevel) =>
  SKILL_LEVELS.find((level) => level.value === value)?.label || value;

const sanitizeFileNamePart = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");

function buildApplicationPdf(data: {
  firstName: string;
  lastName: string;
  age: string;
  city: string;
  email: string;
  phone: string;
  position: string;
  presentation: string;
  taskRatings: TaskRatingItem[];
}) {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const marginX = 44;
  const marginTop = 44;
  const lineHeight = 18;
  const bottomMargin = 44;
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const contentWidth = pageWidth - marginX * 2;
  let y = marginTop;

  const ensureSpace = (needed = lineHeight) => {
    if (y + needed > pageHeight - bottomMargin) {
      doc.addPage();
      y = marginTop;
    }
  };

  const addTitle = (text: string) => {
    ensureSpace(lineHeight * 2);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text(text, marginX, y);
    y += 24;
  };

  const addParagraph = (text: string) => {
    const lines = doc.splitTextToSize(text, contentWidth);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    for (const line of lines) {
      ensureSpace(lineHeight);
      doc.text(line, marginX, y);
      y += lineHeight;
    }
  };

  const addLabeledLine = (label: string, value: string) => {
    const line = `${label}: ${value}`;
    addParagraph(line);
  };

  addTitle("Candidatura - Dimensione Immagine");
  addParagraph(`Data invio: ${new Date().toLocaleString("it-IT")}`);
  y += 6;

  addTitle("Dati Anagrafici");
  addLabeledLine("Nome", data.firstName);
  addLabeledLine("Cognome", data.lastName);
  addLabeledLine("Eta", data.age);
  addLabeledLine("Citta", data.city);
  addLabeledLine("Email", data.email);
  addLabeledLine("Telefono", data.phone);
  addLabeledLine("Posizione desiderata", data.position);
  y += 6;

  addTitle("Autovalutazione Competenze");
  data.taskRatings.forEach((entry, index) => {
    addLabeledLine(`${index + 1}. ${entry.task}`, levelToLabel(entry.level));
  });
  y += 6;

  addTitle("Presentazione");
  addParagraph(data.presentation || "Nessuna presentazione inserita.");

  return doc.output("blob");
}

const LavoraConNoi: React.FC = () => {
  const location = useLocation();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [age, setAge] = useState("");
  const [city, setCity] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [position, setPosition] = useState("");
  const [positions, setPositions] = useState<JobPositionOffer[]>([]);
  const [positionsLoaded, setPositionsLoaded] = useState(false);
  const [presentation, setPresentation] = useState("");
  const [taskRatings, setTaskRatings] = useState<Record<string, SkillLevel>>(
    {},
  );
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);

  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [feedbackMsg, setFeedbackMsg] = useState("");
  const [deleteStatus, setDeleteStatus] = useState<
    "idle" | "deleting" | "deleted" | "error"
  >("idle");

  const recaptchaContainerRef = useRef<HTMLDivElement>(null);
  const recaptchaWidgetIdRef = useRef<number | null>(null);
  const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY as
    | string
    | undefined;

  useEffect(() => {
    if (!siteKey) return;
    let mounted = true;
    const scriptId = "recaptcha-v2";
    let retryTimer: number | null = null;

    const renderWidget = () => {
      if (
        !mounted ||
        !window.grecaptcha ||
        typeof window.grecaptcha.render !== "function" ||
        !recaptchaContainerRef.current ||
        recaptchaWidgetIdRef.current !== null
      ) {
        return false;
      }

      recaptchaWidgetIdRef.current = window.grecaptcha.render(
        recaptchaContainerRef.current,
        {
          sitekey: siteKey,
          callback: (token: string) => setRecaptchaToken(token),
          "expired-callback": () => setRecaptchaToken(null),
          "error-callback": () => setRecaptchaToken(null),
        },
      );
      return true;
    };

    const waitAndRender = (attempt = 0) => {
      if (!mounted) return;
      if (renderWidget()) return;
      if (attempt >= 30) return;
      retryTimer = window.setTimeout(() => waitAndRender(attempt + 1), 150);
    };

    if (window.grecaptcha && typeof window.grecaptcha.render === "function") {
      waitAndRender();
    } else {
      if (window.grecaptcha && typeof window.grecaptcha.render !== "function") {
        delete (window as any).grecaptcha;
      }

      const existing = document.getElementById(scriptId);
      if (!existing) {
        const script = document.createElement("script");
        script.id = scriptId;
        script.src = "https://www.google.com/recaptcha/api.js?render=explicit";
        script.async = true;
        script.defer = true;
        script.onload = () => waitAndRender();
        document.head.appendChild(script);
      } else {
        waitAndRender();
      }
    }

    return () => {
      mounted = false;
      if (retryTimer !== null) {
        window.clearTimeout(retryTimer);
      }
      recaptchaWidgetIdRef.current = null;
      setRecaptchaToken(null);
      if (recaptchaContainerRef.current) {
        recaptchaContainerRef.current.innerHTML = "";
      }
      document.getElementById(scriptId)?.remove();
      document.querySelectorAll(".grecaptcha-badge").forEach((el) => el.remove());
    };
  }, [siteKey]);

  useEffect(() => {
    let mounted = true;
    getActiveJobPositions()
      .then((items) => {
        if (!mounted) return;
        setPositionsLoaded(true);
        const source = items.length > 0 ? items : FALLBACK_POSITIONS;
        setPositions(source);
        setPosition(source[0]?.title || "");
      })
      .catch(() => {
        if (!mounted) return;
        setPositionsLoaded(true);
        setPositions(FALLBACK_POSITIONS);
        setPosition(FALLBACK_POSITIONS[0].title);
      });

    return () => {
      mounted = false;
    };
  }, []);

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

  const selectedPosition = useMemo(
    () => positions.find((item) => item.title === position) || null,
    [positions, position],
  );

  useEffect(() => {
    const currentTasks = selectedPosition?.tasks || [];
    setTaskRatings((previous) => {
      const next: Record<string, SkillLevel> = {};
      currentTasks.forEach((task) => {
        next[task.id] = previous[task.id] || "none";
      });
      return next;
    });
  }, [selectedPosition]);

  const handleTaskLevelChange = (taskId: string, level: SkillLevel) => {
    setTaskRatings((previous) => ({ ...previous, [taskId]: level }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "submitting") return;

    if (
      !firstName.trim() ||
      !lastName.trim() ||
      !age.trim() ||
      !city.trim() ||
      !email.trim() ||
      !phone.trim() ||
      !position.trim()
    ) {
      setStatus("error");
      setFeedbackMsg("Compila tutti i campi obbligatori.");
      return;
    }

    const ageValue = Number(age);
    if (!Number.isFinite(ageValue) || ageValue < 16 || ageValue > 100) {
      setStatus("error");
      setFeedbackMsg("Inserisci un'eta valida (16-100).");
      return;
    }

    if (!selectedPosition || selectedPosition.tasks.length === 0) {
      setStatus("error");
      setFeedbackMsg(
        "Nessun task disponibile per questa posizione. Contattaci per assistenza.",
      );
      return;
    }

    const missingRequiredTask = selectedPosition.tasks.find(
      (task) => task.required && (taskRatings[task.id] || "none") === "none",
    );
    if (missingRequiredTask) {
      setStatus("error");
      setFeedbackMsg(
        `Seleziona almeno un livello Base per il task obbligatorio: "${missingRequiredTask.label}".`,
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

    if (!siteKey) {
      setStatus("error");
      setFeedbackMsg("reCAPTCHA non configurato.");
      return;
    }

    if (!recaptchaToken) {
      setStatus("error");
      setFeedbackMsg("Conferma di non essere un robot.");
      return;
    }

    setStatus("submitting");
    setFeedbackMsg("");

    try {
      const taskRatingsPayload: TaskRatingItem[] = selectedPosition.tasks.map(
        (task) => ({
          task: task.label,
          level: taskRatings[task.id] || "none",
        }),
      );

      const pdfBlob = buildApplicationPdf({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        age: age.trim(),
        city: city.trim(),
        email: email.trim(),
        phone: phone.trim(),
        position: position.trim(),
        presentation: presentation.trim(),
        taskRatings: taskRatingsPayload,
      });

      const pdfFileName = `candidatura-${sanitizeFileNamePart(firstName)}-${sanitizeFileNamePart(lastName)}.pdf`;
      const generatedPdf = new File([pdfBlob], pdfFileName, {
        type: "application/pdf",
      });

      const fd = new FormData();
      fd.append("name", firstName.trim());
      fd.append("surname", lastName.trim());
      fd.append("age", age.trim());
      fd.append("city", city.trim());
      fd.append("email", email.trim());
      fd.append("phone", phone.trim());
      fd.append("position", position.trim());
      fd.append("message", presentation.trim());
      fd.append("taskRatings", JSON.stringify(taskRatingsPayload));
      fd.append("recaptchaToken", recaptchaToken);
      fd.append("cv", generatedPdf);

      const res = await fetch("/api/lavora-con-noi", {
        method: "POST",
        body: fd,
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        if (window.grecaptcha && recaptchaWidgetIdRef.current !== null) {
          window.grecaptcha.reset(recaptchaWidgetIdRef.current);
        }
        setRecaptchaToken(null);
        throw new Error(data?.error || "Invio non riuscito. Riprova.");
      }

      setStatus("success");
      setFeedbackMsg(
        "Grazie! La tua candidatura e stata inviata con successo.",
      );

      setFirstName("");
      setLastName("");
      setAge("");
      setCity("");
      setEmail("");
      setPhone("");
      setPresentation("");
      setPrivacyAccepted(false);
      if (window.grecaptcha && recaptchaWidgetIdRef.current !== null) {
        window.grecaptcha.reset(recaptchaWidgetIdRef.current);
      }
      setRecaptchaToken(null);
    } catch (error: any) {
      setStatus("error");
      setFeedbackMsg(error?.message || "Si e verificato un errore. Riprova.");
    }
  };

  const showNoPositions = positionsLoaded && positions.length === 0;

  return (
    <PageTransition>
      <div className="pt-24 min-h-screen bg-gray-50 text-gray-900">
        <SEO
          title="Lavora con Noi | Dimensione Immagine"
          description="Scegli una posizione, completa le competenze richieste e invia la candidatura."
          url={`https://www.dimensioneimmagineabbigliamento.it/lavora-con-noi`}
          image="/og-sedi.jpg"
        />

        <section className="container mx-auto px-6 py-12 md:py-20">
          <Reveal width="100%">
            <div className="text-center mb-10">
              <span className="text-brand-gold font-medium tracking-widest uppercase text-sm mb-2 block">
                Carriere
              </span>
              <h1 className="text-3xl md:text-5xl font-serif mb-4">
                Lavora con Dimensione Immagine
              </h1>
              <p className="text-gray-600 max-w-3xl mx-auto">
                Scegli la posizione, autovaluta le competenze richieste e invia
                la candidatura. Il sistema genera automaticamente un PDF
                riepilogativo che sostituisce il caricamento CV.
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
            <div className="max-w-4xl mx-auto bg-white p-8 md:p-10 rounded-2xl shadow-xl border-t-4 border-brand-gold">
              <div className="mb-8">
                <p className="text-xs tracking-widest uppercase text-brand-gold font-semibold mb-2">
                  Step 1
                </p>
                <label
                  htmlFor="position"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Scegli il tipo di posizione *
                </label>
                <div className="relative">
                  <select
                    id="position"
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                    className={`${inputClasses} appearance-none cursor-pointer pr-10 h-12 leading-[1.2]`}
                    disabled={status === "submitting" || showNoPositions}
                  >
                    {positions.map((p) => (
                      <option key={p.id} value={p.title}>
                        {p.title}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-brand-gold">
                    <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                      <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                    </svg>
                  </div>
                </div>
                {showNoPositions && (
                  <p className="mt-2 text-xs text-red-600">
                    Al momento non ci sono posizioni aperte.
                  </p>
                )}
              </div>

              {!!selectedPosition && (
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="border-t border-gray-100 pt-8">
                    <p className="text-xs tracking-widest uppercase text-brand-gold font-semibold mb-2">
                      Step 2
                    </p>
                    <h2 className="text-xl md:text-2xl font-serif mb-5">
                      Dati Candidato
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label
                          htmlFor="firstName"
                          className="block text-sm font-semibold text-gray-700 mb-2"
                        >
                          Nome *
                        </label>
                        <input
                          id="firstName"
                          type="text"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          className={inputClasses}
                          placeholder="Mario"
                          disabled={status === "submitting"}
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="lastName"
                          className="block text-sm font-semibold text-gray-700 mb-2"
                        >
                          Cognome *
                        </label>
                        <input
                          id="lastName"
                          type="text"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          className={inputClasses}
                          placeholder="Rossi"
                          disabled={status === "submitting"}
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="age"
                          className="block text-sm font-semibold text-gray-700 mb-2"
                        >
                          Eta *
                        </label>
                        <input
                          id="age"
                          type="number"
                          min={16}
                          max={100}
                          value={age}
                          onChange={(e) => setAge(e.target.value)}
                          className={inputClasses}
                          placeholder="30"
                          disabled={status === "submitting"}
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="city"
                          className="block text-sm font-semibold text-gray-700 mb-2"
                        >
                          Citta *
                        </label>
                        <input
                          id="city"
                          type="text"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          className={inputClasses}
                          placeholder="Messina"
                          disabled={status === "submitting"}
                        />
                      </div>
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
                  </div>

                  <div className="border-t border-gray-100 pt-8">
                    <p className="text-xs tracking-widest uppercase text-brand-gold font-semibold mb-2">
                      Step 3
                    </p>
                    <h2 className="text-xl md:text-2xl font-serif mb-2">
                      Competenze per {selectedPosition.title}
                    </h2>
                    <p className="text-sm text-gray-600 mb-6">
                      Seleziona il tuo livello per ogni task, da Nessuna
                      conoscenza a Esperto.
                    </p>
                    <div className="space-y-4">
                      {selectedPosition.tasks.map((task) => (
                        <div
                          key={task.id}
                          className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6 p-4 border border-gray-200 rounded-lg"
                        >
                          <div className="my-auto">
                            <p className="text-sm text-gray-700 font-medium">
                              {task.label}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {task.required ? "Obbligatorio" : "Opzionale"}
                            </p>
                          </div>
                          <select
                            value={taskRatings[task.id] || "none"}
                            onChange={(e) =>
                              handleTaskLevelChange(
                                task.id,
                                e.target.value as SkillLevel,
                              )
                            }
                            className={`${inputClasses} h-11`}
                            disabled={status === "submitting"}
                          >
                            {SKILL_LEVELS.map((level) => (
                              <option key={level.value} value={level.value}>
                                {level.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-gray-100 pt-8">
                    <p className="text-xs tracking-widest uppercase text-brand-gold font-semibold mb-2">
                      Step 4
                    </p>
                    <label
                      htmlFor="presentation"
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      Presentazione personale *
                    </label>
                    <textarea
                      id="presentation"
                      rows={6}
                      value={presentation}
                      onChange={(e) => setPresentation(e.target.value)}
                      className={inputClasses}
                      placeholder="Raccontaci chi sei, le tue motivazioni e cosa puoi portare nel team..."
                      disabled={status === "submitting"}
                    />
                    <p className="text-xs text-gray-500 mt-2">
                      Questo testo verra incluso nel PDF finale della tua
                      candidatura.
                    </p>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex h-6 items-center">
                      <input
                        id="privacy"
                        name="privacy"
                        type="checkbox"
                        checked={privacyAccepted}
                        onChange={(e) => setPrivacyAccepted(e.target.checked)}
                        className="h-4 w-4 rounded border-gray-300 text-brand-gold focus:ring-brand-gold cursor-pointer"
                      />
                    </div>
                    <div className="text-sm leading-6">
                      <label htmlFor="privacy" className="text-gray-600">
                        Acconsento al trattamento dei dati personali secondo la{" "}
                        <a
                          href="/privacy-policy"
                          className="text-brand-gold hover:underline font-medium"
                        >
                          Privacy Policy
                        </a>
                        .
                      </label>
                    </div>
                  </div>

                  <div className="pt-1">
                    <div ref={recaptchaContainerRef} />
                  </div>

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

                  <button
                    type="submit"
                    disabled={
                      status === "submitting" ||
                      status === "success" ||
                      showNoPositions ||
                      !selectedPosition ||
                      !recaptchaToken
                    }
                    className={`w-full py-4 rounded-lg font-bold text-white uppercase tracking-wider transition-all transform hover:-translate-y-1 shadow-md hover:shadow-lg cursor-pointer ${
                      status === "submitting"
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-brand-gold hover:bg-[#a38a53]"
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
                        Generazione PDF e invio...
                      </span>
                    ) : (
                      "Invia Candidatura"
                    )}
                  </button>
                </form>
              )}
            </div>
          </Reveal>
        </section>
      </div>
    </PageTransition>
  );
};

export default LavoraConNoi;
