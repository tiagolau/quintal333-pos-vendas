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

interface CouponPatchBody {
  coupon_id?: string;
  prize_id?: string;
  expires_at?: string; // ISO string
  redeemed?: boolean;
}

export async function PATCH(request: Request) {
  const body = (await request.json().catch(() => ({}))) as CouponPatchBody;
  const { coupon_id, prize_id, expires_at, redeemed } = body;

  if (!coupon_id) {
    return NextResponse.json(
      { error: "coupon_id obrigatório" },
      { status: 400 },
    );
  }

  const patch: Record<string, unknown> = {};
  if (typeof prize_id === "string" && prize_id) patch.prize_id = prize_id;
  if (typeof expires_at === "string" && expires_at) {
    const d = new Date(expires_at);
    if (Number.isNaN(d.getTime())) {
      return NextResponse.json(
        { error: "expires_at inválido" },
        { status: 400 },
      );
    }
    patch.expires_at = d.toISOString();
  }
  if (typeof redeemed === "boolean") {
    patch.redeemed = redeemed;
    patch.redeemed_at = redeemed ? new Date().toISOString() : null;
  }

  if (Object.keys(patch).length === 0) {
    return NextResponse.json({ success: true });
  }

  const { error } = await supabaseAdmin
    .from("coupons")
    .update(patch)
    .eq("id", coupon_id);

  if (error) {
    console.error("admin:coupons:patch", error);
    return NextResponse.json(
      { error: "Erro ao atualizar cupom" },
      { status: 500 },
    );
  }

  return NextResponse.json({ success: true });
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "id obrigatório" }, { status: 400 });
  }

  const { error } = await supabaseAdmin.from("coupons").delete().eq("id", id);
  if (error) {
    console.error("admin:coupons:delete", error);
    return NextResponse.json(
      { error: "Erro ao excluir cupom" },
      { status: 500 },
    );
  }

  return NextResponse.json({ success: true });
}
