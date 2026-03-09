import { useState, useEffect, useMemo } from "react";
import { LayoutDashboard, TableProperties, Plus, FileSpreadsheet, Filter, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import * as XLSX from "xlsx";
import { type Indicator, type CalculatedIndicator, type Product, type ProductItem } from "./types";
import { cn, formatCurrency, formatPercent } from "./lib/utils";
import Dashboard from "./components/Dashboard";
import IndicatorManagement from "./components/IndicatorManagement";
import ProductManagement from "./components/ProductManagement";

export default function App() {
  const [indicators, setIndicators] = useState<Indicator[]>([]);
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [view, setView] = useState<"dashboard" | "management" | "products">("dashboard");
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | "Todos">("Todos");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [indRes, prodRes] = await Promise.all([
        fetch("/api/indicators"),
        fetch("/api/products")
      ]);
      const [indData, prodData] = await Promise.all([
        indRes.json(),
        prodRes.json()
      ]);
      setIndicators(indData);
      setProducts(prodData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchIndicators = async () => {
    try {
      const response = await fetch("/api/indicators");
      const data = await response.json();
      setIndicators(data);
    } catch (error) {
      console.error("Error fetching indicators:", error);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/products");
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const calculatedIndicators = useMemo(() => {
    return indicators.map(ind => {
      // Churn = Cancelamentos do mês + Inadimplentes (Cancelamentos Automáticos)
      const churn = ind.cancelled_within_month + ind.auto_cancellations;
      const churn_percent = ind.active_clients_prev > 0 
        ? (churn / ind.active_clients_prev) * 100 
        : 0;
      
      return {
        ...ind,
        churn,
        churn_percent
      } as CalculatedIndicator;
    });
  }, [indicators]);

  const filteredIndicators = useMemo(() => {
    return calculatedIndicators.filter(ind => {
      const productMatch = selectedProduct === "Todos" || ind.product === selectedProduct;
      const dateMatch = (!startDate || ind.month >= startDate) && (!endDate || ind.month <= endDate);
      return productMatch && dateMatch;
    }).sort((a, b) => a.month.localeCompare(b.month));
  }, [calculatedIndicators, selectedProduct, startDate, endDate]);

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredIndicators);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Indicadores");
    XLSX.writeFile(workbook, `indicadores_saas_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-100 font-sans selection:bg-indigo-500/30">
      {/* Sidebar / Navigation */}
      <nav className="fixed top-0 left-0 right-0 h-16 bg-[#1E293B]/80 backdrop-blur-md border-b border-slate-800 z-50 px-6 flex items-center justify-between shadow-lg shadow-black/20">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-sky-400 to-blue-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-sky-500/20">
              <span className="text-xl font-black">S</span>
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-white leading-none">Controle de Carteira</h1>
              <span className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">Analytics Dashboard</span>
            </div>
          </div>
          
          <div className="flex items-center gap-1 bg-slate-900/50 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setView("dashboard")}
              className={cn(
                "flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200",
                view === "dashboard" ? "bg-sky-500 text-white shadow-lg shadow-sky-500/20" : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
              )}
            >
              <LayoutDashboard size={16} />
              Dashboard
            </button>
            <button
              onClick={() => setView("management")}
              className={cn(
                "flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200",
                view === "management" ? "bg-sky-500 text-white shadow-lg shadow-sky-500/20" : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
              )}
            >
              <TableProperties size={16} />
              Gestão
            </button>
            <button
              onClick={() => setView("products")}
              className={cn(
                "flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200",
                view === "products" ? "bg-sky-500 text-white shadow-lg shadow-sky-500/20" : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
              )}
            >
              <Plus size={16} />
              Produtos
            </button>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={exportToExcel}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 rounded-xl text-sm font-semibold transition-all border border-emerald-500/20"
          >
            <FileSpreadsheet size={16} />
            Exportar Excel
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-24 pb-12 px-6 max-w-7xl mx-auto">
        {/* Filters Bar */}
        <div className="bg-[#1E293B] p-5 rounded-2xl border border-slate-800 shadow-xl mb-8 flex flex-wrap items-center gap-6">
          <div className="flex items-center gap-2 text-slate-400">
            <Filter size={18} />
            <span className="text-sm font-bold uppercase tracking-wider">Filtros</span>
          </div>

          <div className="flex items-center gap-6 flex-1">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">Produto</label>
              <select
                value={selectedProduct}
                onChange={(e) => setSelectedProduct(e.target.value as any)}
                className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-sm text-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none min-w-[180px] transition-all"
              >
                <option value="Todos">Todos os Produtos</option>
                {products.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">Início</label>
              <input
                type="month"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-sm text-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">Fim</label>
              <input
                type="month"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-sm text-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              />
            </div>
          </div>

          {(startDate || endDate || selectedProduct !== "Todos") && (
            <button
              onClick={() => {
                setStartDate("");
                setEndDate("");
                setSelectedProduct("Todos");
              }}
              className="text-sm text-slate-500 hover:text-indigo-400 font-bold uppercase tracking-wider transition-colors"
            >
              Limpar Filtros
            </button>
          )}
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center h-96 gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
            <p className="text-slate-500 font-medium animate-pulse">Carregando métricas...</p>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            {view === "dashboard" ? (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                <Dashboard 
                  indicators={filteredIndicators} 
                  allIndicators={calculatedIndicators}
                  isDateFiltered={!!(startDate || endDate)}
                />
              </motion.div>
            ) : view === "management" ? (
              <motion.div
                key="management"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                <IndicatorManagement 
                  onUpdate={fetchIndicators} 
                  indicators={indicators} 
                  products={products}
                />
              </motion.div>
            ) : (
              <motion.div
                key="products"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                <ProductManagement 
                  onUpdate={fetchProducts} 
                  products={products} 
                />
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </main>
    </div>
  );
}
