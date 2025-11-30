import React, { useState, useMemo } from 'react';
import { Sale, Metrics, ProductSummary } from './types';
import { MetricsCards } from './components/MetricsCards';
import { SalesForm } from './components/SalesForm';
import { SalesCharts } from './components/SalesCharts';
import { GoalSimulator } from './components/GoalSimulator';
import { ProductList } from './components/ProductList';
import { AiAdvisor } from './components/AiAdvisor';
import { Trash2, AlertTriangle, X } from 'lucide-react';

export default function App() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [targetRevenue, setTargetRevenue] = useState<number>(10000);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleAddSale = (productName: string, price: number, quantity: number) => {
    const newSale: Sale = {
      id: Math.random().toString(36).substr(2, 9),
      productName,
      price,
      quantity,
      total: price * quantity,
      date: new Date().toISOString(),
    };
    setSales(prev => [...prev, newSale]);
  };

  const confirmResetData = () => {
    setSales([]);
    setTargetRevenue(10000); // Reseta a meta para o padrão
    setShowResetConfirm(false);
  };

  // Derive Metrics from Sales
  const metrics: Metrics = useMemo(() => {
    const totalRevenue = sales.reduce((acc, curr) => acc + curr.total, 0);
    const totalSalesCount = sales.length; // Transações
    // const totalQuantitySold = sales.reduce((acc, curr) => acc + curr.quantity, 0);
    const averageTicket = totalSalesCount > 0 ? totalRevenue / totalSalesCount : 0;

    // Group by product
    const productMap = new Map<string, { revenue: number; quantity: number }>();
    sales.forEach(sale => {
      const current = productMap.get(sale.productName) || { revenue: 0, quantity: 0 };
      productMap.set(sale.productName, {
        revenue: current.revenue + sale.total,
        quantity: current.quantity + sale.quantity
      });
    });

    // Convert map to array
    let productsArray: ProductSummary[] = Array.from(productMap.entries()).map(([name, data]) => ({
      name,
      totalRevenue: data.revenue,
      totalQuantity: data.quantity,
      percentOfRevenue: totalRevenue > 0 ? (data.revenue / totalRevenue) * 100 : 0,
      category: 'Secundário' // Default
    }));

    // Sort by revenue desc
    productsArray.sort((a, b) => b.totalRevenue - a.totalRevenue);

    // Apply logic: Top 3 products are "Principal" (Curva A aprox)
    // Se tiver poucos produtos, ajusta logica dinamicamente
    const cutoffIndex = Math.max(1, Math.floor(productsArray.length * 0.2)); // Top 20%
    
    productsArray = productsArray.map((p, index) => ({
      ...p,
      category: index < cutoffIndex || (productsArray.length <= 2 && index === 0) ? 'Principal' : 'Secundário'
    }));

    return {
      totalRevenue,
      totalSalesCount,
      averageTicket,
      products: productsArray
    };
  }, [sales]);

  const hasDataToReset = sales.length > 0 || targetRevenue !== 10000;

  return (
    <div className="min-h-screen pb-12 bg-slate-50 relative">
      
      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowResetConfirm(false)}></div>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 relative z-10 animate-in fade-in zoom-in duration-200">
            <button 
              onClick={() => setShowResetConfirm(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <X size={20} />
            </button>
            
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4 text-red-600">
                <AlertTriangle size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Resetar Painel?</h3>
              <p className="text-slate-600 text-sm mb-6 px-4">
                Isso apagará permanentemente todas as vendas registradas e restaurará a meta inicial. Essa ação não pode ser desfeita.
              </p>
              
              <div className="flex w-full space-x-3">
                <button 
                  onClick={() => setShowResetConfirm(false)}
                  className="flex-1 px-4 py-2 bg-white border border-slate-300 rounded-xl text-slate-700 font-medium hover:bg-slate-50 transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  onClick={confirmResetData}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-colors shadow-lg shadow-red-200"
                >
                  Sim, Resetar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 py-3 flex items-center justify-between">
            <div className="flex items-center gap-4">
                {/* Custom Logo for Agência Fluir */}
                <h1 className="flex items-center gap-3 select-none" aria-label="Agência Fluir">
                    <div className="relative h-10 w-10 flex items-center justify-center">
                        <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full transform transition-transform hover:scale-105 duration-300">
                            <path d="M12 8L28 20L12 32" stroke="url(#logo_gradient)" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
                            <defs>
                                <linearGradient id="logo_gradient" x1="12" y1="8" x2="28" y2="32" gradientUnits="userSpaceOnUse">
                                    <stop stopColor="#34d399" /> 
                                    <stop offset="1" stopColor="#059669" />
                                </linearGradient>
                            </defs>
                        </svg>
                    </div>
                    <div className="flex flex-col justify-center h-full">
                        <span className="text-[10px] uppercase font-bold text-slate-500 tracking-[0.2em] leading-none mb-1">Agência</span>
                        <span className="text-2xl font-black text-slate-900 tracking-tighter leading-none">Fluir</span>
                    </div>
                </h1>
                
                <div className="hidden md:block h-8 w-px bg-slate-200 mx-2"></div>
                <span className="hidden md:block text-xs text-slate-400 font-medium uppercase tracking-wide">Painel Financeiro</span>
            </div>
            
            <button 
              onClick={() => setShowResetConfirm(true)}
              disabled={!hasDataToReset}
              className={`flex items-center space-x-2 text-sm px-4 py-2 rounded-lg transition-colors ${
                !hasDataToReset
                ? 'text-slate-300 cursor-not-allowed' 
                : 'text-red-500 hover:text-red-700 hover:bg-red-50 border border-transparent hover:border-red-100'
              }`}
              title="Apagar todos os dados"
            >
               <Trash2 size={18} />
               <span className="hidden sm:inline font-medium">Resetar Dados</span>
            </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Top KPI Cards */}
        <MetricsCards metrics={metrics} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            {/* Left Column: Data Entry & Charts */}
            <div className="lg:col-span-2 space-y-8">
                <SalesForm onAddSale={handleAddSale} />
                <SalesCharts metrics={metrics} sales={sales} />
                <ProductList metrics={metrics} />
            </div>

            {/* Right Column: Goal Simulator & AI */}
            <div className="lg:col-span-1 space-y-8">
                <GoalSimulator 
                    metrics={metrics} 
                    targetRevenue={targetRevenue} 
                    setTargetRevenue={setTargetRevenue} 
                />
                
                <AiAdvisor metrics={metrics} targetRevenue={targetRevenue} />

                {/* Info Box */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 text-sm text-slate-600 shadow-sm">
                    <h4 className="font-semibold text-slate-800 mb-3 border-b pb-2">Como aumentar o faturamento?</h4>
                    <ul className="space-y-3 list-disc list-inside">
                        <li><strong className="text-indigo-600">Ticket Médio:</strong> Tente vender mais produtos para o mesmo cliente (upsell/cross-sell).</li>
                        <li><strong className="text-indigo-600">Produtos Principais:</strong> Foque marketing nos itens com etiqueta "Principal".</li>
                        <li><strong className="text-indigo-600">Meta:</strong> Use o simulador acima para saber exatamente quanto falta.</li>
                    </ul>
                </div>
            </div>
        </div>
      </main>
    </div>
  );
}