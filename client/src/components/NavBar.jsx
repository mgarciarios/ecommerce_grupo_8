// NUEVO: Importar useRef
import { useState, useEffect, useRef } from 'react' 
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../store/slices/userSlice'
import { setFavorites } from '../store/slices/favoriteSlice'
import { setCartItems } from '../store/slices/cartSlice'
import ThemeToggle from './ThemeToggle'
import { authApi } from '../api/authApi'
import './css/NavBar.css'
import { isAdminUser } from '../utils/auth'

const NavBar = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [searchTerm, setSearchTerm] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  
  // NUEVO: Creamos una referencia para el contenedor del NavBar
  const navRef = useRef(null) 
  
  const { isAuthenticated, user } = useSelector(state => state.user)

  // NUEVO: useEffect exclusivo para manejar los clics fuera del menú
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Si el menú está abierto y el clic no ocurrió dentro de 'navRef' (el NavBar), lo cerramos
      if (navRef.current && !navRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    // Solo agregamos el eventListener si el menú está abierto por cuestiones de rendimiento
    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    // Limpiamos el evento cuando el componente se desmonta o el estado cambia
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuOpen]);

  // ... (aquí sigue tu useEffect fetchUserData tal como lo dejamos antes) ...

  const linkClass = (path) =>
    `navbar-link ${location.pathname === path ? 'navbar-link-active' : ''}`

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`)
    }
  }

  const handleLogout = async () => {
    try {
      // 1. Llama al backend para que invalide la cookie HttpOnly
      await authApi.logout();
    } catch (error) {
      console.error("Error al cerrar sesión en el backend:", error);
    } finally {
      // 2. Limpia el estado del frontend y redirige, sin importar si el backend falló.
      closeMenu();
      dispatch(logout());
      navigate('/productos');
    }
  }

  const closeMenu = () => setMenuOpen(false)

  return (
// NUEVO: Le asignamos la referencia (ref) al contenedor principal
    <nav className="navbar" ref={navRef}> 
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

        <li className="navbar-theme-item" style={{ display: 'flex', alignItems: 'center', marginLeft: '10px' }}>
          <ThemeToggle />
        </li>
      </ul>
    </nav>
  )
}

export default NavBar