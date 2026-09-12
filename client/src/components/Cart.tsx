import { useState } from 'react';
import { useCartStore } from '../store/cartStore';
import { api } from '../services/api';

interface Props {
  onSuccess: () => void;
}

export default function Cart({ onSuccess }: Props) {
  const { items, removeItem, decreaseItem, addItem, clearCart, getTotal } = useCartStore();
  const [paymentMethod, setPaymentMethod] = useState<'EFECTIVO' | 'TARJETA' | 'TRANSFERENCIA'>('EFECTIVO');
  const [amountPaid, setAmountPaid] = useState('');
  const [loading, setLoading] = useState(false);
  const [ticket, setTicket] = useState<any>(null);

  const total = getTotal();
  const paid = parseFloat(amountPaid) || 0;
  const change = paid - total;

  const handleCheckout = async () => {
    if (items.length === 0) return;
    if (paymentMethod === 'EFECTIVO' && paid < total) {
      alert('Monto pagado insuficiente');
      return;
    }
    try {
      setLoading(true);
      const order = await api.createOrder({
        items: items.map((i) => ({ productId: i.id, quantity: i.quantity })),
        paymentMethod,
        amountPaid: paymentMethod === 'EFECTIVO' ? paid : total,
      });
      setTicket(order);
      clearCart();
      setAmountPaid('');
      onSuccess();
    } catch (e: any) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
  };

  const printTicket = () => {
    if (!ticket) return;
    const w = window.open('', '_blank', 'width=400,height=600');
    if (!w) return;
    w.document.write(`
      <html><head><title>Ticket #${ticket.orderNumber}</title>
      <style>
        body{font-family:monospace;padding:20px;font-size:13px}
        h2{text-align:center;margin:0}.center{text-align:center}
        hr{border:1px dashed #000}table{width:100%}td{padding:2px 0}
        .total{font-weight:bold;font-size:16px}
      </style></head><body>
      <h2>LAS TRES FLAMITAS</h2>
      <p class="center">Ticket #${ticket.orderNumber}</p>
      <p class="center">${new Date(ticket.createdAt).toLocaleString()}</p>
      <hr/>
      <table>${ticket.items.map((i: any) =>
        `<tr><td>${i.quantity}x ${i.productName}</td><td style="text-align:right">$${i.subtotal}</td></tr>`
      ).join('')}</table>
      <hr/>
      <table>
        <tr><td>Subtotal:</td><td style="text-align:right">$${ticket.subtotal}</td></tr>
        <tr class="total"><td>TOTAL:</td><td style="text-align:right">$${ticket.total}</td></tr>
        <tr><td>Pagó con:</td><td style="text-align:right">$${ticket.amountPaid}</td></tr>
        <tr><td>Cambio:</td><td style="text-align:right">$${ticket.change}</td></tr>
      </table>
      <hr/>
      <p class="center">¡GRACIAS POR SU COMPRA!</p>
      </body></html>`);
    w.document.close();
    w.print();
  };

  return (
    <div className="w-full md:w-96 bg-flamita-card flex flex-col h-full border-l-2 border-flamita-dark-red">
      <div className="p-4 border-b border-flamita-border">
        <h2 className="font-titles font-bold text-2xl text-flamita-red text-center">TICKET</h2>
        <p className="text-center text-xs text-gray-400">{items.length} producto(s)</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {items.length === 0 ? (
          <p className="text-center text-gray-500 mt-10">Carrito vacío</p>
        ) : (
          items.map((item) => (
            <div key={item.id} className="bg-flamita-bg p-3 rounded border border-flamita-border">
              <div className="flex justify-between">
                <p className="font-bold text-sm flex-1 pr-2">{item.name}</p>
                <button onClick={() => removeItem(item.id)} className="text-flamita-red text-xs hover:underline">
                  ✕
                </button>
              </div>
              <div className="flex justify-between items-center mt-2">
                <div className="flex items-center gap-2">
                  <button onClick={() => decreaseItem(item.id)} className="w-6 h-6 bg-flamita-dark-red rounded text-white font-bold">−</button>
                  <span className="w-8 text-center font-bold">{item.quantity}</span>
                  <button
                    onClick={() =>
                      addItem({
                        id: item.id, name: item.name, price: item.price,
                        stock: item.stock, categoryId: '', description: '',
                        category: { id: '', name: '' },
                      } as any)
                    }
                    className="w-6 h-6 bg-flamita-dark-red rounded text-white font-bold"
                  >+</button>
                </div>
                <span className="font-bold text-flamita-red">${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="p-4 border-t border-flamita-border space-y-3">
        <div className="flex justify-between text-2xl font-bold">
          <span>TOTAL:</span>
          <span className="text-flamita-red">${total.toFixed(2)}</span>
        </div>

        <div>
          <label className="text-xs text-gray-400">Método de pago</label>
          <div className="grid grid-cols-3 gap-1 mt-1">
            {(['EFECTIVO', 'TARJETA', 'TRANSFERENCIA'] as const).map((m) => (
              <button
                key={m}
                onClick={() => setPaymentMethod(m)}
                className={`py-1 rounded text-xs font-bold ${
                  paymentMethod === m ? 'bg-flamita-red text-white' : 'bg-flamita-bg text-gray-400'
                }`}
              >{m}</button>
            ))}
          </div>
        </div>

        {paymentMethod === 'EFECTIVO' && (
          <div>
            <label className="text-xs text-gray-400">Monto recibido</label>
            <input
              type="number"
              value={amountPaid}
              onChange={(e) => setAmountPaid(e.target.value)}
              placeholder="0.00"
              className="w-full bg-flamita-bg border border-flamita-border rounded px-3 py-2 mt-1 text-white"
            />
            {paid > 0 && (
              <p className="text-sm mt-1">
                Cambio: <span className={change >= 0 ? 'text-green-400' : 'text-red-400'}>${change.toFixed(2)}</span>
              </p>
            )}
          </div>
        )}

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={clearCart}
            disabled={items.length === 0}
            className="bg-flamita-bg border border-flamita-border hover:bg-gray-800 disabled:opacity-40 py-3 rounded font-bold"
          >Cancelar</button>
          <button
            onClick={handleCheckout}
            disabled={items.length === 0 || loading}
            className="bg-flamita-red hover:bg-flamita-dark-red disabled:bg-gray-700 py-3 rounded font-titles font-bold"
          >{loading ? '...' : 'COBRAR'}</button>
        </div>
      </div>

      {ticket && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-flamita-card p-6 rounded-lg max-w-md w-full">
            <h3 className="font-titles font-bold text-2xl text-flamita-red text-center">
              ✅ Venta Registrada
            </h3>
            <div className="mt-4 space-y-2 text-sm">
              <p><strong>Ticket:</strong> #{ticket.orderNumber}</p>
              <p><strong>Total:</strong> ${ticket.total.toFixed(2)}</p>
              <p><strong>Pagó con:</strong> ${ticket.amountPaid.toFixed(2)}</p>
              <p><strong>Cambio:</strong> ${ticket.change.toFixed(2)}</p>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-6">
              <button onClick={printTicket} className="bg-flamita-dark-red hover:bg-flamita-red py-2 rounded font-bold">🖨️ Imprimir</button>
              <button onClick={() => setTicket(null)} className="bg-flamita-bg border border-flamita-border py-2 rounded font-bold">Cerrar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}