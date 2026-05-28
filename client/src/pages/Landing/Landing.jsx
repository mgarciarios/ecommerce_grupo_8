import ProductList from '../ProductList/ProductList'
import './Landing.css'

export default function Landing() {
  const scrollToProducts = () => {
    document.getElementById('productos')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="landing">
      <section className="hero">
        <div className="hero-content">
          <span className="hero-badge">Nueva colección</span>
          <h1 className="hero-title">Descubrí lo mejor para vos</h1>
          <p className="hero-subtitle">
            Productos seleccionados con la mejor calidad y al mejor precio.
            Envíos gratis en compras superiores a $10.000.
          </p>
          <div className="hero-actions">
            <button className="hero-btn hero-btn-primary" onClick={scrollToProducts}>
              Ver productos
            </button>
            <button className="hero-btn hero-btn-secondary" onClick={scrollToProducts}>
              Ofertas del día
            </button>
          </div>
        </div>
        <div className="hero-visual">
          <div className="hero-shape hero-shape-1" />
          <div className="hero-shape hero-shape-2" />
          <div className="hero-shape hero-shape-3" />
        </div>
      </section>

      <section className="features">
        <div className="feature">
          <div className="feature-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>
          <h3>Compra segura</h3>
          <p>Tus datos protegidos siempre</p>
        </div>
        <div className="feature">
          <div className="feature-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="1" y="3" width="15" height="13" />
              <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
              <circle cx="5.5" cy="18.5" r="2.5" />
              <circle cx="18.5" cy="18.5" r="2.5" />
            </svg>
          </div>
          <h3>Envíos rápidos</h3>
          <p>Recibí tu pedido en 48hs</p>
        </div>
        <div className="feature">
          <div className="feature-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
              <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
              <line x1="12" y1="22.08" x2="12" y2="12" />
            </svg>
          </div>
          <h3>Devolución gratis</h3>
          <p>Hasta 30 días para cambios</p>
        </div>
      </section>

      <section id="productos">
        <ProductList />
      </section>
    </div>
  )
}
