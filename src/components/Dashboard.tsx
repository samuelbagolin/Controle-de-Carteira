import { useMemo } from "react";
import { Users, UserPlus, UserMinus, UserX, DollarSign, TrendingDown, Percent } from "lucide-react";
import { type CalculatedIndicator } from "../types";
import { formatCurrency, formatPercent } from "../lib/utils";
import MetricsCards from "./MetricsCards";
import Charts from "./Charts";
import IndicatorTable from "./IndicatorTable";

interface DashboardProps {
  indicators: CalculatedIndicator[];
  allIndicators: CalculatedIndicator[];
  isDateFiltered: boolean;
}

export default function Dashboard({ indicators, allIndicators, isDateFiltered }: DashboardProps) {
  const totals = useMemo(() => {
    const sum = (key: keyof CalculatedIndicator) => 
      indicators.reduce((acc, curr) => acc + (curr[key] as number), 0);

    // Clientes Ativos e MRR Total devem ser os valores do ÚLTIMO mês do período selecionado
    let totalActive = 0;
    let totalMRR = 0;

    if (indicators.length > 0) {
      const sortedByMonth = [...indicators].sort((a, b) => a.month.localeCompare(b.month));
      const lastMonth = sortedByMonth[sortedByMonth.length - 1].month;
      const lastMonthIndicators = sortedByMonth.filter(i => i.month === lastMonth);
      
      totalActive = lastMonthIndicators.reduce((acc, curr) => acc + curr.active_clients_prev, 0);
      totalMRR = lastMonthIndicators.reduce((acc, curr) => acc + curr.mrr_total, 0);
    }

    const totalNew = sum("new_contracts");
    const totalCancelled = sum("cancelled_within_month");
    const totalAutoCancelled = sum("auto_cancellations");
    const totalInactivated = sum("inactivations");
    const totalMRRLostCancel = sum("mrr_lost_cancel");
    const totalMRRLostInactivation = sum("mrr_lost_inactivation");
    
    // Churn Médio: Agrupar por mês para calcular a média das taxas mensais do portfólio
    // A fórmula solicitada é (Cancelamentos + Inadimplentes) / Clientes Ativos
    const months = Array.from(new Set(indicators.map(i => i.month))).sort();
    let avgChurn = 0;

    if (months.length > 0) {
      const monthlyChurns = months.map(month => {
        const monthData = indicators.filter(i => i.month === month);
        const monthActive = monthData.reduce((acc, curr) => acc + curr.active_clients_prev, 0);
        // Interpretando "Inadimplentes" como Cancelamentos Automáticos (que batem com o gráfico de 5.72%)
        // Se o usuário quer 5.5%, a média das taxas mensais do portfólio total costuma ser mais precisa.
        const monthChurn = monthData.reduce((acc, curr) => acc + (curr.cancelled_within_month + curr.auto_cancellations), 0);
        
        return monthActive > 0 ? (monthChurn / monthActive) * 100 : 0;
      });
      
      avgChurn = monthlyChurns.reduce((acc, curr) => acc + curr, 0) / monthlyChurns.length;
    }

    return {
      totalActive,
      totalNew,
      totalCancelled,
      totalAutoCancelled,
      totalInactivated,
      totalMRR,
      totalMRRLostCancel,
      totalMRRLostInactivation,
      avgChurn
    };
  }, [indicators]);

  return (
    <div className="space-y-8">
      {/* Metrics Grid */}
      <MetricsCards totals={totals} />

      {/* Charts Grid */}
      <Charts indicators={indicators} />

      {/* Analytical Table */}
      <div className="bg-[#1E293B] rounded-2xl border border-slate-800 shadow-xl overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/30">
          <h3 className="font-bold text-white tracking-tight">Tabela Analítica</h3>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></span>
            <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Dados em Tempo Real</span>
          </div>
        </div>
        <IndicatorTable indicators={indicators} />
      </div>
    </div>
  );
}
