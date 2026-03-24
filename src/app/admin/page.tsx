"use client";

import { useEffect, useState } from "react";
import { Star, Users, Ticket, TrendingUp } from "lucide-react";
import type { DashboardStats } from "@/lib/types";

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  color,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  sub?: string;
  color: string;
}) {
  return (
    <div className="bg-q-charcoal rounded-xl p-5">
      <div className="flex items-center gap-3 mb-3">
        <div className={`p-2 rounded-lg ${color}`}>
          <Icon size={20} />
        </div>
        <span className="text-sm text-q-gray">{label}</span>
      </div>
      <p className="text-2xl font-bold text-q-cream">{value}</p>
      {sub && <p className="text-xs text-q-gray mt-1">{sub}</p>}
    </div>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then(setStats)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-q-gold border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!stats) return null;

  const redemptionRate =
    stats.coupons_issued > 0
      ? ((stats.coupons_redeemed / stats.coupons_issued) * 100).toFixed(0)
      : "0";

  const avgOverall = ((stats.avg_pizza + stats.avg_service + stats.avg_ambiance) / 3).toFixed(1);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-q-cream">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Star}
          label="NPS Geral"
          value={`${avgOverall}/5`}
          sub={`Pizza ${stats.avg_pizza} | Atend. ${stats.avg_service} | Amb. ${stats.avg_ambiance}`}
          color="bg-q-gold/20 text-q-gold"
        />
        <StatCard
          icon={Users}
          label="Clientes"
          value={stats.total_customers}
          sub={`+${stats.new_customers_week} esta semana`}
          color="bg-blue-500/20 text-blue-400"
        />
        <StatCard
          icon={TrendingUp}
          label="Avaliacoes"
          value={stats.total_reviews}
          color="bg-green-500/20 text-green-400"
        />
        <StatCard
          icon={Ticket}
          label="Cupons"
          value={stats.coupons_issued}
          sub={`${stats.coupons_redeemed} resgatados (${redemptionRate}%)`}
          color="bg-purple-500/20 text-purple-400"
        />
      </div>

      {/* Quick overview of ratings */}
      <div className="bg-q-charcoal rounded-xl p-6">
        <h2 className="text-lg font-semibold text-q-cream mb-4">
          Medias de Avaliacao
        </h2>
        <div className="space-y-4">
          {[
            { label: "Pizza", value: stats.avg_pizza },
            { label: "Atendimento", value: stats.avg_service },
            { label: "Ambiente", value: stats.avg_ambiance },
          ].map(({ label, value }) => (
            <div key={label} className="flex items-center gap-4">
              <span className="text-sm text-q-gray w-28">{label}</span>
              <div className="flex-1 h-3 bg-q-black rounded-full overflow-hidden">
                <div
                  className="h-full bg-q-gold rounded-full transition-all duration-500"
                  style={{ width: `${(value / 5) * 100}%` }}
                />
              </div>
              <span className="text-sm font-semibold text-q-cream w-10 text-right">
                {value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
