import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import ProductCard from './ejemplos/ProductCard.jsx'
import TwitterCard from './ejemplos/TwitterFollowCard.jsx'
import Video from './ejemplos/Video.jsx'
import OnOff from './ejemplos/OnOff.jsx'
import Card from './ejemplos/Card.jsx'
import testObj from './test_obj.json';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* Mapeo de productos */}
    {testObj.productos.map(producto => (
      <Card 
        key={producto.id}
        userName={producto.nombre}
        imgLink={producto.imgLink}
        formatUserName={(name) => name.toUpperCase()}
      >
        <h4>{producto.nombre}</h4>
        <p>{producto.descripcion}</p>
        <p style={{ fontSize: '20px', fontWeight: 'bold', color: '#00a650' }}>
          ${producto.precio}
        </p>
        <p></p>
      </Card>
    ))}
  </StrictMode>,
)