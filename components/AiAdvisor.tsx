import React, { useState } from 'react';
import { Metrics } from '../types';
import { getBusinessInsights } from '../services/geminiService';
import { Sparkles, Loader2, MessageSquareQuote } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface AiAdvisorProps {
  metrics: Metrics;
  targetRevenue: number;
}

export const AiAdvisor: React.FC<AiAdvisorProps> = ({ metrics, targetRevenue }) => {
  const [advice, setAdvice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGetAdvice = async () => {
    if (metrics.totalRevenue === 0) return;
    
    setLoading(true);
    const result = await getBusinessInsights(metrics, targetRevenue);
    setAdvice(result);
    setLoading(false);
  };

  return (
    <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-xl shadow-xl text-white p-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl"></div>
      
      <div className="relative z-10">
        <h3 className="text-xl font-bold flex items-center mb-2">
          <Sparkles className="mr-2 text-yellow-300" />
          Consultor Inteligente
        </h3>
        <p className="text-indigo-100 text-sm mb-6 max-w-lg">
          Use nossa IA para analisar seus números e descobrir estratégias personalizadas para bater sua meta de {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(targetRevenue)}.
        </p>

        {!advice && !loading && (
          <button
            onClick={handleGetAdvice}
            disabled={metrics.totalRevenue === 0}
            className={`px-6 py-3 rounded-lg font-semibold flex items-center transition-all ${
                metrics.totalRevenue === 0 
                ? 'bg-indigo-500/50 cursor-not-allowed text-indigo-200'
                : 'bg-white text-indigo-700 hover:bg-indigo-50 shadow-lg hover:shadow-xl'
            }`}
          >
            {metrics.totalRevenue === 0 ? "Adicione vendas para iniciar" : "Gerar Análise Estratégica"}
          </button>
        )}

        {loading && (
          <div className="flex items-center space-x-3 text-indigo-100 animate-pulse">
            <Loader2 className="animate-spin" />
            <span>Analisando seus dados de vendas...</span>
          </div>
        )}

        {advice && (
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 mt-4 animate-fadeIn">
            <div className="flex items-start mb-4">
                <MessageSquareQuote className="text-yellow-300 mr-3 mt-1 flex-shrink-0" size={24}/>
                <div className="prose prose-invert prose-sm max-w-none">
                    <ReactMarkdown>{advice}</ReactMarkdown>
                </div>
            </div>
            <button 
                onClick={() => setAdvice(null)}
                className="text-xs text-indigo-200 hover:text-white underline mt-2"
            >
                Nova Análise
            </button>
          </div>
        )}
      </div>
    </div>
  );
};