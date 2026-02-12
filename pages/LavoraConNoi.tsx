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
type InterestArea =
  | "commerciale-vendite"
  | "amministrativo"
  | "operativo-produzione"
  | "tecnologia-it"
  | "marketing"
  | "autista"
  | "magazzino";
type ExperienceLevel = "stage" | "junior" | "mid-level" | "senior";
type NoticePeriod = "immediata" | "15-giorni" | "30-giorni";
type EducationLevel =
  | "diploma"
  | "laurea-triennale"
  | "laurea-magistrale"
  | "master-dottorato";
type LanguageLevel = "base" | "intermedio" | "avanzato-madrelingua";

type TaskRatingItem = {
  task: string;
  level: SkillLevel;
};

type LanguageItem = {
  id: string;
  language: string;
  level: LanguageLevel;
};

type ExperienceItem = {
  id: string;
  company: string;
  role: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  responsibilities: string;
};

const SKILL_LEVELS: { value: SkillLevel; label: string }[] = [
  { value: "none", label: "Nessuna conoscenza" },
  { value: "basic", label: "Base" },
  { value: "intermediate", label: "Intermedio" },
  { value: "advanced", label: "Avanzato" },
  { value: "expert", label: "Esperto" },
];

const INTEREST_AREA_OPTIONS: { value: InterestArea; label: string }[] = [
  { value: "commerciale-vendite", label: "Commerciale/Vendite" },
  { value: "amministrativo", label: "Amministrativo" },
  { value: "operativo-produzione", label: "Operativo/Produzione" },
  { value: "tecnologia-it", label: "Tecnologia/IT" },
  { value: "marketing", label: "Marketing" },
  { value: "autista", label: "Autista" },
  { value: "magazzino", label: "Magazzino" },
];

const EXPERIENCE_LEVEL_OPTIONS: { value: ExperienceLevel; label: string }[] = [
  { value: "stage", label: "Stage" },
  { value: "junior", label: "Junior" },
  { value: "mid-level", label: "Mid-level" },
  { value: "senior", label: "Senior" },
];

const NOTICE_PERIOD_OPTIONS: { value: NoticePeriod; label: string }[] = [
  { value: "immediata", label: "Immediata" },
  { value: "15-giorni", label: "15 giorni" },
  { value: "30-giorni", label: "30 giorni" },
];

const EDUCATION_OPTIONS: { value: EducationLevel; label: string }[] = [
  { value: "diploma", label: "Diploma" },
  { value: "laurea-triennale", label: "Laurea Triennale" },
  { value: "laurea-magistrale", label: "Laurea Magistrale" },
  { value: "master-dottorato", label: "Master/Dottorato" },
];

const LANGUAGE_LEVEL_OPTIONS: { value: LanguageLevel; label: string }[] = [
  { value: "base", label: "Base" },
  { value: "intermedio", label: "Intermedio" },
  { value: "avanzato-madrelingua", label: "Avanzato/Madrelingua" },
];

const MAX_EXPERIENCES = 3;
let experienceCounter = 0;

const createEmptyExperience = (): ExperienceItem => {
  experienceCounter += 1;
  return {
    id: `exp-${experienceCounter}`,
    company: "",
    role: "",
    startDate: "",
    endDate: "",
    isCurrent: false,
    responsibilities: "",
  };
};

const getInitialExperiences = (): ExperienceItem[] => [createEmptyExperience()];

const levelToLabel = (value: SkillLevel) =>
  SKILL_LEVELS.find((level) => level.value === value)?.label || value;

const sanitizeFileNamePart = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");

function formatMonthYear(value: string) {
  if (!value) return "-";
  const [year, month] = value.split("-");
  if (!year || !month) return value;
  return `${month}/${year}`;
}

