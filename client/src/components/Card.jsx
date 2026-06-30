import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addFavorite, removeFavorite } from '../store/slices/favoriteSlice';
import { addItemToCart, selectCartItems } from '../store/slices/cartSlice';
import { isAuthenticated } from '../utils/auth';
import { favoritosApi } from '../api/favoritosApi';
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
  const { user } = useSelector((state) => state.user); // Obtener usuario desde Redux

  const productId = id ?? producto?.id;
  const esFav = favorites.some((item) => item.id === productId);
  const inCart = cartItems.some((item) => item.id === productId);
  const isLoggedIn = isAuthenticated();
  const infoProducto = producto || { id: productId, nombre: userName, foto: producto?.foto };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (!isLoggedIn) {
      alert('Debes iniciar sesión para agregar productos al carrito.');
      navigate('/login');
      return;
    }

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
    const userId = user?.id; // Usar el ID del usuario desde Redux
 
    // Ahora solo validamos que exista el usuario
    if (!userId) {
      alert("Inicia sesion para marcar productos como favoritos");
      return;
    }

    if (esFav) {
      dispatch(removeFavorite(productId));
      if (userId) {
        favoritosApi.remove(userId, productId).catch(err => console.error("Error BD al borrar favorito:", err));
      }
    } else {
      dispatch(addFavorite(infoProducto));
      if (userId) {
        favoritosApi.add(userId, productId).catch(err => console.error("Error BD al agregar favorito:", err));
      }
    }
  };

  const handleCardClick = () => {
    if (productId) navigate(`/producto/${productId}`);
  };

  const normalizeImageUrl = (value) => {
    if (!value) return '/icons.svg';
    if (/^https?:\/\//i.test(value) || value.startsWith('data:') || value.startsWith('/')) return value;
    return `http://localhost:8080/${value.replace(/^\/+/, '')}`;
  };

  const text = inCart ? 'En el Carrito' : 'Agregar al carrito';
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
          disabled={inCart}
          title={!isLoggedIn ? 'Inicia sesión para agregar al carrito' : ''}
        >
          {text}
        </button>
      </div>
    </div>
  );
};

export default Card;