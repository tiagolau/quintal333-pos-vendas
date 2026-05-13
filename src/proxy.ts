import { NextRequest, NextResponse } from "next/server";
import {
  SESSION_COOKIE,
  getAdminSecret,
  verifySessionToken,
} from "@/lib/admin-session";

const PUBLIC = new Set(["/admin/login", "/api/admin/login"]);

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (PUBLIC.has(pathname)) return NextResponse.next();

  const isApi = pathname.startsWith("/api/admin");

  let secret: string;
  try {
    secret = getAdminSecret();
  } catch {
    return isApi
      ? NextResponse.json({ error: "Servidor mal configurado" }, { status: 500 })
      : NextResponse.redirect(new URL("/admin/login?err=config", req.url));
  }

  const token = req.cookies.get(SESSION_COOKIE)?.value;
  const ok = await verifySessionToken(token, secret);
  if (ok) return NextResponse.next();

  if (isApi) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }
  const url = req.nextUrl.clone();
  url.pathname = "/admin/login";
  if (pathname !== "/admin") url.searchParams.set("from", pathname);
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
