import { useState, useEffect } from 'react';
import './index.css';
import Card from './ejemplos/Card.jsx';

export default function ListadoProductos() {
  // Estado para almacenar los productos
  const [productos, setProductos] = useState([]);
  
  // Estado para manejar la carga
  const [loading, setLoading] = useState(true);
  
  // Estado para manejar errores
  const [error, setError] = useState(null);

  // useEffect para obtener los datos cuando el componente se monta
  useEffect(() => {
    const fetchProductos = async () => {
      try {
        setLoading(true);
        
        // Reemplaza esta URL con la de tu backend
        const response = await fetch('http://localhost:8080/api/productos');
        
        // Verificar si la respuesta es exitosa
        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status}`);
        }
        
        // Parsear la respuesta JSON
        const data = await response.json();
        
        // Actualizar el estado con los productos
        setProductos(data);
        setError(null);
        
      } catch (err) {
        console.error('Error al obtener productos:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProductos();
  }, []); // El array vacío significa que solo se ejecuta una vez al montar

  // Mostrar mensaje de carga
  if (loading) {
    return (
      <main>
        <h1>Listado de Productos</h1>
        <div className="loading">
          Cargando productos...
        </div>
      </main>
    );
  }

  // Mostrar mensaje de error
  if (error) {
    return (
      <main>
        <h1>Listado de Productos</h1>
        <div className="error">
          Error: {error}
        </div>
      </main>
    );
  }

  return (
    <main>
      <h1>Listado de Productos</h1>
      <div className="product-list">
        {productos.map((producto) => (
          <Card
            key={producto.id}
            userName={producto.nombre}
            imgLink={producto.foto}
            formatUserName={(name) => name.toUpperCase()}
          >
            <h4>{producto.nombre}</h4>
            <p>{producto.descripcion}</p>
            <p style={{ fontSize: '20px', fontWeight: 'bold', color: '#00a650' }}>
              ${producto.precio}
            </p>
          </Card>
        ))}
        
        {/* Mensaje si no hay productos */}
        {productos.length === 0 && (
          <p>No hay productos disponibles</p>
        )}
      </div>
    </main>
  );
}