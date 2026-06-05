import React from 'react';
import { Link } from 'react-router-dom';
import defaultImage from '../assets/imgXdefault.jpg';

const CardProd = ({ product }) => {
  return (
    <Link 
      to={`/products/${product.id}`} 
      style={{ textDecoration: 'none', color: 'inherit' }}
    >
      <div style={{ 
        border: '1px solid #ddd',
        backgroundColor: 'lightblue',
        borderRadius: '8px',
        padding: '1rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
        transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
        cursor: 'pointer'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-5px)';
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}
      >
        <img 
          src={product.imagen || defaultImage}
          alt={product.nombre}
          style={{ 
            width: '100%',
            height: '200px',
            objectFit: 'cover',
            borderRadius: '4px'
          }}
        />
        <h3 style={{ margin: '0.5rem 0' }}>{product.nombre}</h3>
        <p style={{ color: '#2D3277', fontSize: '1.25rem', fontWeight: 'bold', margin: '0' }}>
          ${product.precio.toLocaleString('es-AR')}
        </p>
        <p style={{ color: '#666', margin: '0' }}>{product.descripcion}</p>
      </div>
    </Link>
  );
};

export default CardProd;