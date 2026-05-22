import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../css/components/Card.css';

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
  const [isFollowing, setIsFollowing] = useState(false);
  const navigate = useNavigate();

  const handleFollow = (e) => {
    e.stopPropagation(); // Evita que el click en el botón navegue al detalle
    setIsFollowing(!isFollowing);
    // Aquí puedes agregar la lógica para añadir al carrito
    console.log(isFollowing ? 'Sacar del carrito' : 'Añadir al carrito');
  };

  const handleCardClick = () => {
    // Navega al detalle del producto usando el id
    if (id) {
      navigate(`/producto/${id}`);
    }
  };

  const text = isFollowing ? 'Sacar del Carrito' : 'Añadir al Carrito';
  const buttonClass = isFollowing ? 'card__button--following' : 'card__button--not-following';

  return (
    <div className="card" onClick={handleCardClick}>
      <img src={imgLink} className="card__image" alt={userName || 'Producto'} />
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