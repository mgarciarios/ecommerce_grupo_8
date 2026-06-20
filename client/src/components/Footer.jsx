import './Footer.css';

function Footer({ mode = 'light' }) {
  return (
    <footer className={`app-footer ${mode}`}>
      <div className="footer-content">
        <div>
          <span className="footer-brand">Grupo 08</span>
          <p>El mejor ecommerce de la historia de los ecommerce</p>
        </div>
        <div className="footer-meta">
          <p>© {new Date().getFullYear()} Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
