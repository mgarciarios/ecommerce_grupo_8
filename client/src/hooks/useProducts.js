import { useState, useCallback } from 'react';
import { productService } from '../api/productApi.js';

export const useProducts = () => {
  const [productos, setProductos] = useState([]);
  const [producto, setProducto] = useState(null);
  const [categorias, setCategorias] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

  // Cargar todos los productos
  const cargarProductos = useCallback(async () => {
    setCargando(true);
    setError(null);
    try {
      const data = await productService.getProductos();
      setProductos(data);
    } catch (err) {
      setError(err.message);
      console.error('Error al cargar productos:', err);
    } finally {
      setCargando(false);
    }
  }, []);

  // Cargar categorías
  const cargarCategorias = useCallback(async () => {
    setError(null);
    try {
      const data = await productService.getCategorias();
      setCategorias(data);
    } catch (err) {
      setError(err.message);
      console.error('Error al cargar categorías:', err);
    }
  }, []);

  // Cargar un producto por ID
  const cargarProductoById = useCallback(async (id) => {
    setCargando(true);
    setError(null);
    try {
      const data = await productService.getProductoById(id);
      setProducto(data);
      return data;
    } catch (err) {
      setError(err.message);
      console.error('Error al cargar producto:', err);
    } finally {
      setCargando(false);
    }
  }, []);

  // Crear producto
  const crearProducto = useCallback(async (productoData) => {
    setCargando(true);
    setError(null);
    try {
      const nuevoProducto = await productService.createProducto(productoData);
      setProductos((prev) => [...prev, nuevoProducto]);
      return nuevoProducto;
    } catch (err) {
      setError(err.message);
      console.error('Error al crear producto:', err);
      throw err;
    } finally {
      setCargando(false);
    }
  }, []);

  // Actualizar producto
  const actualizarProducto = useCallback(async (id, productoData) => {
    setCargando(true);
    setError(null);
    try {
      const productoActualizado = await productService.updateProducto(id, productoData);
      setProductos((prev) =>
        prev.map((p) => (p.id === id ? productoActualizado : p))
      );
      setProducto(productoActualizado);
      return productoActualizado;
    } catch (err) {
      setError(err.message);
      console.error('Error al actualizar producto:', err);
      throw err;
    } finally {
      setCargando(false);
    }
  }, []);

  // Eliminar producto
  const eliminarProducto = useCallback(async (id) => {
    setCargando(true);
    setError(null);
    try {
      await productService.deleteProducto(id);
      setProductos((prev) => prev.filter((p) => p.id !== id));
      if (producto?.id === id) {
        setProducto(null);
      }
    } catch (err) {
      setError(err.message);
      console.error('Error al eliminar producto:', err);
      throw err;
    } finally {
      setCargando(false);
    }
  }, [producto?.id]);

  // Limpiar estado
  const limpiar = useCallback(() => {
    setProducto(null);
    setError(null);
  }, []);

  return {
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
  };
};
