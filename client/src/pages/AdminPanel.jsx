import { useState, useEffect } from 'react';
import ProductForm from '../components/ProductForm';
import ProductsTable from '../components/ProductsTable';
import { useProducts } from '../hooks/useProducts';
import './css/AdminPanel.css';

export default function AdminPanel() {
  const {
    productos,
    producto,
    categorias,
    cargando,
    error,
    cargarProductos,
    cargarCategorias,
    cargarProductoById,
    crearProducto,
    actualizarProducto,
    eliminarProducto,
    limpiar,
  } = useProducts();

  const [editando, setEditando] = useState(false);
  const [mensajeExito, setMensajeExito] = useState('');

  // Cargar datos al montar
  useEffect(() => {
    cargarProductos();
    cargarCategorias();
  }, []);

  // Mostrar mensaje de éxito
  const mostrarMensajeExito = (mensaje) => {
    setMensajeExito(mensaje);
    setTimeout(() => setMensajeExito(''), 3000);
  };

  // Manejar submit del formulario
  const handleSubmit = async (productoData, productoId) => {
    try {
      if (productoId) {
        // Actualizar
        await actualizarProducto(productoId, productoData);
        mostrarMensajeExito('Producto actualizado exitosamente');
      } else {
        // Crear
        await crearProducto(productoData);
        mostrarMensajeExito('Producto creado exitosamente');
      }
      limpiarFormulario();
    } catch (err) {
      console.error('Error al guardar producto:', err);
    }
  };

  // Manejar edición
  const handleEditar = async (id) => {
    await cargarProductoById(id);
    setEditando(true);
    // Scroll al formulario
    document.getElementById('formulario').scrollIntoView({ behavior: 'smooth' });
  };

  // Manejar eliminación
  const handleEliminar = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      try {
        await eliminarProducto(id);
        mostrarMensajeExito('Producto eliminado exitosamente');
      } catch (err) {
        console.error('Error al eliminar:', err);
      }
    }
  };

  // Limpiar formulario
  const limpiarFormulario = () => {
    limpiar();
    setEditando(false);
  };

  return (
    <div className="admin-panel">
      <div className="admin-container">
        <header className="admin-header">
          <h1>Panel de Administración</h1>
          <p>Gestión de Productos</p>
        </header>

        {error && <div className="error-banner">{error}</div>}

        {mensajeExito && <div className="success-banner">{mensajeExito}</div>}

        <div className="admin-content">
          {/* Sección del formulario */}
          <section className="form-section" id="formulario">
            <ProductForm
              onSubmit={handleSubmit}
              producto={editando ? producto : null}
              categorias={categorias}
            />
            {editando && (
              <button className="btn-cancelar" onClick={limpiarFormulario}>
                Cancelar Edición
              </button>
            )}
          </section>

          {/* Sección de tabla */}
          <section className="table-section">
            <div className="table-header">
              <h2>Productos Registrados</h2>
              <div className="table-info">
                {cargando ? (
                  <span className="cargando">Cargando...</span>
                ) : (
                  <span className="cantidad">Total: {productos.length} producto(s)</span>
                )}
              </div>
            </div>

            {productos.length > 0 ? (
              <ProductsTable
                productos={productos}
                onEditar={handleEditar}
                onEliminar={handleEliminar}
                cargando={cargando}
              />
            ) : (
              <div className="sin-productos">
                <p>No hay productos registrados aún. Crea uno nuevo.</p>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
