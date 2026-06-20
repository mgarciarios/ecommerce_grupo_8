import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import CartCard from '../components/CartCard';
import {
  fetchCartItems, // ¡NUEVO!: Debemos importar la acción
  updateCartItemQuantity,
  removeItemFromCart,
  checkoutCart,
  selectCartItems,
  selectCartTotal,
  selectCartLoading,
  selectCartError,
} from '../store/slices/cartSlice';
import './css/Cart.css';

export default function Cart() {
  const dispatch = useDispatch();
  const items = useSelector(selectCartItems);
  const total = useSelector(selectCartTotal);
  const loading = useSelector(selectCartLoading);
  const error = useSelector(selectCartError);

  // NUEVO: Descomentamos el useEffect para que vaya a buscar los 
  // productos a la base de datos real apenas el usuario entra a la página
  useEffect(() => {
    dispatch(fetchCartItems());
  }, [dispatch]);

  const handleUpdateCantidad = (id, delta) => {
    dispatch(updateCartItemQuantity({ id, delta }));
  };

  const handleRemove = (id) => {
    dispatch(removeItemFromCart(id));
  };

  const handleFinalizarCompra = async () => {
    try {
      const pedido = await dispatch(checkoutCart()).unwrap();
      alert(`Compra finalizada! Pedido #${pedido.pedidoId} - Total: $${pedido.total.toFixed(2)}`);
    } catch (err) {
      alert(err);
    }
  };

  if (loading) {
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
