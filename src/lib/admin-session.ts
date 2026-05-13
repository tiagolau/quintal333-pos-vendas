// Sessão admin: cookie httpOnly assinado com HMAC-SHA256 via Web Crypto.
// Edge-compatível (usado também no middleware).

const ENCODER = new TextEncoder();
const DECODER = new TextDecoder();

export const SESSION_COOKIE = "q333_admin";
export const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7;

interface SessionPayload {
  sub: "admin";
  iat: number;
  exp: number;
}

function toB64Url(bytes: Uint8Array): string {
  let bin = "";
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromB64Url(s: string): Uint8Array {
  let str = s.replace(/-/g, "+").replace(/_/g, "/");
  while (str.length % 4) str += "=";
  const bin = atob(str);
  const buf = new ArrayBuffer(bin.length);
  const out = new Uint8Array(buf);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

async function hmacKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    ENCODER.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );
}

export function getAdminSecret(): string {
  const s = process.env.ADMIN_SESSION_SECRET;
  if (!s || s.length < 16) {
    throw new Error(
      "ADMIN_SESSION_SECRET deve estar configurado com pelo menos 16 caracteres",
    );
  }
  return s;
}

function asBufferSource(bytes: Uint8Array): BufferSource {
  return bytes as unknown as BufferSource;
}

export async function createSessionToken(secret: string): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const payload: SessionPayload = {
    sub: "admin",
    iat: now,
    exp: now + SESSION_TTL_SECONDS,
  };
  const payloadBytes = ENCODER.encode(JSON.stringify(payload));
  const payloadB64 = toB64Url(payloadBytes);
  const key = await hmacKey(secret);
  const sig = await crypto.subtle.sign(
    "HMAC",
    key,
    asBufferSource(ENCODER.encode(payloadB64)),
  );
  return `${payloadB64}.${toB64Url(new Uint8Array(sig))}`;
}

export async function verifySessionToken(
  token: string | undefined,
  secret: string,
): Promise<boolean> {
  if (!token || !token.includes(".")) return false;
  const [payloadB64, sigB64] = token.split(".");
  if (!payloadB64 || !sigB64) return false;
  try {
    const key = await hmacKey(secret);
    const ok = await crypto.subtle.verify(
      "HMAC",
      key,
      asBufferSource(fromB64Url(sigB64)),
      asBufferSource(ENCODER.encode(payloadB64)),
    );
    if (!ok) return false;
    const payload = JSON.parse(
      DECODER.decode(fromB64Url(payloadB64)),
    ) as SessionPayload;
    if (typeof payload.exp !== "number") return false;
    return payload.exp > Math.floor(Date.now() / 1000);
  } catch {
    return false;
  }
}
