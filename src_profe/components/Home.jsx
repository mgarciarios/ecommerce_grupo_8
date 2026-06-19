import React from 'react';  
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div>
      <h1>Bienvenidos a la página de inicio</h1>
      <p>Esta es una página de ejemplo para mostrar el routing</p>

      {/* no es react */}
      <a href="/products">productos</a>

      {/* link en react*/}
      <br />
      <Link to="/products">Ir a la lista de productos</Link>
      {/* <Link to="/cart">Ir al carrito</Link> */}
      <br />
      <Link to="/counter">Ir al contador</Link>
      <br />
      <Link to="/debug-auth">Debug Auth</Link>
    </div>
  );
};

export default Home;