function buildApplicationPdf(data: {
  fullName: string;
  email: string;
  phone: string;
  city: string;
  linkedin: string;
  position: string;
  interestAreas: string[];
  experienceLevel: string;
  salaryExpectation: string;
  noticePeriod: string;
  educationLevel: string;
  languages: LanguageItem[];
  hardSkills: string;
  experiences: ExperienceItem[];
  professionalSummary: string;
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
    addParagraph(`${label}: ${value}`);
  };

  addTitle("Candidatura - Dimensione Immagine");
  addParagraph(`Data invio: ${new Date().toLocaleString("it-IT")}`);
  y += 6;

  addTitle("1. Dati Personali");
  addLabeledLine("Nome e Cognome", data.fullName);
  addLabeledLine("Email", data.email || "-");
  addLabeledLine("Telefono/WhatsApp", data.phone);
  addLabeledLine("Citta/Provincia", data.city);
  addLabeledLine("LinkedIn/Portfolio", data.linkedin || "-");
  addLabeledLine("Posizione", data.position);
  y += 6;

  addTitle("2. Screening Strategico");
  addLabeledLine(
    "Aree di interesse",
    data.interestAreas.length ? data.interestAreas.join(", ") : "-",
  );
  addLabeledLine("Livello esperienza", data.experienceLevel);
  addLabeledLine(
    "Aspettativa salariale",
    data.salaryExpectation ? `${data.salaryExpectation} EUR` : "-",
  );
  addLabeledLine("Disponibilita preavviso", data.noticePeriod);
  y += 6;

  addTitle("3. Formazione e Competenze");
  addLabeledLine("Titolo di studio", data.educationLevel);
  addLabeledLine(
    "Lingue straniere",
    data.languages
      .map((item) => `${item.language} (${item.level})`)
      .join(", ") || "-",
  );
  addLabeledLine("Competenze tecniche", data.hardSkills || "-");
  y += 6;

  addTitle("4. Competenze posizione");
  data.taskRatings.forEach((entry, index) => {
    addLabeledLine(`${index + 1}. ${entry.task}`, levelToLabel(entry.level));
  });
  y += 6;

  addTitle("5. Esperienze Professionali");
  const experiencesToPrint = data.experiences.filter(
    (item) =>
      item.company.trim() ||
      item.role.trim() ||
      item.startDate.trim() ||
      item.endDate.trim() ||
      item.responsibilities.trim(),
  );

  if (experiencesToPrint.length === 0) {
    addParagraph("Nessuna esperienza professionale inserita.");
  } else {
    experiencesToPrint.forEach((item, index) => {
      addLabeledLine(`Esperienza ${index + 1} - Azienda`, item.company || "-");
      addLabeledLine("Ruolo", item.role || "-");
      addLabeledLine("Data inizio", formatMonthYear(item.startDate));
      addLabeledLine(
        "Data fine",
        item.isCurrent ? "Attualmente occupato" : formatMonthYear(item.endDate),
      );
      addLabeledLine("Principali responsabilita", item.responsibilities || "-");
      y += 4;
    });
  }

  y += 6;
  addTitle("6. Riepilogo Professionale");
  addParagraph(data.professionalSummary || "-");

  return doc.output("blob");
}

