"use client";

import { useEffect, useState, useCallback } from "react";
import type { Prize } from "@/lib/types";

export default function PrizesPage() {
  const [prizes, setPrizes] = useState<Prize[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPrizes = useCallback(() => {
    setLoading(true);
    fetch("/api/admin/prizes")
      .then((r) => r.json())
      .then((data) => setPrizes(data.prizes))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchPrizes();
  }, [fetchPrizes]);

  const updatePrize = async (id: string, updates: Partial<Prize>) => {
    await fetch("/api/admin/prizes", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...updates }),
    });
    fetchPrizes();
  };

  const totalProbability = prizes.reduce((s, p) => s + p.probability, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-q-cream">Premios da Roleta</h1>
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
      </div>

      {loading ? (
        <div className="flex justify-center py-10">
          <div className="w-8 h-8 border-2 border-q-gold border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="space-y-3">
          {prizes.map((prize) => (
            <div
              key={prize.id}
              className={`bg-q-charcoal rounded-xl p-5 ${
                !prize.is_active ? "opacity-50" : ""
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-q-cream">{prize.name}</h3>
                  <p className="text-sm text-q-gray">{prize.description}</p>
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <span className="text-xs text-q-gray">Ativo</span>
                  <input
                    type="checkbox"
                    checked={prize.is_active}
                    onChange={(e) =>
                      updatePrize(prize.id, { is_active: e.target.checked })
                    }
                    className="w-5 h-5 rounded accent-q-gold"
                  />
                </label>
              </div>

              <div className="flex items-center gap-4">
                <span className="text-sm text-q-gray">Probabilidade:</span>
                <input
                  type="range"
                  min={0}
                  max={50}
                  value={prize.probability}
                  onChange={(e) =>
                    updatePrize(prize.id, {
                      probability: Number(e.target.value),
                    })
                  }
                  className="flex-1 accent-q-gold"
                />
                <span className="text-sm font-mono text-q-gold w-10 text-right">
                  {prize.probability}%
                </span>
              </div>

              {/* Visual bar */}
              <div className="mt-2 h-1.5 bg-q-black rounded-full overflow-hidden">
                <div
                  className="h-full bg-q-gold rounded-full transition-all"
                  style={{ width: `${(prize.probability / 50) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
