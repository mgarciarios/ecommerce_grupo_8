import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import CartCard from '../components/CartCard';
import {
  updateCartItemQuantity,
  removeItemFromCart,
  clearUserCart,
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

  // Desactivamos el fetchCartItems() original (que probablemente apuntaba a json-server)
  // ya que ahora el carrito se carga de la base de datos real desde NavBar.jsx
  // useEffect(() => {
  //   dispatch(fetchCartItems());
  // }, [dispatch]);

  const handleUpdateCantidad = (id, delta) => {
    dispatch(updateCartItemQuantity({ id, delta }));

    const token = localStorage.getItem("token");
    const localUser = JSON.parse(localStorage.getItem("user") || localStorage.getItem("usuario") || "{}");
    const carritoId = localUser?.idCarrito || localUser?.user?.idCarrito || localUser?.usuario?.idCarrito || localUser?.carrito?.id || localUser?.user?.carrito?.id;

    if (token && carritoId) {
      if (delta < 0) {
        // Restar cantidad
        fetch(`http://localhost:8080/api/carrito/${carritoId}/productos/${id}/reduce?cantidad=1`, {
          method: 'PUT',
          headers: { 'Authorization': `Bearer ${token}` }
        }).catch(err => console.error("Error BD al reducir carrito:", err));
      } else {
        // Sumar cantidad (buscamos la cantidad actual sumada)
        const item = items.find((i) => i.id === id);
        const nuevaCantidad = item ? item.cantidad + delta : 1;
        
        fetch(`http://localhost:8080/api/carrito/${carritoId}/productos`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ productoId: id, cantidad: nuevaCantidad }) 
        }).catch(err => console.error("Error BD al aumentar carrito:", err));
      }
    }
  };

  const handleRemove = (id) => {
    dispatch(removeItemFromCart(id));

    const token = localStorage.getItem("token");
    const localUser = JSON.parse(localStorage.getItem("user") || localStorage.getItem("usuario") || "{}");
    const carritoId = localUser?.idCarrito || localUser?.user?.idCarrito || localUser?.usuario?.idCarrito || localUser?.carrito?.id || localUser?.user?.carrito?.id;

    if (token && carritoId) {
      // Ruta correcta para eliminar un producto del carrito
      fetch(`http://localhost:8080/api/carrito/${carritoId}/productos/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      }).catch(err => console.error("Error BD al eliminar del carrito:", err));
    }
  };

  const handleFinalizarCompra = () => {
    dispatch(clearUserCart());
    alert('Compra finalizada!');

    const token = localStorage.getItem("token");
    const localUser = JSON.parse(localStorage.getItem("user") || localStorage.getItem("usuario") || "{}");
    const carritoId = localUser?.idCarrito || localUser?.user?.idCarrito || localUser?.usuario?.idCarrito || localUser?.carrito?.id || localUser?.user?.carrito?.id;

    if (token && carritoId) {
      // Ruta correcta para vaciar todo el carrito
      fetch(`http://localhost:8080/api/carrito/${carritoId}/productos`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      }).catch(err => console.error("Error BD al vaciar el carrito:", err));
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
