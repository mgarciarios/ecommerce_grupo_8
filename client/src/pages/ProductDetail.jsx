import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import { useFavorites } from '../hooks/useContext/FavoriteProvider';
import './css/ProductDetail.css';

export default function ProductoDetalle() {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const { obtenerProductoPorId } = useProducts();
  
  const { addToFavorite, removeFavorite, isFavorite } = useFavorites();

  const [producto, setProducto] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [cantidad, setCantidad] = useState(1);

  // FUNCIÓN PARA NORMALIZAR LA URL DE LA IMAGEN
  const normalizeImageUrl = (value) => {
    if (!value) return 'https://via.placeholder.com/400?text=Sin+Imagen';
    if (/^https?:\/\//i.test(value) || value.startsWith('data:')) {
      return value;
    }
    return `http://localhost:8080/${value.replace(/^\/+/, '')}`;
  };

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
    const carritoActual = JSON.parse(localStorage.getItem('cart') || '[]');
    const itemExistente = carritoActual.find(item => item.id === producto.id);

    if (itemExistente) {
      itemExistente.cantidad += cantidad;
    } else {
      carritoActual.push({
        id: producto.id,
        nombre: producto.nombre,
        precio: producto.precio,
        foto: producto.foto,
        cantidad,
        stock: producto.stock,
      });
    }

    localStorage.setItem('cart', JSON.stringify(carritoActual));
    alert(`¡${producto?.nombre} agregado al carrito!`);
  };

 const handleFavoriteClick = () => {
  if (!producto) return;
  if (isFavorite(producto.id)) {
    removeFavorite(producto.id); // Borra usando el ID
  } else {
    addToFavorite(producto);   // Mandamos el objeto "producto" real que vino del backend
  }
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
          {/* IMAGEN CORREGIDA CON NORMALIZACIÓN Y APAGADO DE ERROR EN BUCLE */}
          <img 
            src={normalizeImageUrl(producto.foto)} 
            alt={producto.nombre}
            onError={(e) => {
              e.target.onerror = null; // Corta el bucle de renderizado infinito de raíz
              e.target.src = 'https://via.placeholder.com/400?text=Imagen+No+Disponible';
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
              {/* SECCIÓN DE CANTIDAD TOTALMENTE REDISEÑADA Y CENTRADA */}
              <div className="detalle-cantidad" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '20px 0' }}>
                <label style={{ marginBottom: '8px', fontWeight: 'bold', color: '#555' }}>Cantidad</label>
                <div className="cantidad-control" style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '15px'
                }}>
                  <button 
                    type="button"
                    onClick={decrementarCantidad} 
                    disabled={cantidad <= 1}
                    style={{
                      width: '35px',
                      height: '35px',
                      borderRadius: '50%',
                      border: '1px solid #8a3ffc',
                      background: '#db0d0d',
                      color: '#ffffff',
                      cursor: 'pointer',
                      fontWeight: 'bold',
                      fontSize: '1.2rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      opacity: cantidad <= 1 ? 0.4 : 1
                    }}
                  >
                    -
                  </button>
                  
                  <span style={{
                    fontSize: '1.3rem',
                    fontWeight: '600',
                    minWidth: '30px',
                    textAlign: 'center',
                    color: '#333'
                  }}>
                    {cantidad}
                  </span>

                  <button 
                    type="button"
                    onClick={incrementarCantidad} 
                    disabled={cantidad >= producto.stock}
                    style={{
                      width: '35px',
                      height: '35px',
                      borderRadius: '50%',
                      border: '1px solid #553ffc',
                      background: '#81fc3f',
                      color: '#fff',
                      cursor: 'pointer',
                      fontWeight: 'bold',
                      fontSize: '1.2rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      opacity: cantidad >= producto.stock ? 0.4 : 1
                    }}
                  >
                    +
                  </button>
                </div>
              </div>
              {/* BOTÓN ÚNICO DE FAVORITOS - TOTALMENTE INTEGRADO Y ESTILIZADO */}
              {/* LE AGREGAMOS ESTOS 3 ESTILOS AL DIV PADRE PARA CENTRAR EL BOTÓN */}
              <div className="detalle-acciones" style={{ 
                marginTop: '15px', 
                display: 'flex', 
                justifyContent: 'center', 
                width: '100%' 
              }}>
                <button
                  type="button"
                  onClick={handleFavoriteClick}
                  style={{
                    width: 'max-content', // Tu configuración actual
                    padding: '12px',
                    borderRadius: '8px',
                    fontSize: '0.6rem', // Tu configuración actual
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    transition: 'all 0.3s ease',
                    background: isFavorite(producto.id) ? '#ffebee' : 'transparent',
                    color: isFavorite(producto.id) ? '#c62828' : '#000000',
                    border: isFavorite(producto.id) ? '2px solid #ef5350' : '2px solid #333333',
                  }}
                  onMouseEnter={(e) => {
                    if (!isFavorite(producto.id)) e.currentTarget.style.background = 'rgba(0, 0, 0, 0.05)';
                  }}
                  onMouseLeave={(e) => {
                    if (!isFavorite(producto.id)) e.currentTarget.style.background = 'transparent';
                  }}
                >
                  {isFavorite(producto.id) ? '❤️ Quitar de favoritos' : '🖤 Añadir a favoritos'}
                </button>
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