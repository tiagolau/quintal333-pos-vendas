import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = Math.max(1, Number(searchParams.get("page") || "1"));
  const limit = 20;
  const offset = (page - 1) * limit;

  const { data, error, count } = await supabaseAdmin
    .from("reviews")
    .select("*, customer:customers(name,phone)", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    console.error("admin:reviews", error);
    return NextResponse.json({ error: "Erro ao buscar avaliações" }, { status: 500 });
  }

  const total = count ?? 0;
  return NextResponse.json({
    reviews: data ?? [],
    total,
    page,
    pages: Math.ceil(total / limit),
  });
}
