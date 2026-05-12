"use client";

const STAR_PATH =
  "M12 2.2 L14.55 9.35 L22 9.55 L15.95 14.05 L18.35 21.35 L12 16.85 L5.65 21.35 L8.05 14.05 L2 9.55 L9.45 9.35 Z";

interface StarRatingProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
}

export function StarRating({ label, value, onChange }: StarRatingProps) {
  return (
    <div className="flex items-baseline gap-3 py-2.5">
      <span className="text-q-cream text-[0.95rem] font-normal whitespace-nowrap">
        {label}
      </span>
      <span
        className="flex-1 self-center border-b border-dotted border-q-stone/40 translate-y-px"
        aria-hidden="true"
      />
      <div
        className="flex gap-0.5 -mr-1"
        role="radiogroup"
        aria-label={`Avaliação de ${label}`}
      >
        {[1, 2, 3, 4, 5].map((star) => {
          const filled = star <= value;
          return (
            <button
              key={star}
              type="button"
              role="radio"
              aria-checked={value === star}
              onClick={() => onChange(star)}
              className="relative w-9 h-9 flex items-center justify-center -mx-px group"
              aria-label={`${star} estrela${star > 1 ? "s" : ""} em ${label}`}
            >
              <span
                className="absolute inset-0"
                aria-hidden="true"
              />
              <svg
                viewBox="0 0 24 24"
                className="w-[22px] h-[22px] transition-[fill,stroke,opacity] duration-300 ease-out group-active:opacity-70"
                fill={filled ? "var(--q-gold)" : "transparent"}
                stroke={filled ? "var(--q-gold)" : "var(--q-stone)"}
                strokeWidth={filled ? 0.6 : 1}
                strokeLinejoin="round"
                style={{ opacity: filled ? 1 : 0.65 }}
              >
                <path d={STAR_PATH} />
              </svg>
            </button>
          );
        })}
      </div>
    </div>
  );
}
