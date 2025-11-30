import React from 'react';
import { Metrics } from '../types';
import { DollarSign, TrendingUp, ShoppingBag } from 'lucide-react';

interface MetricsCardsProps {
  metrics: Metrics;
}

export const MetricsCards: React.FC<MetricsCardsProps> = ({ metrics }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 flex items-center space-x-4">
        <div className="p-3 bg-emerald-100 rounded-full text-emerald-600">
          <DollarSign size={24} />
        </div>
        <div>
          <p className="text-sm text-slate-500 font-medium">Faturamento Atual</p>
          <h3 className="text-2xl font-bold text-slate-800">
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(metrics.totalRevenue)}
          </h3>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 flex items-center space-x-4">
        <div className="p-3 bg-blue-100 rounded-full text-blue-600">
          <TrendingUp size={24} />
        </div>
        <div>
          <p className="text-sm text-slate-500 font-medium">Ticket Médio</p>
          <h3 className="text-2xl font-bold text-slate-800">
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(metrics.averageTicket)}
          </h3>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 flex items-center space-x-4">
        <div className="p-3 bg-indigo-100 rounded-full text-indigo-600">
          <ShoppingBag size={24} />
        </div>
        <div>
          <p className="text-sm text-slate-500 font-medium">Total de Vendas</p>
          <h3 className="text-2xl font-bold text-slate-800">
            {metrics.totalSalesCount}
          </h3>
        </div>
      </div>
    </div>
  );
};