"use client";

import { useEffect, useState, useCallback } from "react";
import { Search, Download } from "lucide-react";
import type { Customer } from "@/lib/types";

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchCustomers = useCallback((p: number, q: string) => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(p) });
    if (q) params.set("search", q);
    fetch(`/api/admin/customers?${params}`)
      .then((r) => r.json())
      .then((data) => {
        setCustomers(data.customers);
        setTotalPages(data.pages);
        setTotal(data.total);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchCustomers(page, search);
  }, [page, search, fetchCustomers]);

  const exportCSV = () => {
    const header = "Nome,Telefone,Aniversario,WhatsApp,Cadastro\n";
    const rows = customers
      .map(
        (c) =>
          `"${c.name}","${c.phone}","${c.birthday || ""}","${c.accepts_whatsapp ? "Sim" : "Nao"}","${new Date(c.created_at).toLocaleDateString("pt-BR")}"`
      )
      .join("\n");
    const blob = new Blob([header + rows], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `clientes-quintal-333-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-q-cream">
          Clientes <span className="text-q-gray text-base font-normal">({total})</span>
        </h1>
        <button
          onClick={exportCSV}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-q-charcoal text-q-cream text-sm hover:bg-q-gold/10 transition-colors"
        >
          <Download size={16} />
          Exportar CSV
        </button>
      </div>

      <div className="relative">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-q-gray" />
        <input
          type="text"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          placeholder="Buscar por nome ou telefone..."
          className="w-full pl-10 pr-4 py-3 rounded-lg bg-q-charcoal border border-q-gray/30 text-q-cream placeholder-q-gray/50 focus:outline-none focus:border-q-gold"
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-10">
          <div className="w-8 h-8 border-2 border-q-gold border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs text-q-gray uppercase tracking-wider border-b border-q-gray/10">
                <th className="pb-3 px-2">Nome</th>
                <th className="pb-3 px-2">Telefone</th>
                <th className="pb-3 px-2">Aniversario</th>
                <th className="pb-3 px-2">WhatsApp</th>
                <th className="pb-3 px-2">Cadastro</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-q-gray/10">
              {customers.map((c) => (
                <tr key={c.id} className="hover:bg-q-charcoal/50">
                  <td className="py-3 px-2 text-q-cream">{c.name}</td>
                  <td className="py-3 px-2 text-q-gray font-mono text-sm">
                    {c.phone}
                  </td>
                  <td className="py-3 px-2 text-q-gray text-sm">
                    {c.birthday || "-"}
                  </td>
                  <td className="py-3 px-2">
                    <span
                      className={`text-xs px-2 py-0.5 rounded ${
                        c.accepts_whatsapp
                          ? "bg-q-green/20 text-q-green"
                          : "bg-q-gray/20 text-q-gray"
                      }`}
                    >
                      {c.accepts_whatsapp ? "Sim" : "Nao"}
                    </span>
                  </td>
                  <td className="py-3 px-2 text-q-gray text-sm">
                    {new Date(c.created_at).toLocaleDateString("pt-BR")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`px-3 py-1.5 rounded text-sm ${
                page === i + 1
                  ? "bg-q-gold text-q-black"
                  : "bg-q-charcoal text-q-gray hover:text-q-cream"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
