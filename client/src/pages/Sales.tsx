import { useEffect, useState } from 'react';
import { api } from '../services/api';
import type { SalesSummary } from '../types';

export default function Sales() {
  const [data, setData] = useState<SalesSummary | null>(null);
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.getSales(from || undefined, to || undefined);
      setData(res);
    } catch (e: any) { alert(e.message); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  return (
    <div className="p-4 md:p-6">
      <h2 className="font-titles font-bold text-3xl text-flamita-red mb-6">
        📊 Reporte de Ventas
      </h2>

      <div className="bg-flamita-card p-4 rounded-lg border border-flamita-border mb-6 flex flex-wrap gap-3 items-end">
        <div>
          <label className="text-xs text-gray-400 block">Desde</label>
          <input type="date" value={from} onChange={(e) => setFrom(e.target.value)}
            className="bg-flamita-bg border border-flamita-border rounded px-3 py-2" />
        </div>
        <div>
          <label className="text-xs text-gray-400 block">Hasta</label>
          <input type="date" value={to} onChange={(e) => setTo(e.target.value)}
            className="bg-flamita-bg border border-flamita-border rounded px-3 py-2" />
        </div>
        <button onClick={load} disabled={loading}
          className="bg-flamita-red hover:bg-flamita-dark-red px-4 py-2 rounded font-bold disabled:opacity-50">
          {loading ? 'Cargando...' : '🔍 Filtrar'}
        </button>
      </div>

      {data && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-flamita-card p-4 rounded-lg border-l-4 border-flamita-red">
              <p className="text-gray-400 text-sm">Ingresos Totales</p>
              <p className="text-3xl font-bold text-flamita-red">${data.totalRevenue.toFixed(2)}</p>
            </div>
            <div className="bg-flamita-card p-4 rounded-lg border-l-4 border-flamita-red">
              <p className="text-gray-400 text-sm">Tickets</p>
              <p className="text-3xl font-bold">{data.totalOrders}</p>
            </div>
            <div className="bg-flamita-card p-4 rounded-lg border-l-4 border-flamita-red">
              <p className="text-gray-400 text-sm">Productos Vendidos</p>
              <p className="text-3xl font-bold">{data.totalItems}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-flamita-card p-4 rounded-lg border border-flamita-border">
              <h3 className="font-titles font-bold text-xl text-flamita-red mb-3">🏆 Top Productos</h3>
              <ul className="space-y-2">
                {data.topProducts.map((p, i) => (
                  <li key={i} className="flex justify-between border-b border-flamita-border pb-1 text-sm">
                    <span>{i + 1}. {p.name}</span>
                    <span className="text-flamita-red font-bold">{p.qty} uds</span>
                  </li>
                ))}
                {data.topProducts.length === 0 && (
                  <li className="text-gray-500 text-sm">Sin datos</li>
                )}
              </ul>
            </div>

            <div className="bg-flamita-card p-4 rounded-lg border border-flamita-border">
              <h3 className="font-titles font-bold text-xl text-flamita-red mb-3">🧾 Últimas Órdenes</h3>
              <div className="max-h-80 overflow-y-auto">
                <table className="w-full text-sm">
                  <thead className="text-gray-400">
                    <tr>
                      <th className="text-left">#</th>
                      <th className="text-left">Fecha</th>
                      <th className="text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.orders.slice(0, 20).map((o) => (
                      <tr key={o.id} className="border-t border-flamita-border">
                        <td className="py-1">#{o.orderNumber}</td>
                        <td className="py-1 text-xs">{new Date(o.createdAt).toLocaleString()}</td>
                        <td className="py-1 text-right text-flamita-red font-bold">${o.total.toFixed(2)}</td>
                      </tr>
                    ))}
                    {data.orders.length === 0 && (
                      <tr><td colSpan={3} className="text-center text-gray-500 py-4">Sin ventas</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}