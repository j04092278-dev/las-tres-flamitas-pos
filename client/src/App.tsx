import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import POS from './pages/POS';
import Inventory from './pages/Inventory';
import Sales from './pages/Sales';
import CashRegister from './pages/CashRegister';

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<POS />} />
        <Route path="/inventario" element={<Inventory />} />
        <Route path="/ventas" element={<Sales />} />
        <Route path="/caja" element={<CashRegister />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}