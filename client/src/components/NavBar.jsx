import React from 'react';
import { Link } from 'react-router-dom';

const NavBar = () => {
  return (
    <nav>
      <ul style={{ listStyleType: 'none', padding: 0, display: 'flex', justifyContent: 'space-around' }}>
        <li>
          <Link to="/productos">Listado de Productos</Link>
        </li>
        <li>
          <Link to="/login">Login</Link>
        </li>
        <li>
          <Link to="/register">Registro</Link>
        </li>
        <li>
          <Link to="/profile">Perfil</Link>
        </li>
        <li>
          <Link to="/AdminPanel">Admin Panel</Link>
        </li>
      </ul>
    </nav>
  );
};

export default NavBar;
