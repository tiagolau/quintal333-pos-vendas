"use client";

import { useState } from "react";
import { PhoneInput } from "@/components/phone-input";
import type { FlowState, Prize } from "@/lib/types";

export interface SubmitResult {
  customerId: string;
  reviewId: string;
  existingCoupon: {
    code: string;
    expires_at: string;
    prize: Prize;
  } | null;
}

interface RegisterStepProps {
  customer: FlowState["customer"];
  ratings: FlowState["ratings"];
  onChange: (customer: FlowState["customer"]) => void;
  onComplete: (result: SubmitResult) => void;
}

export function RegisterStep({
  customer,
  ratings,
  onChange,
  onComplete,
}: RegisterStepProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isValid =
    customer.name.trim().length >= 2 && customer.phone.length >= 10;

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
      onComplete({
        customerId: data.customer_id,
        reviewId: data.review_id,
        existingCoupon: data.existing_coupon ?? null,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro inesperado");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="space-y-10">
      <div className="space-y-1">
        <h2
          className="font-serif text-q-cream-bright text-[1.9rem] leading-[1.05]"
          style={{
            fontVariationSettings: '"opsz" 120, "SOFT" 30, "wght" 400',
            letterSpacing: "-0.005em",
          }}
        >
          Quase lá.
        </h2>
        <p className="text-q-cream-soft text-sm font-serif italic">
          Pra mandar seu cupom no WhatsApp.
        </p>
      </div>

      <div className="space-y-7">
        <Field label="Nome" htmlFor="name">
          <input
            id="name"
            type="text"
            value={customer.name}
            onChange={(e) => onChange({ ...customer, name: e.target.value })}
            placeholder="Como você se chama"
            autoComplete="given-name"
            autoFocus
            className="w-full bg-transparent border-b border-q-stone/40 focus:border-q-gold transition-colors duration-300 text-q-cream placeholder:text-q-stone/55 placeholder:italic placeholder:font-serif placeholder:font-light py-2 px-0 focus:outline-none text-[1.05rem]"
          />
        </Field>

        <Field label="WhatsApp" htmlFor="phone">
          <PhoneInput
            value={customer.phone}
            onChange={(v) => onChange({ ...customer, phone: v })}
            id="phone"
          />
        </Field>

        <Field
          label="Aniversário"
          htmlFor="birthday"
          hint="presente de aniversário, se quiser dividir"
        >
          <input
            id="birthday"
            type="date"
            value={customer.birthday}
            onChange={(e) =>
              onChange({ ...customer, birthday: e.target.value })
            }
            className="w-full bg-transparent border-b border-q-stone/40 focus:border-q-gold transition-colors duration-300 text-q-cream placeholder:text-q-stone/60 py-2 px-0 focus:outline-none text-[1.05rem] appearance-none"
          />
        </Field>

        <label className="flex items-start gap-3 cursor-pointer group pt-1">
          <span className="relative mt-0.5 flex-shrink-0">
            <input
              type="checkbox"
              checked={customer.accepts_whatsapp}
              onChange={(e) =>
                onChange({ ...customer, accepts_whatsapp: e.target.checked })
              }
              className="peer appearance-none w-4 h-4 border border-q-stone/60 rounded-[2px] bg-transparent checked:border-q-gold transition-colors duration-200 cursor-pointer"
            />
            <svg
              viewBox="0 0 16 16"
              className="absolute inset-0 w-4 h-4 pointer-events-none text-q-gold opacity-0 peer-checked:opacity-100 transition-opacity duration-200"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3.5 8.5 L6.5 11.5 L12.5 5" />
            </svg>
          </span>
          <span className="text-[0.85rem] text-q-cream-soft leading-snug">
            Aceito receber novidades pelo WhatsApp.
          </span>
        </label>
      </div>

      {error && (
        <p
          role="alert"
          className="text-q-red text-sm font-serif italic text-center"
        >
          {error}
        </p>
      )}

      <div className="pt-4">
        <button
          onClick={handleSubmit}
          disabled={!isValid || loading}
          className={`group w-full flex items-center justify-between gap-2 border-t border-b py-5 px-1 transition-all duration-300 ${
            isValid && !loading
              ? "border-q-gold text-q-cream-bright hover:bg-q-gold/5 active:bg-q-gold/10"
              : "border-q-stone/30 text-q-stone/60 cursor-not-allowed"
          }`}
        >
          <span
            className="font-serif text-[1.1rem] smallcaps"
            style={{
              fontVariationSettings: '"opsz" 24, "SOFT" 40, "wght" 450',
              letterSpacing: "0.14em",
            }}
          >
            {loading ? "Salvando" : "Pronto"}
          </span>
          <span
            aria-hidden="true"
            className={`transition-transform duration-300 ease-out ${
              isValid && !loading ? "group-hover:translate-x-1" : ""
            }`}
          >
            <svg
              viewBox="0 0 24 12"
              className="w-6 h-3"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.25"
            >
              <path d="M0 6 L22 6 M16 1 L22 6 L16 11" strokeLinejoin="round" />
            </svg>
          </span>
        </button>
      </div>
    </section>
  );
}

function Field({
  label,
  htmlFor,
  hint,
  children,
}: {
  label: string;
  htmlFor: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={htmlFor}
        className="block text-q-cream-soft text-xs smallcaps mb-1"
        style={{ letterSpacing: "0.12em" }}
      >
        {label}
        {hint && (
          <span
            className="ml-2 text-q-gold-deep italic font-serif-small"
            style={{
              letterSpacing: "0.005em",
              fontVariantCaps: "normal",
              textTransform: "lowercase",
              fontVariationSettings: '"opsz" 12, "SOFT" 60',
            }}
          >
            {hint}
          </span>
        )}
      </label>
      {children}
    </div>
  );
}
