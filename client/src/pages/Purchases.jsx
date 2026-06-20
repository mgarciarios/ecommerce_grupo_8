import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import PurchaseCard from '../components/PurchaseCard';
import './css/Purchases.css';
import {
  fetchPurchases,
  selectPurchases,
  selectPurchasesStatus,
  selectPurchasesError,
} from '../store/slices/purchaseSlice';

export default function Purchases() {
  const dispatch = useDispatch();
  const pedidos = useSelector(selectPurchases);
  const status = useSelector(selectPurchasesStatus);
  const error = useSelector(selectPurchasesError);

  useEffect(() => {
    dispatch(fetchPurchases());
  }, [dispatch]);

  if (status === 'loading') {
    return <p>Cargando compras...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (pedidos.length === 0) {
    return (
      <div>
        <h1>Mis compras</h1>
        <p>No tenés compras realizadas.</p>
        <Link to="/productos">Ir a productos</Link>
      </div>
    );
  }

  return (
    <div className="purchases-container">
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '1rem' }}>
        <h1>Mis compras</h1>
        {pedidos.map((pedido) => (
          <PurchaseCard key={pedido.pedidoId} pedido={pedido} />
        ))}
      </div>
    </div>
  );
}
