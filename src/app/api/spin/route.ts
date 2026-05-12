import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

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


    const { data: existing } = await supabaseAdmin
      .from("coupons")
      .select("code, expires_at")
      .eq("review_id", review_id)
      .maybeSingle();

    if (existing) {
      return NextResponse.json({
        coupon_code: existing.code,
        expires_at: existing.expires_at,
        already_spun: true,
      });
    }

    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

    // Tenta gerar um código único — extremamente improvável colidir, mas garantimos.
    for (let attempt = 0; attempt < 5; attempt++) {
      const code = generateCouponCode();
      const { data, error } = await supabaseAdmin
        .from("coupons")
        .insert({
          customer_id,
          review_id,
          prize_id,
          code,
          expires_at: expiresAt,
        })
        .select("code, expires_at")
        .single();

      if (!error && data) {
        return NextResponse.json({
          coupon_code: data.code,
          expires_at: data.expires_at,
        });
      }

      // 23505 = unique_violation (código duplicado), tenta de novo
      if (error && error.code !== "23505") {
        console.error("spin:insert", error);
        return NextResponse.json(
          { error: "Erro ao gerar cupom" },
          { status: 500 }
        );
      }
    }

    return NextResponse.json(
      { error: "Não foi possível gerar cupom único" },
      { status: 500 }
    );
  } catch (e) {
    console.error("spin:exception", e);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
