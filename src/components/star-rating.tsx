"use client";

import { Star } from "lucide-react";

interface StarRatingProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
}

export function StarRating({ label, value, onChange }: StarRatingProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-q-cream text-sm font-medium min-w-[100px]">
        {label}
      </span>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            className="p-1 transition-transform active:scale-125"
            aria-label={`${star} estrela${star > 1 ? "s" : ""}`}
          >
            <Star
              size={32}
              className={
                star <= value
                  ? "fill-q-gold text-q-gold"
                  : "fill-none text-q-gray/40"
              }
            />
          </button>
        ))}
      </div>
    </div>
  );
}
