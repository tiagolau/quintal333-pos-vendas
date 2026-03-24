import { NextResponse } from "next/server";
import { store } from "@/lib/mock-data";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = Number(searchParams.get("page") || "1");
  const limit = 20;
  const offset = (page - 1) * limit;

  const sorted = [...store.coupons].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  const paged = sorted.slice(offset, offset + limit);

  const coupons = paged.map((cp) => {
    const customer = store.customers.find((c) => c.id === cp.customer_id);
    const prize = store.prizes.find((p) => p.id === cp.prize_id);
    return {
      ...cp,
      customer: customer ? { name: customer.name, phone: customer.phone } : null,
      prize: prize ? { name: prize.name, description: prize.description } : null,
    };
  });

  return NextResponse.json({
    coupons,
    total: store.coupons.length,
    page,
    pages: Math.ceil(store.coupons.length / limit),
  });
}

export async function PATCH(request: Request) {
  const { coupon_id } = await request.json();

  if (!coupon_id) {
    return NextResponse.json({ error: "coupon_id obrigatorio" }, { status: 400 });
  }

  const coupon = store.coupons.find((c) => c.id === coupon_id);
  if (!coupon) {
    return NextResponse.json({ error: "Cupom nao encontrado" }, { status: 404 });
  }

  coupon.redeemed = true;
  coupon.redeemed_at = new Date().toISOString();

  return NextResponse.json({ success: true });
}
