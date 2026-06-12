import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../store/slices/userSlice'
import { setFavorites } from '../store/slices/favoriteSlice'
// IMPORTANTE: Asegurate de exportar setCartItems en tu cartSlice.js
import { setCartItems } from '../store/slices/cartSlice'
import './css/NavBar.css'
import { isAdminUser } from '../utils/auth'

const NavBar = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [searchTerm, setSearchTerm] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  
  // Obtener estado de autenticación y usuario de Redux
  const { isAuthenticated, user } = useSelector(state => state.user)
  const canAccessAdmin = isAuthenticated && user && isAdminUser()

  // Cargar favoritos y carrito desde la base de datos al arrancar
  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");
      const localUser = JSON.parse(localStorage.getItem("user") || localStorage.getItem("usuario") || "{}");
      const activeUser = user && Object.keys(user).length > 0 ? user : localUser;
      const userId = activeUser?.id || activeUser?.usuario?.id || activeUser?.user?.id;
      const carritoId = activeUser?.idCarrito || activeUser?.user?.idCarrito || activeUser?.usuario?.idCarrito || activeUser?.carrito?.id || activeUser?.user?.carrito?.id;

      if (token) {
        // 1. Traer Favoritos
        if (userId) {
          try {
            const resFav = await fetch(`http://localhost:8080/api/usuarios/${userId}/favoritos`, {
              headers: { "Authorization": `Bearer ${token}` }
            });
            if (resFav.ok) {
              const dataFav = await resFav.json();
              dispatch(setFavorites(dataFav));
            }
          } catch (error) {
            console.error("Error al traer favoritos:", error);
          }
        }

        // 2. Traer Carrito
        if (carritoId) {
          try {
            const resCart = await fetch(`http://localhost:8080/api/carrito/${carritoId}`, {
              headers: { "Authorization": `Bearer ${token}` }
            });
            if (resCart.ok) {
              const dataCart = await resCart.json();
              
              const productos = dataCart.productos || (Array.isArray(dataCart) ? dataCart : []);
              const formattedCart = await Promise.all(productos.map(async (p) => {
                const prodId = p.productoId || p.id || p.producto?.id;
                let detalles = {};

                // Vamos a buscar los detalles completos a la API de productos para no perder la foto ni el nombre
                if (prodId) {
                  try {
                    const resProd = await fetch(`http://localhost:8080/api/productos/${prodId}`);
                    if (resProd.ok) detalles = await resProd.json();
                  } catch (e) {
                    console.error("Error al obtener producto del carrito:", e);
                  }
                }

                return {
                  id: prodId,
                  nombre: detalles.nombre || p.nombreProducto || p.nombre || p.producto?.nombre,
                  precio: detalles.precio || p.precioUnitario || p.precio || p.producto?.precio,
                  cantidad: p.cantidad,
                  foto: detalles.foto || detalles.imgLink || p.foto || p.producto?.foto || null,
                  stock: detalles.stock ?? p.stock ?? p.producto?.stock ?? 99,
                }
              }));
              dispatch(setCartItems(formattedCart)); // Guarda el carrito de la BD en Redux
            }
          } catch (error) {
            console.error("Error al traer carrito:", error);
          }
        }
      }
    };
    fetchUserData();
  }, [isAuthenticated, user, dispatch]);

  const linkClass = (path) =>
    `navbar-link ${location.pathname === path ? 'navbar-link-active' : ''}`

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`)
    }
  }

  const handleLogout = () => {
    dispatch(logout())
    closeMenu()
    navigate('/productos')
  }

  const closeMenu = () => setMenuOpen(false)

  return (
    <nav className="navbar">
      <Link to="/productos" className="navbar-brand">
        <span className="navbar-brand-icon">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
          </svg>
        </span>
        Tienda
      </Link>

      <button
        type="button"
        className="navbar-hamburger"
        onClick={() => setMenuOpen((prev) => !prev)}
        aria-label="Abrir menú"
        aria-expanded={menuOpen}
      >
        <span />
        <span />
        <span />
      </button>

      <ul className={`navbar-links ${menuOpen ? 'is-open' : ''}`}>
        <li>
          <input
            type="text"
            className="navbar-search"
            placeholder="Buscar productos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </li>
        <li>
          <Link to="/productos" className={linkClass('/productos')} onClick={closeMenu}>Productos</Link>
        </li>
        {!isAuthenticated && (
          <li>
            <Link to="/login" className={linkClass('/login')} onClick={closeMenu}>Ingresar</Link>

            <Link to="/register" className={linkClass('/register')} onClick={closeMenu}>Registro</Link>
          </li>
      
        )}
        {isAuthenticated &&  (
          <li>
            <Link to="/profile" className={linkClass('/profile')} onClick={closeMenu}>Perfil</Link>
            <Link to="/favorites" className={linkClass('/favorites')} onClick={closeMenu}>Favoritos</Link>
            <Link to="/purchases" className={linkClass('/purchases')} onClick={closeMenu}>Mis Compras</Link>
          </li>
        )}

        {isAuthenticated && isAdminUser() && (
          <li>
            <Link to="/AdminPanel" className={`navbar-link navbar-link-admin ${location.pathname === '/AdminPanel' ? 'navbar-link-active' : ''}`} onClick={closeMenu}>Admin</Link>
          </li>
        )}


        <li>
          <Link to="/cart" className={linkClass('/cart')} aria-label="Carrito" title="Carrito" onClick={closeMenu}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 10.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
          </Link>
        </li>
      </ul>
    </nav>
  )
}

export default NavBar
