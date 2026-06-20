import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addFavorite, removeFavorite } from '../store/slices/favoriteSlice';
import { addItemToCart, selectCartItems } from '../store/slices/cartSlice';
import './css/Card.css';

const Card = ({
  children,
  userName,
  id,
  producto
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const favorites = useSelector((state) => (state.favorite && state.favorite.items) || []);
  const cartItems = useSelector(selectCartItems);

  const productId = id ?? producto?.id;
  const esFav = favorites.some((item) => item.id === productId);
  const inCart = cartItems.some((item) => item.id === productId);
  const infoProducto = producto || { id: productId, nombre: userName, foto: producto?.foto };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    dispatch(addItemToCart({
      id: producto.id,
      nombre: producto.nombre,
      precio: producto.precio,
      foto: producto.foto || producto.imgLink || producto.imagen || producto.image || producto.img || null,
      cantidad: 1,
      stock: producto.stock ?? 99,
    }));
  };

const handleFavoriteClick = (e) => {
    e.stopPropagation(); 

    // Eliminamos la búsqueda del token
    const localUser = JSON.parse(localStorage.getItem("user") || localStorage.getItem("usuario") || "{}");
    const userId = localUser?.id || localUser?.usuario?.id || localUser?.user?.id;

    // Ahora solo validamos que exista el usuario
    if (!userId) {
      alert("Inicia sesion para marcar productos como favoritos");
      return;
    }

    if (esFav) {
      dispatch(removeFavorite(productId));
      // Petición a la BD para borrar
      if (userId) {
        fetch(`http://localhost:8080/api/usuarios/${userId}/favoritos/${productId}`, {
          method: 'DELETE',
          credentials: 'include' // Agregamos credentials y quitamos headers
        }).catch(err => console.error("Error BD al borrar favorito:", err));
      }
    } else {
      dispatch(addFavorite(infoProducto));
      // Petición a la BD para agregar
      if (userId) {
        fetch(`http://localhost:8080/api/usuarios/${userId}/favoritos/${productId}`, {
          method: 'POST',
          credentials: 'include' // Agregamos credentials y quitamos headers
        }).catch(err => console.error("Error BD al agregar favorito:", err));
      }
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

  const text = inCart ? 'En el Carrito' : 'Añadir al Carrito';
  const buttonClass = inCart ? 'card__button--following' : 'card__button--not-following';
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
            <span className="emoji-light">{esFav ? '❤️' : '🖤'}</span>
            <span className="emoji-dark">{esFav ? '❤️' : '🤍'}</span>
            <span>
              {esFav ? 'Quitar de favoritos' : 'Añadir a favoritos'}
            </span>
          </button>
        </div>

        <button
          className={`card__button ${buttonClass}`}
          onClick={handleAddToCart}
        >
          {text}
        </button>
      </div>
    </div>
  );
};

export default Card;