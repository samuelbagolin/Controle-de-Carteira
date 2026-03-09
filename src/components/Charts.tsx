import React, { useMemo } from "react";
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell 
} from "recharts";
import { type CalculatedIndicator } from "../types";
import { formatCurrency, formatMonth } from "../lib/utils";

interface ChartsProps {
  indicators: CalculatedIndicator[];
}

const COLORS = ["#0EA5E9", "#10B981", "#F59E0B", "#EF4444", "#6366F1"];

export default function Charts({ indicators }: ChartsProps) {
  // Group by month for evolution charts
  const monthlyData = useMemo(() => {
    const groups: Record<string, any> = {};
    indicators.forEach(ind => {
      if (!groups[ind.month]) {
        groups[ind.month] = {
          month: ind.month,
          displayMonth: formatMonth(ind.month),
          active: 0,
          cancelled: 0,
          autoCancelled: 0,
          requests: 0,
          inactivated: 0,
          mrr: 0,
          mrrLostCancel: 0,
          mrrLostInactivation: 0,
          churn: 0,
          count: 0
        };
      }
      groups[ind.month].active += ind.active_clients_prev;
      groups[ind.month].cancelled += ind.cancelled_within_month;
      groups[ind.month].autoCancelled += ind.auto_cancellations;
      groups[ind.month].requests += ind.cancel_requests;
      groups[ind.month].inactivated += ind.inactivations;
      groups[ind.month].mrr += ind.mrr_total;
      groups[ind.month].mrrLostCancel += ind.mrr_lost_cancel;
      groups[ind.month].mrrLostInactivation += ind.mrr_lost_inactivation;
      groups[ind.month].churn += ind.churn_percent;
      groups[ind.month].count += 1;
    });

    return Object.values(groups).sort((a, b) => a.month.localeCompare(b.month)).map(g => ({
      ...g,
      avgChurn: g.churn / g.count
    }));
  }, [indicators]);

  // Distribution by product
  const productDistribution = useMemo(() => {
    const dist: Record<string, number> = {};
    indicators.forEach(ind => {
      dist[ind.product] = (dist[ind.product] || 0) + ind.active_clients_prev;
    });
    return Object.entries(dist).map(([name, value]) => ({ name, value }));
  }, [indicators]);

  const tooltipStyle = {
    contentStyle: {
      backgroundColor: "#1E293B",
      border: "1px solid #334155",
      borderRadius: "12px",
      color: "#F1F5F9",
      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.3)"
    },
    itemStyle: { color: "#F1F5F9" }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Evolução de Clientes */}
      <ChartContainer title="Evolução de Clientes Ativos">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
            <XAxis dataKey="displayMonth" fontSize={10} tick={{ fill: "#94A3B8" }} axisLine={false} tickLine={false} dy={10} interval={0} />
            <YAxis fontSize={12} tick={{ fill: "#94A3B8" }} axisLine={false} tickLine={false} dx={-10} />
            <Tooltip {...tooltipStyle} />
            <Legend verticalAlign="top" height={36} iconType="circle" />
            <Line type="monotone" dataKey="active" name="Clientes Ativos" stroke="#0EA5E9" strokeWidth={3} dot={{ r: 4, fill: "#0EA5E9", strokeWidth: 2, stroke: "#1E293B" }} activeDot={{ r: 6, strokeWidth: 0 }} />
          </LineChart>
        </ResponsiveContainer>
      </ChartContainer>

      {/* Cancelamentos */}
      <ChartContainer title="Cancelamentos e Inativações">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
            <XAxis dataKey="displayMonth" fontSize={10} tick={{ fill: "#94A3B8" }} axisLine={false} tickLine={false} dy={10} interval={0} />
            <YAxis fontSize={12} tick={{ fill: "#94A3B8" }} axisLine={false} tickLine={false} dx={-10} />
            <Tooltip {...tooltipStyle} />
            <Bar dataKey="requests" name="Solicitações" fill="#94A3B8" radius={[4, 4, 0, 0]} />
            <Bar dataKey="cancelled" name="Cancelados" fill="#EF4444" radius={[4, 4, 0, 0]} />
            <Bar dataKey="autoCancelled" name="Auto. Cancelados" fill="#F59E0B" radius={[4, 4, 0, 0]} />
            <Bar dataKey="inactivated" name="Inativações" fill="#0EA5E9" radius={[4, 4, 0, 0]} />
            <Legend 
              verticalAlign="top" 
              height={36} 
              iconType="circle"
              payload={[
                { value: 'Solicitações', type: 'circle', id: 'requests', color: '#94A3B8' },
                { value: 'Cancelados', type: 'circle', id: 'cancelled', color: '#EF4444' },
                { value: 'Auto. Cancelados', type: 'circle', id: 'autoCancelled', color: '#F59E0B' },
                { value: 'Inativações', type: 'circle', id: 'inactivated', color: '#0EA5E9' },
              ]}
            />
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>

      {/* Receita (MRR) */}
      <ChartContainer title="Receita (MRR) e Perdas">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
            <XAxis dataKey="displayMonth" fontSize={10} tick={{ fill: "#94A3B8" }} axisLine={false} tickLine={false} dy={10} interval={0} />
            <YAxis fontSize={12} tick={{ fill: "#94A3B8" }} axisLine={false} tickLine={false} dx={-10} />
            <Tooltip {...tooltipStyle} formatter={(value: number) => formatCurrency(value)} />
            <Legend verticalAlign="top" height={36} iconType="circle" />
            <Line type="monotone" dataKey="mrr" name="MRR Total" stroke="#10B981" strokeWidth={3} dot={{ r: 4, fill: "#10B981", strokeWidth: 2, stroke: "#1E293B" }} />
            <Line type="monotone" dataKey="mrrLostCancel" name="Perda Cancel." stroke="#EF4444" strokeWidth={2} strokeDasharray="5 5" dot={false} />
            <Line type="monotone" dataKey="mrrLostInactivation" name="Perda Inativ." stroke="#F43F5E" strokeWidth={2} strokeDasharray="3 3" dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </ChartContainer>

      {/* Churn */}
      <ChartContainer title="Taxa de Churn (%)">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
            <XAxis dataKey="displayMonth" fontSize={10} tick={{ fill: "#94A3B8" }} axisLine={false} tickLine={false} dy={10} interval={0} />
            <YAxis fontSize={12} tick={{ fill: "#94A3B8" }} axisLine={false} tickLine={false} dx={-10} />
            <Tooltip {...tooltipStyle} formatter={(value: number) => `${value.toFixed(2)}%`} />
            <Legend verticalAlign="top" height={36} iconType="circle" />
            <Line type="monotone" dataKey="avgChurn" name="Churn Médio %" stroke="#F59E0B" strokeWidth={3} dot={{ r: 4, fill: "#F59E0B", strokeWidth: 2, stroke: "#1E293B" }} />
          </LineChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
}

function ChartContainer({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-[#1E293B] p-8 rounded-2xl border border-slate-800 shadow-xl">
      <h3 className="text-xs font-black text-slate-500 mb-8 uppercase tracking-[0.2em]">{title}</h3>
      {children}
    </div>
  );
}
