import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import CartCard from '../components/CartCard';
import {
  fetchCart,
  updateCartItemQuantity,
  removeItemFromCart,
  clearUserCart,
  selectCartItems,
  selectCartTotal,
  selectCartStatus,
  selectCartError,
} from '../store/slices/cartSlice';
import './css/Cart.css';

export default function Cart() {
  const dispatch = useDispatch();
  const items = useSelector(selectCartItems);
  const total = useSelector(selectCartTotal);
  const status = useSelector(selectCartStatus);
  const error = useSelector(selectCartError);

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const handleUpdateCantidad = (id, delta) => {
    dispatch(updateCartItemQuantity({ id, delta }));
  };

  const handleRemove = (id) => {
    dispatch(removeItemFromCart(id));
  };

  const handleFinalizarCompra = () => {
    dispatch(clearUserCart());
    alert('Compra finalizada!');
  };

  if (status === 'loading') {
    return (
      <div className="cart-container">
        <p className="cart-loading">Cargando carrito...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="cart-container">
        <div className="cart-empty">
          <h2>Error al cargar el carrito</h2>
          <p>{error}</p>
          <Link to="/productos" className="cart-btn-back">
            Ir a productos
          </Link>
        </div>
      </div>
    );
  }

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
            onUpdateCantidad={handleUpdateCantidad}
            onRemove={handleRemove}
          />
        ))}
      </div>

      <div className="cart-footer">
        <span className="cart-total">Total: ${total.toFixed(2)}</span>
        <div className="cart-actions">
          <Link to="/productos" className="cart-btn-back">
            Seguir comprando
          </Link>
          <button onClick={handleFinalizarCompra} className="cart-btn-checkout">
            Finalizar compra
          </button>
        </div>
      </div>
    </div>
  );
}
