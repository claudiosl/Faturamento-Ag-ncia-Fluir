import React, { useState } from 'react';
import { Metrics } from '../types';
import { Target, TrendingUp, AlertCircle, Calendar, CalendarDays } from 'lucide-react';

interface GoalSimulatorProps {
  metrics: Metrics;
  targetMonthly: number;
  setTargetMonthly: (val: number) => void;
  targetAnnual: number;
  setTargetAnnual: (val: number) => void;
}

export const GoalSimulator: React.FC<GoalSimulatorProps> = ({ 
    metrics, 
    targetMonthly, 
    setTargetMonthly, 
    targetAnnual, 
    setTargetAnnual 
}) => {
  const [activeTab, setActiveTab] = useState<'monthly' | 'annual'>('monthly');

  const currentTarget = activeTab === 'monthly' ? targetMonthly : targetAnnual;
  const currentRevenue = activeTab === 'monthly' ? metrics.monthlyRevenue : metrics.annualRevenue;
  const setTarget = activeTab === 'monthly' ? setTargetMonthly : setTargetAnnual;
  const label = activeTab === 'monthly' ? 'Mês Atual' : 'Ano Atual';

  const revenueGap = Math.max(0, currentTarget - currentRevenue);
  const progress = Math.min(100, (currentRevenue / (currentTarget || 1)) * 100);
  
  // Calculate how many tickets needed
  const salesNeeded = metrics.averageTicket > 0 ? Math.ceil(revenueGap / metrics.averageTicket) : 0;

  // Identify top product to suggest focus
  const topProduct = metrics.products.length > 0 
    ? metrics.products.reduce((prev, current) => (prev.totalRevenue > current.totalRevenue) ? prev : current)
    : null;
    
  const topProductSalesNeeded = topProduct && topProduct.totalRevenue > 0 && revenueGap > 0
     ? Math.ceil(revenueGap / (topProduct.totalRevenue / topProduct.totalQuantity)) 
     : 0;

  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden transform transition-all hover:shadow-xl">
        <div className="p-6 bg-slate-900 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 -mt-4 -mr-4 bg-emerald-500 w-24 h-24 rounded-full opacity-20 blur-xl"></div>
            <h3 className="text-lg font-bold flex items-center relative z-10">
                <Target className="mr-2 text-emerald-400" size={20} />
                Simulador de Meta
            </h3>
            <p className="text-slate-400 text-xs mt-1 relative z-10">Monitore suas metas de curto e longo prazo.</p>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-100">
            <button 
                onClick={() => setActiveTab('monthly')}
                className={`flex-1 py-3 text-sm font-medium flex items-center justify-center transition-colors ${activeTab === 'monthly' ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50/50' : 'text-slate-500 hover:bg-slate-50'}`}
            >
                <Calendar size={16} className="mr-2" /> Mensal
            </button>
            <button 
                onClick={() => setActiveTab('annual')}
                className={`flex-1 py-3 text-sm font-medium flex items-center justify-center transition-colors ${activeTab === 'annual' ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50/50' : 'text-slate-500 hover:bg-slate-50'}`}
            >
                <CalendarDays size={16} className="mr-2" /> Anual
            </button>
        </div>
        
        <div className="p-6">
            <div className="mb-6">
                <label className="block text-xs uppercase font-bold text-slate-500 mb-2">Meta de Faturamento ({label})</label>
                <div className="relative">
                    <span className="absolute left-0 top-2 text-slate-400 font-light">R$</span>
                    <input 
                        type="number" 
                        value={currentTarget} 
                        onChange={(e) => setTarget(parseFloat(e.target.value) || 0)}
                        className="w-full text-3xl font-bold text-slate-800 border-b-2 border-slate-200 focus:border-indigo-600 outline-none pl-8 py-1 bg-transparent transition-colors placeholder-slate-300"
                    />
                </div>
                <div className="flex justify-between mt-2 text-xs">
                    <span className="text-slate-500">Realizado:</span>
                    <span className="font-bold text-slate-700">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(currentRevenue)}</span>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="relative pt-1 mb-6">
                <div className="flex mb-2 items-center justify-between">
                    <div>
                        <span className={`text-xs font-bold inline-block py-1 px-2 uppercase rounded-full ${progress >= 100 ? 'text-emerald-600 bg-emerald-200' : 'text-indigo-600 bg-indigo-200'}`}>
                            {progress >= 100 ? 'Concluído' : 'Em andamento'}
                        </span>
                    </div>
                    <div className="text-right">
                        <span className={`text-xs font-bold inline-block ${progress >= 100 ? 'text-emerald-600' : 'text-indigo-600'}`}>
                            {progress.toFixed(1)}%
                        </span>
                    </div>
                </div>
                <div className="overflow-hidden h-2.5 mb-4 text-xs flex rounded-full bg-slate-100">
                    <div style={{ width: `${progress}%` }} className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${progress >= 100 ? 'bg-emerald-500' : 'bg-indigo-600'} transition-all duration-700 ease-out`}></div>
                </div>
            </div>

            {revenueGap > 0 ? (
                <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg">
                    <h4 className="font-bold text-amber-800 mb-2 flex items-center text-sm">
                        <AlertCircle size={16} className="mr-2" />
                        Falta para bater a meta {activeTab === 'monthly' ? 'do mês' : 'do ano'}:
                    </h4>
                    <p className="text-2xl font-black text-amber-600 mb-3 tracking-tight">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(revenueGap)}
                    </p>
                    
                    <div className="space-y-2">
                        <div className="flex items-center justify-between bg-white p-2 rounded border border-amber-100">
                            <span className="text-xs text-slate-500">Vendas necessárias (Ticket Médio)</span>
                            <span className="font-bold text-indigo-700">+{salesNeeded} vendas</span>
                        </div>
                        
                        {topProduct && (
                            <div className="flex items-center justify-between bg-white p-2 rounded border border-amber-100">
                                <span className="text-xs text-slate-500">Ou vendendo só "{topProduct.name}"</span>
                                <span className="font-bold text-emerald-600">+{topProductSalesNeeded} un.</span>
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <div className="bg-emerald-50 border border-emerald-200 p-5 rounded-lg flex items-center justify-center flex-col text-center animate-bounce-short">
                    <div className="bg-emerald-100 p-3 rounded-full mb-3">
                        <TrendingUp className="text-emerald-600" size={24} />
                    </div>
                    <h4 className="font-bold text-emerald-800 text-lg">Meta Batida! 🎉</h4>
                    <p className="text-sm text-emerald-600 mt-1">Ótimo trabalho. Defina uma nova meta acima para continuar crescendo.</p>
                </div>
            )}
        </div>
    </div>
  );
};