import { GoogleGenAI } from "@google/genai";
import { Metrics } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getBusinessInsights = async (metrics: Metrics, targetRevenue: number): Promise<string> => {
  try {
    const mainProducts = metrics.products.filter(p => p.category === 'Principal').map(p => p.name).join(', ');
    const secondaryProducts = metrics.products.filter(p => p.category === 'Secundário').map(p => p.name).join(', ');
    
    const prompt = `
      Atue como um consultor de negócios sênior especialista em vendas.
      Analise os seguintes dados de uma empresa:
      
      - Faturamento Atual: R$ ${metrics.totalRevenue.toFixed(2)}
      - Ticket Médio: R$ ${metrics.averageTicket.toFixed(2)}
      - Meta de Faturamento: R$ ${targetRevenue.toFixed(2)}
      - Produtos Principais (Curva A): ${mainProducts}
      - Produtos Secundários (Curva B/C): ${secondaryProducts}
      
      Forneça 3 estratégias curtas e acionáveis (máximo 1 parágrafo cada) para atingir a meta de faturamento.
      Foque em:
      1. Como alavancar os produtos principais.
      2. Como aumentar o ticket médio usando os secundários (cross-sell/up-sell).
      3. Uma ação promocional específica baseada nesses dados.
      
      Use formatação Markdown simples. Seja direto e motivador.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "Não foi possível gerar insights no momento.";
  } catch (error) {
    console.error("Erro ao consultar Gemini:", error);
    return "Erro ao conectar com o consultor IA. Verifique sua chave de API.";
  }
};