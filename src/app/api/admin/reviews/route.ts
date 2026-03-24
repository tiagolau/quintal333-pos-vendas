import { NextResponse } from "next/server";
import { store } from "@/lib/mock-data";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = Number(searchParams.get("page") || "1");
  const limit = 20;
  const offset = (page - 1) * limit;

  const sorted = [...store.reviews].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  const paged = sorted.slice(offset, offset + limit);

  const reviews = paged.map((r) => {
    const customer = store.customers.find((c) => c.id === r.customer_id);
    return {
      ...r,
      customer: customer ? { name: customer.name, phone: customer.phone } : null,
    };
  });

  return NextResponse.json({
    reviews,
    total: store.reviews.length,
    page,
    pages: Math.ceil(store.reviews.length / limit),
  });
}
