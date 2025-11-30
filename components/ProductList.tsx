import React from 'react';
import { Metrics } from '../types';
import { Star, Package } from 'lucide-react';

interface ProductListProps {
  metrics: Metrics;
}

export const ProductList: React.FC<ProductListProps> = ({ metrics }) => {
  const sortedProducts = [...metrics.products].sort((a, b) => b.totalRevenue - a.totalRevenue);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100 bg-slate-50">
        <h3 className="font-semibold text-slate-800">Detalhamento dos Produtos</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 text-xs uppercase font-semibold text-slate-500">
            <tr>
              <th className="px-6 py-3">Classificação</th>
              <th className="px-6 py-3">Produto</th>
              <th className="px-6 py-3 text-right">Qtd</th>
              <th className="px-6 py-3 text-right">Faturamento</th>
              <th className="px-6 py-3 text-right">% Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {sortedProducts.length > 0 ? (
                sortedProducts.map((p, index) => (
                <tr key={index} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-3">
                    {p.category === 'Principal' ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                        <Star size={12} className="mr-1 fill-indigo-800" /> Principal
                        </span>
                    ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                        <Package size={12} className="mr-1" /> Secundário
                        </span>
                    )}
                    </td>
                    <td className="px-6 py-3 font-medium text-slate-800">{p.name}</td>
                    <td className="px-6 py-3 text-right">{p.totalQuantity}</td>
                    <td className="px-6 py-3 text-right font-medium text-slate-800">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(p.totalRevenue)}
                    </td>
                    <td className="px-6 py-3 text-right">
                    {p.percentOfRevenue.toFixed(1)}%
                    </td>
                </tr>
                ))
            ) : (
                <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-slate-400">
                        Nenhum produto registrado ainda.
                    </td>
                </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};