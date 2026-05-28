import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useProducts } from '../../hooks/useProducts';
import './ProductDetail.css';

export default function ProductoDetalle() {
  const { id } = useParams(); // Obtiene el ID de la URL
  const navigate = useNavigate();
  const { obtenerProductoPorId } = useProducts();
  
  const [producto, setProducto] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [cantidad, setCantidad] = useState(1);

  useEffect(() => {
    const fetchProducto = async () => {
      try {
        setCargando(true);
        const response = await fetch(`http://localhost:8080/api/productos/${id}`);
        const data = await response.json();
        if (data) {
          setProducto(data);
        } else {
          setError('Producto no encontrado');
        }
      } catch (err) {
        setError('Error al cargar el producto');
        console.error(err);
      } finally {
        setCargando(false);
      }
    };

    if (id) {
      fetchProducto();
    }
  }, [id, obtenerProductoPorId]);

  const handleCantidadChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0 && value <= (producto?.stock || 99)) {
      setCantidad(value);
    }
  };

  const incrementarCantidad = () => {
    if (cantidad < (producto?.stock || 99)) {
      setCantidad(cantidad + 1);
    }
  };

  const decrementarCantidad = () => {
    if (cantidad > 1) {
      setCantidad(cantidad - 1);
    }
  };

  const agregarAlCarrito = () => {
    // Aquí implementas la lógica para agregar al carrito
    console.log(`Agregando ${cantidad} x ${producto?.nombre} al carrito`);
    alert(`¡${producto?.nombre} agregado al carrito!`);
  };

  if (cargando) {
    return (
      <div className="detalle-container">
        <div className="detalle-loading">
          <div className="spinner"></div>
          <p>Cargando producto...</p>
        </div>
      </div>
    );
  }

  if (error || !producto) {
    return (
      <div className="detalle-container">
        <div className="detalle-error">
          <h2>Error</h2>
          <p>{error || 'Producto no encontrado'}</p>
          <Link to="/productos" className="btn-volver">
            Volver a productos
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="detalle-container">
      <div className="detalle-breadcrumb">
        <Link to="/productos">Productos</Link>
        <span> / </span>
        <span>{producto.nombre}</span>
      </div>

      <div className="detalle-card">
        <div className="detalle-imagen">
          <img 
            src={producto.imgLink || '/placeholder-image.jpg'} 
            alt={producto.nombre}
            onError={(e) => {
              e.target.src = '/placeholder-image.jpg';
            }}
          />
        </div>

        <div className="detalle-info">
          <h1>{producto.nombre}</h1>
          
          <div className="detalle-precio">
            <span className="precio-actual">${producto.precio}</span>
            {producto.precioAnterior && (
              <span className="precio-anterior">${producto.precioAnterior}</span>
            )}
          </div>

          <div className="detalle-stock">
            <span className={`stock-badge ${producto.stock > 0 ? 'in-stock' : 'out-stock'}`}>
              {producto.stock > 0 ? `En stock (${producto.stock} disponibles)` : 'Agotado'}
            </span>
          </div>

          <div className="detalle-descripcion">
            <h3>Descripción</h3>
            <p>{producto.descripcion}</p>
          </div>

          {producto.categoria && (
            <div className="detalle-categoria">
              <span className="categoria-badge">{producto.categoria}</span>
            </div>
          )}

          {producto.stock > 0 && (
            <>
              <div className="detalle-cantidad">
                <label>Cantidad:</label>
                <div className="cantidad-control">
                  <button onClick={decrementarCantidad} disabled={cantidad <= 1}>
                    -
                  </button>
                  <input
                    type="number"
                    value={cantidad}
                    onChange={handleCantidadChange}
                    min="1"
                    max={producto.stock}
                  />
                  <button onClick={incrementarCantidad} disabled={cantidad >= producto.stock}>
                    +
                  </button>
                </div>
              </div>

              <div className="detalle-acciones">
                <button onClick={agregarAlCarrito} className="btn-comprar">
                  Agregar al carrito
                </button>
                <button onClick={() => navigate('/productos')} className="btn-seguir">
                  Seguir comprando
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}