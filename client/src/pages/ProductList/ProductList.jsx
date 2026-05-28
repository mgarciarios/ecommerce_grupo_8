import './ProductList.css'
import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import Card from '../../components/Card/Card.jsx'
import { useProducts } from '../../hooks/useProducts.js';

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
      <div className="product-list">
        {productos.map((producto) => (
          <Card
            key={producto.id}
            userName={producto.nombre}
            imgLink={producto.imgLink}
            formatUserName={(name) => name.toUpperCase()}
          >
            {/* Solo el título es un Link - no necesita useNavigate */}
            <Link 
              to={`/producto/${producto.id}`}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <h4>{producto.nombre}</h4>
            </Link>
            <p>{producto.descripcion}</p>
            <p style={{ fontSize: '20px', fontWeight: 'bold', color: '#7c3aed' }}>
              ${producto.precio}
            </p>
          </Card>
        ))}
      </div>
    </main>
  )
}