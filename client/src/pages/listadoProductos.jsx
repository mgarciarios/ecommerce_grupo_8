import '../css/listadoProductos.css'
import { useEffect } from 'react'
import Card from '../components/Card.jsx'
import testObj from '../test_obj.json'
import { useProducts } from '../hooks/useProducts.js';

export default function ListadoProductos() {
  const { productos, cargando, error, cargarProductos } = useProducts();

  useEffect(() => {
      cargarProductos();
    }, [cargarProductos]);

  if (cargando) {
    return (
      <main>
        <h1>Listado de Productos</h1>
        <p>Cargando productos...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="product-list-page">
        <h1>Listado de Productos</h1>
        <p>Error al cargar productos: {error}</p>
      </main>
    );
  }

  return (
    <main className="product-list-page">
      <h1>Listado de Productos</h1>
      <div className="product-list">
        {productos.map((producto) => (
          <Card
            key={producto.id}
            userName={producto.nombre}
            imgLink={producto.imgLink}
            formatUserName={(name) => name.toUpperCase()}
          >
            <h4>{producto.nombre}</h4>
            <p>{producto.descripcion}</p>
            <p style={{ fontSize: '20px', fontWeight: 'bold', color: '#00a650' }}>
              ${producto.precio}
            </p>
          </Card>
        ))}
      </div>
    </main>
  )
}