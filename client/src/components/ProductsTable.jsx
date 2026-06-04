import './css/ProductsTable.css';

export default function ProductsTable({ productos, onEditar, onEliminar, cargando }) {
  return (
    <div className="products-table-container">
      <table className="products-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Precio</th>
            <th>Stock</th>
            <th>Categoría</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productos.map((producto) => (
            <tr key={producto.id}>
              <td>{producto.id}</td>
              <td>
                <strong>{producto.nombre}</strong>
              </td>
              <td>
                <span className="descripcion-truncada">{producto.descripcion}</span>
              </td>
              <td>
                <span className="precio">${producto.precio.toFixed(2)}</span>
              </td>
              <td>
                <span className={`stock ${producto.stock < 10 ? 'bajo' : ''}`}>
                  {producto.stock}
                </span>
              </td>
              <td>{producto.categoria?.nombre || 'Sin categoría'}</td>
              <td className="acciones">
                <button
                  className="btn-accion btn-editar"
                  onClick={() => onEditar(producto.id)}
                  disabled={cargando}
                  title="Editar producto"
                >
                  ✏️
                </button>
                <button
                  className="btn-accion btn-eliminar"
                  onClick={() => onEliminar(producto.id)}
                  disabled={cargando}
                  title="Eliminar producto"
                >
                  🗑️
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
