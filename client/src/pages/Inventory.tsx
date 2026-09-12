import { useEffect, useState } from 'react';
import { api } from '../services/api';
import type { Product } from '../types';

export default function Inventory() {
  const [products, setProducts] = useState<Product[]>([]);
  const [editing, setEditing] = useState<string | null>(null);
  const [editData, setEditData] = useState({ price: '', stock: '' });

  const load = async () => setProducts(await api.getProducts());
  useEffect(() => { load(); }, []);

  const startEdit = (p: Product) => {
    setEditing(p.id);
    setEditData({ price: p.price.toString(), stock: p.stock.toString() });
  };

  const save = async (id: string) => {
    try {
      await api.updateProduct(id, {
        price: parseFloat(editData.price),
        stock: parseInt(editData.stock),
      });
      setEditing(null);
      load();
    } catch (e: any) { alert(e.message); }
  };

  return (
    <div className="p-4 md:p-6">
      <h2 className="font-titles font-bold text-3xl text-flamita-red mb-6">
        📦 Control de Inventario
      </h2>
      <div className="bg-flamita-card rounded-lg overflow-x-auto border border-flamita-border">
        <table className="w-full text-sm min-w-[700px]">
          <thead className="bg-flamita-dark-red">
            <tr>
              <th className="text-left p-3">Producto</th>
              <th className="text-left p-3">Categoría</th>
              <th className="text-right p-3">Precio</th>
              <th className="text-right p-3">Stock</th>
              <th className="text-center p-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-t border-flamita-border hover:bg-flamita-bg">
                <td className="p-3">
                  <div className="font-bold">{p.name}</div>
                  <div className="text-xs text-gray-400">{p.description}</div>
                </td>
                <td className="p-3 text-gray-300">{p.category.name}</td>
                <td className="p-3 text-right">
                  {editing === p.id ? (
                    <input
                      type="number"
                      value={editData.price}
                      onChange={(e) => setEditData({ ...editData, price: e.target.value })}
                      className="w-20 bg-flamita-bg border border-flamita-border rounded px-2 py-1 text-right"
                    />
                  ) : (
                    <span className="text-flamita-red font-bold">${p.price}</span>
                  )}
                </td>
                <td className="p-3 text-right">
                  {editing === p.id ? (
                    <input
                      type="number"
                      value={editData.stock}
                      onChange={(e) => setEditData({ ...editData, stock: e.target.value })}
                      className="w-20 bg-flamita-bg border border-flamita-border rounded px-2 py-1 text-right"
                    />
                  ) : (
                    <span
                      className={`font-bold ${
                        p.stock > 10 ? 'text-green-400' : p.stock > 0 ? 'text-yellow-400' : 'text-red-400'
                      }`}
                    >{p.stock}</span>
                  )}
                </td>
                <td className="p-3 text-center">
                  {editing === p.id ? (
                    <div className="flex gap-2 justify-center">
                      <button onClick={() => save(p.id)} className="bg-green-700 hover:bg-green-600 px-3 py-1 rounded text-xs font-bold">Guardar</button>
                      <button onClick={() => setEditing(null)} className="bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded text-xs font-bold">Cancelar</button>
                    </div>
                  ) : (
                    <button onClick={() => startEdit(p)} className="bg-flamita-dark-red hover:bg-flamita-red px-3 py-1 rounded text-xs font-bold">✏️ Editar</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}