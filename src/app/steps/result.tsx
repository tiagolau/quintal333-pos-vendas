"use client";

import type { FlowState } from "@/lib/types";

interface ResultStepProps {
  result: NonNullable<FlowState["result"]>;
  onRestart: () => void;
}

// WhatsApp da pizzaria — número em formato internacional sem símbolos
const QUINTAL_WA_NUMBER = "5533991919770";

export function ResultStep({ result, onRestart }: ResultStepProps) {
  const isQuase = result.prize?.name === "Quase!";
  const isExisting = !!result.isExisting;
  // "Quase!" não gera cupom (a não ser que seja a tela `isExisting` mostrando
  // um cupom ANTERIOR que continua válido).
  const hasCoupon = !!result.coupon_code && (!isQuase || isExisting);

  if (!hasCoupon) {
    return <NoCouponResult onRestart={onRestart} />;
  }

  const expiresDate = new Date(result.expires_at).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
  });
  const waMessage = `Oi! Acabei de avaliar no Quintal 333. Meu código do brinde: ${result.coupon_code}`;
  const waUrl = `https://wa.me/${QUINTAL_WA_NUMBER}?text=${encodeURIComponent(waMessage)}`;

  return (
    <section className="space-y-9">
      <div className="space-y-3">
        <p
          className="font-serif-small italic text-q-cream-soft text-xs smallcaps"
          style={{ letterSpacing: "0.16em" }}
        >
          {isExisting ? "seu cupom ainda está ativo" : "para a próxima visita"}
        </p>
        <h2
          className="font-serif text-q-cream-bright text-[2.4rem] leading-[0.95]"
          style={{
            fontVariationSettings: '"opsz" 144, "SOFT" 20, "wght" 400',
            letterSpacing: "-0.012em",
          }}
        >
          {isExisting ? "Que bom te ver." : "Parabéns."}
        </h2>
        {isExisting && (
          <p className="text-q-cream-soft text-[0.92rem] leading-relaxed max-w-[34ch]">
            Você já participou nos últimos 90 dias. Use o cupom abaixo na sua
            próxima visita — depois você pode participar de novo.
          </p>
        )}
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
          {result.prize?.name}
        </p>
        {result.prize?.description && (
          <p className="text-q-cream-soft text-[0.92rem] leading-relaxed max-w-[28ch]">
            {result.prize.description}
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
          válido até{" "}
          <span className="not-italic nums-tabular">{expiresDate}</span>
        </p>
      </div>

      <p className="font-serif italic text-q-cream text-[0.95rem]">
        Apresente quando voltar.
      </p>

      <div className="pt-2 flex flex-col gap-3">
        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center justify-between gap-3 border-t border-b border-q-gold/60 hover:border-q-gold py-4 px-1 text-q-cream transition-colors duration-300"
        >
          <span className="flex items-center gap-3 min-w-0">
            <svg
              viewBox="0 0 24 24"
              className="w-4 h-4 shrink-0 text-q-gold"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M20.52 3.48A11.85 11.85 0 0 0 12.05 0C5.48 0 .14 5.34.14 11.91c0 2.1.55 4.15 1.6 5.96L0 24l6.27-1.64a11.9 11.9 0 0 0 5.78 1.47h.01c6.57 0 11.91-5.34 11.91-11.91 0-3.18-1.24-6.17-3.45-8.44ZM12.06 21.8h-.01a9.88 9.88 0 0 1-5.04-1.38l-.36-.22-3.72.97 1-3.63-.24-.37a9.86 9.86 0 0 1-1.52-5.26c0-5.46 4.44-9.9 9.9-9.9 2.65 0 5.13 1.03 7 2.9a9.86 9.86 0 0 1 2.9 7c-.01 5.46-4.45 9.9-9.9 9.9Zm5.43-7.41c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.6.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51l-.57-.01c-.2 0-.52.07-.79.37s-1.04 1.01-1.04 2.47 1.07 2.87 1.22 3.07c.15.2 2.1 3.2 5.08 4.48.71.31 1.26.49 1.7.63.71.23 1.36.2 1.87.12.57-.08 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.41-.07-.12-.27-.2-.57-.34Z" />
            </svg>
            <span
              className="font-serif text-[1rem] smallcaps truncate"
              style={{
                fontVariationSettings: '"opsz" 24, "SOFT" 40, "wght" 450',
                letterSpacing: "0.14em",
              }}
            >
              Validar Cupom de desconto
            </span>
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
        </a>

        <p
          className="text-center text-q-cream-soft text-[0.78rem] font-serif italic leading-snug max-w-[34ch] mx-auto"
          style={{ fontVariationSettings: '"opsz" 12, "SOFT" 60' }}
        >
          Envie do mesmo WhatsApp que você cadastrou — é assim que a gente
          valida o cupom.
        </p>

        <button
          type="button"
          onClick={onRestart}
          className="self-center text-q-stone/70 hover:text-q-cream-soft text-[0.78rem] font-serif italic transition-colors duration-300 py-2 px-3 mt-2"
          style={{ fontVariationSettings: '"opsz" 12, "SOFT" 60' }}
        >
          outro avaliador?
        </button>
      </div>
    </section>
  );
}

// Tela quando o cliente cai em "Quase!": sem cupom, só agradecimento
function NoCouponResult({ onRestart }: { onRestart: () => void }) {
  return (
    <section className="space-y-9">
      <div className="space-y-3">
        <p
          className="font-serif-small italic text-q-cream-soft text-xs smallcaps"
          style={{ letterSpacing: "0.16em" }}
        >
          obrigado por avaliar
        </p>
        <h2
          className="font-serif text-q-cream-bright text-[2.4rem] leading-[0.95]"
          style={{
            fontVariationSettings: '"opsz" 144, "SOFT" 20, "wght" 400',
            letterSpacing: "-0.012em",
          }}
        >
          Quase.
        </h2>
      </div>

      <div
        className="h-px w-12 bg-q-gold-deep origin-left animate-reveal-line"
        aria-hidden="true"
      />

      <p className="text-q-cream-soft text-[0.98rem] leading-relaxed max-w-[34ch]">
        Não foi dessa vez — mas seu feedback chegou pra gente e isso vale
        muito. Volte na próxima visita pra tentar de novo.
      </p>

      <p className="font-serif italic text-q-cream text-[0.95rem]">
        Te esperamos.
      </p>

      <div className="pt-4">
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
