"use client";

import { StarRating } from "@/components/star-rating";
import type { FlowState } from "@/lib/types";

interface RatingStepProps {
  ratings: FlowState["ratings"];
  onChange: (ratings: FlowState["ratings"]) => void;
  onNext: () => void;
}

export function RatingStep({ ratings, onChange, onNext }: RatingStepProps) {
  const allRated =
    ratings.pizza > 0 && ratings.service > 0 && ratings.ambiance > 0;

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
          Conta pra gente
        </h2>
        <p className="text-q-cream-soft text-sm font-serif italic">
          como foi sua noite.
        </p>
      </div>

      <div className="space-y-1.5">
        <StarRating
          label="Pizza"
          value={ratings.pizza}
          onChange={(v) => onChange({ ...ratings, pizza: v })}
        />
        <StarRating
          label="Atendimento"
          value={ratings.service}
          onChange={(v) => onChange({ ...ratings, service: v })}
        />
        <StarRating
          label="Ambiente"
          value={ratings.ambiance}
          onChange={(v) => onChange({ ...ratings, ambiance: v })}
        />
      </div>

      <div className="space-y-2 pt-2">
        <label
          htmlFor="comment"
          className="block text-q-cream-soft text-xs smallcaps font-serif-small italic"
          style={{ fontVariationSettings: '"opsz" 12, "SOFT" 50' }}
        >
          Um bilhete (se quiser)
        </label>
        <div className="relative">
          <textarea
            id="comment"
            value={ratings.comment}
            onChange={(e) =>
              onChange({ ...ratings, comment: e.target.value.slice(0, 200) })
            }
            placeholder="O que te marcou hoje?"
            maxLength={200}
            rows={3}
            className="w-full bg-transparent border-b border-q-stone/40 focus:border-q-gold transition-colors duration-300 text-q-cream placeholder:text-q-stone/60 placeholder:italic placeholder:font-serif resize-none py-2 px-0 focus:outline-none"
          />
          <span className="absolute right-0 -bottom-5 text-[0.7rem] text-q-stone/60 nums-tabular font-serif-small italic">
            {ratings.comment.length}/200
          </span>
        </div>
      </div>

      <div className="pt-8">
        <button
          onClick={onNext}
          disabled={!allRated}
          className={`group w-full flex items-center justify-between gap-2 border-t border-b py-5 px-1 transition-all duration-300 ${
            allRated
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
            Continuar
          </span>
          <span
            aria-hidden="true"
            className={`transition-transform duration-300 ease-out ${
              allRated ? "group-hover:translate-x-1" : ""
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
