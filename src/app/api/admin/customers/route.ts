import { NextResponse } from "next/server";
import { store } from "@/lib/mock-data";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = Number(searchParams.get("page") || "1");
  const search = (searchParams.get("search") || "").toLowerCase();
  const limit = 20;
  const offset = (page - 1) * limit;

  let filtered = store.customers;
  if (search) {
    filtered = filtered.filter(
      (c) =>
        c.name.toLowerCase().includes(search) ||
        c.phone.includes(search)
    );
  }

  const sorted = [...filtered].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  const paged = sorted.slice(offset, offset + limit);

  return NextResponse.json({
    customers: paged,
    total: filtered.length,
    page,
    pages: Math.ceil(filtered.length / limit),
  });
}
