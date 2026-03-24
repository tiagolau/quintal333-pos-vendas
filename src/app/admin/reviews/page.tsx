"use client";

import { useEffect, useState } from "react";
import { Star, AlertTriangle } from "lucide-react";
import type { ReviewWithCustomer } from "@/lib/types";

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<ReviewWithCustomer[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetchReviews = (p: number) => {
    setLoading(true);
    fetch(`/api/admin/reviews?page=${p}`)
      .then((r) => r.json())
      .then((data) => {
        setReviews(data.reviews);
        setTotalPages(data.pages);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchReviews(page);
  }, [page]);

  const renderStars = (rating: number) => (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          size={14}
          className={s <= rating ? "fill-q-gold text-q-gold" : "text-q-gray/30"}
        />
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-q-cream">Avaliacoes</h1>

      {loading ? (
        <div className="flex justify-center py-10">
          <div className="w-8 h-8 border-2 border-q-gold border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="space-y-3">
          {reviews.map((review) => {
            const avg = (review.pizza_rating + review.service_rating + review.ambiance_rating) / 3;
            const isLow = avg < 3;

            return (
              <div
                key={review.id}
                className={`bg-q-charcoal rounded-xl p-5 ${isLow ? "border border-q-red/50" : ""}`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-semibold text-q-cream">
                      {review.customer?.name || "Anonimo"}
                    </p>
                    <p className="text-xs text-q-gray">
                      {review.customer?.phone} |{" "}
                      {new Date(review.created_at).toLocaleDateString("pt-BR")}{" "}
                      {new Date(review.created_at).toLocaleTimeString("pt-BR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  {isLow && (
                    <span className="flex items-center gap-1 text-xs text-q-red bg-q-red/10 px-2 py-1 rounded">
                      <AlertTriangle size={12} /> Alerta
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-4 mb-3">
                  <div>
                    <p className="text-xs text-q-gray mb-1">Pizza</p>
                    {renderStars(review.pizza_rating)}
                  </div>
                  <div>
                    <p className="text-xs text-q-gray mb-1">Atendimento</p>
                    {renderStars(review.service_rating)}
                  </div>
                  <div>
                    <p className="text-xs text-q-gray mb-1">Ambiente</p>
                    {renderStars(review.ambiance_rating)}
                  </div>
                </div>

                {review.comment && (
                  <p className="text-sm text-q-cream bg-q-black/50 rounded-lg p-3">
                    &quot;{review.comment}&quot;
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`px-3 py-1.5 rounded text-sm ${
                page === i + 1
                  ? "bg-q-gold text-q-black"
                  : "bg-q-charcoal text-q-gray hover:text-q-cream"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