const LavoraConNoi: React.FC = () => {
  const location = useLocation();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [linkedin, setLinkedin] = useState("");

  const [position, setPosition] = useState("");
  const [positions, setPositions] = useState<JobPositionOffer[]>([]);
  const [positionsLoaded, setPositionsLoaded] = useState(false);

  const [interestAreas, setInterestAreas] = useState<InterestArea[]>([]);
  const [experienceLevel, setExperienceLevel] = useState<ExperienceLevel | null>(
    null,
  );
  const [salaryExpectation, setSalaryExpectation] = useState("");
  const [noticePeriod, setNoticePeriod] = useState<NoticePeriod | null>(null);

  const [educationLevel, setEducationLevel] = useState<EducationLevel | null>(
    null,
  );
  const [languages, setLanguages] = useState<LanguageItem[]>([
    { id: "lang-1", language: "", level: "base" },
  ]);
  const [hardSkills, setHardSkills] = useState("");

  const [experiences, setExperiences] = useState<ExperienceItem[]>(
    () => getInitialExperiences(),
  );
  const [professionalSummary, setProfessionalSummary] = useState("");

  const [taskRatings, setTaskRatings] = useState<Record<string, SkillLevel>>({});
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
        setPositions(items);
        setPosition(items[0]?.title || "");
      })
      .catch(() => {
        if (!mounted) return;
        setPositionsLoaded(true);
        setPositions([]);
        setPosition("");
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

  const showNoPositions = positionsLoaded && positions.length === 0;

  const handleTaskLevelChange = (taskId: string, level: SkillLevel) => {
    setTaskRatings((previous) => ({ ...previous, [taskId]: level }));
  };

  const toggleInterestArea = (value: InterestArea) => {
    setInterestAreas((previous) =>
      previous.includes(value)
        ? previous.filter((item) => item !== value)
        : [...previous, value],
    );
  };

  const addLanguage = () => {
    setLanguages((previous) => [
      ...previous,
      { id: `lang-${Date.now()}`, language: "", level: "base" },
    ]);
  };

  const removeLanguage = (id: string) => {
    setLanguages((previous) => {
      if (previous.length <= 1) return previous;
      return previous.filter((item) => item.id !== id);
    });
  };

  const updateLanguage = (
    id: string,
    field: "language" | "level",
    value: string,
  ) => {
    setLanguages((previous) =>
      previous.map((item) =>
        item.id === id
          ? {
              ...item,
              [field]: value,
            }
          : item,
      ),
    );
  };

  const updateExperience = (
    id: string,
    field: keyof ExperienceItem,
    value: string | boolean,
  ) => {
    setExperiences((previous) =>
      previous.map((item) => {
        if (item.id !== id) return item;
        if (field === "isCurrent") {
          return {
            ...item,
            isCurrent: Boolean(value),
            endDate: value ? "" : item.endDate,
          };
        }
        return {
          ...item,
          [field]: value,
        };
      }),
    );
  };

  const addExperience = () => {
    setExperiences((previous) => {
      if (previous.length >= MAX_EXPERIENCES) return previous;
      return [...previous, createEmptyExperience()];
    });
  };

  const removeExperience = (id: string) => {
    setExperiences((previous) => {
      if (previous.length <= 1) return previous;
      return previous.filter((item) => item.id !== id);
    });
  };

  const summaryChars = professionalSummary.length;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "submitting") return;

    if (!fullName.trim() || !phone.trim() || !city.trim() || !position.trim()) {
      setStatus("error");
      setFeedbackMsg("Compila tutti i campi obbligatori dei dati personali.");
      return;
    }

    const normalizedEmail = email.trim();

    if (interestAreas.length === 0 || !experienceLevel || !noticePeriod) {
      setStatus("error");
      setFeedbackMsg("Completa la sezione di screening strategico.");
      return;
    }

    if (!salaryExpectation.trim() || Number(salaryExpectation) <= 0) {
      setStatus("error");
      setFeedbackMsg("Inserisci un'aspettativa salariale valida.");
      return;
    }

    if (!educationLevel) {
      setStatus("error");
      setFeedbackMsg("Seleziona il titolo di studio.");
      return;
    }

    const normalizedLanguages = languages
      .map((item) => ({
        ...item,
        language: item.language.trim(),
      }))
      .filter((item) => item.language.length > 0);

    if (normalizedLanguages.length === 0) {
      setStatus("error");
      setFeedbackMsg("Inserisci almeno una lingua straniera.");
      return;
    }

    if (!hardSkills.trim()) {
      setStatus("error");
      setFeedbackMsg("Inserisci le competenze tecniche principali.");
      return;
    }

    const normalizedExperiences = experiences.map((item) => ({
      ...item,
      company: item.company.trim(),
      role: item.role.trim(),
      startDate: item.startDate.trim(),
      endDate: item.endDate.trim(),
      responsibilities: item.responsibilities.trim(),
    }));

    const hasAtLeastOneExperience = normalizedExperiences.some(
      (item) =>
        item.company ||
        item.role ||
        item.startDate ||
        item.endDate ||
        item.responsibilities,
    );

    if (!hasAtLeastOneExperience) {
      setStatus("error");
      setFeedbackMsg("Compila almeno una esperienza professionale.");
      return;
    }

    const invalidExperience = normalizedExperiences.find((item) => {
      const hasAnyField =
        item.company ||
        item.role ||
        item.startDate ||
        item.endDate ||
        item.responsibilities;
      if (!hasAnyField) return false;

      if (!item.company || !item.role || !item.startDate || !item.responsibilities) {
        return true;
      }

      if (!item.isCurrent && !item.endDate) {
        return true;
      }

      return false;
    });

    if (invalidExperience) {
      setStatus("error");
      setFeedbackMsg(
        "Ogni esperienza compilata deve includere azienda, ruolo, data inizio, responsabilita e data fine (o Attualmente occupato).",
      );
      return;
    }

    if (!professionalSummary.trim() || professionalSummary.trim().length > 500) {
      setStatus("error");
      setFeedbackMsg(
        "Il riepilogo professionale e obbligatorio e deve essere massimo 500 caratteri.",
      );
      return;
    }

    if (!selectedPosition || selectedPosition.tasks.length === 0) {
      setStatus("error");
      setFeedbackMsg(
        "Nessuna competenza disponibile per questa posizione. Aggiorna la posizione in Sanity.",
      );
      return;
    }

    const missingRequiredTask = selectedPosition.tasks.find(
      (task) => task.required && (taskRatings[task.id] || "none") === "none",
    );
    if (missingRequiredTask) {
      setStatus("error");
      setFeedbackMsg(
        `Seleziona almeno un livello Base per la competenza obbligatoria: "${missingRequiredTask.label}".`,
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

      const normalizedInterestAreas = INTEREST_AREA_OPTIONS.filter((opt) =>
        interestAreas.includes(opt.value),
      ).map((opt) => opt.label);

      const pdfBlob = buildApplicationPdf({
        fullName: fullName.trim(),
        email: normalizedEmail,
        phone: phone.trim(),
        city: city.trim(),
        linkedin: linkedin.trim(),
        position: position.trim(),
        interestAreas: normalizedInterestAreas,
        experienceLevel:
          EXPERIENCE_LEVEL_OPTIONS.find((opt) => opt.value === experienceLevel)
            ?.label || "-",
        salaryExpectation: salaryExpectation.trim(),
        noticePeriod:
          NOTICE_PERIOD_OPTIONS.find((opt) => opt.value === noticePeriod)?.label ||
          "-",
        educationLevel:
          EDUCATION_OPTIONS.find((opt) => opt.value === educationLevel)?.label ||
          "-",
        languages: normalizedLanguages,
        hardSkills: hardSkills.trim(),
        experiences: normalizedExperiences,
        professionalSummary: professionalSummary.trim(),
        taskRatings: taskRatingsPayload,
      });

      const fileSafeName = sanitizeFileNamePart(fullName) || "candidato";
      const pdfFileName = `candidatura-${fileSafeName}.pdf`;
      const generatedPdf = new File([pdfBlob], pdfFileName, {
        type: "application/pdf",
      });

      const fd = new FormData();
      fd.append("name", fullName.trim());
      fd.append("fullName", fullName.trim());
      fd.append("surname", "");
      fd.append("age", "");
      fd.append("city", city.trim());
      fd.append("email", normalizedEmail);
      fd.append("phone", phone.trim());
      fd.append("position", position.trim());
      fd.append(
        "experience",
        `${
          EXPERIENCE_LEVEL_OPTIONS.find((opt) => opt.value === experienceLevel)
            ?.label || ""
        } | Preavviso: ${
          NOTICE_PERIOD_OPTIONS.find((opt) => opt.value === noticePeriod)?.label ||
          ""
        }`,
      );
      fd.append("linkedin", linkedin.trim());
      fd.append("interestAreas", JSON.stringify(normalizedInterestAreas));
      fd.append("experienceLevel", experienceLevel || "");
      fd.append("salaryExpectation", salaryExpectation.trim());
      fd.append("noticePeriod", noticePeriod || "");
      fd.append("educationLevel", educationLevel || "");
      fd.append("languages", JSON.stringify(normalizedLanguages));
      fd.append("hardSkills", hardSkills.trim());
      fd.append("experiences", JSON.stringify(normalizedExperiences));
      fd.append("professionalSummary", professionalSummary.trim());
      fd.append("message", professionalSummary.trim());
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
      setFeedbackMsg("Grazie! La tua candidatura e stata inviata con successo.");

      setFullName("");
      setEmail("");
      setPhone("");
      setCity("");
      setLinkedin("");
      setInterestAreas([]);
      setExperienceLevel(null);
      setSalaryExpectation("");
      setNoticePeriod(null);
      setEducationLevel(null);
      setLanguages([{ id: "lang-1", language: "", level: "base" }]);
      setHardSkills("");
      setExperiences(getInitialExperiences());
      setProfessionalSummary("");
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

  return (
    <PageTransition>
      <div className="pt-24 min-h-screen bg-gray-50 text-gray-900">
        <SEO
          title="Lavora con Noi | Dimensione Immagine"
          description="Compila il form di candidatura e autovaluta le competenze richieste per la posizione."
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
                Compila il modulo di candidatura e seleziona il tuo livello per
                le competenze richieste dalla posizione.
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
            <div className="max-w-5xl mx-auto bg-white p-8 md:p-10 rounded-2xl shadow-xl border-t-4 border-brand-gold">
              {showNoPositions ? (
                <div className="text-center py-8">
                  <h2 className="text-xl md:text-2xl font-serif mb-2">
                    Nessuna posizione disponibile
                  </h2>
                  <p className="text-sm text-gray-600">
                    Non sono presenti offerte attive in Sanity. Aggiungi una
                    posizione e almeno una competenza per abilitare il form.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div>
                    <p className="text-xs tracking-widest uppercase text-brand-gold font-semibold mb-2">
                      Step 1
                    </p>
                    <label
                      htmlFor="position"
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      Posizione aperta *
                    </label>
                    <select
                      id="position"
                      value={position}
                      onChange={(e) => setPosition(e.target.value)}
                      className={`${inputClasses} h-12`}
                      disabled={status === "submitting"}
                    >
                      {positions.map((p) => (
                        <option key={p.id} value={p.title}>
                          {p.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="border-t border-gray-100 pt-8">
                    <p className="text-xs tracking-widest uppercase text-brand-gold font-semibold mb-2">
                      Step 2
                    </p>
                    <h2 className="text-xl md:text-2xl font-serif mb-5">
                      1. Dati Personali
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label
                          htmlFor="fullName"
                          className="block text-sm font-semibold text-gray-700 mb-2"
                        >
                          Nome e Cognome *
                        </label>
                        <input
                          id="fullName"
                          type="text"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className={inputClasses}
                          placeholder="Mario Rossi"
                          disabled={status === "submitting"}
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="email"
                          className="block text-sm font-semibold text-gray-700 mb-2"
                        >
                          E-mail (opzionale)
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
                          Telefono/WhatsApp *
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
                      <div>
                        <label
                          htmlFor="city"
                          className="block text-sm font-semibold text-gray-700 mb-2"
                        >
                          Citta/Provincia *
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
                      <div className="md:col-span-2">
                        <label
                          htmlFor="linkedin"
                          className="block text-sm font-semibold text-gray-700 mb-2"
                        >
                          Link LinkedIn/Portfolio
                        </label>
                        <input
                          id="linkedin"
                          type="url"
                          value={linkedin}
                          onChange={(e) => setLinkedin(e.target.value)}
                          className={inputClasses}
                          placeholder="https://linkedin.com/in/..."
                          disabled={status === "submitting"}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-gray-100 pt-8">
                    <p className="text-xs tracking-widest uppercase text-brand-gold font-semibold mb-2">
                      Step 3
                    </p>
                    <h2 className="text-xl md:text-2xl font-serif mb-5">
                      2. Screening Strategico
                    </h2>

                    <div className="mb-6">
                      <p className="block text-sm font-semibold text-gray-700 mb-2">
                        Area di Interesse *
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                        {INTEREST_AREA_OPTIONS.map((option) => (
                          <label
                            key={option.value}
                            className="flex items-center gap-2 text-sm text-gray-700 border border-gray-200 rounded-lg px-3 py-2"
                          >
                            <input
                              type="checkbox"
                              checked={interestAreas.includes(option.value)}
                              onChange={() => toggleInterestArea(option.value)}
                              disabled={status === "submitting"}
                              className="h-4 w-4 rounded border-gray-300 text-brand-gold focus:ring-brand-gold"
                            />
                            {option.label}
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <label
                          htmlFor="experienceLevel"
                          className="block text-sm font-semibold text-gray-700 mb-2"
                        >
                          Livello di Esperienza *
                        </label>
                        <select
                          id="experienceLevel"
                          value={experienceLevel || ""}
                          onChange={(e) =>
                            setExperienceLevel(e.target.value as ExperienceLevel)
                          }
                          className={inputClasses}
                          disabled={status === "submitting"}
                        >
                          <option value="">Seleziona</option>
                          {EXPERIENCE_LEVEL_OPTIONS.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label
                          htmlFor="salaryExpectation"
                          className="block text-sm font-semibold text-gray-700 mb-2"
                        >
                          Aspettativa Salariale (EUR) *
                        </label>
                        <input
                          id="salaryExpectation"
                          type="number"
                          min={1}
                          value={salaryExpectation}
                          onChange={(e) => setSalaryExpectation(e.target.value)}
                          className={inputClasses}
                          placeholder="28000"
                          disabled={status === "submitting"}
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="noticePeriod"
                          className="block text-sm font-semibold text-gray-700 mb-2"
                        >
                          Disponibilita al preavviso *
                        </label>
                        <select
                          id="noticePeriod"
                          value={noticePeriod || ""}
                          onChange={(e) =>
                            setNoticePeriod(e.target.value as NoticePeriod)
                          }
                          className={inputClasses}
                          disabled={status === "submitting"}
                        >
                          <option value="">Seleziona</option>
                          {NOTICE_PERIOD_OPTIONS.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-gray-100 pt-8">
                    <p className="text-xs tracking-widest uppercase text-brand-gold font-semibold mb-2">
                      Step 4
                    </p>
                    <h2 className="text-xl md:text-2xl font-serif mb-5">
                      3. Formazione e Competenze
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label
                          htmlFor="education"
                          className="block text-sm font-semibold text-gray-700 mb-2"
                        >
                          Titolo di Studio *
                        </label>
                        <select
                          id="education"
                          value={educationLevel || ""}
                          onChange={(e) =>
                            setEducationLevel(e.target.value as EducationLevel)
                          }
                          className={inputClasses}
                          disabled={status === "submitting"}
                        >
                          <option value="">Seleziona</option>
                          {EDUCATION_OPTIONS.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="md:col-span-2">
                        <p className="block text-sm font-semibold text-gray-700 mb-2">
                          Lingue Straniere *
                        </p>
                        <div className="space-y-3">
                          {languages.map((item, index) => (
                            <div
                              key={item.id}
                              className="grid grid-cols-1 md:grid-cols-[1fr_220px_auto] gap-3"
                            >
                              <input
                                type="text"
                                value={item.language}
                                onChange={(e) =>
                                  updateLanguage(item.id, "language", e.target.value)
                                }
                                className={inputClasses}
                                placeholder={`Lingua ${index + 1} (es. Inglese)`}
                                disabled={status === "submitting"}
                              />
                              <select
                                value={item.level}
                                onChange={(e) =>
                                  updateLanguage(item.id, "level", e.target.value)
                                }
                                className={inputClasses}
                                disabled={status === "submitting"}
                              >
                                {LANGUAGE_LEVEL_OPTIONS.map((level) => (
                                  <option key={level.value} value={level.value}>
                                    {level.label}
                                  </option>
                                ))}
                              </select>
                              <button
                                type="button"
                                onClick={() => removeLanguage(item.id)}
                                disabled={status === "submitting" || languages.length <= 1}
                                className="px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-700 disabled:opacity-50"
                              >
                                Rimuovi
                              </button>
                            </div>
                          ))}
                        </div>
                        <button
                          type="button"
                          onClick={addLanguage}
                          disabled={status === "submitting"}
                          className="mt-3 text-sm text-brand-gold font-semibold hover:underline"
                        >
                          + Aggiungi lingua
                        </button>
                      </div>

                      <div className="md:col-span-2">
                        <label
                          htmlFor="hardSkills"
                          className="block text-sm font-semibold text-gray-700 mb-2"
                        >
                          Competenze Tecniche (Hard Skills) *
                        </label>
                        <input
                          id="hardSkills"
                          type="text"
                          value={hardSkills}
                          onChange={(e) => setHardSkills(e.target.value)}
                          className={inputClasses}
                          placeholder="Excel Avanzato, Gestione Team, Python"
                          disabled={status === "submitting"}
                        />
                      </div>
                    </div>
                  </div>

                  {!!selectedPosition && (
                    <div className="border-t border-gray-100 pt-8">
                      <p className="text-xs tracking-widest uppercase text-brand-gold font-semibold mb-2">
                        Step 5
                      </p>
                      <h2 className="text-xl md:text-2xl font-serif mb-2">
                        Competenze per {selectedPosition.title}
                      </h2>
                      <p className="text-sm text-gray-600 mb-6">
                        Queste competenze arrivano dalla posizione configurata in
                        Sanity.
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
                                {task.required ? "Obbligatoria" : "Opzionale"}
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
                  )}

                  <div className="border-t border-gray-100 pt-8">
                    <p className="text-xs tracking-widest uppercase text-brand-gold font-semibold mb-2">
                      Step 6
                    </p>
                    <h2 className="text-xl md:text-2xl font-serif mb-5">
                      4. Esperienze Professionali
                    </h2>
                    <p className="text-sm text-gray-600 mb-6">
                      Aggiungi fino a {MAX_EXPERIENCES} esperienze professionali
                      (almeno una obbligatoria).
                    </p>

                    <div className="space-y-6">
                      {experiences.map((exp, index) => (
                        <div
                          key={exp.id}
                          className="border border-gray-200 rounded-xl p-4 md:p-5"
                        >
                          <div className="mb-4 flex items-center justify-between gap-4">
                            <p className="text-sm font-semibold text-gray-700">
                              Esperienza {index + 1}
                            </p>
                            <button
                              type="button"
                              onClick={() => removeExperience(exp.id)}
                              disabled={status === "submitting" || experiences.length <= 1}
                              className="px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-700 disabled:opacity-50"
                            >
                              Rimuovi
                            </button>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-xs font-semibold text-gray-600 mb-2">
                                Azienda
                              </label>
                              <input
                                type="text"
                                value={exp.company}
                                onChange={(e) =>
                                  updateExperience(exp.id, "company", e.target.value)
                                }
                                className={inputClasses}
                                disabled={status === "submitting"}
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-semibold text-gray-600 mb-2">
                                Ruolo/Posizione
                              </label>
                              <input
                                type="text"
                                value={exp.role}
                                onChange={(e) =>
                                  updateExperience(exp.id, "role", e.target.value)
                                }
                                className={inputClasses}
                                disabled={status === "submitting"}
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-semibold text-gray-600 mb-2">
                                Data di Inizio (Mese/Anno)
                              </label>
                              <input
                                type="month"
                                value={exp.startDate}
                                onChange={(e) =>
                                  updateExperience(exp.id, "startDate", e.target.value)
                                }
                                className={inputClasses}
                                disabled={status === "submitting"}
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-semibold text-gray-600 mb-2">
                                Data di Fine (Mese/Anno)
                              </label>
                              <input
                                type="month"
                                value={exp.endDate}
                                onChange={(e) =>
                                  updateExperience(exp.id, "endDate", e.target.value)
                                }
                                className={inputClasses}
                                disabled={status === "submitting" || exp.isCurrent}
                              />
                              <label className="mt-2 inline-flex items-center gap-2 text-xs text-gray-600">
                                <input
                                  type="checkbox"
                                  checked={exp.isCurrent}
                                  onChange={(e) =>
                                    updateExperience(
                                      exp.id,
                                      "isCurrent",
                                      e.target.checked,
                                    )
                                  }
                                  className="h-4 w-4 rounded border-gray-300 text-brand-gold focus:ring-brand-gold"
                                  disabled={status === "submitting"}
                                />
                                Attualmente occupato
                              </label>
                            </div>
                            <div className="md:col-span-2">
                              <label className="block text-xs font-semibold text-gray-600 mb-2">
                                Principali Responsabilita
                              </label>
                              <textarea
                                rows={3}
                                value={exp.responsibilities}
                                onChange={(e) =>
                                  updateExperience(
                                    exp.id,
                                    "responsibilities",
                                    e.target.value,
                                  )
                                }
                                className={inputClasses}
                                disabled={status === "submitting"}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={addExperience}
                      disabled={
                        status === "submitting" ||
                        experiences.length >= MAX_EXPERIENCES
                      }
                      className="mt-4 text-sm text-brand-gold font-semibold hover:underline disabled:opacity-50 disabled:no-underline"
                    >
                      + Aggiungi esperienza
                    </button>
                  </div>

                  <div className="border-t border-gray-100 pt-8">
                    <p className="text-xs tracking-widest uppercase text-brand-gold font-semibold mb-2">
                      Step 7
                    </p>
                    <h2 className="text-xl md:text-2xl font-serif mb-3">
                      5. Riepilogo Professionale
                    </h2>
                    <label
                      htmlFor="professionalSummary"
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      Riassuma la sua carriera e perche vorrebbe lavorare con noi *
                    </label>
                    <textarea
                      id="professionalSummary"
                      rows={6}
                      value={professionalSummary}
                      onChange={(e) => setProfessionalSummary(e.target.value)}
                      className={inputClasses}
                      maxLength={500}
                      placeholder="Max 500 caratteri"
                      disabled={status === "submitting"}
                    />
                    <p className="text-xs text-gray-500 mt-2">
                      {summaryChars}/500 caratteri
                    </p>
                  </div>

                  <div className="border-t border-gray-100 pt-8">
                    <p className="text-xs tracking-widest uppercase text-brand-gold font-semibold mb-2">
                      Step 8
                    </p>
                    <h2 className="text-xl md:text-2xl font-serif mb-3">
                      6. Allegati e Privacy
                    </h2>

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
                          Autorizzo il trattamento dei miei dati personali ai fini
                          del reclutamento secondo la{" "}
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

                    <div className="pt-5">
                      <div ref={recaptchaContainerRef} />
                    </div>
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
                      status === "submitting" || status === "success" || !recaptchaToken
                    }
                    className={`w-full py-4 rounded-lg font-bold text-white uppercase tracking-wider transition-all transform hover:-translate-y-1 shadow-md hover:shadow-lg cursor-pointer ${
                      status === "submitting"
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-brand-gold hover:bg-[#a38a53]"
                    }`}
                  >
                    {status === "submitting" ? "Generazione PDF e invio..." : "Invia Candidatura"}
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
