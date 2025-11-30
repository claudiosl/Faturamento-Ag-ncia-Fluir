import React, { useState } from 'react';
import { PlusCircle } from 'lucide-react';

interface SalesFormProps {
  onAddSale: (product: string, price: number, quantity: number) => void;
}

export const SalesForm: React.FC<SalesFormProps> = ({ onAddSale }) => {
  const [product, setProduct] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('1');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (product && price && quantity) {
      onAddSale(product, parseFloat(price), parseInt(quantity));
      setProduct('');
      setPrice('');
      setQuantity('1');
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-slate-100">
      <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
        <PlusCircle className="mr-2 text-indigo-600" size={20} />
        Registrar Nova Venda
      </h3>
      <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 items-end">
        <div className="flex-grow w-full">
          <label className="block text-sm font-medium text-slate-600 mb-1">Produto</label>
          <input
            type="text"
            value={product}
            onChange={(e) => setProduct(e.target.value)}
            placeholder="Ex: Consultoria Premium, Camiseta X..."
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
            required
          />
        </div>
        <div className="w-full md:w-32">
          <label className="block text-sm font-medium text-slate-600 mb-1">Preço (R$)</label>
          <input
            type="number"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="0,00"
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
            required
          />
        </div>
        <div className="w-full md:w-24">
          <label className="block text-sm font-medium text-slate-600 mb-1">Qtd</label>
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full md:w-auto px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center"
        >
          Adicionar
        </button>
      </form>
    </div>
  );
};