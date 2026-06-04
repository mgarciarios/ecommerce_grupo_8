import './ProductList.css'
import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import Card from '../../components/Card/Card.jsx'
import { useProducts } from '../../hooks/useProducts.js';

export default function ListadoProductos() {
  const { productos, cargando, error, cargarProductos } = useProducts();

  const formatPrice = (value) => {
    if (value === null || value === undefined || value === '') return '—';

    const normalized = typeof value === 'string'
      ? value.replace(/\./g, '').replace(',', '.')
      : String(value);

    const number = Number(normalized);

    if (!Number.isFinite(number)) {
      return String(value);
    }

    return number.toLocaleString('es-AR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

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
          id={producto.id}
          userName={producto.nombre}
          imgLink={producto.imgLink || producto.image || producto.imagen || producto.img || producto.foto}
          producto={producto}
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
          
          {/* ❌ ACÁ BORRASTE LAS LÍNEAS DEL PRECIO VIEJO */}

        </Card>
      ))}
    </div>
  </main>
)
}