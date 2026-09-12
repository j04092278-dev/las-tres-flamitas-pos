import { useEffect, useState, useCallback } from 'react';
import { api } from '../services/api';
import type { Product, Category } from '../types';
import ProductCard from '../components/ProductCard';
import Cart from '../components/Cart';
import { useCartStore } from '../store/cartStore';

export default function POS() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const addItem = useCartStore((s) => s.addItem);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [prods, cats] = await Promise.all([
        api.getProducts(),
        api.getCategories(),
      ]);
      setProducts(prods);
      setCategories(cats);
    } catch (e: any) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const filtered = products.filter((p) => {
    const matchCat = activeCategory === 'ALL' || p.categoryId === activeCategory;
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-90px)]">
      <div className="flex-1 p-4 md:p-6 overflow-y-auto">
        <div className="mb-4 flex flex-col md:flex-row gap-3">
          <input
            type="text"
            placeholder="🔍 Buscar producto..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-flamita-card border border-flamita-border rounded-lg px-4 py-2 text-white"
          />
          <button
            onClick={loadData}
            className="bg-flamita-dark-red hover:bg-flamita-red px-4 py-2 rounded-lg font-bold"
          >🔄 Refrescar</button>
        </div>

        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          <button
            onClick={() => setActiveCategory('ALL')}
            className={`px-5 py-2 rounded-full font-bold whitespace-nowrap ${
              activeCategory === 'ALL'
                ? 'bg-flamita-red text-white'
                : 'bg-flamita-card text-gray-400 hover:bg-gray-800'
            }`}
          >Todos</button>
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setActiveCategory(c.id)}
              className={`px-5 py-2 rounded-full font-bold whitespace-nowrap ${
                activeCategory === c.id
                  ? 'bg-flamita-red text-white'
                  : 'bg-flamita-card text-gray-400 hover:bg-gray-800'
              }`}
            >{c.name}</button>
          ))}
        </div>

        {loading ? (
          <p className="text-center text-gray-500">Cargando productos...</p>
        ) : filtered.length === 0 ? (
          <p className="text-center text-gray-500">No hay productos que coincidan</p>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map((p) => (
              <ProductCard key={p.id} product={p} onAdd={addItem} />
            ))}
          </div>
        )}
      </div>
      <Cart onSuccess={loadData} />
    </div>
  );
}