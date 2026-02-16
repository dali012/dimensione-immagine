import { SEO } from "@/components/SEO/SEO";
import {
  CheckCircle2,
  RefreshCw,
  Send,
  ShieldCheck,
  XCircle,
} from "lucide-react";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

type ListFilter = "pending" | "approved" | "all";

type WholesaleItem = {
  id: number;
  name: string;
  surname: string;
  phone: string;
  email: string;
  createdAt: string;
  approvedAt: string | null;
  verifiedAt: string | null;
  isApproved: boolean;
  hasPassword: boolean;
  status:
    | "not_found"
    | "pending_approval"
    | "approved_password_required"
    | "approved_setup_required";
};

type ListResponse = {
  items?: WholesaleItem[];
  counts?: {
    pending: number;
    approved: number;
    setupRequired: number;
  };
  pagination?: {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
  error?: string;
};

const TOKEN_STORAGE_KEY = "wholesale_admin_token";

function formatDate(value: string | null) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleString("it-IT");
}

function statusLabel(item: WholesaleItem) {
  switch (item.status) {
    case "pending_approval":
      return "In attesa";
    case "approved_setup_required":
      return "Approvato - setup password";
    case "approved_password_required":
      return "Attivo";
    default:
      return item.status;
  }
}

async function parseJsonSafe<T>(response: Response) {
  const text = await response.text();
  if (!text) return {} as T;
  try {
    return JSON.parse(text) as T;
  } catch {
    return {} as T;
  }
}

