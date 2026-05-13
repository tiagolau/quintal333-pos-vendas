"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as {
          error?: string;
        };
        throw new Error(data.error || "Senha incorreta");
      }
      const from = params.get("from") || "/admin";
      router.replace(from);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha ao entrar");
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-sm bg-q-charcoal rounded-2xl p-8 space-y-6"
    >
      <div className="text-center">
        <h1 className="text-2xl font-bold text-q-gold">QUINTAL 333</h1>
        <p className="text-q-gray text-sm mt-1">Painel Administrativo</p>
      </div>
      <input
        type="password"
        value={password}
        onChange={(e) => {
          setPassword(e.target.value);
          setError("");
        }}
        placeholder="Senha"
        autoFocus
        className="w-full px-4 py-3 rounded-lg bg-q-black border border-q-gray/30 text-q-cream placeholder-q-gray/50 focus:outline-none focus:border-q-gold"
      />
      {error && <p className="text-q-red text-sm text-center">{error}</p>}
      <button
        type="submit"
        disabled={loading || password.length === 0}
        className="w-full py-3 rounded-lg bg-q-gold text-q-black font-semibold hover:bg-q-gold-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Entrando…" : "Entrar"}
      </button>
    </form>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-q-black p-4">
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
