// productService.js - Servicio para gestionar productos

const API_BASE_URL = 'http://localhost:8080/api';

export const productService = {
  // Obtener todos los productos
  getProductos: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/productos`);
      if (!response.ok) {
        throw new Error('Error al obtener productos');
      }
      return await response.json();
    } catch (error) {
      console.error('Error en getProductos:', error);
      throw error;
    }
  },

  // Obtener un producto por ID
  getProductoById: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/productos/${id}`);
      if (!response.ok) {
        throw new Error(`Producto ${id} no encontrado`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error en getProductoById:', error);
      throw error;
    }
  },

  // Crear un nuevo producto
  createProducto: async (productoData) => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${API_BASE_URL}/productos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(productoData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Error al crear producto');
      }

      return await response.json();
    } catch (error) {
      console.error('Error en createProducto:', error);
      throw error;
    }
  },

  // Actualizar un producto
  updateProducto: async (id, productoData) => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${API_BASE_URL}/productos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(productoData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Error al actualizar producto');
      }

      return await response.json();
    } catch (error) {
      console.error('Error en updateProducto:', error);
      throw error;
    }
  },

  // Eliminar un producto
  deleteProducto: async (id) => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${API_BASE_URL}/productos/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Error al eliminar producto');
      }

      return await response.json();
    } catch (error) {
      console.error('Error en deleteProducto:', error);
      throw error;
    }
  },

  // Buscar productos por query
  searchProductos: async (query, categorias = []) => {
    try {
      const params = new URLSearchParams()
      params.append('query', query)
      categorias.forEach((cat) => params.append('categorias', cat))

      const response = await fetch(`${API_BASE_URL}/productos/search?${params.toString()}`)
      if (!response.ok) {
        throw new Error('Error al buscar productos')
      }
      const result = await response.json()
      return result.data ?? result
    } catch (error) {
      console.error('Error en searchProductos:', error)
      throw error
    }
  },

  // Obtener todas las categorías
  getCategorias: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/productos/categorias`);
      if (!response.ok) {
        throw new Error('Error al obtener categorías');
      }
      return await response.json();
    } catch (error) {
      console.error('Error en getCategorias:', error);
      throw error;
    }
  },
};
