"use client";

import { useState } from "react";
import type { FlowState } from "@/lib/types";

interface ResultStepProps {
  result: NonNullable<FlowState["result"]>;
  onRestart: () => void;
}

export function ResultStep({ result, onRestart }: ResultStepProps) {
  const [shareState, setShareState] = useState<"idle" | "copied">("idle");
  const isWin = result.prize?.name !== "Quase!";
  const displayPrizeName = isWin
    ? result.prize?.name
    : "Cinco por cento pela noite";
  const displayPrizeDescription = isWin
    ? result.prize?.description
    : "Use o código abaixo na próxima visita.";
  const expiresDate = new Date(result.expires_at).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
  });

  const handleShare = async () => {
    const text = isWin
      ? `Levei ${result.prize?.name} do Quintal 333. Vão lá: @quintal333`
      : `Avaliei minha noite no Quintal 333. Pizza de verdade. @quintal333`;

    try {
      if (navigator.share) {
        await navigator.share({ text });
      } else {
        await navigator.clipboard.writeText(text);
        setShareState("copied");
        setTimeout(() => setShareState("idle"), 2200);
      }
    } catch {
      // user cancelled or share failed
    }
  };

  return (
    <section className="space-y-9">
      <div className="space-y-3">
        <p
          className="font-serif-small italic text-q-cream-soft text-xs smallcaps"
          style={{ letterSpacing: "0.16em" }}
        >
          {isWin ? "para a próxima visita" : "fique com a gente"}
        </p>
        <h2
          className="font-serif text-q-cream-bright text-[2.4rem] leading-[0.95]"
          style={{
            fontVariationSettings: '"opsz" 144, "SOFT" 20, "wght" 400',
            letterSpacing: "-0.012em",
          }}
        >
          {isWin ? "Parabéns." : "Da próxima."}
        </h2>
      </div>

      <div
        className="h-px w-12 bg-q-gold origin-left animate-reveal-line"
        aria-hidden="true"
      />

      <div className="space-y-1.5">
        <p
          className="font-serif text-q-cream text-[1.55rem] leading-[1.15]"
          style={{
            fontVariationSettings: '"opsz" 36, "SOFT" 40, "wght" 450',
            letterSpacing: "-0.005em",
          }}
        >
          {displayPrizeName}
        </p>
        {displayPrizeDescription && (
          <p className="text-q-cream-soft text-[0.92rem] leading-relaxed max-w-[28ch]">
            {displayPrizeDescription}
          </p>
        )}
      </div>

      <div className="pt-4 pb-2 space-y-3 border-t border-b border-q-stone/25 py-7">
        <p
          className="text-q-cream-soft text-[0.7rem] smallcaps"
          style={{ letterSpacing: "0.18em" }}
        >
          Código
        </p>
        <p
          key={result.coupon_code}
          className="font-serif text-q-gold text-[2rem] sm:text-[2.2rem] leading-none nums-tabular animate-reveal-code"
          style={{
            fontVariationSettings: '"opsz" 72, "SOFT" 25, "wght" 450',
            letterSpacing: "0.24em",
          }}
        >
          {result.coupon_code}
        </p>
        <p
          className="font-serif-small italic text-q-cream-soft text-[0.82rem]"
          style={{ fontVariationSettings: '"opsz" 12, "SOFT" 60' }}
        >
          válido até <span className="not-italic nums-tabular">{expiresDate}</span>
        </p>
      </div>

      <p className="font-serif italic text-q-cream text-[0.95rem]">
        Apresente quando voltar.
      </p>

      <div className="pt-2 flex flex-col gap-3">
        <button
          type="button"
          onClick={handleShare}
          className="group flex items-center justify-between gap-2 border-t border-b border-q-gold/60 hover:border-q-gold py-4 px-1 text-q-cream transition-colors duration-300"
        >
          <span
            className="font-serif text-[1rem] smallcaps"
            style={{
              fontVariationSettings: '"opsz" 24, "SOFT" 40, "wght" 450',
              letterSpacing: "0.14em",
            }}
          >
            {shareState === "copied" ? "Copiado" : "Mostrar no Instagram"}
          </span>
          <span
            aria-hidden="true"
            className="transition-transform duration-300 ease-out group-hover:translate-x-1"
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

        <button
          type="button"
          onClick={onRestart}
          className="self-center text-q-stone/70 hover:text-q-cream-soft text-[0.78rem] font-serif italic transition-colors duration-300 py-2 px-3"
          style={{ fontVariationSettings: '"opsz" 12, "SOFT" 60' }}
        >
          outro avaliador?
        </button>
      </div>
    </section>
  );
}
