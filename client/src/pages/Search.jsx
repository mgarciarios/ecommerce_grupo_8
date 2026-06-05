import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import Card from '../components/Card'
import SearchFilters from '../components/SearchFilters'
import { productService } from '../services/productService'
import '../components/css/ProductList.css'
import './css/Search.css'

export default function Search() {
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q') || ''
  const categorias = searchParams.getAll('categorias')

  const [productos, setProductos] = useState([])
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!query) {
      setProductos([])
      return
    }

    setCargando(true)
    setError(null)

    productService.searchProductos(query, categorias)
      .then(setProductos)
      .catch((err) => setError(err.message))
      .finally(() => setCargando(false))
  }, [query, categorias.join(',')])

  if (!query) {
    return (
      <main className="search-page">
        <h1>Búsqueda</h1>
        <p className="search-empty">Ingresá un término para buscar productos.</p>
      </main>
    )
  }

  const plural = productos.length !== 1

  return (
    <main className="search-page">
      <SearchFilters />

      <div className="search-content">
        <div className="search-header">
          <h1>Resultados para <span className="search-query">&ldquo;{query}&rdquo;</span></h1>
          <p className="search-count">{productos.length} resultado{plural ? 's' : ''}</p>
        </div>

        {cargando ? (
          <p>Cargando resultados...</p>
        ) : error ? (
          <p>Error al buscar productos: {error}</p>
        ) : productos.length === 0 ? (
          <p className="search-empty">No se encontraron productos.</p>
        ) : (
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
                <Link
                  to={`/producto/${producto.id}`}
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  <h4>{producto.nombre}</h4>
                </Link>
                <p>{producto.descripcion}</p>
              </Card>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
