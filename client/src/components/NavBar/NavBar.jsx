import { Link, useLocation } from 'react-router-dom'
import './NavBar.css'

const NavBar = () => {
  const location = useLocation()

  const linkClass = (path) =>
    `navbar-link ${location.pathname === path ? 'navbar-link-active' : ''}`

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
        <li>
          <Link to="/AdminPanel" className={`navbar-link navbar-link-admin ${location.pathname === '/AdminPanel' ? 'navbar-link-active' : ''}`}>Admin</Link>
        </li>
      </ul>
    </nav>
  )
}

export default NavBar
