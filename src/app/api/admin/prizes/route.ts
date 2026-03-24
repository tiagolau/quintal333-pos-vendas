import { NextResponse } from "next/server";
import { store } from "@/lib/mock-data";

export async function GET() {
  const prizes = [...store.prizes].sort((a, b) => b.probability - a.probability);
  return NextResponse.json({ prizes });
}

export async function PATCH(request: Request) {
  const { id, probability, is_active } = await request.json();

  if (!id) {
    return NextResponse.json({ error: "id obrigatorio" }, { status: 400 });
  }

  const prize = store.prizes.find((p) => p.id === id);
  if (!prize) {
    return NextResponse.json({ error: "Premio nao encontrado" }, { status: 404 });
  }

  if (probability !== undefined) prize.probability = probability;
  if (is_active !== undefined) prize.is_active = is_active;

  return NextResponse.json({ success: true });
}
