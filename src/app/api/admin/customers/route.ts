import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = Math.max(1, Number(searchParams.get("page") || "1"));
  const search = (searchParams.get("search") || "").trim();
  const limit = 20;
  const offset = (page - 1) * limit;

  let query = supabaseAdmin
    .from("customers")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (search) {
    // Busca por nome OU telefone
    query = query.or(`name.ilike.%${search}%,phone.ilike.%${search}%`);
  }

  const { data, error, count } = await query;

  if (error) {
    console.error("admin:customers", error);
    return NextResponse.json({ error: "Erro ao buscar clientes" }, { status: 500 });
  }

  const total = count ?? 0;
  return NextResponse.json({
    customers: data ?? [],
    total,
    page,
    pages: Math.ceil(total / limit),
  });
}
