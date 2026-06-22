import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { productService } from '../api/productApi.js'
import './css/SearchFilters.css'

export default function SearchFilters() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [categorias, setCategorias] = useState([])
  const [cargando, setCargando] = useState(true)

  const selected = searchParams.getAll('categorias')

  useEffect(() => {
    productService.getCategorias()
      .then(setCategorias)
      .catch(() => setCategorias([]))
      .finally(() => setCargando(false))
  }, [])

  const toggleCategoria = (nombre) => {
    setSearchParams((prev) => {
      const current = prev.getAll('categorias')

      if (current.includes(nombre)) {
        prev.delete('categorias')
        current.filter((c) => c !== nombre).forEach((c) => prev.append('categorias', c))
      } else {
        prev.append('categorias', nombre)
      }

      return prev
    }, { replace: true })
  }

  return (
    <aside className="search-filters">
      <h3 className="search-filters-title">Filtros</h3>

      <fieldset className="filter-group">
        <legend className="filter-group-label">Categorías</legend>

        {cargando ? (
          <p className="filter-loading">Cargando...</p>
        ) : categorias.length === 0 ? (
          <p className="filter-loading">Sin categorías</p>
        ) : (
          <ul className="filter-list">
            {categorias.map((cat) => (
              <li key={cat.id}>
                <label className="filter-checkbox">
                  <input
                    type="checkbox"
                    checked={selected.includes(cat.nombre)}
                    onChange={() => toggleCategoria(cat.nombre)}
                  />
                  <span>{cat.nombre}</span>
                </label>
              </li>
            ))}
          </ul>
        )}
      </fieldset>
    </aside>
  )
}
