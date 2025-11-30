import React from 'react';
import { Metrics, Sale } from '../types';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, 
  PieChart, Pie, Legend, AreaChart, Area 
} from 'recharts';
import { BarChart3 } from 'lucide-react';

interface SalesChartsProps {
  metrics: Metrics;
  sales: Sale[];
}

const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export const SalesCharts: React.FC<SalesChartsProps> = ({ metrics, sales }) => {
  // 1. Bar Chart Data (Top 5 Products)
  const barData = [...metrics.products]
    .sort((a, b) => b.totalRevenue - a.totalRevenue)
    .slice(0, 5)
    .map(p => ({
      name: p.name.length > 15 ? p.name.substring(0, 15) + '...' : p.name,
      fullName: p.name,
      total: p.totalRevenue
    }));

  // 2. Pie Chart Data (Category split)
  const pieData = [
    { name: 'Principais (Curva A)', value: metrics.products.filter(p => p.category === 'Principal').reduce((acc, curr) => acc + curr.totalRevenue, 0) },
    { name: 'Secundários (Curva B/C)', value: metrics.products.filter(p => p.category === 'Secundário').reduce((acc, curr) => acc + curr.totalRevenue, 0) }
  ].filter(d => d.value > 0);

  // 3. Line Chart Data (Timeline)
  const salesByDate = sales.reduce((acc, sale) => {
    const dateKey = new Date(sale.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
    acc[dateKey] = (acc[dateKey] || 0) + sale.total;
    return acc;
  }, {} as Record<string, number>);

  const lineData = Object.keys(salesByDate).map(date => ({
    date,
    amount: salesByDate[date]
  }));

  if (sales.length === 0) {
    return (
        <div className="bg-white p-12 rounded-xl shadow-sm border border-slate-100 flex flex-col items-center justify-center text-center">
            <div className="bg-slate-100 p-4 rounded-full mb-4">
                <BarChart3 size={32} className="text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-800">Aguardando Dados</h3>
            <p className="text-slate-500 max-w-sm mt-2">
                Utilize o formulário "Registrar Nova Venda" acima para começar a popular seus gráficos de faturamento.
            </p>
        </div>
    );
  }

  return (
    <div className="space-y-8 mb-8">
      {/* Row 1: Timeline Chart (Full Width) */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
        <h4 className="text-lg font-semibold text-slate-800 mb-2">Evolução do Faturamento</h4>
        <p className="text-sm text-slate-500 mb-6">Acompanhe o crescimento das vendas ao longo do tempo.</p>
        <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={lineData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" />
                <YAxis tickFormatter={(val) => `R$${val}`} width={80} />
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <Tooltip 
                  formatter={(value: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)}
                  labelStyle={{ color: '#1e293b' }}
                />
                <Area type="monotone" dataKey="amount" stroke="#4f46e5" fillOpacity={1} fill="url(#colorAmount)" name="Vendas" />
              </AreaChart>
            </ResponsiveContainer>
        </div>
      </div>

      {/* Row 2: Top Products & Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Bar Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h4 className="text-lg font-semibold text-slate-800 mb-6">Top Produtos (Receita)</h4>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" width={100} tick={{fontSize: 11}} />
                <Tooltip 
                  formatter={(value: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)}
                  cursor={{fill: 'transparent'}}
                />
                <Bar dataKey="total" fill="#4f46e5" radius={[0, 4, 4, 0]} barSize={20}>
                  {barData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h4 className="text-lg font-semibold text-slate-800 mb-6">Principal vs. Secundário</h4>
          <div className="h-64 w-full flex justify-center items-center">
              {pieData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                      <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      fill="#8884d8"
                      paddingAngle={5}
                      dataKey="value"
                      >
                      {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={index === 0 ? '#4f46e5' : '#94a3b8'} />
                      ))}
                      </Pie>
                      <Tooltip formatter={(value: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)} />
                      <Legend verticalAlign="bottom" height={36}/>
                  </PieChart>
                  </ResponsiveContainer>
              ) : (
                  <div className="text-slate-400 text-sm">Insira mais dados para ver categorias.</div>
              )}
          </div>
        </div>
      </div>
    </div>
  );
};