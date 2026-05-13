"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
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
  { href: "/admin/reviews", label: "Avaliações", icon: MessageSquare },
  { href: "/admin/customers", label: "Clientes", icon: Users },
  { href: "/admin/coupons", label: "Cupons", icon: Ticket },
  { href: "/admin/prizes", label: "Prêmios", icon: Trophy },
];

export default function AdminAuthedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-q-black flex">
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

      <main className="flex-1 p-6 overflow-auto">{children}</main>
    </div>
  );
}
