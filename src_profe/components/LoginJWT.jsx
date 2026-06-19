import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../store/slices/authSlice';

const LoginJWT = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Obtener el estado de autenticación desde Redux
  const { isAuthenticated, isLoading, error } = useSelector(state => state.auth);
  
  //credentials es un estado local que guarda el email y password que el usuario ingresa en el formulario
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });

  // handleChange actualiza el estado local de credentials cada vez que el usuario escribe en los campos de email o password
  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
  };

  // handleSubmit se ejecuta al enviar el formulario, dispara la acción de loginUser con las credenciales
  const handleSubmit = (e) => {
    //e.preventDefault() evita que el formulario se envíe de forma tradicional, lo que recargaría la página. En su lugar, manejamos el envío con JavaScript.
    e.preventDefault();
    // Disparar la acción de login con Redux
    dispatch(loginUser(credentials));
  };

  // Redirigir cuando el login sea exitoso
  useEffect(() => {
    if (isAuthenticated) {
      // se limpian los campos porque el usuario ya está autenticado, no es necesario mantener esa info en el estado local
      setCredentials({ email: '', password: '' });
      // Redirigir al home
      navigate('/home');
    }
  }, [isAuthenticated]);

  return (
    <div style={{ 
      padding: '2rem',
      maxWidth: '400px',
      margin: '0 auto',
      marginTop: '2rem'
    }}>
      <h1 style={{ marginBottom: '1.5rem' }}>Iniciar Sesión</h1>
      {error && (
        <div style={{
          padding: '0.75rem',
          marginBottom: '1rem',
          backgroundColor: '#fee2e2',
          color: '#dc2626',
          borderRadius: '4px'
        }}>
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div>
          <label 
            htmlFor="email" 
            style={{ 
              display: 'block', 
              marginBottom: '0.5rem',
              fontWeight: '500'
            }}
          >
            Correo electrónico
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={credentials.email}
            onChange={handleChange}
            required
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '0.5rem',
              borderRadius: '4px',
              border: '1px solid #ccc'
            }}
          />
        </div>
        
        <div>
          <label 
            htmlFor="password"
            style={{ 
              display: 'block', 
              marginBottom: '0.5rem',
              fontWeight: '500'
            }}
          >
            Contraseña
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={credentials.password}
            onChange={handleChange}
            required
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '0.5rem',
              borderRadius: '4px',
              border: '1px solid #ccc'
            }}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          style={{
            backgroundColor: '#2D3277',
            color: 'white',
            padding: '0.75rem 1rem',
            border: 'none',
            borderRadius: '4px',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            fontSize: '1rem',
            marginTop: '1rem',
            opacity: isLoading ? 0.7 : 1
          }}
        >
          {isLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}
        </button>
      </form>
    </div>
  );
};

export default LoginJWT;