"use client";

import { useEffect, useState, useCallback } from "react";
import { Check } from "lucide-react";
import type { CouponWithDetails } from "@/lib/types";

export default function CouponsPage() {
  const [coupons, setCoupons] = useState<CouponWithDetails[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetchCoupons = useCallback((p: number) => {
    setLoading(true);
    fetch(`/api/admin/coupons?page=${p}`)
      .then((r) => r.json())
      .then((data) => {
        setCoupons(data.coupons);
        setTotalPages(data.pages);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchCoupons(page);
  }, [page, fetchCoupons]);

  const handleRedeem = async (couponId: string) => {
    const res = await fetch("/api/admin/coupons", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ coupon_id: couponId }),
    });
    if (res.ok) {
      fetchCoupons(page);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-q-cream">Cupons</h1>

      {loading ? (
        <div className="flex justify-center py-10">
          <div className="w-8 h-8 border-2 border-q-gold border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="space-y-3">
          {coupons.map((coupon) => {
            const isExpired = new Date(coupon.expires_at) < new Date();
            return (
              <div
                key={coupon.id}
                className={`bg-q-charcoal rounded-xl p-5 flex items-center justify-between ${
                  coupon.redeemed ? "opacity-60" : ""
                }`}
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono font-bold text-q-gold text-lg">
                      {coupon.code}
                    </span>
                    {coupon.redeemed && (
                      <span className="text-xs bg-q-green/20 text-q-green px-2 py-0.5 rounded">
                        Resgatado
                      </span>
                    )}
                    {isExpired && !coupon.redeemed && (
                      <span className="text-xs bg-q-red/20 text-q-red px-2 py-0.5 rounded">
                        Expirado
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-q-cream">
                    {coupon.customer?.name} | {coupon.prize?.name}
                  </p>
                  <p className="text-xs text-q-gray">
                    Emitido: {new Date(coupon.created_at).toLocaleDateString("pt-BR")}
                    {" | "}
                    Expira: {new Date(coupon.expires_at).toLocaleDateString("pt-BR")}
                  </p>
                </div>

                {!coupon.redeemed && !isExpired && (
                  <button
                    onClick={() => handleRedeem(coupon.id)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-q-green/20 text-q-green text-sm hover:bg-q-green/30 transition-colors"
                  >
                    <Check size={16} />
                    Resgatar
                  </button>
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
