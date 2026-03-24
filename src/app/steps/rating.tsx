"use client";

import { StarRating } from "@/components/star-rating";
import type { FlowState } from "@/lib/types";

interface RatingStepProps {
  ratings: FlowState["ratings"];
  onChange: (ratings: FlowState["ratings"]) => void;
  onNext: () => void;
}

export function RatingStep({ ratings, onChange, onNext }: RatingStepProps) {
  const allRated = ratings.pizza > 0 && ratings.service > 0 && ratings.ambiance > 0;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-q-cream">
          Como foi sua experiencia?
        </h2>
        <p className="text-q-gray text-sm mt-1">
          Avalie e gire a roleta para ganhar um premio!
        </p>
      </div>

      <div className="bg-q-charcoal rounded-2xl p-6 space-y-5">
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

      <div>
        <label className="block text-sm text-q-gray mb-2">
          Comentario (opcional)
        </label>
        <textarea
          value={ratings.comment}
          onChange={(e) =>
            onChange({ ...ratings, comment: e.target.value.slice(0, 200) })
          }
          placeholder="Conta pra gente o que achou..."
          maxLength={200}
          rows={3}
          className="w-full px-4 py-3 rounded-lg bg-q-charcoal border border-q-gray/30 text-q-cream placeholder-q-gray/50 focus:outline-none focus:border-q-gold transition-colors resize-none"
        />
        <span className="text-xs text-q-gray">{ratings.comment.length}/200</span>
      </div>

      <button
        onClick={onNext}
        disabled={!allRated}
        className={`
          w-full py-4 rounded-xl text-lg font-semibold transition-all
          ${
            allRated
              ? "bg-q-gold text-q-black hover:bg-q-gold-light active:scale-[0.98]"
              : "bg-q-gray/20 text-q-gray cursor-not-allowed"
          }
        `}
      >
        Proximo
      </button>
    </div>
  );
}
