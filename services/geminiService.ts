import { GoogleGenAI } from "@google/genai";
import { Metrics } from "../types";

// Função segura para obter a chave API em diferentes ambientes (Vite vs Webpack/Node)
// Isso evita o erro "process is not defined" que causa a tela branca
const getApiKey = () => {
  try {
    // Tenta pegar do Vite (padrão moderno que usamos no passo a passo)
    // @ts-ignore
    if (typeof import.meta !== "undefined" && import.meta.env && import.meta.env.VITE_API_KEY) {
      // @ts-ignore
      return import.meta.env.VITE_API_KEY;
    }
    // Tenta pegar do Node/Webpack (caso esteja rodando em outro ambiente)
    if (typeof process !== "undefined" && process.env && process.env.API_KEY) {
      return process.env.API_KEY;
    }
  } catch (e) {
    console.warn("Erro ao ler variáveis de ambiente:", e);
  }
  return "";
};

const ai = new GoogleGenAI({ apiKey: getApiKey() });

export const getBusinessInsights = async (metrics: Metrics, targetMonthly: number, targetAnnual: number): Promise<string> => {
  try {
    const mainProducts = metrics.products.filter(p => p.category === 'Principal').map(p => p.name).join(', ');
    const secondaryProducts = metrics.products.filter(p => p.category === 'Secundário').map(p => p.name).join(', ');
    
    // Calcular progresso com segurança contra divisão por zero
    const progressMonthly = targetMonthly > 0 ? (metrics.monthlyRevenue / targetMonthly) * 100 : 0;
    const progressAnnual = targetAnnual > 0 ? (metrics.annualRevenue / targetAnnual) * 100 : 0;

    const prompt = `
      Atue como um consultor de negócios sênior especialista em performance de agências.
      Analise os seguintes dados da "Agência Fluir":
      
      DADOS FINANCEIROS:
      - Faturamento Mês Atual: R$ ${metrics.monthlyRevenue.toFixed(2)} (Meta: R$ ${targetMonthly.toFixed(2)}) - Progresso: ${progressMonthly.toFixed(1)}%
      - Faturamento Ano Atual: R$ ${metrics.annualRevenue.toFixed(2)} (Meta: R$ ${targetAnnual.toFixed(2)}) - Progresso: ${progressAnnual.toFixed(1)}%
      - Ticket Médio Global: R$ ${metrics.averageTicket.toFixed(2)}
      
      PRODUTOS:
      - Principais (Curva A): ${mainProducts}
      - Secundários (Curva B/C): ${secondaryProducts}
      
      SOLICITAÇÃO:
      Forneça uma análise estratégica curta em Markdown.
      1. Se o progresso mensal estiver baixo (<70%), dê uma ação de emergência para fechar o mês.
      2. Se o anual estiver baixo, sugira uma mudança estrutural.
      3. Sugira como usar os produtos principais para alavancar o ticket médio.
      
      Seja direto, motivador e use emojis para facilitar a leitura.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "Não foi possível gerar insights no momento.";
  } catch (error) {
    console.error("Erro ao consultar Gemini:", error);
    return "Erro ao conectar com a IA. Verifique se você configurou a variável 'VITE_API_KEY' nas configurações do projeto na Vercel.";
  }
};