"use client";

import { useEffect, useState, useCallback } from "react";
import { Check, Pencil, Trash2, X } from "lucide-react";
import type { CouponWithDetails, Prize } from "@/lib/types";

// expires_at vem como ISO; o <input type="date"> quer "yyyy-MM-dd"
function toDateInputValue(iso: string): string {
  if (!iso) return "";
  return new Date(iso).toISOString().slice(0, 10);
}

interface EditState {
  prize_id: string;
  expires_date: string;
  redeemed: boolean;
}

export default function CouponsPage() {
  const [coupons, setCoupons] = useState<CouponWithDetails[]>([]);
  const [prizes, setPrizes] = useState<Prize[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [edit, setEdit] = useState<EditState | null>(null);
  const [saving, setSaving] = useState(false);

  const fetchCoupons = useCallback((p: number) => {
    setLoading(true);
    fetch(`/api/admin/coupons?page=${p}`)
      .then((r) => r.json())
      .then((data) => {
        setCoupons(data.coupons);
        setTotalPages(data.pages);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchCoupons(page);
  }, [page, fetchCoupons]);

  useEffect(() => {
    fetch("/api/admin/prizes")
      .then((r) => r.json())
      .then((data) => setPrizes(data.prizes ?? []))
      .catch(() => {});
  }, []);

  const handleRedeem = async (couponId: string) => {
    const res = await fetch("/api/admin/coupons", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ coupon_id: couponId, redeemed: true }),
    });
    if (res.ok) fetchCoupons(page);
  };

  const startEdit = (coupon: CouponWithDetails) => {
    setEditingId(coupon.id);
    setEdit({
      prize_id: coupon.prize_id,
      expires_date: toDateInputValue(coupon.expires_at),
      redeemed: coupon.redeemed,
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
      // 23:59:59 do dia escolhido — mantém validade até o fim do dia
      const expiresIso = new Date(edit.expires_date + "T23:59:59").toISOString();
      const res = await fetch("/api/admin/coupons", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          coupon_id: editingId,
          prize_id: edit.prize_id,
          expires_at: expiresIso,
          redeemed: edit.redeemed,
        }),
      });
      if (res.ok) {
        cancelEdit();
        fetchCoupons(page);
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (couponId: string, code: string) => {
    if (!confirm(`Excluir o cupom ${code}? Esta ação não pode ser desfeita.`))
      return;
    const res = await fetch(`/api/admin/coupons?id=${couponId}`, {
      method: "DELETE",
    });
    if (res.ok) {
      cancelEdit();
      fetchCoupons(page);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-q-cream">Cupons</h1>

      {loading ? (
        <div className="flex justify-center py-10">
          <div className="w-8 h-8 border-2 border-q-gold border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="space-y-3">
          {coupons.map((coupon) => {
            const isExpired = new Date(coupon.expires_at) < new Date();
            const isEditing = editingId === coupon.id;
            return (
              <div
                key={coupon.id}
                className={`bg-q-charcoal rounded-xl p-5 ${
                  coupon.redeemed && !isEditing ? "opacity-60" : ""
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="font-mono font-bold text-q-gold text-lg">
                        {coupon.code}
                      </span>
                      {coupon.redeemed && (
                        <span className="text-xs bg-q-green/20 text-q-green px-2 py-0.5 rounded">
                          Resgatado
                        </span>
                      )}
                      {isExpired && !coupon.redeemed && (
                        <span className="text-xs bg-q-red/20 text-q-red px-2 py-0.5 rounded">
                          Expirado
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-q-cream">
                      {coupon.customer?.name}{" "}
                      <span className="text-q-gray">
                        | {coupon.customer?.phone}
                      </span>
                    </p>
                    <p className="text-sm text-q-cream">{coupon.prize?.name}</p>
                    <p className="text-xs text-q-gray mt-1">
                      Emitido:{" "}
                      {new Date(coupon.created_at).toLocaleDateString("pt-BR")}
                      {" | "}
                      Expira:{" "}
                      {new Date(coupon.expires_at).toLocaleDateString("pt-BR")}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {!isEditing && !coupon.redeemed && !isExpired && (
                      <button
                        onClick={() => handleRedeem(coupon.id)}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-q-green/20 text-q-green text-sm hover:bg-q-green/30 transition-colors"
                        title="Marcar como resgatado"
                      >
                        <Check size={16} />
                        <span className="hidden sm:inline">Resgatar</span>
                      </button>
                    )}
                    {!isEditing && (
                      <button
                        onClick={() => startEdit(coupon)}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-q-gold/15 text-q-gold text-sm hover:bg-q-gold/25 transition-colors"
                        title="Editar cupom"
                      >
                        <Pencil size={16} />
                        <span className="hidden sm:inline">Editar</span>
                      </button>
                    )}
                  </div>
                </div>

                {isEditing && edit && (
                  <div className="mt-4 pt-4 border-t border-q-gray/15 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <label className="block">
                      <span className="text-xs uppercase tracking-wider text-q-gray block mb-1.5">
                        Prêmio
                      </span>
                      <select
                        value={edit.prize_id}
                        onChange={(e) =>
                          setEdit({ ...edit, prize_id: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-lg bg-q-black border border-q-gray/30 text-q-cream text-sm focus:outline-none focus:border-q-gold"
                      >
                        {prizes.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name}
                          </option>
                        ))}
                      </select>
                    </label>

                    <label className="block">
                      <span className="text-xs uppercase tracking-wider text-q-gray block mb-1.5">
                        Válido até
                      </span>
                      <input
                        type="date"
                        value={edit.expires_date}
                        onChange={(e) =>
                          setEdit({ ...edit, expires_date: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-lg bg-q-black border border-q-gray/30 text-q-cream text-sm focus:outline-none focus:border-q-gold"
                      />
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer sm:col-span-2">
                      <input
                        type="checkbox"
                        checked={edit.redeemed}
                        onChange={(e) =>
                          setEdit({ ...edit, redeemed: e.target.checked })
                        }
                        className="w-4 h-4 accent-q-gold"
                      />
                      <span className="text-sm text-q-cream">
                        Resgatado
                      </span>
                    </label>

                    <div className="sm:col-span-2 flex flex-wrap items-center gap-2 pt-1">
                      <button
                        onClick={saveEdit}
                        disabled={saving}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-q-gold text-q-black text-sm font-medium hover:bg-q-gold-light transition-colors disabled:opacity-50"
                      >
                        <Check size={16} />
                        {saving ? "Salvando…" : "Salvar"}
                      </button>
                      <button
                        onClick={cancelEdit}
                        disabled={saving}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-q-black border border-q-gray/30 text-q-cream text-sm hover:border-q-gray/60 transition-colors disabled:opacity-50"
                      >
                        <X size={16} />
                        Cancelar
                      </button>
                      <button
                        onClick={() => handleDelete(coupon.id, coupon.code)}
                        disabled={saving}
                        className="ml-auto flex items-center gap-1.5 px-4 py-2 rounded-lg bg-q-red/15 text-q-red text-sm hover:bg-q-red/25 transition-colors disabled:opacity-50"
                      >
                        <Trash2 size={16} />
                        Excluir
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`px-3 py-1.5 rounded text-sm ${
                page === i + 1
                  ? "bg-q-gold text-q-black"
                  : "bg-q-charcoal text-q-gray hover:text-q-cream"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
