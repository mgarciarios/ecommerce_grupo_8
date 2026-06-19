import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';

/**
 * EJEMPLOS: Cómo acceder al token desde Redux
 * 
 * Este archivo muestra los patrones de uso del token de autenticación
 * almacenado en Redux en diferentes componentes de tu aplicación.
 * Solo el token se almacena; para datos del usuario, hacer una petición adicional.
 */

// ============================================
// PATRÓN 1: Acceder al token para una petición
// ============================================
export const ProductListWithAuth = () => {
  const token = useSelector(state => state.auth.token);
  const [products, setProducts] = React.useState([]);

  React.useEffect(() => {
    if (token) {
      // Hacer una petición con el token en el header
      fetch('http://localhost:8080/api/productos', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
        .then(res => res.json())
        .then(data => setProducts(data))
        .catch(err => console.error('Error:', err));
    }
  }, [token]);

  return (
    <div>
      <h2>Productos</h2>
      {products.map(product => (
        <div key={product.id}>{product.nombre}</div>
      ))}
    </div>
  );
};

// ============================================
// PATRÓN 2: Verificar si está autenticado
// ============================================
export const UserStatus = () => {
  const { token, isAuthenticated } = useSelector(state => state.auth);

  if (!isAuthenticated) {
    return <div>Por favor, inicia sesión</div>;
  }

  return (
    <div>
      <h2>Estado de Autenticación</h2>
      <p>Estás autenticado ✓</p>
      <p>Token guardado en Redux</p>
    </div>
  );
};

// ============================================
// PATRÓN 3: Botón para cerrar sesión
// ============================================
export const LogoutButton = () => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector(state => state.auth);

  if (!isAuthenticated) {
    return null;
  }

  const handleLogout = () => {
    dispatch(logout());
    // Opcionalmente redirigir a login
  };

  return (
    <button onClick={handleLogout} style={{ padding: '0.5rem 1rem' }}>
      Cerrar Sesión
    </button>
  );
};

// ============================================
// PATRÓN 4: Verificar si está cargando
// ============================================
export const ProtectedComponent = () => {
  const { isAuthenticated, isLoading } = useSelector(state => state.auth);

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  if (!isAuthenticated) {
    return <div>No tiene acceso</div>;
  }

  return <div>Contenido protegido visible solo para usuarios autenticados</div>;
};

// ============================================
// PATRÓN 5: Usar token en un async thunk (cartSlice, etc)
// ============================================
// En tu cartSlice.js, cuando uses createAsyncThunk:
/*
export const fetchCartItems = createAsyncThunk(
  'cart/fetchCartItems',
  async (_, { getState }) => {
    const { auth } = getState();
    const token = auth.token;

    if (!token) {
      throw new Error('No hay token disponible');
    }

    const response = await fetch('http://localhost:8080/api/carrito', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      mode: 'cors'
    });

    if (!response.ok) {
      throw new Error('Error al obtener el carrito');
    }

    return response.json();
  }
);
*/

// ============================================
// PATRÓN 6: Interceptor con axios (si lo usas)
// ============================================
/*
// En main.jsx o App.jsx, después de que Redux esté configurado:
import axios from 'axios';
import { store } from './store';

// Configurar interceptor
axios.interceptors.request.use((config) => {
  const state = store.getState();
  const token = state.auth.token;
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
}, (error) => {
  return Promise.reject(error);
});
*/
