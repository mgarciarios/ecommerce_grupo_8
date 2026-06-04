import { Link } from 'react-router-dom';
import { useFavorites } from '../hooks/useContext/FavoriteProvider';
import './css/Favorite.css';

export default function Favorite({ categoria }) {
  const { favorites, removeFavorite } = useFavorites();

  // Nos aseguramos de que 'favorites' sea un array válido antes de filtrar
  const validFavorites = Array.isArray(favorites) ? favorites : [];

  const filtered = categoria
    ? validFavorites.filter((p) => p.categoria === categoria)
    : validFavorites;

  if (filtered.length === 0) {
    return (
      <div className="favorite">
        <h2 className="favorite__title">
          {categoria ? `Favoritos - ${categoria}` : 'Mis Favoritos'}
        </h2>
        <div className="favorite__empty">
          <p>
            {categoria
              ? `No tenés productos favoritos en "${categoria}".`
              : 'No tenés productos favoritos todavía.'}
          </p>
          <Link to="/productos" className="favorite__link">Explorar productos</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="favorite">
      <h2 className="favorite__title">
        {categoria ? `Favoritos - ${categoria}` : 'Mis Favoritos'} ({filtered.length})
      </h2>
      <div 
        className="favorite__grid"
      >
        {filtered.map((product) => {
          // Buscamos alternativas por si las propiedades se llaman distinto
          const nombreProducto = product.nombre || product.children || 'Producto sin nombre';
          const fotoProducto = product.foto || product.imgLink || '/icons.svg';
          const precioProducto = product.precio !== undefined ? product.precio : '0';

          return (
            <div key={product.id} className="favorite__card">
              <Link to={`/producto/${product.id}`} className="favorite__card-link">
                <img
                  src={fotoProducto}
                  alt={nombreProducto}
                  className="favorite__image"
                  onError={(e) => {
                    
                    e.currentTarget.onerror = null; //Esto detiene en seco el bucle infinito si una imagen da error de carga.
                    e.currentTarget.src = '/icons.svg';
                  }}
                />
                <div className="favorite__info">
                  <h3 className="favorite__name">{nombreProducto}</h3>
                  <span className="favorite__price">${precioProducto}</span>
                </div>
              </Link>
              <button
                type="button"
                className="favorite__remove"
                onClick={(e) => {
                  e.preventDefault(); // Evita que el click interactúe con el Link de la tarjeta
                  removeFavorite(product.id);
                }}
              >
                Quitar
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}