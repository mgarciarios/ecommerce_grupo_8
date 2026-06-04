import { useState } from 'react';
import { Link } from 'react-router-dom';
import CartCard from '../components/CartCard';
import './css/Cart.css';

const STORAGE_KEY = 'cart';

const readCart = () => JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');

export default function Cart() {
  const [items, setItems] = useState(readCart);

  const syncStorage = (nuevos) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nuevos));
    setItems(nuevos);
  };

  const updateCantidad = (id, delta) => {
    const nuevos = items
      .map((item) => {
        if (item.id !== id) return item;
        const nuevaCantidad = item.cantidad + delta;
        if (nuevaCantidad < 1 || nuevaCantidad > item.stock) return item;
        return { ...item, cantidad: nuevaCantidad };
      });
    syncStorage(nuevos);
  };

  const removeItem = (id) => {
    syncStorage(items.filter((item) => item.id !== id));
  };

  const finalizarCompra = () => {
    alert('Compra finalizada!');
    syncStorage([]);
  };

  const total = items.reduce((sum, item) => sum + item.precio * item.cantidad, 0);

  if (items.length === 0) {
    return (
      <div className="cart-container">
        <div className="cart-empty">
          <h2>Tu carrito está vacío</h2>
          <p>Agregá productos desde la tienda.</p>
          <Link to="/productos" className="cart-btn-back">
            Ir a productos
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <h1 className="cart-title">Carrito de compras</h1>

      <div className="cart-items">
        {items.map((item) => (
          <CartCard
            key={item.id}
            item={item}
            onUpdateCantidad={updateCantidad}
            onRemove={removeItem}
          />
        ))}
      </div>

      <div className="cart-footer">
        <span className="cart-total">Total: ${total}</span>
        <div className="cart-actions">
          <Link to="/productos" className="cart-btn-back">
            Seguir comprando
          </Link>
          <button onClick={finalizarCompra} className="cart-btn-checkout">
            Finalizar compra
          </button>
        </div>
      </div>
    </div>
  );
}
