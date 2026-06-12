import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { removeFromCart, clearCart, fetchCartItems } from '../store/slices/cartSlice';
import { styles } from './CartRedux.styles';
import defaultImage from '../assets/imgXdefault.jpg';

// hace exactamente lo mismo que Cart.jsx pero usando Redux en lugar de useContext para manejar el estado del carrito
const CartRedux = () => {
  const dispatch = useDispatch();
  
  // Obtener items, loading y error del estado global
  // se suscribe a cambios en state.cart.items, cada vez que se modifica el estado del carrito (agregar, eliminar, limpiar), 
  // el componente CartRedux se re renderiza automáticamente con el nuevo estado del carrito
  const cartItems = useSelector((state) => state.cart.items);
  // se suscribe a cambios en state.cart.loading y error, cada vez que se modifica el estado de carga del carrito (al obtener los items desde la API),
  //  el componente CartRedux se re renderiza automáticamente con el nuevo estado de carga, mostrando el mensaje de "Cargando carrito..." mientras se obtienen los items desde la API
  const loading = useSelector((state) => state.cart.loading);
  const error = useSelector((state) => state.cart.error);

  // Al montar el componente, se dispara la acción asincrónica para obtener los items del carrito
  // dispatch(fetchCartItems()) envía la acción fetchCartItems a Redux, que a su vez ejecuta la función asincrónica definida en createAsyncThunk 
  // para obtener los items del carrito desde la API.
  useEffect(() => {
    dispatch(fetchCartItems());
    // dispatch esta en el array de dependencias para evitar warnings de React, aunque en este caso no es necesario porque dispatch no cambia, pero es una buena práctica incluirlo.
  }, [dispatch]);


  //TODO: ssanchez - llamar a la api de cartSlice
  const handleRemoveFromCart = (productId) => {
    // dispara el reducer internto
    dispatch(removeFromCart(productId));
  };

  //TODO: ssanchez - llamar a la api de cartSlice
  const handleClearCart = () => {
    // dispara reducer internto
    dispatch(clearCart());
  };

  const calculateTotal = () => {
    return cartItems.reduce((sum, item) => sum + item.precio, 0);
  };

  // cuando se ejecuta handleRemoveFromCart o handleClearCart, el estado del carrito se actualiza en el store global de Redux.
  // Esto hace que el componente CartRedux se vuelva a renderizar automáticamente con el nuevo estado del carrito, mostrando los cambios en la interfaz de usuario.
  const total = calculateTotal();

  // Mostrar estado de carga
  if (loading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <p>Cargando carrito...</p>
      </div>
    );
  }

  // Mostrar error si existe
  if (error) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <p style={{ color: '#ff4444' }}>Error: {error}</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h1>Carrito de Compras (Redux)</h1>
      {cartItems.length > 0 && (<p>Tienes {cartItems.length} productos en el carrito</p>)}

      {cartItems.length === 0 ? (
        <p>Tu carrito está vacío</p>
      ) : (
        <>
          <div style={styles.itemsContainer}>
            {cartItems.map(item => (
              <div 
                key={item.id} 
                style={styles.itemCard}
              >
                <img 
                  src={item.imagen || defaultImage}
                  alt={item.nombre}
                  style={styles.itemImage}
                />
                <div>
                  <h3 style={styles.itemTitle}>{item.nombre}</h3>
                  <p style={styles.itemPrice}>
                    ${item.precio.toLocaleString('es-AR')}
                  </p>
                </div>
                <button
                  onClick={() => handleRemoveFromCart(item.id)}
                  style={styles.removeButton}
                >
                  Eliminar
                </button>
              </div>
            ))}
          </div>
          <div style={styles.totalContainer}>
            <h3>Total: ${total.toLocaleString('es-AR')}</h3>
            <button
              onClick={handleClearCart}
              style={styles.clearButton}
            >
              Vaciar carrito
            </button>
          </div>
        </>
      )}
      <div style={styles.linksContainer}>
        <Link 
          to="/products"
          style={styles.shoppingLink}
        >
          Seguir comprando
        </Link>
        {cartItems.length > 0 && (
          <Link 
            to="/checkout"
            style={styles.checkoutLink}
          >
            Pagar
          </Link>
        )}
      </div>
    </div>
  );
};

export default CartRedux;
