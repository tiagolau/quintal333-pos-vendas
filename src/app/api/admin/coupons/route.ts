import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = Math.max(1, Number(searchParams.get("page") || "1"));
  const limit = 20;
  const offset = (page - 1) * limit;

  const { data, error, count } = await supabaseAdmin
    .from("coupons")
    .select(
      "*, customer:customers(name,phone), prize:prizes(name,description)",
      { count: "exact" }
    )
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    console.error("admin:coupons", error);
    return NextResponse.json({ error: "Erro ao buscar cupons" }, { status: 500 });
  }

  const total = count ?? 0;
  return NextResponse.json({
    coupons: data ?? [],
    total,
    page,
    pages: Math.ceil(total / limit),
  });
}

export async function PATCH(request: Request) {
  const { coupon_id } = await request.json();

  if (!coupon_id) {
    return NextResponse.json({ error: "coupon_id obrigatorio" }, { status: 400 });
  }

  const { error } = await supabaseAdmin
    .from("coupons")
    .update({ redeemed: true, redeemed_at: new Date().toISOString() })
    .eq("id", coupon_id);

  if (error) {
    console.error("admin:coupons:patch", error);
    return NextResponse.json({ error: "Erro ao resgatar cupom" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
