import { Link } from 'react-router-dom';

const ESTADO_LABELS = {
  PENDIENTE: 'Pendiente',
  CONFIRMADO: 'Confirmado',
  ENVIADO: 'Enviado',
  ENTREGADO: 'Entregado',
  CANCELADO: 'Cancelado',
};

const ESTADO_COLORS = {
  PENDIENTE: '#f59e0b',
  CONFIRMADO: '#3b82f6',
  ENVIADO: '#8b5cf6',
  ENTREGADO: '#10b981',
  CANCELADO: '#ef4444',
};

export default function PurchaseCard({ pedido }) {
  const fecha = new Date(pedido.fechaPedido).toLocaleDateString('es-AR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const recepcion = pedido.fechaRecepcion
    ? new Date(pedido.fechaRecepcion).toLocaleDateString('es-AR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null;

  const totalItems = pedido.items.reduce((sum, i) => sum + i.cantidad, 0);

  return (
    <div style={{
      border: '1px solid #e5e7eb',
      borderRadius: '8px',
      marginBottom: '1rem',
      background: '#fff',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1rem',
        borderBottom: '1px solid #e5e7eb',
      }}>
        <div>
          <h3 style={{ margin: 0, fontSize: '1.1rem' }}>
            Pedido #{pedido.pedidoId}
          </h3>
          <span style={{ fontSize: '0.85rem', color: '#6b7280' }}>{fecha}</span>
          {recepcion && (
            <span style={{ fontSize: '0.85rem', color: '#6b7280', marginLeft: '1rem' }}>
              Recibido: {recepcion}
            </span>
          )}
        </div>

        <span style={{
          background: ESTADO_COLORS[pedido.estado] || '#6b7280',
          color: '#fff',
          padding: '0.25rem 0.75rem',
          borderRadius: '999px',
          fontSize: '0.8rem',
          fontWeight: 600,
        }}>
          {ESTADO_LABELS[pedido.estado] || pedido.estado}
        </span>
      </div>

      {/* Product detail */}
      <div style={{ padding: '1rem' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #e5e7eb', textAlign: 'left' }}>
              <th style={{ padding: '0.5rem' }}>Producto</th>
              <th style={{ padding: '0.5rem', textAlign: 'center' }}>Cant.</th>
              <th style={{ padding: '0.5rem', textAlign: 'right' }}>P. Unit.</th>
              <th style={{ padding: '0.5rem', textAlign: 'right' }}>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {pedido.items.map((item) => (
              <tr key={item.pedidoProductoId} style={{ borderBottom: '1px solid #f3f4f6' }}>
                <td style={{ padding: '0.5rem' }}>
                  <Link
                    to={`/producto/${item.productoId}`}
                    style={{ color: '#2563eb', textDecoration: 'none' }}
                  >
                    {item.nombreProducto}
                  </Link>
                </td>
                <td style={{ padding: '0.5rem', textAlign: 'center' }}>{item.cantidad}</td>
                <td style={{ padding: '0.5rem', textAlign: 'right' }}>
                  ${item.precioUnitario.toFixed(2)}
                </td>
                <td style={{ padding: '0.5rem', textAlign: 'right', fontWeight: 600 }}>
                  ${(item.precioUnitario * item.cantidad).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div style={{
        padding: '0.75rem 1rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: '#f9fafb',
        borderTop: '1px solid #e5e7eb',
      }}>
        <span style={{ fontSize: '0.9rem', color: '#4b5563' }}>
          {totalItems} {totalItems === 1 ? 'producto' : 'productos'}
        </span>
        <span style={{ fontSize: '1.1rem', fontWeight: 700 }}>
          ${pedido.total.toFixed(2)}
        </span>
      </div>
    </div>
  );
}
