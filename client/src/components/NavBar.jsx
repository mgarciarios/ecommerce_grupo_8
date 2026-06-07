import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import './css/NavBar.css'
import { isAdminUser, isAuthenticated } from '../utils/auth'

const NavBar = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const canAccessAdmin = isAuthenticated() && isAdminUser()

  const linkClass = (path) =>
    `navbar-link ${location.pathname === path ? 'navbar-link-active' : ''}`

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`)
    }
  }

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

      <ul className="navbar-links">
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
          <Link to="/productos" className={linkClass('/productos')}>Productos</Link>
        </li>
        <li>
          <Link to="/login" className={linkClass('/login')}>Ingresar</Link>
        </li>
        <li>
          <Link to="/register" className={linkClass('/register')}>Registro</Link>
        </li>
        <li>
          <Link to="/profile" className={linkClass('/profile')}>Perfil</Link>
        </li>
        {canAccessAdmin && (
          <li>
            <Link to="/AdminPanel" className={`navbar-link navbar-link-admin ${location.pathname === '/AdminPanel' ? 'navbar-link-active' : ''}`}>Admin</Link>
          </li>
        )}
        <li>
          <Link to="/favorites" className={linkClass('/favorites')}>Favoritos</Link>
        </li>
        <li>
          <Link to="/cart" className={linkClass('/cart')} aria-label="Carrito" title="Carrito">
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
