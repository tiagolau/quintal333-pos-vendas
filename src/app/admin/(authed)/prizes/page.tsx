"use client";

import { useEffect, useState, useCallback } from "react";
import { Plus, Pencil, Trash2, Check, X } from "lucide-react";
import type { Prize } from "@/lib/types";

interface EditState {
  name: string;
  description: string;
  probability: number;
  is_active: boolean;
}

const NEW_DRAFT: EditState = {
  name: "",
  description: "",
  probability: 10,
  is_active: true,
};

export default function PrizesPage() {
  const [prizes, setPrizes] = useState<Prize[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [edit, setEdit] = useState<EditState | null>(null);
  const [creating, setCreating] = useState(false);
  const [draft, setDraft] = useState<EditState>(NEW_DRAFT);
  const [saving, setSaving] = useState(false);

  const fetchPrizes = useCallback(() => {
    setLoading(true);
    fetch("/api/admin/prizes")
      .then((r) => r.json())
      .then((data) => setPrizes(data.prizes ?? []))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchPrizes();
  }, [fetchPrizes]);

  const quickPatch = async (id: string, updates: Partial<Prize>) => {
    await fetch("/api/admin/prizes", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...updates }),
    });
    fetchPrizes();
  };

  const startEdit = (prize: Prize) => {
    setEditingId(prize.id);
    setEdit({
      name: prize.name,
      description: prize.description,
      probability: prize.probability,
      is_active: prize.is_active,
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEdit(null);
  };

  const saveEdit = async () => {
    if (!editingId || !edit) return;
    setSaving(true);
    try {
      const res = await fetch("/api/admin/prizes", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingId,
          name: edit.name,
          description: edit.description,
          probability: edit.probability,
          is_active: edit.is_active,
        }),
      });
      if (res.ok) {
        cancelEdit();
        fetchPrizes();
      } else {
        const data = (await res.json().catch(() => ({}))) as {
          error?: string;
        };
        alert(data.error || "Erro ao salvar");
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (
      !confirm(
        `Excluir o prêmio "${name}"? Cupons já emitidos continuam válidos, mas ficarão sem prêmio vinculado.`,
      )
    )
      return;
    const res = await fetch(`/api/admin/prizes?id=${id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      cancelEdit();
      fetchPrizes();
    }
  };

  const startCreate = () => {
    setCreating(true);
    setDraft(NEW_DRAFT);
  };

  const cancelCreate = () => {
    setCreating(false);
    setDraft(NEW_DRAFT);
  };

  const saveCreate = async () => {
    if (!draft.name.trim()) {
      alert("Nome é obrigatório");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/admin/prizes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(draft),
      });
      if (res.ok) {
        cancelCreate();
        fetchPrizes();
      } else {
        const data = (await res.json().catch(() => ({}))) as {
          error?: string;
        };
        alert(data.error || "Erro ao criar");
      }
    } finally {
      setSaving(false);
    }
  };

  const totalProbability = prizes.reduce((s, p) => s + p.probability, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-2xl font-bold text-q-cream">Prêmios da Roleta</h1>
        <div className="flex items-center gap-3">
          <span
            className={`text-sm px-3 py-1 rounded-lg ${
              totalProbability === 100
                ? "bg-q-green/20 text-q-green"
                : "bg-q-red/20 text-q-red"
            }`}
          >
            Total: {totalProbability}%{" "}
            {totalProbability !== 100 && "(deve ser 100%)"}
          </span>
          {!creating && (
            <button
              onClick={startCreate}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-q-gold text-q-black text-sm font-medium hover:bg-q-gold-light transition-colors"
            >
              <Plus size={16} />
              Novo prêmio
            </button>
          )}
        </div>
      </div>

      {creating && (
        <div className="bg-q-charcoal rounded-xl p-5 border border-q-gold/40">
          <h3 className="font-semibold text-q-gold mb-3">Novo prêmio</h3>
          <PrizeForm
            value={draft}
            onChange={setDraft}
            onSave={saveCreate}
            onCancel={cancelCreate}
            saving={saving}
          />
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-10">
          <div className="w-8 h-8 border-2 border-q-gold border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="space-y-3">
          {prizes.map((prize) => {
            const isEditing = editingId === prize.id;
            return (
              <div
                key={prize.id}
                className={`bg-q-charcoal rounded-xl p-5 ${
                  !prize.is_active && !isEditing ? "opacity-50" : ""
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-q-cream">{prize.name}</h3>
                    <p className="text-sm text-q-gray">{prize.description}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {!isEditing && (
                      <>
                        <label className="flex items-center gap-2 cursor-pointer mr-2">
                          <span className="text-xs text-q-gray">Ativo</span>
                          <input
                            type="checkbox"
                            checked={prize.is_active}
                            onChange={(e) =>
                              quickPatch(prize.id, {
                                is_active: e.target.checked,
                              })
                            }
                            className="w-5 h-5 rounded accent-q-gold"
                          />
                        </label>
                        <button
                          onClick={() => startEdit(prize)}
                          className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-q-gold/15 text-q-gold text-sm hover:bg-q-gold/25 transition-colors"
                          title="Editar prêmio"
                        >
                          <Pencil size={16} />
                          <span className="hidden sm:inline">Editar</span>
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {!isEditing && (
                  <>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-q-gray">Probabilidade:</span>
                      <input
                        type="range"
                        min={0}
                        max={50}
                        value={prize.probability}
                        onChange={(e) =>
                          quickPatch(prize.id, {
                            probability: Number(e.target.value),
                          })
                        }
                        className="flex-1 accent-q-gold"
                      />
                      <span className="text-sm font-mono text-q-gold w-10 text-right">
                        {prize.probability}%
                      </span>
                    </div>
                    <div className="mt-2 h-1.5 bg-q-black rounded-full overflow-hidden">
                      <div
                        className="h-full bg-q-gold rounded-full transition-all"
                        style={{
                          width: `${(prize.probability / 50) * 100}%`,
                        }}
                      />
                    </div>
                  </>
                )}

                {isEditing && edit && (
                  <div className="pt-2 border-t border-q-gray/15 mt-2">
                    <PrizeForm
                      value={edit}
                      onChange={setEdit}
                      onSave={saveEdit}
                      onCancel={cancelEdit}
                      onDelete={() => handleDelete(prize.id, prize.name)}
                      saving={saving}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function PrizeForm({
  value,
  onChange,
  onSave,
  onCancel,
  onDelete,
  saving,
}: {
  value: EditState;
  onChange: (v: EditState) => void;
  onSave: () => void;
  onCancel: () => void;
  onDelete?: () => void;
  saving: boolean;
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3">
      <label className="block sm:col-span-2">
        <span className="text-xs uppercase tracking-wider text-q-gray block mb-1.5">
          Nome
        </span>
        <input
          type="text"
          value={value.name}
          onChange={(e) => onChange({ ...value, name: e.target.value })}
          placeholder='Ex: "Sobremesa Grátis"'
          className="w-full px-3 py-2 rounded-lg bg-q-black border border-q-gray/30 text-q-cream text-sm focus:outline-none focus:border-q-gold"
        />
      </label>

      <label className="block sm:col-span-2">
        <span className="text-xs uppercase tracking-wider text-q-gray block mb-1.5">
          Descrição
        </span>
        <textarea
          value={value.description}
          onChange={(e) => onChange({ ...value, description: e.target.value })}
          placeholder="Descrição visível ao cliente"
          rows={2}
          className="w-full px-3 py-2 rounded-lg bg-q-black border border-q-gray/30 text-q-cream text-sm focus:outline-none focus:border-q-gold resize-none"
        />
      </label>

      <label className="block">
        <span className="text-xs uppercase tracking-wider text-q-gray block mb-1.5">
          Probabilidade ({value.probability}%)
        </span>
        <input
          type="range"
          min={0}
          max={50}
          value={value.probability}
          onChange={(e) =>
            onChange({ ...value, probability: Number(e.target.value) })
          }
          className="w-full accent-q-gold"
        />
      </label>

      <label className="flex items-end gap-2 cursor-pointer pb-2">
        <input
          type="checkbox"
          checked={value.is_active}
          onChange={(e) =>
            onChange({ ...value, is_active: e.target.checked })
          }
          className="w-4 h-4 accent-q-gold"
        />
        <span className="text-sm text-q-cream">Ativo na roleta</span>
      </label>

      <div className="sm:col-span-2 flex flex-wrap items-center gap-2 pt-1">
        <button
          onClick={onSave}
          disabled={saving}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-q-gold text-q-black text-sm font-medium hover:bg-q-gold-light transition-colors disabled:opacity-50"
        >
          <Check size={16} />
          {saving ? "Salvando…" : "Salvar"}
        </button>
        <button
          onClick={onCancel}
          disabled={saving}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-q-black border border-q-gray/30 text-q-cream text-sm hover:border-q-gray/60 transition-colors disabled:opacity-50"
        >
          <X size={16} />
          Cancelar
        </button>
        {onDelete && (
          <button
            onClick={onDelete}
            disabled={saving}
            className="ml-auto flex items-center gap-1.5 px-4 py-2 rounded-lg bg-q-red/15 text-q-red text-sm hover:bg-q-red/25 transition-colors disabled:opacity-50"
          >
            <Trash2 size={16} />
            Excluir
          </button>
        )}
      </div>
    </div>
  );
}
