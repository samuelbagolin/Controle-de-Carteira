import React, { useState, useEffect } from "react";
import { X, Save } from "lucide-react";
import { motion } from "motion/react";
import { type Indicator, type ProductItem } from "../types";

interface IndicatorFormProps {
  indicator: Indicator | null;
  products: ProductItem[];
  onClose: () => void;
  onSaved: () => void;
}

const initialForm: Indicator = {
  month: new Date().toISOString().slice(0, 7),
  product: "",
  active_clients_prev: 0,
  new_contracts: 0,
  cancel_requests: 0,
  cancelled_within_month: 0,
  auto_cancellations: 0,
  inactivations: 0,
  mrr_total: 0,
  mrr_lost_cancel: 0,
  mrr_lost_inactivation: 0,
};

export default function IndicatorForm({ indicator, products, onClose, onSaved }: IndicatorFormProps) {
  const [form, setForm] = useState<Indicator>({
    ...initialForm,
    product: products[0]?.name || ""
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (indicator) {
      setForm(indicator);
    }
  }, [indicator]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const url = indicator ? `/api/indicators/${indicator.id}` : "/api/indicators";
      const method = indicator ? "PUT" : "POST";
      
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (response.ok) {
        onSaved();
        onClose();
      } else {
        const err = await response.json();
        alert(`Erro ao salvar: ${err.error}`);
      }
    } catch (error) {
      console.error("Error saving indicator:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === "number" ? parseFloat(value) || 0 : value
    }));
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[60] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-[#1E293B] rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col border border-slate-800"
      >
        <div className="px-8 py-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/30">
          <div>
            <h3 className="font-black text-white text-xl tracking-tight">
              {indicator ? "Editar Registro" : "Novo Registro"}
            </h3>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">Preencha os indicadores mensais</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-xl transition-all text-slate-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar">
          {/* Identificação */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-1 h-4 bg-sky-500 rounded-full"></div>
              <h4 className="text-[10px] font-black text-sky-400 uppercase tracking-[0.2em]">Identificação</h4>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Mês/Ano</label>
                <input
                  type="month"
                  name="month"
                  required
                  value={form.month}
                  onChange={handleChange}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-sky-500 outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Produto</label>
                <select
                  name="product"
                  required
                  value={form.product}
                  onChange={handleChange}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-sky-500 outline-none transition-all"
                >
                  {products.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
                </select>
              </div>
            </div>
          </section>

          {/* Indicadores de Clientes */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-1 h-4 bg-emerald-500 rounded-full"></div>
              <h4 className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.2em]">Indicadores de Clientes</h4>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Clientes Ativos (mês anterior)</label>
                <input
                  type="number"
                  name="active_clients_prev"
                  value={form.active_clients_prev}
                  onChange={handleChange}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Novos Contratos</label>
                <input
                  type="number"
                  name="new_contracts"
                  value={form.new_contracts}
                  onChange={handleChange}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Solicitações de Cancelamento</label>
                <input
                  type="number"
                  name="cancel_requests"
                  value={form.cancel_requests}
                  onChange={handleChange}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Cancelados dentro do mês</label>
                <input
                  type="number"
                  name="cancelled_within_month"
                  value={form.cancelled_within_month}
                  onChange={handleChange}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Cancelamentos Automáticos</label>
                <input
                  type="number"
                  name="auto_cancellations"
                  value={form.auto_cancellations}
                  onChange={handleChange}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Inativações dentro do mês</label>
                <input
                  type="number"
                  name="inactivations"
                  value={form.inactivations}
                  onChange={handleChange}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                />
              </div>
            </div>
          </section>

          {/* Financeiro */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-1 h-4 bg-amber-500 rounded-full"></div>
              <h4 className="text-[10px] font-black text-amber-400 uppercase tracking-[0.2em]">Financeiro</h4>
            </div>
            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">MRR Total do Produto</label>
                <input
                  type="number"
                  step="0.01"
                  name="mrr_total"
                  value={form.mrr_total}
                  onChange={handleChange}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">MRR Perdido (Canc.)</label>
                  <input
                    type="number"
                    step="0.01"
                    name="mrr_lost_cancel"
                    value={form.mrr_lost_cancel}
                    onChange={handleChange}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">MRR Perdido (Inat.)</label>
                  <input
                    type="number"
                    step="0.01"
                    name="mrr_lost_inactivation"
                    value={form.mrr_lost_inactivation}
                    onChange={handleChange}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  />
                </div>
              </div>
            </div>
          </section>
        </form>

        <div className="px-8 py-6 border-t border-slate-800 flex items-center justify-end gap-4 bg-slate-900/30">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-3 text-slate-400 hover:text-white font-bold uppercase tracking-widest text-[10px] transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex items-center gap-2 px-8 py-3 bg-sky-600 text-white hover:bg-sky-700 rounded-xl font-black uppercase tracking-widest text-[10px] transition-all shadow-lg shadow-sky-500/20 disabled:opacity-50 active:scale-95"
          >
            {loading ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div> : <Save size={18} />}
            Salvar Alterações
          </button>
        </div>
      </motion.div>
    </div>
  );
}
