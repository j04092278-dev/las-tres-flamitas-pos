import { useEffect, useState } from 'react';
import { api } from '../services/api';
import type { CashSession } from '../types';

export default function CashRegister() {
  const [current, setCurrent] = useState<CashSession | null>(null);
  const [sessions, setSessions] = useState<CashSession[]>([]);
  const [openingAmount, setOpeningAmount] = useState('');
  const [closingAmount, setClosingAmount] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CashSession | null>(null);

  const load = async () => {
    const [cur, list] = await Promise.all([
      api.getCurrentSession(),
      api.getSessions(),
    ]);
    setCurrent(cur);
    setSessions(list);
  };

  useEffect(() => { load(); }, []);

  const handleOpen = async () => {
    try {
      setLoading(true);
      await api.openSession(parseFloat(openingAmount) || 0);
      setOpeningAmount('');
      await load();
    } catch (e: any) { alert(e.message); }
    finally { setLoading(false); }
  };

  const handleClose = async () => {
    if (!confirm('¿Cerrar la caja? Esta acción no se puede deshacer.')) return;
    try {
      setLoading(true);
      const closed = await api.closeSession(parseFloat(closingAmount) || 0, notes);
      setResult(closed);
      setClosingAmount('');
      setNotes('');
      await load();
    } catch (e: any) { alert(e.message); }
    finally { setLoading(false); }
  };

  const totalSales = current?.totalSales || 0;
  const expected = current ? current.openingAmount + totalSales : 0;
  const diff = (parseFloat(closingAmount) || 0) - expected;

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto">
      <h2 className="font-titles font-bold text-3xl text-flamita-red mb-6">💰 Corte de Caja</h2>

      {current ? (
        <div className="bg-flamita-card rounded-lg border-2 border-green-600 p-6 mb-6">
          <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
            <h3 className="font-titles font-bold text-2xl">🟢 CAJA ABIERTA</h3>
            <span className="text-xs text-gray-400">
              Desde: {new Date(current.openedAt).toLocaleString()}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-flamita-bg p-3 rounded">
              <p className="text-xs text-gray-400">Monto inicial</p>
              <p className="text-xl font-bold">${current.openingAmount.toFixed(2)}</p>
            </div>
            <div className="bg-flamita-bg p-3 rounded">
              <p className="text-xs text-gray-400">Ventas del día</p>
              <p className="text-xl font-bold text-flamita-red">${totalSales.toFixed(2)}</p>
            </div>
            <div className="bg-flamita-bg p-3 rounded">
              <p className="text-xs text-gray-400">Esperado en caja</p>
              <p className="text-xl font-bold text-green-400">${expected.toFixed(2)}</p>
            </div>
          </div>

          <div className="border-t border-flamita-border pt-4">
            <h4 className="font-bold mb-3">Cerrar Caja</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="text-xs text-gray-400">Monto contado</label>
                <input type="number" value={closingAmount}
                  onChange={(e) => setClosingAmount(e.target.value)} placeholder="0.00"
                  className="w-full bg-flamita-bg border border-flamita-border rounded px-3 py-2 mt-1" />
              </div>
              <div className="md:col-span-2">
                <label className="text-xs text-gray-400">Notas (opcional)</label>
                <input type="text" value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-flamita-bg border border-flamita-border rounded px-3 py-2 mt-1" />
              </div>
            </div>
            {closingAmount && (
              <p className="mt-3 text-sm">
                Diferencia:{' '}
                <span className={diff === 0 ? 'text-green-400' : diff > 0 ? 'text-yellow-400' : 'text-red-400'}>
                  ${diff.toFixed(2)} {diff === 0 ? '(Cuadra ✓)' : diff > 0 ? '(Sobrante)' : '(Faltante)'}
                </span>
              </p>
            )}
            <button onClick={handleClose} disabled={loading || !closingAmount}
              className="mt-4 bg-flamita-red hover:bg-flamita-dark-red disabled:bg-gray-700 px-6 py-3 rounded font-bold">
              {loading ? 'Cerrando...' : '🔒 Cerrar Caja'}
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-flamita-card rounded-lg border-2 border-yellow-600 p-6 mb-6">
          <h3 className="font-titles font-bold text-2xl mb-4">🔴 CAJA CERRADA</h3>
          <p className="text-gray-400 mb-4">Abre la caja para comenzar a vender.</p>
          <div className="flex flex-wrap gap-3 items-end">
            <div>
              <label className="text-xs text-gray-400">Monto inicial (fondo)</label>
              <input type="number" value={openingAmount}
                onChange={(e) => setOpeningAmount(e.target.value)} placeholder="0.00"
                className="bg-flamita-bg border border-flamita-border rounded px-3 py-2 mt-1" />
            </div>
            <button onClick={handleOpen} disabled={loading}
              className="bg-green-700 hover:bg-green-600 px-6 py-2 rounded font-bold disabled:opacity-50">
              {loading ? '...' : '🔓 Abrir Caja'}
            </button>
          </div>
        </div>
      )}

      {result && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-flamita-card p-6 rounded-lg max-w-md w-full">
            <h3 className="font-titles font-bold text-2xl text-flamita-red text-center mb-4">
              🧾 Corte Final
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span>Apertura:</span><span>${result.openingAmount.toFixed(2)}</span></div>
              <div className="flex justify-between"><span>Ventas:</span><span>${result.totalSales.toFixed(2)}</span></div>
              <div className="flex justify-between border-t border-flamita-border pt-2">
                <span>Esperado:</span><span>${result.expectedAmount?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between"><span>Contado:</span><span>${result.closingAmount?.toFixed(2)}</span></div>
              <div className="flex justify-between font-bold text-lg border-t border-flamita-border pt-2">
                <span>Diferencia:</span>
                <span className={result.difference === 0 ? 'text-green-400' : 'text-red-400'}>
                  ${result.difference?.toFixed(2)}
                </span>
              </div>
            </div>
            <button onClick={() => setResult(null)}
              className="w-full mt-6 bg-flamita-red hover:bg-flamita-dark-red py-2 rounded font-bold">
              Cerrar
            </button>
          </div>
        </div>
      )}

      <div className="mt-8">
        <h3 className="font-titles font-bold text-xl text-flamita-red mb-3">📁 Historial de Cortes</h3>
        <div className="bg-flamita-card rounded-lg border border-flamita-border overflow-x-auto">
          <table className="w-full text-sm min-w-[800px]">
            <thead className="bg-flamita-dark-red">
              <tr>
                <th className="text-left p-3">Apertura</th>
                <th className="text-left p-3">Cierre</th>
                <th className="text-right p-3">Inicial</th>
                <th className="text-right p-3">Ventas</th>
                <th className="text-right p-3">Esperado</th>
                <th className="text-right p-3">Contado</th>
                <th className="text-right p-3">Diferencia</th>
                <th className="text-center p-3">Estado</th>
              </tr>
            </thead>
            <tbody>
              {sessions.map((s) => (
                <tr key={s.id} className="border-t border-flamita-border">
                  <td className="p-3 text-xs">{new Date(s.openedAt).toLocaleString()}</td>
                  <td className="p-3 text-xs">{s.closedAt ? new Date(s.closedAt).toLocaleString() : '—'}</td>
                  <td className="p-3 text-right">${s.openingAmount.toFixed(2)}</td>
                  <td className="p-3 text-right text-flamita-red">${s.totalSales.toFixed(2)}</td>
                  <td className="p-3 text-right">{s.expectedAmount != null ? `$${s.expectedAmount.toFixed(2)}` : '—'}</td>
                  <td className="p-3 text-right">{s.closingAmount != null ? `$${s.closingAmount.toFixed(2)}` : '—'}</td>
                  <td className={`p-3 text-right font-bold ${
                    s.difference == null ? '' : s.difference === 0 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {s.difference != null ? `$${s.difference.toFixed(2)}` : '—'}
                  </td>
                  <td className="p-3 text-center">
                    <span className={`px-2 py-0.5 rounded text-xs ${
                      s.status === 'OPEN' ? 'bg-green-900 text-green-300' : 'bg-gray-700 text-gray-300'
                    }`}>{s.status === 'OPEN' ? 'ABIERTA' : 'CERRADA'}</span>
                  </td>
                </tr>
              ))}
              {sessions.length === 0 && (
                <tr><td colSpan={8} className="p-4 text-center text-gray-500">No hay cortes registrados</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}