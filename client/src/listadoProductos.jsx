import './index.css'
import Card from './ejemplos/Card.jsx'
import testObj from './test_obj.json'

export default function ListadoProductos() {
  return (
    <main>
      <h1>Listado de Productos</h1>
      <div className="product-list">
        {testObj.productos.map((producto) => (
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
          </Card>
        ))}
      </div>
    </main>
  )
}