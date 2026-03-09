import { type CalculatedIndicator } from "../types";
import { formatCurrency, formatPercent, formatMonth, cn } from "../lib/utils";

interface IndicatorTableProps {
  indicators: CalculatedIndicator[];
}

export default function IndicatorTable({ indicators }: IndicatorTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-slate-900/50 border-b border-slate-800">
            <th className="px-6 py-4 text-[10px] uppercase font-black text-slate-500 tracking-[0.15em]">Produto</th>
            <th className="px-6 py-4 text-[10px] uppercase font-black text-slate-500 tracking-[0.15em]">Mês</th>
            <th className="px-6 py-4 text-[10px] uppercase font-black text-slate-500 tracking-[0.15em]">Ativos (Ant.)</th>
            <th className="px-6 py-4 text-[10px] uppercase font-black text-slate-500 tracking-[0.15em]">Novos</th>
            <th className="px-6 py-4 text-[10px] uppercase font-black text-slate-500 tracking-[0.15em]">Solic. Canc.</th>
            <th className="px-6 py-4 text-[10px] uppercase font-black text-slate-500 tracking-[0.15em]">Canc.</th>
            <th className="px-6 py-4 text-[10px] uppercase font-black text-slate-500 tracking-[0.15em]">Canc. Auto.</th>
            <th className="px-6 py-4 text-[10px] uppercase font-black text-slate-500 tracking-[0.15em]">Inat.</th>
            <th className="px-6 py-4 text-[10px] uppercase font-black text-slate-500 tracking-[0.15em]">MRR Total</th>
            <th className="px-6 py-4 text-[10px] uppercase font-black text-slate-500 tracking-[0.15em]">MRR Perd. Canc.</th>
            <th className="px-6 py-4 text-[10px] uppercase font-black text-slate-500 tracking-[0.15em]">MRR Perd. Inat.</th>
            <th className="px-6 py-4 text-[10px] uppercase font-black text-slate-500 tracking-[0.15em]">Churn %</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800">
          {indicators.length === 0 ? (
            <tr>
              <td colSpan={12} className="px-6 py-16 text-center text-slate-500 italic font-medium">
                Nenhum dado encontrado para os filtros selecionados.
              </td>
            </tr>
          ) : (
            indicators.map((ind, i) => (
              <tr key={i} className="hover:bg-slate-800/30 transition-all duration-200 group">
                <td className="px-6 py-4">
                  <span className="font-bold text-white group-hover:text-sky-400 transition-colors">{ind.product}</span>
                </td>
                <td className="px-6 py-4 text-sm text-slate-400">{formatMonth(ind.month)}</td>
                <td className="px-6 py-4 text-sm text-slate-300">{ind.active_clients_prev}</td>
                <td className="px-6 py-4 text-sm text-emerald-400 font-bold">+{ind.new_contracts}</td>
                <td className="px-6 py-4 text-sm text-slate-400">{ind.cancel_requests}</td>
                <td className="px-6 py-4 text-sm text-rose-400">{ind.cancelled_within_month}</td>
                <td className="px-6 py-4 text-sm text-orange-400">{ind.auto_cancellations}</td>
                <td className="px-6 py-4 text-sm text-sky-400">{ind.inactivations}</td>
                <td className="px-6 py-4 text-sm font-bold text-slate-100">{formatCurrency(ind.mrr_total)}</td>
                <td className="px-6 py-4 text-sm text-rose-400/80">{formatCurrency(ind.mrr_lost_cancel)}</td>
                <td className="px-6 py-4 text-sm text-sky-400/80">{formatCurrency(ind.mrr_lost_inactivation)}</td>
                <td className="px-6 py-4">
                  <span className={cn(
                    "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider",
                    ind.churn_percent > 5 ? "bg-rose-500/10 text-rose-400 border border-rose-500/20" : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                  )}>
                    {formatPercent(ind.churn_percent)}
                  </span>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