export const WholesaleAdmin: React.FC = () => {
  const [tokenInput, setTokenInput] = useState("");
  const [adminToken, setAdminToken] = useState("");
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<ListFilter>("pending");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [items, setItems] = useState<WholesaleItem[]>([]);
  const [counts, setCounts] = useState({
    pending: 0,
    approved: 0,
    setupRequired: 0,
  });
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 20,
    totalItems: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [actionEmail, setActionEmail] = useState<string | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem(TOKEN_STORAGE_KEY) || "";
    if (stored) {
      setAdminToken(stored);
      setTokenInput(stored);
    }
  }, []);

  const fetchList = useCallback(
    async (
      token: string,
      filter: ListFilter,
      q: string,
      currentPage: number,
      currentPageSize: number,
    ) => {
      if (!token) return;
      setLoading(true);
      setError(null);

      const url = new URL(
        "/api/wholesale-auth-approve",
        window.location.origin,
      );
      url.searchParams.set("status", filter);
      if (q.trim()) url.searchParams.set("q", q.trim());
      url.searchParams.set("page", String(currentPage));
      url.searchParams.set("pageSize", String(currentPageSize));

      try {
        const response = await fetch(url.toString(), {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await parseJsonSafe<ListResponse>(response);

        if (!response.ok) {
          if (response.status === 401) {
            sessionStorage.removeItem(TOKEN_STORAGE_KEY);
            setAdminToken("");
            setTokenInput("");
            setItems([]);
            setPagination({
              page: 1,
              pageSize: currentPageSize,
              totalItems: 0,
              totalPages: 0,
              hasNextPage: false,
              hasPrevPage: false,
            });
            setError("Token admin non valido.");
            return;
          }
          setError(data.error || "Impossibile caricare le richieste.");
          return;
        }

        setItems(data.items || []);
        if (data.counts) setCounts(data.counts);
        if (data.pagination) {
          setPagination(data.pagination);
          if (data.pagination.page !== currentPage) {
            setPage(data.pagination.page);
          }
        }
      } catch {
        setError("Errore di rete durante il caricamento.");
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    if (!adminToken) return;
    fetchList(adminToken, activeFilter, query, page, pageSize);
  }, [adminToken, activeFilter, page, pageSize, fetchList]);

  const approveAction = async (
    item: WholesaleItem,
    approved: boolean,
    sendSetupLink = false,
  ) => {
    if (!adminToken) return;
    setActionEmail(item.email);

    try {
      const response = await fetch("/api/wholesale-auth-approve", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${adminToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: item.email,
          approved,
          sendSetupLink,
        }),
      });
      const data = await parseJsonSafe<{ error?: string }>(response);

      if (!response.ok) {
        if (response.status === 401) {
          sessionStorage.removeItem(TOKEN_STORAGE_KEY);
          setAdminToken("");
          setTokenInput("");
          setItems([]);
          setPagination({
            page: 1,
            pageSize,
            totalItems: 0,
            totalPages: 0,
            hasNextPage: false,
            hasPrevPage: false,
          });
          setError("Token admin non valido.");
          return;
        }
        toast.error(data.error || "Operazione non riuscita.");
        return;
      }

      toast.success(
        approved
          ? sendSetupLink
            ? "Profilo approvato e link setup inviato."
            : "Profilo approvato."
          : "Profilo riportato in attesa.",
      );
      await fetchList(adminToken, activeFilter, query, page, pageSize);
    } catch {
      toast.error("Errore di rete durante l'operazione.");
    } finally {
      setActionEmail(null);
    }
  };

  const handleSaveToken = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = tokenInput.trim();
    if (!trimmed) {
      setError("Inserisci il token admin.");
      return;
    }

    sessionStorage.setItem(TOKEN_STORAGE_KEY, trimmed);
    setAdminToken(trimmed);
    setPage(1);
    await fetchList(trimmed, activeFilter, query, 1, pageSize);
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminToken) return;
    setPage(1);
    await fetchList(adminToken, activeFilter, query, 1, pageSize);
  };

  const statusPillClass = useMemo(
    () => ({
      pending_approval: "bg-amber-100 text-amber-800",
      approved_setup_required: "bg-blue-100 text-blue-800",
      approved_password_required: "bg-green-100 text-green-800",
      not_found: "bg-gray-100 text-gray-700",
    }),
    [],
  );

  return (
    <div className="pt-24 min-h-screen bg-brand-bg text-brand-text-primary">
      <SEO
        title="Admin Richieste B2B | Dimensione Immagine"
        description="Pannello amministrazione richieste distribuzione ingrosso."
        url="https://www.dimensioneimmagineabbigliamento.it/admin-wholesale"
      />

      <section className="container mx-auto px-6 py-10 max-w-6xl">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-brand-accent font-semibold">
            <ShieldCheck size={16} />
            Admin
          </div>
          <h1 className="text-3xl md:text-4xl font-serif mt-2">
            Gestione Richieste B2B
          </h1>
        </div>

        <form
          onSubmit={handleSaveToken}
          className="bg-white border border-brand-border rounded-xl p-5 mb-6"
        >
          <label className="block text-xs uppercase tracking-wide text-brand-text-secondary mb-2">
            Token Admin
          </label>
          <div className="flex flex-col md:flex-row gap-3">
            <input
              type="password"
              value={tokenInput}
              onChange={(e) => setTokenInput(e.target.value)}
              placeholder="Inserisci WHOLESALE_AUTH_ADMIN_TOKEN"
              className="flex-1 p-3 border border-brand-border rounded"
              required
            />
            <button className="px-5 py-3 bg-brand-accent text-white rounded-lg font-semibold cursor-pointer">
              Salva Token
            </button>
            {adminToken && (
              <button
                type="button"
                onClick={() => {
                  sessionStorage.removeItem(TOKEN_STORAGE_KEY);
                  setTokenInput("");
                  setAdminToken("");
                  setItems([]);
                  setPage(1);
                  setError(null);
                }}
                className="px-5 py-3 border border-brand-border rounded-lg font-semibold cursor-pointer"
              >
                Disconnetti
              </button>
            )}
          </div>
        </form>

        {adminToken && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <StatCard label="In attesa" value={counts.pending} />
              <StatCard label="Approvati" value={counts.approved} />
              <StatCard label="Setup password" value={counts.setupRequired} />
            </div>

            <form
              onSubmit={handleSearch}
              className="bg-white border border-brand-border rounded-xl p-5 mb-6"
            >
              <div className="flex flex-col md:flex-row md:items-end gap-4">
                <div className="flex-1">
                  <label className="block text-xs uppercase tracking-wide text-brand-text-secondary mb-2">
                    Cerca
                  </label>
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Email, nome, cognome o telefono"
                    className="w-full p-3 border border-brand-border rounded"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wide text-brand-text-secondary mb-2">
                    Filtro
                  </label>
                  <select
                    value={activeFilter}
                    onChange={(e) => {
                      setActiveFilter(e.target.value as ListFilter);
                      setPage(1);
                    }}
                    className="p-3 border border-brand-border rounded min-w-45"
                  >
                    <option value="pending">Solo in attesa</option>
                    <option value="approved">Solo approvati</option>
                    <option value="all">Tutti</option>
                  </select>
                </div>

                <button className="px-5 py-3 bg-brand-accent text-white rounded-lg font-semibold cursor-pointer">
                  Cerca
                </button>
                <button
                  type="button"
                  onClick={() =>
                    fetchList(adminToken, activeFilter, query, page, pageSize)
                  }
                  className="px-5 py-3 border border-brand-border rounded-lg font-semibold inline-flex items-center gap-2 cursor-pointer"
                >
                  <RefreshCw size={16} />
                  Aggiorna
                </button>
              </div>
            </form>

            {error && (
              <div className="mb-5 p-4 rounded-lg bg-red-50 text-red-700 border border-red-200">
                {error}
              </div>
            )}

            <div className="space-y-4">
              {loading && (
                <div className="p-4 bg-white border border-brand-border rounded-xl text-brand-text-secondary">
                  Caricamento richieste...
                </div>
              )}

              {!loading && items.length === 0 && (
                <div className="p-4 bg-white border border-brand-border rounded-xl text-brand-text-secondary">
                  Nessuna richiesta trovata.
                </div>
              )}

              {!loading &&
                items.map((item) => {
                  const busy = actionEmail === item.email;
                  return (
                    <div
                      key={item.id}
                      className="bg-white border border-brand-border rounded-xl p-5"
                    >
                      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                        <div>
                          <h3 className="text-lg font-semibold">
                            {item.name} {item.surname}
                          </h3>
                          <p className="text-sm text-brand-text-secondary">
                            {item.email}
                          </p>
                          <p className="text-sm text-brand-text-secondary">
                            {item.phone}
                          </p>
                          <div className="mt-2 text-xs text-brand-text-secondary">
                            Creato: {formatDate(item.createdAt)}
                          </div>
                        </div>

                        <div className="lg:text-right">
                          <span
                            className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${statusPillClass[item.status]}`}
                          >
                            {statusLabel(item)}
                          </span>
                          <div className="mt-2 text-xs text-brand-text-secondary">
                            Approvato: {formatDate(item.approvedAt)}
                          </div>
                          <div className="text-xs text-brand-text-secondary">
                            Verificato: {formatDate(item.verifiedAt)}
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-2">
                        <button
                          type="button"
                          disabled={busy}
                          onClick={() => approveAction(item, true, false)}
                          className="px-4 py-2 rounded border border-green-600 text-green-700 hover:bg-green-50 inline-flex items-center gap-2 text-sm font-semibold disabled:opacity-60 cursor-pointer"
                        >
                          <CheckCircle2 size={16} />
                          Approva
                        </button>
                        <button
                          type="button"
                          disabled={busy}
                          onClick={() => approveAction(item, true, true)}
                          className="px-4 py-2 rounded border border-blue-600 text-blue-700 hover:bg-blue-50 inline-flex items-center gap-2 text-sm font-semibold disabled:opacity-60 cursor-pointer"
                        >
                          <Send size={16} />
                          Approva + Invia setup
                        </button>
                        <button
                          type="button"
                          disabled={busy}
                          onClick={() => approveAction(item, false, false)}
                          className="px-4 py-2 rounded border border-red-600 text-red-700 hover:bg-red-50 inline-flex items-center gap-2 text-sm font-semibold disabled:opacity-60 cursor-pointer"
                        >
                          <XCircle size={16} />
                          Rimetti in attesa
                        </button>
                      </div>
                    </div>
                  );
                })}
            </div>

            <div className="mt-6 bg-white border border-brand-border rounded-xl p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="text-sm text-brand-text-secondary">
                {pagination.totalItems > 0
                  ? `Pagina ${pagination.page} di ${Math.max(
                      pagination.totalPages,
                      1,
                    )} - ${pagination.totalItems} richieste`
                  : "Nessuna richiesta"}
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <label className="text-xs uppercase tracking-wide text-brand-text-secondary">
                  Righe
                </label>
                <select
                  value={pageSize}
                  onChange={(e) => {
                    const nextSize = Number.parseInt(e.target.value, 10) || 20;
                    setPageSize(nextSize);
                    setPage(1);
                  }}
                  className="p-2 border border-brand-border rounded"
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>

                <button
                  type="button"
                  onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                  disabled={!pagination.hasPrevPage || loading}
                  className="px-3 py-2 border border-brand-border rounded text-sm font-semibold disabled:opacity-50 cursor-pointer"
                >
                  Precedente
                </button>

                <button
                  type="button"
                  onClick={() => setPage((prev) => prev + 1)}
                  disabled={!pagination.hasNextPage || loading}
                  className="px-3 py-2 border border-brand-border rounded text-sm font-semibold disabled:opacity-50 cursor-pointer"
                >
                  Successiva
                </button>
              </div>
            </div>
          </>
        )}
      </section>
    </div>
  );
};

const StatCard: React.FC<{ label: string; value: number }> = ({
  label,
  value,
}) => (
  <div className="bg-white border border-brand-border rounded-xl p-4">
    <p className="text-xs uppercase tracking-wide text-brand-text-secondary mb-2">
      {label}
    </p>
    <p className="text-3xl font-serif">{value}</p>
  </div>
);

export default WholesaleAdmin;
