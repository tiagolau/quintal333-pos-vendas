import { NextResponse } from "next/server";
import { store } from "@/lib/mock-data";

export async function GET() {
  const prizes = store.prizes
    .filter((p) => p.is_active)
    .sort((a, b) => b.probability - a.probability);

  return NextResponse.json({ prizes });
}
