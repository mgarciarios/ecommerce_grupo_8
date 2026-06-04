import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../hooks/useContext/CartContext';
import defaultImage from '../assets/imgXdefault.jpg';
const Cart = () => {
  const { cartItems } = useCart();

  

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>Carrito de Compras</h1>
      {/* Renderizado condicional con operador lógico AND (&&) */}
      {/* Si la condición (cartItems.length > 0) es verdadera, se renderiza el elemento <p>. */}
      {/* Si es falsa, no se renderiza nada. */}
      {/* true && true -> true */}
      {/* false && true -> false */}
      {cartItems.length > 0 && (
        <p>Tienes {cartItems.length} productos en el carrito</p>
      )}

      {/* Renderizado condicional con operador ternario */}
      {/* Si el carrito está vacío (cartItems.length === 0), muestra un mensaje. */}
      {/* De lo contrario (? significa 'entonces'), muestra la lista de productos (: significa 'si no'). */}
      {/* func ? true : false */}
      {cartItems.length === 0 ? (
        <p>Tu carrito está vacío</p>
      ) : (
        <>
          <div style={{ marginBottom: '2rem' }}>
            {cartItems.map(item => (
              <div 
                key={item.id} 
                style={{
                  display: 'grid',
                  gridTemplateColumns: '100px 1fr auto',
                  gap: '1rem',
                  alignItems: 'center',
                  padding: '1rem',
                  borderBottom: '1px solid #eee'
                }}
              >
                <img 
                  src={item.imagen || defaultImage}
                  alt={item.nombre}
                  style={{
                    width: '100px',
                    height: '100px',
                    objectFit: 'cover',
                    borderRadius: '4px'
                  }}
                />
                <div>
                  <h3 style={{ margin: '0 0 0.5rem 0' }}>{item.nombre}</h3>
                  <p style={{ margin: '0', color: '#666' }}>
                    Cantidad: {item.quantity}
                  </p>
                  <p style={{ margin: '0.5rem 0', color: '#2D3277', fontWeight: 'bold' }}>
                    ${(item.precio * item.quantity).toLocaleString('es-AR')}
                  </p>
                </div>
                <button
                  onClick={() => removeFromCart(item.id)}
                  style={{
                    padding: '0.5rem',
                    background: 'none',
                    border: '1px solid #ff4444',
                    color: '#ff4444',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Eliminar
                </button>
              </div>
            ))}
          </div>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            padding: '1rem',
            backgroundColor: '#f9f9f9',
            borderRadius: '4px',
            marginBottom: '1rem'
          }}>
          </div>
        </>
      )}
      <div style={{ display: 'flex', gap: '1rem' }}>
        <Link 
          to="/products"
          style={{
            backgroundColor: '#2D3277',
            color: 'white',
            padding: '0.5rem 1rem',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            textDecoration: 'none'
          }}
        >
          Seguir comprando
        </Link>
        {cartItems.length > 0 && (
          <Link 
            to="/checkout"
            style={{
              backgroundColor: '#4CAF50',
              color: 'white',
              padding: '0.5rem 1rem',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              textDecoration: 'none'
            }}
          >
            Pagar
          </Link>
        )}
      </div>
    </div>
  );
};

export default Cart;