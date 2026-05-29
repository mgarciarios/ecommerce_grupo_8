import { Link } from 'react-router-dom';
import { useFavorites } from '../../hooks/useContext/FavoriteProvider';
import './Favorite.css';

export default function Favorite({ categoria }) {
  const { favorites, removeFavorite } = useFavorites();

  const filtered = categoria
    ? favorites.filter((p) => p.categoria === categoria)
    : favorites;

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
      <div className="favorite__grid">
        {filtered.map((product) => (
          <div key={product.id} className="favorite__card">
            <Link to={`/producto/${product.id}`} className="favorite__card-link">
              <img
                src={product.foto || '/placeholder-image.jpg'}
                alt={product.nombre}
                className="favorite__image"
                onError={(e) => {
                  e.currentTarget.src = '/placeholder-image.jpg';
                }}
              />
              <div className="favorite__info">
                <h3 className="favorite__name">{product.nombre}</h3>
                <span className="favorite__price">${product.precio}</span>
              </div>
            </Link>
            <button
              className="favorite__remove"
              onClick={() => removeFavorite(product.id)}
            >
              Quitar
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
