import { Link } from 'react-router-dom';
import './css/CartCard.css';

const normalizeImageUrl = (value) => {
  if (!value) return 'https://via.placeholder.com/150?text=Sin+Imagen';
  if (/^https?:\/\//i.test(value) || value.startsWith('data:')) return value;
  return `http://localhost:8080/${value.replace(/^\/+/, '')}`;
};

export default function CartCard({ item, onUpdateCantidad, onRemove }) {
  return (
    <div className="cart-item">
      <img
        src={normalizeImageUrl(item.foto)}
        alt={item.nombre}
        className="cart-item-img"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = 'https://via.placeholder.com/150?text=Sin+Imagen';
        }}
      />

      <div className="cart-item-info">
        <Link to={`/producto/${item.id}`} className="cart-item-name">
          {item.nombre}
        </Link>
        <span className="cart-item-price">${item.precio.toFixed(2)}</span>
      </div>

      <div className="cart-item-qty">
        <button
          type="button"
          onClick={() => onUpdateCantidad(item.id, -1)}
          disabled={item.cantidad <= 1}
        >
          -
        </button>
        <span>{item.cantidad}</span>
        <button
          type="button"
          onClick={() => onUpdateCantidad(item.id, 1)}
          disabled={item.cantidad >= item.stock}
        >
          +
        </button>
      </div>

      <span className="cart-item-subtotal">
        ${(item.precio * item.cantidad).toFixed(2)}
      </span>

      <button
        type="button"
        className="cart-item-remove"
        onClick={() => onRemove(item.id)}
      >
        Eliminar
      </button>
    </div>
  );
}
