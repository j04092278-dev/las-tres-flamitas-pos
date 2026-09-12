import { NavLink } from 'react-router-dom';
import type { ReactNode } from 'react';

const links = [
  { to: '/', label: '🛒 POS' },
  { to: '/caja', label: '💰 Corte de Caja' },
  { to: '/ventas', label: '📊 Ventas' },
  { to: '/inventario', label: '📦 Inventario' },
];

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-flamita-card border-b-2 border-flamita-dark-red px-4 md:px-6 py-3 flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="text-3xl">🔥</span>
          <div>
            <h1 className="font-titles font-bold text-xl md:text-2xl text-flamita-red leading-none">
              LAS TRES FLAMITAS
            </h1>
            <p className="text-xs text-gray-400">Sistema de Punto de Venta</p>
          </div>
        </div>
        <nav className="flex flex-wrap gap-2 justify-center">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === '/'}
              className={({ isActive }) =>
                `px-3 md:px-4 py-2 rounded-lg text-xs md:text-sm font-bold transition-colors ${
                  isActive
                    ? 'bg-flamita-red text-white'
                    : 'bg-flamita-bg text-gray-300 hover:bg-flamita-dark-red'
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  );
}