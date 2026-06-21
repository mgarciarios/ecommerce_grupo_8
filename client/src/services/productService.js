// productService.js - Servicio para gestionar productos
// NUEVO: Ya no necesitamos importar store ni getToken porque el token viaja en la cookie
// import { store } from '../store';
// import { getToken as getStoredToken } from '../utils/auth';

const API_BASE_URL = 'http://localhost:8080/api';

// NUEVO: Eliminamos la función getToken() por completo

const readApiResponse = async (response) => {
  const json = await response.json().catch(() => null);
  if (json && typeof json === 'object' && 'data' in json) {
    return json.data;
  }
  return json;
};

export const productService = {
  // Obtener todos los productos (Ruta pública, puede o no llevar credenciales, pero las incluimos por si acaso)
  getProductos: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/productos`, {
        // NUEVO: Le dice al navegador que envíe las cookies (incluida nuestra cookie HttpOnly 'jwt')
        credentials: 'include' 
      });
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
      const response = await fetch(`${API_BASE_URL}/productos/${id}`, {
        credentials: 'include' // NUEVO
      });
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
      // NUEVO: Ya no obtenemos el token de Redux/localStorage
      
      const response = await fetch(`${API_BASE_URL}/productos`, {
        method: 'POST',
        credentials: 'include',
        body: productoData, // FormData — browser sets Content-Type to multipart/form-data
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Error al crear producto');
      }

      return await readApiResponse(response);
    } catch (error) {
      console.error('Error en createProducto:', error);
      throw error;
    }
  },

  // Actualizar un producto
  updateProducto: async (id, productoData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/productos/${id}`, {
        method: 'PUT',
        credentials: 'include',
        body: productoData, // FormData — browser sets Content-Type to multipart/form-data
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Error al actualizar producto');
      }

      return await readApiResponse(response);
    } catch (error) {
      console.error('Error en updateProducto:', error);
      throw error;
    }
  },

  // Eliminar un producto
  deleteProducto: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/productos/${id}`, {
        method: 'DELETE',
        credentials: 'include', // NUEVO
        // NUEVO: No hacen falta headers de autorización manuales
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Error al eliminar producto');
      }

      return await readApiResponse(response);
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

      const response = await fetch(`${API_BASE_URL}/productos/search?${params.toString()}`, {
        credentials: 'include' // NUEVO
      })
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
      const response = await fetch(`${API_BASE_URL}/productos/categorias`, {
        credentials: 'include' // NUEVO
      });
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