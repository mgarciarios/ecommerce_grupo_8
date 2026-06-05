// Importamos React.
import React from 'react';
// Importamos nuestro custom hook 'useCart' para acceder al contexto del carrito.
import { useCart } from './CartProvider.jsx';

// --- COMPONENTE CONSUMIDOR: EL ÍCONO/RESUMEN DEL CARRITO ---
// Este componente es responsable únicamente de mostrar el resumen del carrito.
function CartSummary() {
  // Usamos el hook 'useCart' para obtener el estado `cartItems` del contexto.
  const { cartItems } = useCart();

  // Renderizamos un resumen del carrito.
  return (
    <div style={{ position: 'fixed', top: '10px', right: '10px', border: '2px solid black', padding: '10px', background: 'lightblue' }}>
      <h3>🛒 Carrito</h3>
      {/* Mostramos la cantidad de items en el carrito. */}
      <p>Items: {cartItems.length}</p>
      <ul>
        {/* Mostramos los nombres de los primeros 5 items en el carrito */}
        {cartItems.slice(0, 5).map((item, index) => (
          <li key={index}>{item.nombre}</li>
        ))}
        {cartItems.length > 5 && <li>...y más</li>}
      </ul>
    </div>
  );
}

// Exportamos el componente para que pueda ser usado en otras partes de la aplicación.
export default CartSummary;