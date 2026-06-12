import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import { useDispatch, useSelector } from 'react-redux';
import { addFavorite, removeFavorite } from '../store/slices/favoriteSlice';
import { addItemToCart } from '../store/slices/cartSlice';
import './css/ProductDetail.css';

export default function ProductoDetalle() {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const { obtenerProductoPorId } = useProducts();
  
  const dispatch = useDispatch();
  const favorites = useSelector((state) => (state.favorite && state.favorite.items) || []);

  const [producto, setProducto] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [cantidad, setCantidad] = useState(1);

  // FUNCIÓN PARA NORMALIZAR LA URL DE LA IMAGEN
  const normalizeImageUrl = (value) => {
    if (!value) return '/icons.svg';
    if (/^https?:\/\//i.test(value) || value.startsWith('data:')) {
      return value;
    }
    return `http://localhost:8080/${value.replace(/^\/+/, '')}`;
  };

  const handleAddToFavorite = () => {
    if (!producto) return;
    dispatch(addFavorite(producto));
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
    dispatch(addItemToCart({
      id: producto.id,
      nombre: producto.nombre,
      precio: producto.precio,
      foto: producto.foto || producto.imgLink || producto.imagen || producto.image || producto.img || null,
      cantidad,
      stock: producto.stock,
    }));
    alert(`¡${producto?.nombre} agregado al carrito!`);

    const token = localStorage.getItem("token");
    const localUser = JSON.parse(localStorage.getItem("user") || localStorage.getItem("usuario") || "{}");
    const userId = localUser?.id || localUser?.usuario?.id || localUser?.user?.id;
    
    // Ampliamos la búsqueda por si el ID del carrito viene anidado
    const carritoId = localUser?.idCarrito || localUser?.user?.idCarrito || localUser?.usuario?.idCarrito || localUser?.carrito?.id || localUser?.user?.carrito?.id;

    if (token && carritoId) {
      fetch(`http://localhost:8080/api/carrito/${carritoId}/productos`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ productoId: producto.id, cantidad: cantidad })
      }).catch(err => console.error("Error BD al agregar al carrito:", err));
    } else if (token && !carritoId) {
      console.error("No se encontró el ID del carrito para este usuario");
    }
  };

 const handleFavoriteClick = () => {
  if (!producto) return;
  const esFav = favorites.some((f) => f.id === producto.id);
  
  const token = localStorage.getItem("token");
  const localUser = JSON.parse(localStorage.getItem("user") || localStorage.getItem("usuario") || "{}");
  const userId = localUser?.id || localUser?.usuario?.id || localUser?.user?.id;

  if (!token || !userId) {
    alert("Inicia sesion para marcar productos como favoritos");
    return;
  }

  if (esFav) {
    dispatch(removeFavorite(producto.id));
    if (token && userId) {
      fetch(`http://localhost:8080/api/usuarios/${userId}/favoritos/${producto.id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      }).catch(err => console.error("Error BD:", err));
    }
  } else {
    dispatch(addFavorite(producto));
    if (token && userId) {
      fetch(`http://localhost:8080/api/usuarios/${userId}/favoritos/${producto.id}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      }).catch(err => console.error("Error BD:", err));
    }
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
            src={normalizeImageUrl(producto.foto || producto.imgLink || producto.imagen || producto.image || producto.img)} 
            alt={producto.nombre}
            onError={(e) => {
              e.target.onerror = null; // Corta el bucle de renderizado infinito de raíz
              e.target.src = '/icons.svg';
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
                    background: favorites.some((f) => f.id === producto.id) ? '#ffebee' : 'transparent',
                    color: favorites.some((f) => f.id === producto.id) ? '#c62828' : '#000000',
                    border: favorites.some((f) => f.id === producto.id) ? '2px solid #ef5350' : '2px solid #333333',
                  }}
                  onMouseEnter={(e) => {
                    if (!favorites.some((f) => f.id === producto.id)) e.currentTarget.style.background = 'rgba(0, 0, 0, 0.05)';
                  }}
                  onMouseLeave={(e) => {
                    if (!favorites.some((f) => f.id === producto.id)) e.currentTarget.style.background = 'transparent';
                  }}
                >
                    {favorites.some((f) => f.id === producto.id) ? '❤️ Quitar de favoritos' : '🖤 Añadir a favoritos'}
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