import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useFavorites } from '../../hooks/useContext/FavoriteProvider'
import './Card.css';

const Card = ({ 
  children, 
  userName, 
  onFollow = 'false', 
  numeroImg, 
  imgLink, 
  formatUserName,
  id, // Añade el id del producto
  producto // Opcional: pasar todo el objeto producto
}) => {
  const normalizeImageUrl = (value) => {
    if (!value) return '/icons.svg';
    if (/^https?:\/\//i.test(value) || value.startsWith('data:')) {
      return value;
    }

    return `http://localhost:8080/${value.replace(/^\/+/, '')}`;
  };
  const [isFollowing, setIsFollowing] = useState(false);
  const navigate = useNavigate();

  const { addToFavorite, removeFavorite, isFavorite } = useFavorites();

  const productId = id ?? producto?.id; // Identificamos el ID de forma segura
  const esFav = isFavorite(productId); // Verificamos si este producto específico ya es favorito
  
// Reconstruimos el objeto producto por si de arriba solo te pasan props sueltas
  const infoProducto = producto || { id: productId, nombre: children, foto: imgLink }; // Esto asegura que la lista de favoritos tenga datos para mostrar

  const handleFollow = (e) => {
    e.stopPropagation(); // Evita que el click en el botón navegue al detalle
    setIsFollowing(!isFollowing);
    // Aquí puedes agregar la lógica para añadir al carrito
    console.log(isFollowing ? 'Sacar del carrito' : 'Añadir al carrito');
  };

  const handleFavoriteClick = (e) => {
    e.stopPropagation(); // CRUCIAL: Evita que al tocar el corazón se abra el detalle del producto
    if (esFav) {
      removeFavorite(productId);
    } else {
      addToFavorite(infoProducto);
    }
  };

  const handleCardClick = () => {
    const productId = id ?? producto?.id;
    if (productId) {
      navigate(`/producto/${productId}`);
    }
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
          <div className="card__title">{children}</div>
          <p className="card__username">
            {formatUserName ? formatUserName(userName) : userName}
          </p>
        </div>
        {/* --- SECCIÓN DE FAVORITOS CENTRADA CON FLEXBOX --- */}
        <div className="card__favorite-container" style={{ 
          display: 'flex', 
          justifyContent: 'center', // Centra el botón horizontalmente
          alignItems: 'center',
          width: '100%', 
          margin: '8px 0' 
        }}>
          <button 
            type="button"
            className={`card__favorite-btn ${esFav ? 'is-fav' : ''}`}
            onClick={handleFavoriteClick}
            style={{
              width:'max-content', // Podés regular este porcentaje para darle el tamaño que más te guste
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
        {/* --------------------------------------------------------------------------- */}

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