"use client";

const CHAPTERS = ["I", "II", "III", "IV"] as const;
const STEPS = ["rating", "register", "roulette", "result"] as const;

type Step = (typeof STEPS)[number];

export function ChapterIndicator({ current }: { current: Step }) {
  const currentIndex = STEPS.indexOf(current);

  return (
    <div
      className="flex items-center justify-center gap-3 select-none"
      aria-label={`Capítulo ${currentIndex + 1} de 4`}
      role="status"
    >
      {CHAPTERS.map((numeral, i) => {
        const isCurrent = i === currentIndex;
        const isPast = i < currentIndex;
        const tone = isCurrent
          ? "text-q-gold"
          : isPast
            ? "text-q-cream-soft/70"
            : "text-q-stone/60";

        return (
          <div key={numeral} className="flex items-center gap-3">
            <span
              className={`font-serif-small italic text-[0.78rem] ${tone} transition-colors duration-500`}
              style={{
                fontVariationSettings: isCurrent
                  ? '"opsz" 12, "SOFT" 50, "wght" 500'
                  : '"opsz" 12, "SOFT" 50, "wght" 350',
              }}
              aria-current={isCurrent ? "step" : undefined}
            >
              {numeral}
            </span>
            {i < CHAPTERS.length - 1 && (
              <span
                aria-hidden="true"
                className="text-q-stone/40 text-[0.7rem]"
              >
                /
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}
