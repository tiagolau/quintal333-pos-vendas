import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from("prizes")
    .select("*")
    .eq("is_active", true)
    .order("probability", { ascending: false });

  if (error) {
    console.error("prizes:get", error);
    return NextResponse.json({ error: "Erro ao buscar prêmios" }, { status: 500 });
  }

  return NextResponse.json({ prizes: data ?? [] });
}
