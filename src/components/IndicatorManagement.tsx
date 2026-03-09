import { useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { type Indicator, type ProductItem } from "../types";
import { formatMonth, formatCurrency } from "../lib/utils";
import IndicatorForm from "./IndicatorForm";

interface IndicatorManagementProps {
  indicators: Indicator[];
  products: ProductItem[];
  onUpdate: () => void;
}

export default function IndicatorManagement({ indicators, products, onUpdate }: IndicatorManagementProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingIndicator, setEditingIndicator] = useState<Indicator | null>(null);

  const handleDelete = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir este registro?")) return;
    
    try {
      await fetch(`/api/indicators/${id}`, { method: "DELETE" });
      onUpdate();
    } catch (error) {
      console.error("Error deleting indicator:", error);
    }
  };

  const handleEdit = (indicator: Indicator) => {
    setEditingIndicator(indicator);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingIndicator(null);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight">Gestão de Indicadores</h2>
          <p className="text-slate-500 font-medium mt-1">Lançamento mensal de indicadores por produto.</p>
        </div>
        <button
          onClick={() => setIsFormOpen(true)}
          className="flex items-center gap-2 px-6 py-3 bg-sky-600 text-white hover:bg-sky-700 rounded-xl font-bold transition-all shadow-lg shadow-sky-500/20 active:scale-95"
        >
          <Plus size={20} />
          Novo Registro
        </button>
      </div>

      <div className="bg-[#1E293B] rounded-2xl border border-slate-800 shadow-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900/50 border-b border-slate-800">
                <th className="px-8 py-5 text-[10px] uppercase font-black text-slate-500 tracking-[0.2em]">Produto</th>
                <th className="px-8 py-5 text-[10px] uppercase font-black text-slate-500 tracking-[0.2em]">Mês</th>
                <th className="px-8 py-5 text-[10px] uppercase font-black text-slate-500 tracking-[0.2em]">Clientes Ativos</th>
                <th className="px-8 py-5 text-[10px] uppercase font-black text-slate-500 tracking-[0.2em]">MRR Total</th>
                <th className="px-8 py-5 text-[10px] uppercase font-black text-slate-500 tracking-[0.2em] text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {indicators.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center text-slate-500 italic font-medium">
                    Nenhum registro cadastrado.
                  </td>
                </tr>
              ) : (
                indicators.map((ind) => (
                  <tr key={ind.id} className="hover:bg-slate-800/30 transition-all duration-200 group">
                    <td className="px-8 py-5 font-bold text-white group-hover:text-sky-400 transition-colors">{ind.product}</td>
                    <td className="px-8 py-5 text-sm text-slate-400">{formatMonth(ind.month)}</td>
                    <td className="px-8 py-5 text-sm text-slate-300 font-medium">{ind.active_clients_prev}</td>
                    <td className="px-8 py-5 text-sm text-slate-300 font-bold">{formatCurrency(ind.mrr_total)}</td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <button
                          onClick={() => handleEdit(ind)}
                          className="p-2.5 text-slate-500 hover:text-sky-400 hover:bg-sky-500/10 rounded-xl transition-all"
                          title="Editar"
                        >
                          <Pencil size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(ind.id!)}
                          className="p-2.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-all"
                          title="Excluir"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isFormOpen && (
        <IndicatorForm
          indicator={editingIndicator}
          products={products}
          onClose={handleCloseForm}
          onSaved={onUpdate}
        />
      )}
    </div>
  );
}
