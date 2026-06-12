import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { removeFavorite, clearFavorites } from '../store/slices/favoriteSlice';
import { styles } from './Favorite.styles';
import defaultImage from '../assets/imgXdefault.jpg';

const Favorite = () => {
  // Obtiene los favoritos del estado global de Redux
  const favorites = useSelector((state) => state.favorites.items);
  const dispatch = useDispatch();

  // Elimina un producto de favoritos
  const handleRemove = (productId) => {
    dispatch(removeFavorite(productId));
  };

  // Limpia todos los favoritos
  const handleClearAll = () => {
    dispatch(clearFavorites());
  };

  // Calcula el total de favoritos
  const totalFavorites = favorites.length;

  return (
    <div style={styles.container}>
      <h1>❤️ Mis Favoritos</h1>

      {totalFavorites > 0 && (
        <p>Tienes {totalFavorites} producto{totalFavorites !== 1 ? 's' : ''} en favoritos</p>
      )}

      {totalFavorites === 0 ? (
        <div style={styles.emptyMessage}>
          <p>No tienes productos en favoritos</p>
          <Link to="/products" style={styles.linkButton}>
            Ver Productos
          </Link>
        </div>
      ) : (
        <>
          <div style={styles.gridContainer}>
            {favorites.map(product => (
              <Link
                to={`/products-redux/${product.id}`}
                key={product.id}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <div style={styles.card}>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleRemove(product.id);
                    }}
                    style={styles.removeButton}
                    title="Eliminar de favoritos"
                  >
                    Eliminar
                  </button>
                  <img
                    src={product.imagen || defaultImage}
                    alt={product.nombre}
                    style={styles.cardImage}
                  />
                  <h3 style={styles.cardTitle}>{product.nombre}</h3>
                  <p style={styles.cardPrice}>
                    ${product.precio?.toLocaleString('es-AR') || '0'}
                  </p>
                  <p style={styles.cardDescription}>
                    {product.descripcion?.substring(0, 100)}...
                  </p>
                </div>
              </Link>
            ))}
          </div>

          <div style={styles.buttonsContainer}>
            <Link to="/products" style={styles.linkButton}>
              Seguir comprando
            </Link>
            <button
              onClick={handleClearAll}
              style={{
                ...styles.linkButton,
                backgroundColor: '#ff4444'
              }}
            >
              Limpiar Favoritos
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Favorite;
