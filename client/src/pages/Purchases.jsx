import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PurchaseCard from '../components/PurchaseCard';
import { pedidoApi } from '../api/pedidoApi';

export default function Purchases() {
  const [pedidos, setPedidos] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const localUser = JSON.parse(localStorage.getItem("user") || "{}");
    const userId = localUser?.id;
    if (!userId) {
      setPedidos([]);
      return;
    }

    pedidoApi.getByUsuario(userId)
      .then(data => setPedidos(data))
      .catch(err => setError(err.message));
  }, []);

  if (error) return <p>Error: {error}</p>;
  if (pedidos === null) return <p>Cargando compras...</p>;

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
