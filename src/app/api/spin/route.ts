import { NextResponse } from "next/server";
import { store } from "@/lib/mock-data";

function generateCouponCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "Q333-";
  for (let i = 0; i < 5; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

export async function POST(request: Request) {
  try {
    const { customer_id, review_id, prize_id } = await request.json();

    if (!customer_id || !review_id || !prize_id) {
      return NextResponse.json(
        { error: "Dados incompletos" },
        { status: 400 }
      );
    }

    // Check if this review already has a coupon
    const existing = store.coupons.find((c) => c.review_id === review_id);
    if (existing) {
      return NextResponse.json({
        coupon_code: existing.code,
        expires_at: existing.expires_at,
        already_spun: true,
      });
    }

    const couponCode = generateCouponCode();
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

    store.coupons.push({
      id: store.uid(),
      customer_id,
      review_id,
      prize_id,
      code: couponCode,
      redeemed: false,
      redeemed_at: null,
      expires_at: expiresAt,
      created_at: new Date().toISOString(),
    });

    return NextResponse.json({
      coupon_code: couponCode,
      expires_at: expiresAt,
    });
  } catch {
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
