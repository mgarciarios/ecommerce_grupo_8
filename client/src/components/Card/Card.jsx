import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFavorites } from '../../hooks/useContext/FavoriteProvider';
import './Card.css';

const Card = ({ 
  children, 
  userName, 
  id, 
  producto 
}) => {
  const navigate = useNavigate();
  const { addToFavorite, removeFavorite, isFavorite } = useFavorites();
  const [isFollowing, setIsFollowing] = useState(false);

  const productId = id ?? producto?.id; 
  const esFav = isFavorite(productId); 
  const infoProducto = producto || { id: productId, nombre: userName, foto: producto?.foto };

  const handleFollow = (e) => {
    e.stopPropagation(); 
    setIsFollowing(!isFollowing);
    console.log(isFollowing ? 'Sacar del carrito' : 'Añadir al carrito');
  };

  const handleFavoriteClick = (e) => {
    e.stopPropagation(); 
    if (esFav) {
      removeFavorite(productId);
    } else {
      addToFavorite(infoProducto);
    }
  };

  const handleCardClick = () => {
    if (productId) navigate(`/producto/${productId}`);
  };

  const normalizeImageUrl = (value) => {
    if (!value) return '/icons.svg';
    if (/^https?:\/\//i.test(value) || value.startsWith('data:')) return value;
    return `http://localhost:8080/${value.replace(/^\/+/, '')}`;
  };

  const text = isFollowing ? 'Sacar del Carrito' : 'Añadir al Carrito';
  const buttonClass = isFollowing ? 'card__button--following' : 'card__button--not-following';
  const imageSrc = normalizeImageUrl(producto?.foto);

  return (
    <div className="card" onClick={handleCardClick}>
      <img
        src={imageSrc}
        className="card__image"
        alt={userName || 'Producto'}
        onError={(e) => {
          e.currentTarget.onerror = null;
          e.currentTarget.src = '/icons.svg';
        }}
      />
      
      <div className="card__info">
        <div className="card__content">
          {/* Bloque superior para título y descripción */}
          <div className="card__text-block">
            {children}
          </div>
          
          {/* El precio con su clase única e independiente */}
          <div className="card__price">
            {producto?.precio ? `$${producto.precio}` : '$0.00'}
          </div>
        </div>
        
        {/* Contenedor de Favoritos */}
        <div className="card__favorite-container">
          <button 
            type="button"
            className={`card__favorite-btn ${esFav ? 'is-fav' : ''}`}
            onClick={handleFavoriteClick}
            style={{
              width: 'max-content', 
              padding: '8px 12px',
              borderRadius: '6px',
              fontSize: '0.6rem',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'all 0.3s ease',
              background: esFav ? '#ffebee' : 'transparent',
              color: esFav ? '#c62828' : '#000000',
              border: esFav ? '2px solid #ef5350' : '2px solid #333333',
            }}
            onMouseEnter={(e) => {
              if (!esFav) e.currentTarget.style.background = 'rgba(0, 0, 0, 0.05)';
            }}
            onMouseLeave={(e) => {
              if (!esFav) e.currentTarget.style.background = 'transparent';
            }}
          >
            <span>{esFav ? '❤️' : '🖤'}</span>
            <span>
              {esFav ? 'Quitar de favoritos' : 'Añadir a favoritos'}
            </span>
          </button>
        </div>

        <button 
          className={`card__button ${buttonClass}`} 
          onClick={handleFollow}
        >
          {text}
        </button>
      </div>
    </div>
  );
};

export default Card;