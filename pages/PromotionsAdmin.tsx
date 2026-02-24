import { SEO } from "@/components/SEO/SEO";
import { useAuth } from "@/contexts/AuthContext";
import { ImagePlus, Save, Trash2 } from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

type PromotionAdminItem = {
  id: number;
  title: string;
  imageUrl: string;
  oldPriceCents: number;
  newPriceCents: number;
  discountPercent: number;
  startsAt: string | null;
  endsAt: string | null;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
  oldPriceInput: string;
  newPriceInput: string;
  startsAtInput: string;
  endsAtInput: string;
  sortOrderInput: string;
};

const toRomeDateTimeInput = (value: string | null) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Rome",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  const map: Record<string, string> = {};
  for (const part of formatter.formatToParts(date)) {
    if (part.type !== "literal") map[part.type] = part.value;
  }
  return `${map.year}-${map.month}-${map.day}T${map.hour}:${map.minute}`;
};

const toEuroInput = (cents: number) => (cents / 100).toFixed(2);

export const PromotionsAdmin: React.FC = () => {
  const { user, isReady } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [items, setItems] = useState<PromotionAdminItem[]>([]);
  const [replacementFiles, setReplacementFiles] = useState<
    Record<number, File | null>
  >({});

  const [createTitle, setCreateTitle] = useState("");
  const [createOldPrice, setCreateOldPrice] = useState("");
  const [createNewPrice, setCreateNewPrice] = useState("");
  const [createStartsAt, setCreateStartsAt] = useState("");
  const [createEndsAt, setCreateEndsAt] = useState("");
  const [createIsActive, setCreateIsActive] = useState(true);
  const [createSortOrder, setCreateSortOrder] = useState("1000");
  const [createImage, setCreateImage] = useState<File | null>(null);

  const [savingId, setSavingId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [reorderId, setReorderId] = useState<number | null>(null);
  const [creating, setCreating] = useState(false);

  const loadItems = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/promotions-admin?action=list", {
        method: "GET",
        credentials: "include",
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data?.error || "Impossibile caricare le promozioni.");
      }

      const nextItems = (Array.isArray(data?.items) ? data.items : []).map(
        (item: any) =>
          ({
            ...item,
            oldPriceInput: toEuroInput(item.oldPriceCents),
            newPriceInput: toEuroInput(item.newPriceCents),
            startsAtInput: toRomeDateTimeInput(item.startsAt),
            endsAtInput: toRomeDateTimeInput(item.endsAt),
            sortOrderInput: String(item.sortOrder),
          }) as PromotionAdminItem,
      );

      setItems(nextItems);
    } catch (err: any) {
      setError(err?.message || "Errore durante il caricamento.");
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isReady) return;
    if (!user?.canManagePromotions) return;
    loadItems();
  }, [isReady, user?.canManagePromotions, loadItems]);

  const handleItemField = (
    id: number,
    key:
      | "title"
      | "oldPriceInput"
      | "newPriceInput"
      | "startsAtInput"
      | "endsAtInput"
      | "isActive"
      | "sortOrderInput",
    value: string | boolean,
  ) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        return {
          ...item,
          [key]: value,
        };
      }),
    );
  };

  const handleSaveItem = async (id: number) => {
    const item = items.find((it) => it.id === id);
    if (!item) return;

    setSavingId(id);
    try {
      const formData = new FormData();
      formData.append("id", String(item.id));
      formData.append("title", item.title);
      formData.append("oldPrice", item.oldPriceInput);
      formData.append("newPrice", item.newPriceInput);
      formData.append("startsAt", item.startsAtInput);
      formData.append("endsAt", item.endsAtInput);
      formData.append("isActive", String(item.isActive));
      formData.append("sortOrder", item.sortOrderInput);
      const replacement = replacementFiles[id];
      if (replacement) {
        formData.append("image", replacement);
      }

      const response = await fetch("/api/promotions-admin?action=update", {
        method: "POST",
        credentials: "include",
        body: formData,
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data?.error || "Salvataggio non riuscito.");
      }

      setReplacementFiles((prev) => ({ ...prev, [id]: null }));
      toast.success("Promozione aggiornata.");
      await loadItems();
    } catch (err: any) {
      toast.error(err?.message || "Errore durante il salvataggio.");
    } finally {
      setSavingId(null);
    }
  };

  const handleReorder = async (id: number) => {
    const item = items.find((it) => it.id === id);
    if (!item) return;

    const sortOrder = Number.parseInt(item.sortOrderInput, 10);
    if (!Number.isFinite(sortOrder)) {
      toast.error("Sort order non valido.");
      return;
    }

    setReorderId(id);
    try {
      const response = await fetch("/api/promotions-admin?action=reorder", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          id,
          sortOrder,
        }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data?.error || "Aggiornamento ordine non riuscito.");
      }

      toast.success("Ordine aggiornato.");
      await loadItems();
    } catch (err: any) {
      toast.error(err?.message || "Errore durante l'aggiornamento ordine.");
    } finally {
      setReorderId(null);
    }
  };

  const handleDelete = async (id: number) => {
    const confirmDelete = window.confirm(
      "Confermi l'eliminazione di questa promozione?",
    );
    if (!confirmDelete) return;

    setDeletingId(id);
    try {
      const response = await fetch("/api/promotions-admin?action=delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ id }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data?.error || "Eliminazione non riuscita.");
      }

      toast.success("Promozione eliminata.");
      await loadItems();
    } catch (err: any) {
      toast.error(err?.message || "Errore durante l'eliminazione.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!createImage) {
      toast.error("Seleziona un'immagine.");
      return;
    }

    setCreating(true);
    try {
      const formData = new FormData();
      formData.append("title", createTitle);
      formData.append("oldPrice", createOldPrice);
      formData.append("newPrice", createNewPrice);
      formData.append("startsAt", createStartsAt);
      formData.append("endsAt", createEndsAt);
      formData.append("isActive", String(createIsActive));
      formData.append("sortOrder", createSortOrder);
      formData.append("image", createImage);

      const response = await fetch("/api/promotions-admin?action=create", {
        method: "POST",
        credentials: "include",
        body: formData,
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data?.error || "Creazione non riuscita.");
      }

      setCreateTitle("");
      setCreateOldPrice("");
      setCreateNewPrice("");
      setCreateStartsAt("");
      setCreateEndsAt("");
      setCreateIsActive(true);
      setCreateSortOrder("1000");
      setCreateImage(null);
      toast.success("Promozione creata.");
      await loadItems();
    } catch (err: any) {
      toast.error(err?.message || "Errore durante la creazione.");
    } finally {
      setCreating(false);
    }
  };

  if (!isReady) {
    return (
      <div className="pt-24 min-h-screen bg-brand-bg flex items-center justify-center text-brand-text-secondary">
        Verifica sessione...
      </div>
    );
  }

  if (!user?.canManagePromotions) {
    return (
      <div className="pt-24 min-h-screen bg-brand-bg text-brand-text-primary">
        <SEO
          title="Admin Promozioni | Dimensione Immagine"
          description="Gestione promozioni e offerte."
          url="https://www.dimensioneimmagineabbigliamento.it/admin-promozioni"
        />
        <div className="container mx-auto px-6 py-12 max-w-3xl">
          <div className="bg-white border border-brand-border rounded-xl p-8 text-center">
            <h1 className="text-3xl font-serif mb-3">Accesso negato</h1>
            <p className="text-brand-text-secondary mb-6">
              Il tuo account non ha i permessi per gestire le promozioni.
            </p>
            <Link
              to="/admin-wholesale"
              className="inline-flex px-5 py-3 rounded-lg border border-brand-border hover:border-brand-accent transition-colors"
            >
              Vai al pannello admin
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 min-h-screen bg-brand-bg text-brand-text-primary">
      <SEO
        title="Admin Promozioni | Dimensione Immagine"
        description="Gestione promozioni e offerte."
        url="https://www.dimensioneimmagineabbigliamento.it/admin-promozioni"
      />

      <section className="container mx-auto px-6 py-10 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-serif">Gestione Promozioni</h1>
          <p className="text-brand-text-secondary mt-2">
            Crea, aggiorna, ordina e disattiva le promozioni visibili al pubblico.
          </p>
          <p className="text-sm mt-2">
            Gestione editor email:{" "}
            <Link to="/admin-wholesale" className="underline">
              admin-wholesale
            </Link>
          </p>
        </div>

        <form
          onSubmit={handleCreate}
          className="bg-white border border-brand-border rounded-xl p-6 mb-8"
        >
          <h2 className="text-xl font-serif mb-4">Nuova promozione</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <input
              value={createTitle}
              onChange={(e) => setCreateTitle(e.target.value)}
              placeholder="Titolo promozione"
              className="p-3 border border-brand-border rounded"
              required
            />
            <input
              type="number"
              inputMode="decimal"
              min="0"
              step="0.01"
              value={createOldPrice}
              onChange={(e) => setCreateOldPrice(e.target.value)}
              placeholder="Prezzo originale (es. 99.90)"
              className="p-3 border border-brand-border rounded"
              required
            />
            <input
              type="number"
              inputMode="decimal"
              min="0"
              step="0.01"
              value={createNewPrice}
              onChange={(e) => setCreateNewPrice(e.target.value)}
              placeholder="Prezzo promo (es. 49.90)"
              className="p-3 border border-brand-border rounded"
              required
            />
            <input
              type="datetime-local"
              value={createStartsAt}
              onChange={(e) => setCreateStartsAt(e.target.value)}
              className="p-3 border border-brand-border rounded"
            />
            <input
              type="datetime-local"
              value={createEndsAt}
              onChange={(e) => setCreateEndsAt(e.target.value)}
              className="p-3 border border-brand-border rounded"
            />
            <input
              type="number"
              value={createSortOrder}
              onChange={(e) => setCreateSortOrder(e.target.value)}
              placeholder="Sort order"
              className="p-3 border border-brand-border rounded"
            />
          </div>

          <div className="mt-4 flex flex-col md:flex-row md:items-center gap-4">
            <label className="inline-flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={createIsActive}
                onChange={(e) => setCreateIsActive(e.target.checked)}
              />
              Attiva subito
            </label>

            <label className="inline-flex items-center gap-2 text-sm cursor-pointer">
              <ImagePlus size={16} />
              <span>{createImage ? createImage.name : "Seleziona immagine"}</span>
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                className="hidden"
                onChange={(e) => setCreateImage(e.target.files?.[0] || null)}
                required
              />
            </label>

            <button
              type="submit"
              disabled={creating}
              className="px-5 py-3 bg-brand-accent text-white rounded-lg font-semibold disabled:opacity-70 cursor-pointer"
            >
              {creating ? "Creazione..." : "Crea promozione"}
            </button>
          </div>
        </form>

        {loading && (
          <div className="bg-white border border-brand-border rounded-xl p-5 text-brand-text-secondary">
            Caricamento promozioni...
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-5 mb-6">
            {error}
          </div>
        )}

        {!loading && !error && items.length === 0 && (
          <div className="bg-white border border-brand-border rounded-xl p-5 text-brand-text-secondary">
            Nessuna promozione disponibile.
          </div>
        )}

        <div className="space-y-6">
          {items.map((item) => {
            const busy = savingId === item.id || deletingId === item.id;
            const replacingFile = replacementFiles[item.id];
            return (
              <div
                key={item.id}
                className="bg-white border border-brand-border rounded-xl p-5"
              >
                <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-5">
                  <div className="aspect-[4/5] overflow-hidden rounded border border-brand-border bg-brand-surface">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <input
                        value={item.title}
                        onChange={(e) =>
                          handleItemField(item.id, "title", e.target.value)
                        }
                        className="p-3 border border-brand-border rounded"
                      />
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.oldPriceInput}
                        onChange={(e) =>
                          handleItemField(item.id, "oldPriceInput", e.target.value)
                        }
                        className="p-3 border border-brand-border rounded"
                      />
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.newPriceInput}
                        onChange={(e) =>
                          handleItemField(item.id, "newPriceInput", e.target.value)
                        }
                        className="p-3 border border-brand-border rounded"
                      />
                      <input
                        type="number"
                        value={item.sortOrderInput}
                        onChange={(e) =>
                          handleItemField(item.id, "sortOrderInput", e.target.value)
                        }
                        className="p-3 border border-brand-border rounded"
                      />
                      <input
                        type="datetime-local"
                        value={item.startsAtInput}
                        onChange={(e) =>
                          handleItemField(item.id, "startsAtInput", e.target.value)
                        }
                        className="p-3 border border-brand-border rounded"
                      />
                      <input
                        type="datetime-local"
                        value={item.endsAtInput}
                        onChange={(e) =>
                          handleItemField(item.id, "endsAtInput", e.target.value)
                        }
                        className="p-3 border border-brand-border rounded"
                      />
                    </div>

                    <div className="mt-3 flex flex-wrap gap-4 items-center text-sm">
                      <label className="inline-flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={item.isActive}
                          onChange={(e) =>
                            handleItemField(item.id, "isActive", e.target.checked)
                          }
                        />
                        Attiva
                      </label>

                      <label className="inline-flex items-center gap-2 cursor-pointer">
                        <ImagePlus size={16} />
                        <span>
                          {replacingFile ? replacingFile.name : "Sostituisci immagine"}
                        </span>
                        <input
                          type="file"
                          accept="image/png,image/jpeg,image/webp"
                          className="hidden"
                          onChange={(e) =>
                            setReplacementFiles((prev) => ({
                              ...prev,
                              [item.id]: e.target.files?.[0] || null,
                            }))
                          }
                        />
                      </label>

                      <span className="text-brand-text-secondary">
                        Sconto attuale: {item.discountPercent}%
                      </span>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => handleSaveItem(item.id)}
                        disabled={busy}
                        className="px-4 py-2 rounded border border-brand-accent text-brand-accent hover:bg-brand-accent/10 inline-flex items-center gap-2 disabled:opacity-60 cursor-pointer"
                      >
                        <Save size={16} />
                        {savingId === item.id ? "Salvataggio..." : "Salva modifiche"}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleReorder(item.id)}
                        disabled={reorderId === item.id}
                        className="px-4 py-2 rounded border border-brand-border hover:border-brand-accent inline-flex items-center gap-2 disabled:opacity-60 cursor-pointer"
                      >
                        {reorderId === item.id ? "Aggiornamento..." : "Salva ordine"}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDelete(item.id)}
                        disabled={busy}
                        className="px-4 py-2 rounded border border-red-600 text-red-700 hover:bg-red-50 inline-flex items-center gap-2 disabled:opacity-60 cursor-pointer"
                      >
                        <Trash2 size={16} />
                        {deletingId === item.id ? "Eliminazione..." : "Elimina"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default PromotionsAdmin;
