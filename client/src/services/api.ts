import type {
  Product, Category, Order, CashSession, SalesSummary,
} from '../types';

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: `Error ${res.status}` }));
    throw new Error(err.error || `Error ${res.status}`);
  }
  if (res.status === 204) return undefined as T;
  return res.json();
}

export const api = {
  // Products
  getProducts: () => request<Product[]>('/products'),
  getCategories: () => request<Category[]>('/products/categories'),
  updateProduct: (id: string, data: { price?: number; stock?: number }) =>
    request<Product>(`/products/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  createProduct: (data: Partial<Product>) =>
    request<Product>('/products', { method: 'POST', body: JSON.stringify(data) }),
  deleteProduct: (id: string) =>
    request<void>(`/products/${id}`, { method: 'DELETE' }),

  // Orders
  createOrder: (data: {
    items: { productId: string; quantity: number }[];
    paymentMethod: string;
    amountPaid: number;
  }) => request<Order>('/orders', { method: 'POST', body: JSON.stringify(data) }),

  getSales: (from?: string, to?: string) => {
    const q = new URLSearchParams();
    if (from) q.append('from', from);
    if (to) q.append('to', to);
    return request<SalesSummary>(`/orders?${q.toString()}`);
  },

  // Cash register
  getCurrentSession: () => request<CashSession | null>('/cash-register/current'),
  getSessions: () => request<CashSession[]>('/cash-register'),
  openSession: (openingAmount: number) =>
    request<CashSession>('/cash-register/open', {
      method: 'POST',
      body: JSON.stringify({ openingAmount }),
    }),
  closeSession: (closingAmount: number, notes?: string) =>
    request<CashSession>('/cash-register/close', {
      method: 'POST',
      body: JSON.stringify({ closingAmount, notes }),
    }),
};