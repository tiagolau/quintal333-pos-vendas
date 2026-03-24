"use client";

import { Confetti } from "@/components/confetti";
import { Gift, RotateCcw, Share2 } from "lucide-react";
import type { FlowState } from "@/lib/types";

interface ResultStepProps {
  result: NonNullable<FlowState["result"]>;
  onRestart: () => void;
}

export function ResultStep({ result, onRestart }: ResultStepProps) {
  const isWin = result.prize?.name !== "Quase!";
  const expiresDate = new Date(result.expires_at).toLocaleDateString("pt-BR");

  const handleShare = async () => {
    const text = isWin
      ? `Ganhei ${result.prize?.name} no Quintal 333! A melhor pizza artesanal de MG. @quintal333`
      : `Acabei de avaliar minha experiencia no Quintal 333! A melhor pizza artesanal de MG. @quintal333`;

    if (navigator.share) {
      try {
        await navigator.share({ text });
      } catch {
        // user cancelled
      }
    } else {
      await navigator.clipboard.writeText(text);
    }
  };

  return (
    <div className="space-y-6 text-center">
      {isWin && <Confetti />}

      <div
        className={`
        p-8 rounded-2xl border-2
        ${isWin ? "bg-q-charcoal border-q-gold" : "bg-q-charcoal border-q-gray/30"}
      `}
      >
        <div className="mb-4">
          <Gift
            size={48}
            className={isWin ? "text-q-gold mx-auto" : "text-q-gray mx-auto"}
          />
        </div>

        <h2
          className={`text-2xl font-bold mb-2 ${isWin ? "text-q-gold" : "text-q-cream"}`}
        >
          {isWin ? "Voce ganhou!" : "Quase!"}
        </h2>

        <p className="text-lg text-q-cream font-semibold mb-1">
          {result.prize?.name}
        </p>
        <p className="text-sm text-q-gray mb-4">
          {result.prize?.description}
        </p>

        <div className="bg-q-black rounded-xl p-4 mb-4">
          <p className="text-xs text-q-gray uppercase tracking-wider mb-1">
            Seu codigo
          </p>
          <p className="text-2xl font-mono font-bold text-q-gold tracking-widest">
            {result.coupon_code}
          </p>
          <p className="text-xs text-q-gray mt-2">
            Valido ate {expiresDate}
          </p>
        </div>

        <p className="text-xs text-q-gray">
          Apresente este codigo na sua proxima visita.
        </p>
      </div>

      <div className="flex gap-3">
        <button
          onClick={handleShare}
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-q-charcoal border border-q-gray/30 text-q-cream hover:border-q-gold transition-colors"
        >
          <Share2 size={18} />
          Compartilhar
        </button>
        <button
          onClick={onRestart}
          className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-q-charcoal border border-q-gray/30 text-q-gray hover:text-q-cream hover:border-q-gold transition-colors"
        >
          <RotateCcw size={18} />
        </button>
      </div>

      <p className="text-xs text-q-gray">
        Obrigado por avaliar! Te esperamos de volta.
      </p>
    </div>
  );
}
