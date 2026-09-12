export interface Category {
  id: string;
  name: string;
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  stock: number;
  categoryId: string;
  category: Category;
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  stock: number;
}

export interface OrderItem {
  id: string;
  productName: string;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface Order {
  id: string;
  orderNumber: number;
  subtotal: number;
  total: number;
  paymentMethod: string;
  amountPaid: number;
  change: number;
  createdAt: string;
  items: OrderItem[];
}

export interface CashSession {
  id: string;
  openedAt: string;
  closedAt?: string;
  openingAmount: number;
  closingAmount?: number;
  expectedAmount?: number;
  difference?: number;
  totalSales: number;
  notes?: string;
  status: 'OPEN' | 'CLOSED';
  orders?: Order[];
}

export interface SalesSummary {
  orders: Order[];
  totalRevenue: number;
  totalOrders: number;
  totalItems: number;
  topProducts: { name: string; qty: number; revenue: number }[];
}