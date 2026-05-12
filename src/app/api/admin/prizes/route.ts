import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from("prizes")
    .select("*")
    .order("probability", { ascending: false });

  if (error) {
    console.error("admin:prizes:get", error);
    return NextResponse.json({ error: "Erro ao buscar prêmios" }, { status: 500 });
  }

  return NextResponse.json({ prizes: data ?? [] });
}

export async function PATCH(request: Request) {
  const { id, probability, is_active } = await request.json();

  if (!id) {
    return NextResponse.json({ error: "id obrigatório" }, { status: 400 });
  }

  const patch: Record<string, unknown> = {};
  if (probability !== undefined) patch.probability = probability;
  if (is_active !== undefined) patch.is_active = is_active;

  if (Object.keys(patch).length === 0) {
    return NextResponse.json({ success: true });
  }

  const { error } = await supabaseAdmin.from("prizes").update(patch).eq("id", id);

  if (error) {
    console.error("admin:prizes:patch", error);
    return NextResponse.json({ error: "Erro ao atualizar prêmio" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
