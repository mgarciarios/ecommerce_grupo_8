import { useState, useEffect } from 'react';
import './css/ProductForm.css';

export default function ProductForm({ onSubmit, producto = null, categorias = [] }) {
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    stock: '',
    categoria: '',
  });

  const [imagen, setImagen] = useState(null);
  const [detalleImagenes, setDetalleImagenes] = useState([]);
  const [errores, setErrores] = useState({});
  const [enviando, setEnviando] = useState(false);

  // Si está editando, cargar datos del producto
  useEffect(() => {
    if (producto) {
      setFormData({
        nombre: producto.nombre || '',
        descripcion: producto.descripcion || '',
        precio: producto.precio || '',
        stock: producto.stock || '',
        categoria: producto.categorias?.[0] || '',
      });
    }
  }, [producto]);

  // Validaciones
  const validar = () => {
    const nuevosErrores = {};

    if (!formData.nombre.trim()) {
      nuevosErrores.nombre = 'El nombre es obligatorio';
    } else if (formData.nombre.length < 3) {
      nuevosErrores.nombre = 'El nombre debe tener al menos 3 caracteres';
    }

    if (!formData.descripcion.trim()) {
      nuevosErrores.descripcion = 'La descripción es obligatoria';
    } else if (formData.descripcion.length < 10) {
      nuevosErrores.descripcion = 'La descripción debe tener al menos 10 caracteres';
    }

    if (!formData.precio) {
      nuevosErrores.precio = 'El precio es obligatorio';
    } else if (parseFloat(formData.precio) <= 0) {
      nuevosErrores.precio = 'El precio debe ser mayor a 0';
    }

    if (!formData.stock) {
      nuevosErrores.stock = 'El stock es obligatorio';
    } else if (parseInt(formData.stock) < 0) {
      nuevosErrores.stock = 'El stock no puede ser negativo';
    }

    if (!formData.categoria) {
      nuevosErrores.categoria = 'Debes seleccionar una categoría';
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  // Manejar cambios en los inputs
  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Limpiar error del campo cuando empieza a escribir
    if (errores[name]) {
      setErrores((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  // Manejar submit
  const manejarSubmit = async (e) => {
    e.preventDefault();

    if (!validar()) {
      return;
    }

    setEnviando(true);

    try {
      const datosEnvio = new FormData();
      datosEnvio.append('nombre', formData.nombre.trim());
      datosEnvio.append('descripcion', formData.descripcion.trim());
      datosEnvio.append('precio', parseFloat(formData.precio));
      datosEnvio.append('stock', parseInt(formData.stock));
      datosEnvio.append('categorias', formData.categoria);
      if (imagen) {
        datosEnvio.append('mainFoto', imagen);
      }
      if (detalleImagenes.length > 0) {
        detalleImagenes.forEach((img) => datosEnvio.append('detalleFotos', img));
      }

      await onSubmit(datosEnvio, producto?.id);
    } catch (error) {
      console.error('Error al enviar formulario:', error);
      setErrores({ general: 'Error al procesar el formulario' });
    } finally {
      setEnviando(false);
    }
  };

  // Limpiar formulario
  const limpiarFormulario = () => {
    setFormData({
      nombre: '',
      descripcion: '',
      precio: '',
      stock: '',
      categoria: '',
    });
    setImagen(null);
    setDetalleImagenes([]);
    setErrores({});
  };

  return (
    <form className="product-form" onSubmit={manejarSubmit}>
      <h2>{producto ? 'Editar Producto' : 'Crear Nuevo Producto'}</h2>

      {errores.general && <div className="error-general">{errores.general}</div>}

      <div className="form-group">
        <label htmlFor="nombre">Nombre del Producto *</label>
        <input
          type="text"
          id="nombre"
          name="nombre"
          value={formData.nombre}
          onChange={manejarCambio}
          placeholder="Ej: Laptop Dell"
          className={errores.nombre ? 'input-error' : ''}
          aria-invalid={Boolean(errores.nombre)}
          aria-describedby={errores.nombre ? 'nombre-error' : undefined}
        />
        {errores.nombre && <span id="nombre-error" className="error-mensaje">{errores.nombre}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="descripcion">Descripción *</label>
        <textarea
          id="descripcion"
          name="descripcion"
          value={formData.descripcion}
          onChange={manejarCambio}
          placeholder="Describe el producto en detalle"
          rows="4"
          className={errores.descripcion ? 'input-error' : ''}
          aria-invalid={Boolean(errores.descripcion)}
          aria-describedby={errores.descripcion ? 'descripcion-error' : undefined}
        />
        {errores.descripcion && <span id="descripcion-error" className="error-mensaje">{errores.descripcion}</span>}
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="precio">Precio ($) *</label>
          <input
            type="number"
            id="precio"
            name="precio"
            value={formData.precio}
            onChange={manejarCambio}
            placeholder="0.00"
            step="0.01"
            min="0"
            className={errores.precio ? 'input-error' : ''}
            aria-invalid={Boolean(errores.precio)}
            aria-describedby={errores.precio ? 'precio-error' : undefined}
          />
          {errores.precio && <span id="precio-error" className="error-mensaje">{errores.precio}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="stock">Stock *</label>
          <input
            type="number"
            id="stock"
            name="stock"
            value={formData.stock}
            onChange={manejarCambio}
            placeholder="0"
            min="0"
            className={errores.stock ? 'input-error' : ''}
            aria-invalid={Boolean(errores.stock)}
            aria-describedby={errores.stock ? 'stock-error' : undefined}
          />
          {errores.stock && <span id="stock-error" className="error-mensaje">{errores.stock}</span>}
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="categoria">Categoría *</label>
        <select
          id="categoria"
          name="categoria"
          value={formData.categoria}
          onChange={manejarCambio}
          className={errores.categoria ? 'input-error' : ''}
          aria-invalid={Boolean(errores.categoria)}
          aria-describedby={errores.categoria ? 'categoria-error' : undefined}
        >
          <option value="">Selecciona una categoría</option>
          {categorias.map((cat) => (
            <option key={cat.id} value={cat.nombre}>
              {cat.nombre}
            </option>
          ))}
        </select>
        {errores.categoria && <span id="categoria-error" className="error-mensaje">{errores.categoria}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="imagen">
          {producto?.foto ? 'Cambiar imagen del Producto' : 'Imagen del Producto'}
        </label>
        <input
          type="file"
          id="imagen"
          name="imagen"
          accept="image/jpeg,image/png,image/gif,image/webp"
          onChange={(e) => setImagen(e.target.files[0] || null)}
        />
        {producto?.foto && !imagen && (
          <img
            src={producto.foto.startsWith('http') ? producto.foto : `http://localhost:8080${producto.foto}`}
            alt={producto.nombre}
            style={{ maxWidth: '200px', marginTop: '8px', borderRadius: '6px' }}
          />
        )}
        {imagen && (
          <img
            src={URL.createObjectURL(imagen)}
            alt="Vista previa"
            style={{ maxWidth: '200px', marginTop: '8px', borderRadius: '6px' }}
          />
        )}
      </div>

      {(producto?.foto || imagen) && (
        <div className="form-group">
          <label htmlFor="detalleImagenes">Imágenes adicionales</label>
          <input
            type="file"
            id="detalleImagenes"
            name="detalleImagenes"
            accept="image/jpeg,image/png,image/gif,image/webp"
            multiple
            onChange={(e) => {
              const nuevos = Array.from(e.target.files || []);
              setDetalleImagenes((prev) => [...prev, ...nuevos]);
              e.target.value = '';
            }}
          />
          {detalleImagenes.length > 0 && (
            <div style={{ display: 'flex', gap: '8px', marginTop: '8px', flexWrap: 'wrap' }}>
              {detalleImagenes.map((img, i) => (
                <div key={i} style={{ position: 'relative', display: 'inline-block' }}>
                  <img
                    src={URL.createObjectURL(img)}
                    alt={`Detalle ${i + 1}`}
                    style={{ maxWidth: '100px', borderRadius: '6px' }}
                  />
                  <button
                    type="button"
                    onClick={() => setDetalleImagenes((prev) => prev.filter((_, idx) => idx !== i))}
                    style={{
                      position: 'absolute',
                      top: '-6px',
                      right: '-6px',
                      background: '#ff4444',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '50%',
                      width: '20px',
                      height: '20px',
                      fontSize: '12px',
                      cursor: 'pointer',
                      lineHeight: '1',
                    }}
                    aria-label={`Quitar detalle ${i + 1}`}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="form-botones">
        <button type="submit" className="btn btn-primary" disabled={enviando}>
          {enviando ? 'Guardando...' : producto ? 'Actualizar Producto' : 'Crear Producto'}
        </button>
        <button type="button" className="btn btn-secundario" onClick={limpiarFormulario}>
          Limpiar
        </button>
      </div>
    </form>
  );
}
