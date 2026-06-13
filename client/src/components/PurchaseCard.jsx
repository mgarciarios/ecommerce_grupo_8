import { Link } from 'react-router-dom';
import './css/PurchaseCard.css';

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
    <div className="purchase-card">
      {/* Header */}
      <div className="purchase-card-header">
        <div>
          <h3 className="purchase-card-title">
            Pedido #{pedido.pedidoId}
          </h3>
          <span className="purchase-card-date">{fecha}</span>
          {recepcion && (
            <span className="purchase-card-date received">
              Recibido: {recepcion}
            </span>
          )}
        </div>

        {/* Mantenemos el fondo del estado en línea porque depende de la variable JavaScript */}
        <span 
          className="purchase-card-badge"
          style={{ background: ESTADO_COLORS[pedido.estado] || '#6b7280' }}
        >
          {ESTADO_LABELS[pedido.estado] || pedido.estado}
        </span>
      </div>

      {/* Product detail */}
      <div className="purchase-card-body">
        <table className="purchase-table">
          <thead>
            <tr>
              <th className="col-producto">Producto</th>
              <th className="col-cant">Cant.</th>
              <th className="col-precio">P. Unit.</th>
              <th className="col-subtotal">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {pedido.items.map((item) => (
              <tr key={item.pedidoProductoId}>
                <td className="col-producto">
                  <Link
                    to={`/producto/${item.productoId}`}
                    className="purchase-product-link"
                  >
                    {item.nombreProducto}
                  </Link>
                </td>
                <td className="col-cant">{item.cantidad}</td>
                <td className="col-precio">
                  ${item.precioUnitario.toFixed(2)}
                </td>
                <td className="col-subtotal font-semibold">
                  ${(item.precioUnitario * item.cantidad).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="purchase-card-footer">
        <span className="purchase-footer-items">
          {totalItems} {totalItems === 1 ? 'producto' : 'productos'}
        </span>
        <span className="purchase-footer-total">
          ${pedido.total.toFixed(2)}
        </span>
      </div>
    </div>
  );
}
