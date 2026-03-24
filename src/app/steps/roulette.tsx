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
      onSpinComplete(prize, "QUINTAL5", new Date(Date.now() + 30 * 86400000).toISOString());
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-q-gold border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4 text-center">
      <h2 className="text-xl font-semibold text-q-cream">
        Gire a roleta!
      </h2>
      <p className="text-q-gray text-sm">
        Toque no botao e descubra seu premio
      </p>
      <RouletteWheel
        prizes={prizes}
        onSpinComplete={handleSpinComplete}
        disabled={submitting}
      />
    </div>
  );
}
