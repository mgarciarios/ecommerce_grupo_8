import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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

  const handleFollow = (e) => {
    e.stopPropagation(); // Evita que el click en el botón navegue al detalle
    setIsFollowing(!isFollowing);
    // Aquí puedes agregar la lógica para añadir al carrito
    console.log(isFollowing ? 'Sacar del carrito' : 'Añadir al carrito');
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