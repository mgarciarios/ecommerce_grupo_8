import { useState, useEffect } from 'react';
import './ProductForm.css';

export default function ProductForm({ onSubmit, producto = null, categorias = [] }) {
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    stock: '',
    categoria: '',
  });

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
        categoria: producto.categoria?.id || '',
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
      const datosEnvio = {
        nombre: formData.nombre.trim(),
        descripcion: formData.descripcion.trim(),
        precio: parseFloat(formData.precio),
        stock: parseInt(formData.stock),
        categoriaId: formData.categoria,
      };

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
        />
        {errores.nombre && <span className="error-mensaje">{errores.nombre}</span>}
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
        />
        {errores.descripcion && <span className="error-mensaje">{errores.descripcion}</span>}
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
          />
          {errores.precio && <span className="error-mensaje">{errores.precio}</span>}
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
          />
          {errores.stock && <span className="error-mensaje">{errores.stock}</span>}
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
        >
          <option value="">Selecciona una categoría</option>
          {categorias.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.nombre}
            </option>
          ))}
        </select>
        {errores.categoria && <span className="error-mensaje">{errores.categoria}</span>}
      </div>

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
