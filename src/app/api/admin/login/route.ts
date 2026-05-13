import { NextResponse } from "next/server";
import {
  SESSION_COOKIE,
  SESSION_TTL_SECONDS,
  createSessionToken,
  getAdminSecret,
} from "@/lib/admin-session";

export const runtime = "edge";

function constantTimeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export async function POST(req: Request) {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) {
    return NextResponse.json(
      { error: "Servidor mal configurado" },
      { status: 500 },
    );
  }

  let password: unknown;
  try {
    const body = await req.json();
    password = (body as { password?: unknown })?.password;
  } catch {
    return NextResponse.json({ error: "Payload inválido" }, { status: 400 });
  }

  // Atraso pequeno em falhas para frustrar brute-force trivial.
  if (typeof password !== "string" || !constantTimeEqual(password, expected)) {
    await new Promise((r) => setTimeout(r, 350));
    return NextResponse.json({ error: "Senha incorreta" }, { status: 401 });
  }

  const token = await createSessionToken(getAdminSecret());
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  });
  return res;
}
