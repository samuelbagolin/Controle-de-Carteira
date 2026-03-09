import { Users, UserPlus, UserMinus, UserX, DollarSign, TrendingDown, Percent } from "lucide-react";
import { formatCurrency, formatPercent } from "../lib/utils";
import { cn } from "../lib/utils";

interface MetricsCardsProps {
  totals: {
    totalActive: number;
    totalNew: number;
    totalCancelled: number;
    totalAutoCancelled: number;
    totalInactivated: number;
    totalMRR: number;
    totalMRRLostCancel: number;
    totalMRRLostInactivation: number;
    avgChurn: number;
  };
}

export default function MetricsCards({ totals }: MetricsCardsProps) {
  const cards = [
    {
      label: "Clientes Ativos",
      value: totals.totalActive.toLocaleString("pt-BR"),
      icon: Users,
      color: "text-blue-400",
      bg: "bg-blue-500/10",
      border: "border-blue-500/20",
    },
    {
      label: "Novos Contratos",
      value: totals.totalNew.toLocaleString("pt-BR"),
      icon: UserPlus,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20",
    },
    {
      label: "Cancelamentos",
      value: totals.totalCancelled.toLocaleString("pt-BR"),
      icon: UserMinus,
      color: "text-rose-400",
      bg: "bg-rose-500/10",
      border: "border-rose-500/20",
    },
    {
      label: "Cancelamentos Auto.",
      value: totals.totalAutoCancelled.toLocaleString("pt-BR"),
      icon: UserX,
      color: "text-orange-400",
      bg: "bg-orange-500/10",
      border: "border-orange-500/20",
    },
    {
      label: "MRR Total",
      value: formatCurrency(totals.totalMRR),
      icon: DollarSign,
      color: "text-sky-400",
      bg: "bg-sky-500/10",
      border: "border-sky-500/20",
    },
    {
      label: "MRR Cancelamento",
      value: formatCurrency(totals.totalMRRLostCancel),
      icon: TrendingDown,
      color: "text-pink-400",
      bg: "bg-pink-500/10",
      border: "border-pink-500/20",
    },
    {
      label: "MRR Inativação",
      value: formatCurrency(totals.totalMRRLostInactivation),
      icon: TrendingDown,
      color: "text-rose-500",
      bg: "bg-rose-500/10",
      border: "border-rose-500/20",
    },
    {
      label: "Churn Médio",
      value: formatPercent(totals.avgChurn),
      icon: Percent,
      color: "text-amber-400",
      bg: "bg-amber-500/10",
      border: "border-amber-500/20",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8 gap-4">
      {cards.map((card, i) => (
        <div key={i} className={cn(
          "bg-[#1E293B] p-4 rounded-2xl border shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-sky-500/5 group overflow-hidden",
          card.border
        )}>
          <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center mb-3 transition-transform duration-300 group-hover:scale-110", card.bg)}>
            <card.icon className={card.color} size={20} />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1 truncate">{card.label}</p>
            <p className="text-lg font-black text-white tracking-tight truncate" title={card.value}>{card.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
