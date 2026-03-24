"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  MessageSquare,
  Ticket,
  Trophy,
  Users,
  LogOut,
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard", icon: BarChart3 },
  { href: "/admin/reviews", label: "Avaliacoes", icon: MessageSquare },
  { href: "/admin/customers", label: "Clientes", icon: Users },
  { href: "/admin/coupons", label: "Cupons", icon: Ticket },
  { href: "/admin/prizes", label: "Premios", icon: Trophy },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = sessionStorage.getItem("admin_authed");
      if (saved === "1") setAuthed(true);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple password check - in production use proper auth
    if (password === (process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "quintal333")) {
      setAuthed(true);
      sessionStorage.setItem("admin_authed", "1");
    } else {
      setError(true);
    }
  };

  const handleLogout = () => {
    setAuthed(false);
    sessionStorage.removeItem("admin_authed");
  };

  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-q-black p-4">
        <form
          onSubmit={handleLogin}
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
              setError(false);
            }}
            placeholder="Senha"
            className="w-full px-4 py-3 rounded-lg bg-q-black border border-q-gray/30 text-q-cream placeholder-q-gray/50 focus:outline-none focus:border-q-gold"
          />
          {error && (
            <p className="text-q-red text-sm text-center">Senha incorreta</p>
          )}
          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-q-gold text-q-black font-semibold hover:bg-q-gold-light transition-colors"
          >
            Entrar
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-q-black flex">
      {/* Sidebar */}
      <aside className="w-56 bg-q-charcoal border-r border-q-gray/10 flex flex-col">
        <div className="p-4 border-b border-q-gray/10">
          <h1 className="text-lg font-bold text-q-gold">QUINTAL 333</h1>
          <p className="text-q-gray text-xs">Admin</p>
        </div>
        <nav className="flex-1 p-2 space-y-1">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                pathname === href
                  ? "bg-q-gold/10 text-q-gold"
                  : "text-q-gray hover:text-q-cream hover:bg-q-black/30"
              }`}
            >
              <Icon size={18} />
              {label}
            </Link>
          ))}
        </nav>
        <div className="p-2 border-t border-q-gray/10">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-q-gray hover:text-q-red w-full transition-colors"
          >
            <LogOut size={18} />
            Sair
          </button>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 p-6 overflow-auto">{children}</main>
    </div>
  );
}
