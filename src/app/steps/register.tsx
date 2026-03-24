"use client";

import { useState } from "react";
import { PhoneInput } from "@/components/phone-input";
import type { FlowState } from "@/lib/types";

interface RegisterStepProps {
  customer: FlowState["customer"];
  ratings: FlowState["ratings"];
  onChange: (customer: FlowState["customer"]) => void;
  onComplete: (customerId: string, reviewId: string) => void;
}

export function RegisterStep({
  customer,
  ratings,
  onChange,
  onComplete,
}: RegisterStepProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isValid = customer.name.trim().length >= 2 && customer.phone.length >= 10;

  const handleSubmit = async () => {
    if (!isValid || loading) return;
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customer, ratings }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Erro ao salvar");
      }

      const data = await res.json();
      onComplete(data.customer_id, data.review_id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro inesperado");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-q-cream">
          Agora seus dados para girar a roleta!
        </h2>
        <p className="text-q-gray text-sm mt-1">
          Rapido e simples, prometemos.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm text-q-gray mb-2">Nome *</label>
          <input
            type="text"
            value={customer.name}
            onChange={(e) => onChange({ ...customer, name: e.target.value })}
            placeholder="Seu nome"
            className="w-full px-4 py-3 rounded-lg bg-q-charcoal border border-q-gray/30 text-q-cream placeholder-q-gray/50 focus:outline-none focus:border-q-gold transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm text-q-gray mb-2">WhatsApp *</label>
          <PhoneInput
            value={customer.phone}
            onChange={(v) => onChange({ ...customer, phone: v })}
          />
        </div>

        <div>
          <label className="block text-sm text-q-gray mb-2">
            Aniversario{" "}
            <span className="text-q-gold text-xs">
              (ganhe um presente especial!)
            </span>
          </label>
          <input
            type="date"
            value={customer.birthday}
            onChange={(e) => onChange({ ...customer, birthday: e.target.value })}
            className="w-full px-4 py-3 rounded-lg bg-q-charcoal border border-q-gray/30 text-q-cream focus:outline-none focus:border-q-gold transition-colors"
          />
        </div>

        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={customer.accepts_whatsapp}
            onChange={(e) =>
              onChange({ ...customer, accepts_whatsapp: e.target.checked })
            }
            className="w-5 h-5 rounded border-q-gray/30 accent-q-gold"
          />
          <span className="text-sm text-q-cream">
            Aceito receber novidades pelo WhatsApp
          </span>
        </label>
      </div>

      {error && (
        <p className="text-q-red text-sm text-center">{error}</p>
      )}

      <button
        onClick={handleSubmit}
        disabled={!isValid || loading}
        className={`
          w-full py-4 rounded-xl text-lg font-bold uppercase tracking-wider transition-all
          ${
            isValid && !loading
              ? "bg-q-gold text-q-black hover:bg-q-gold-light active:scale-[0.98] animate-pulse-gold"
              : "bg-q-gray/20 text-q-gray cursor-not-allowed"
          }
        `}
      >
        {loading ? "Salvando..." : "Girar Roleta!"}
      </button>
    </div>
  );
}
