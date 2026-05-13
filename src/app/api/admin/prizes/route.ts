import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from("prizes")
    .select("*")
    .order("probability", { ascending: false });

  if (error) {
    console.error("admin:prizes:get", error);
    return NextResponse.json(
      { error: "Erro ao buscar prêmios" },
      { status: 500 },
    );
  }

  return NextResponse.json({ prizes: data ?? [] });
}

interface PrizePatchBody {
  id?: string;
  name?: string;
  description?: string;
  probability?: number;
  is_active?: boolean;
}

export async function PATCH(request: Request) {
  const body = (await request.json().catch(() => ({}))) as PrizePatchBody;
  const { id, name, description, probability, is_active } = body;

  if (!id) {
    return NextResponse.json({ error: "id obrigatório" }, { status: 400 });
  }

  const patch: Record<string, unknown> = {};
  if (typeof name === "string") {
    const v = name.trim();
    if (v.length === 0) {
      return NextResponse.json(
        { error: "Nome não pode ficar vazio" },
        { status: 400 },
      );
    }
    patch.name = v;
  }
  if (typeof description === "string") patch.description = description.trim();
  if (typeof probability === "number") {
    if (probability < 0 || probability > 100) {
      return NextResponse.json(
        { error: "Probabilidade deve ficar entre 0 e 100" },
        { status: 400 },
      );
    }
    patch.probability = Math.round(probability);
  }
  if (typeof is_active === "boolean") patch.is_active = is_active;

  if (Object.keys(patch).length === 0) {
    return NextResponse.json({ success: true });
  }

  const { error } = await supabaseAdmin
    .from("prizes")
    .update(patch)
    .eq("id", id);

  if (error) {
    console.error("admin:prizes:patch", error);
    return NextResponse.json(
      { error: "Erro ao atualizar prêmio" },
      { status: 500 },
    );
  }

  return NextResponse.json({ success: true });
}

interface PrizePostBody {
  name?: string;
  description?: string;
  probability?: number;
  is_active?: boolean;
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as PrizePostBody;
  const name = (body.name ?? "").trim();
  const description = (body.description ?? "").trim();
  const probability = Number(body.probability ?? 0);
  const is_active = body.is_active ?? true;

  if (!name) {
    return NextResponse.json({ error: "Nome obrigatório" }, { status: 400 });
  }
  if (!Number.isFinite(probability) || probability < 0 || probability > 100) {
    return NextResponse.json(
      { error: "Probabilidade deve ficar entre 0 e 100" },
      { status: 400 },
    );
  }

  const { data, error } = await supabaseAdmin
    .from("prizes")
    .insert({
      name,
      description,
      probability: Math.round(probability),
      is_active,
    })
    .select("*")
    .single();

  if (error) {
    console.error("admin:prizes:post", error);
    return NextResponse.json(
      { error: "Erro ao criar prêmio" },
      { status: 500 },
    );
  }

  return NextResponse.json({ prize: data });
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "id obrigatório" }, { status: 400 });
  }

  // FK em coupons.prize_id é ON DELETE SET NULL — cupons existentes ficam órfãos
  // mas continuam válidos (apenas perdem a referência ao prêmio).
  const { error } = await supabaseAdmin.from("prizes").delete().eq("id", id);

  if (error) {
    console.error("admin:prizes:delete", error);
    return NextResponse.json(
      { error: "Erro ao excluir prêmio" },
      { status: 500 },
    );
  }

  return NextResponse.json({ success: true });
}
