import React from 'react';
import { useState } from 'react';
import './Card.css'; // Optional: Add styles for the card

const Card = ({ children, userName, onFollow='false', numeroImg, imgLink,formatUserName }) => {
    const [isFollowing, setIsFollowing] = useState(false);
    const [count, setCount] = useState(0);

    const handleFollow = () => {
        setIsFollowing(!isFollowing);
    }

    const text = isFollowing ? 'Sacar del Carrito' : 'Añadir al Carrito';
    const buttonStyle= isFollowing ? 'card__button--following' : 'card__button-not-following';

    return (
        <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            transition: 'transform 0.2s, box-shadow 0.2s',
            cursor: 'pointer',
            width: '280px',
            fontFamily: "'Proxima Nova', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
            margin: '12px'
        }}
        onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
        }}
        onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
        }}>
            <img src={`${imgLink}`} style={{
                width: '100%',
                height: '200px',
                objectFit: 'cover',
                backgroundColor: '#f5f5f5'
            }} />
            <div className="card__info" style={{
                padding: '16px'
            }}>
                <div className="card-title" style={{
                    fontSize: '18px',
                    fontWeight: '600',
                    color: '#333333',
                    marginBottom: '8px',
                    lineHeight: '1.3',
                    display: '-webkit-box',
                    WebkitLineClamp: 10,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                }}>{children}</div>
                <p className="card__username" style={{
                    fontSize: '14px',
                    color: '#00a650',
                    fontWeight: '500',
                    marginBottom: '12px',
                    marginTop: '4px'
                }}></p>
                <button className={buttonStyle} onClick={handleFollow} style={{
                    width: '100%',
                    padding: '10px 16px',
                    fontSize: '14px',
                    fontWeight: '600',
                    borderRadius: '6px',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s, transform 0.1s',
                    backgroundColor: isFollowing ? '#e6f7ee' : '#3483fa',
                    color: isFollowing ? '#00a650' : '#ffffff',
                    border: isFollowing ? '1px solid #00a650' : 'none'
                }}
                onMouseEnter={(e) => {
                    if (!isFollowing) {
                        e.currentTarget.style.backgroundColor = '#2968c8';
                    } else {
                        e.currentTarget.style.backgroundColor = '#d4f0e2';
                    }
                }}
                onMouseLeave={(e) => {
                    if (!isFollowing) {
                        e.currentTarget.style.backgroundColor = '#3483fa';
                    } else {
                        e.currentTarget.style.backgroundColor = '#e6f7ee';
                    }
                }}
                onMouseDown={(e) => {
                    e.currentTarget.style.transform = 'scale(0.98)';
                }}
                onMouseUp={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                }}>
                    {text}
                </button>
            </div>
        </div>  
    );
};

export default Card;