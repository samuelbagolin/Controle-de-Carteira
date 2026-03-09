import React, { useState } from "react";
import { Plus, Trash2, Save, X } from "lucide-react";
import { type ProductItem } from "../types";
import { motion, AnimatePresence } from "motion/react";

interface ProductManagementProps {
  products: ProductItem[];
  onUpdate: () => void;
}

export default function ProductManagement({ products, onUpdate }: ProductManagementProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    
    setLoading(true);
    try {
      const response = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName.trim() }),
      });

      if (response.ok) {
        setNewName("");
        setIsAdding(false);
        onUpdate();
      } else {
        const err = await response.json();
        alert(`Erro ao adicionar produto: ${err.error}`);
      }
    } catch (error) {
      console.error("Error adding product:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir este produto? Isso não afetará os indicadores já lançados, mas o produto não aparecerá mais nos filtros.")) return;
    
    try {
      await fetch(`/api/products/${id}`, { method: "DELETE" });
      onUpdate();
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight">Gestão de Produtos</h2>
          <p className="text-slate-500 font-medium mt-1">Cadastre e gerencie os produtos da sua carteira.</p>
        </div>
        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 px-6 py-3 bg-sky-600 text-white hover:bg-sky-700 rounded-xl font-bold transition-all shadow-lg shadow-sky-500/20 active:scale-95"
        >
          <Plus size={20} />
          Novo Produto
        </button>
      </div>

      <div className="bg-[#1E293B] rounded-2xl border border-slate-800 shadow-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900/50 border-b border-slate-800">
                <th className="px-8 py-5 text-[10px] uppercase font-black text-slate-500 tracking-[0.2em]">ID</th>
                <th className="px-8 py-5 text-[10px] uppercase font-black text-slate-500 tracking-[0.2em]">Nome do Produto</th>
                <th className="px-8 py-5 text-[10px] uppercase font-black text-slate-500 tracking-[0.2em] text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {products.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-8 py-20 text-center text-slate-500 italic font-medium">
                    Nenhum produto cadastrado.
                  </td>
                </tr>
              ) : (
                products.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-800/30 transition-all duration-200 group">
                    <td className="px-8 py-5 text-sm text-slate-500 font-mono">#{p.id}</td>
                    <td className="px-8 py-5 font-bold text-white group-hover:text-sky-400 transition-colors">{p.name}</td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <button
                          onClick={() => handleDelete(p.id)}
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

      <AnimatePresence>
        {isAdding && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[60] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-[#1E293B] rounded-3xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col border border-slate-800"
            >
              <div className="px-8 py-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/30">
                <div>
                  <h3 className="font-black text-white text-xl tracking-tight">Novo Produto</h3>
                  <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">Adicione um novo produto à carteira</p>
                </div>
                <button onClick={() => setIsAdding(false)} className="p-2 hover:bg-slate-800 rounded-xl transition-all text-slate-400 hover:text-white">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleAdd} className="p-8 space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Nome do Produto</label>
                  <input
                    autoFocus
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="Ex: Sittax Pro"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-sky-500 outline-none transition-all"
                  />
                </div>

                <div className="flex items-center justify-end gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsAdding(false)}
                    className="px-6 py-3 text-slate-400 hover:text-white font-bold uppercase tracking-widest text-[10px] transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={loading || !newName.trim()}
                    className="flex items-center gap-2 px-8 py-3 bg-sky-600 text-white hover:bg-sky-700 rounded-xl font-black uppercase tracking-widest text-[10px] transition-all shadow-lg shadow-sky-500/20 disabled:opacity-50 active:scale-95"
                  >
                    {loading ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div> : <Save size={18} />}
                    Cadastrar Produto
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
