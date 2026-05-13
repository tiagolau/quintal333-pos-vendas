"use client";

import { useEffect, useState } from "react";
import { RouletteWheel } from "@/components/roulette-wheel";
import type { Prize } from "@/lib/types";

interface RouletteStepProps {
  customerId: string;
  reviewId: string;
  onSpinComplete: (prize: Prize, couponCode: string, expiresAt: string) => void;
}

export function RouletteStep({
  customerId,
  reviewId,
  onSpinComplete,
}: RouletteStepProps) {
  const [prizes, setPrizes] = useState<Prize[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch("/api/prizes")
      .then((r) => r.json())
      .then((data) => {
        setPrizes(data.prizes || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleSpinComplete = async (prize: Prize) => {
    if (submitting) return;
    setSubmitting(true);

    try {
      const res = await fetch("/api/spin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_id: customerId,
          review_id: reviewId,
          prize_id: prize.id,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      onSpinComplete(prize, data.coupon_code, data.expires_at);
    } catch {
      onSpinComplete(
        prize,
        "QUINTAL5",
        new Date(Date.now() + 90 * 86400000).toISOString(),
      );
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div
          className="h-px w-12 bg-q-gold-deep origin-center animate-reveal-line"
          aria-hidden="true"
        />
        <p
          className="font-serif italic text-q-cream-soft text-sm"
          style={{ fontVariationSettings: '"opsz" 14, "SOFT" 60' }}
        >
          preparando
        </p>
      </div>
    );
  }

  return (
    <section className="space-y-10">
      <div className="space-y-1 text-center">
        <h2
          className="font-serif text-q-cream-bright text-[1.9rem] leading-[1.05]"
          style={{
            fontVariationSettings: '"opsz" 120, "SOFT" 30, "wght" 400',
            letterSpacing: "-0.005em",
          }}
        >
          Sua vez.
        </h2>
        <p className="text-q-cream-soft text-sm font-serif italic">
          o que estiver para você está nesse disco.
        </p>
      </div>

      <RouletteWheel
        prizes={prizes}
        onSpinComplete={handleSpinComplete}
        disabled={submitting}
      />
    </section>
  );
}
