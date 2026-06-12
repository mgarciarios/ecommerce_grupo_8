import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import defaultImage from '../assets/imgXdefault.jpg';
import Card from '../ejemplos/Card';
import { addFavorite, removeFavorite } from '../store/slices/favoriteSlice';
import { useDispatch } from 'react-redux';



const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [category, setCategory] = useState(null); // Estado para la categoría seleccionada
  const dispatch = useDispatch();
 

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        //  const response = await fetch(`http://localhost:8080/api/productos`, {
        const response = await fetch(`http://localhost:8080/api/productos${category ? `?categoria=${category}` : ''}`, {
          // http://localhost:8080/api/productos?categoria=Electrónica
          // Especificamos el método HTTP a utilizar
          method: 'GET',
          
          headers: {
            // Indica al servidor que esperamos recibir JSON como respuesta
            'Accept': 'application/json',
            
            // Indica al servidor que estamos enviando datos en formato JSON
            'Content-Type': 'application/json',
            
            // Envía el token JWT si existe en localStorage (necesario para rutas protegidas)
            'Authorization': localStorage.getItem('token')
          },
          
          // Permite el envío de cookies y credenciales de autenticación
          // Esto es necesario porque en el backend tienes configuration.setAllowCredentials(true)
          credentials: 'include',
          
          // Especifica que esta es una petición CORS (Cross-Origin Resource Sharing)
          // Útil cuando el frontend y backend están en diferentes puertos/dominios
          mode: 'cors'
        });

        if (!response.ok) {
          throw new Error('Error al cargar los productos');
        }
        const data = await response.json();
        setProducts(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category]); // El efecto se vuelve a ejecutar cada vez que 'category' cambie


  const handleAddFavorite = (product) => {
    // Aquí se ejecuta el dispatch de Redux para agregar un producto a favoritos, en lugar de usar la función addFavorite del contexto
    dispatch(addFavorite(product));
  }

  const handleRemoveFavorite = (productId) => {
    // Aquí se ejecuta el dispatch de Redux para eliminar un producto de favoritos, en lugar de usar la función removeFavorite del contexto
    dispatch(removeFavorite(productId));
  }


  // --- Manejo de estados de carga y error ---
  // Si 'loading' es true, se muestra un mensaje de carga.
  // Esto previene que el usuario vea una pantalla vacía o con datos incompletos
  // mientras se esperan los datos de la API.
  // if (loading) return <div>Cargando productos...</div>;
  //TODO: ssanchez - utilizar operador ternario 
  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <div style={{
        border: '4px solid #f3f3f3',
        borderTop: '4px solid #2D3277',
        borderRadius: '50%',
        width: '50px',
        height: '50px',
        animation: 'spin 1s linear infinite'
      }} />
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );

  // Si 'error' tiene un valor (no es null), significa que la petición falló.
  // Se muestra un mensaje de error al usuario en lugar del componente principal.
  // Esto asegura que la aplicación no se rompa y el usuario esté informado del problema.
  //TODO: ssanchez - utilizar operador ternario 
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Lista de Productos</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem', padding: '1rem' }}>
        {/* produts.map(product => ("muestra el producto con html") */}
        {products.map(product => (
          <>
          <button onClick={() => handleAddFavorite(product)}>Agregar a favoritos</button>
          <button onClick={() => handleRemoveFavorite(product.id)}>Eliminar de favoritos</button>

          <Link
            to={`/products-redux/${product.id}`}
            key={product.id}
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
              <div style={{
                border: '1px solid #blue',
                backgroundColor: 'lightgray',
                borderRadius: '8px',
                padding: '1rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
                transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                ':hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                }
              }}>
                <img
                  // operador lógico ||
                  src={product.imagen || defaultImage}
                  alt={product.nombre}
                  style={{
                    width: '100%',
                    height: '200px',
                    objectFit: 'cover',
                    borderRadius: '4px'
                  }} />
                <h3 style={{ margin: '0.5rem 0' }}>{product.nombre}</h3>
                <p style={{ color: '#2D3277', fontSize: '1.25rem', fontWeight: 'bold', margin: '0' }}>
                  ${product.precio.toLocaleString('es-AR')}
                </p>
                <p style={{ color: '#666', margin: '0' }}>{product.descripcion}</p>
              </div>
            </Link></>
        ))}
      </div>
      
    </div>
  );
};

export default ProductList;