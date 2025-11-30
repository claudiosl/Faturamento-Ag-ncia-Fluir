export interface Sale {
  id: string;
  productName: string;
  price: number;
  quantity: number;
  total: number;
  date: string;
}

export interface ProductSummary {
  name: string;
  totalRevenue: number;
  totalQuantity: number;
  percentOfRevenue: number;
  category: 'Principal' | 'Secundário';
}

export interface Metrics {
  totalRevenue: number;
  totalSalesCount: number;
  averageTicket: number;
  products: ProductSummary[];
}