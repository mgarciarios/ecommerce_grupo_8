const API_BASE_URL = 'http://localhost:8080/api';

const readApiResponse = async (response) => {
  const json = await response.json().catch(() => null);
  if (json && typeof json === 'object' && 'data' in json) {
    return json.data;
  }
  return json;
};

export const productService = {
  getProductos: async () => {
    const response = await fetch(`${API_BASE_URL}/productos`, {
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Error al obtener productos');
    return response.json();
  },

  getProductoById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/productos/${id}`, {
      credentials: 'include',
    });
    if (!response.ok) throw new Error(`Producto ${id} no encontrado`);
    return response.json();
  },

  createProducto: async (productoData) => {
    const response = await fetch(`${API_BASE_URL}/productos`, {
      method: 'POST',
      credentials: 'include',
      body: productoData,
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Error al crear producto');
    }
    return readApiResponse(response);
  },

  updateProducto: async (id, productoData) => {
    const response = await fetch(`${API_BASE_URL}/productos/${id}`, {
      method: 'PUT',
      credentials: 'include',
      body: productoData,
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Error al actualizar producto');
    }
    return readApiResponse(response);
  },

  deleteProducto: async (id) => {
    const response = await fetch(`${API_BASE_URL}/productos/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Error al eliminar producto');
    }
    return readApiResponse(response);
  },

  searchProductos: async (query, categorias = []) => {
    const params = new URLSearchParams();
    params.append('query', query);
    categorias.forEach((cat) => params.append('categorias', cat));

    const response = await fetch(`${API_BASE_URL}/productos/search?${params.toString()}`, {
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Error al buscar productos');
    const result = await response.json();
    return result.data ?? result;
  },

  getCategorias: async () => {
    const response = await fetch(`${API_BASE_URL}/productos/categorias`, {
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Error al obtener categorías');
    return response.json();
  },
};