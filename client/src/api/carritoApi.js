const API_BASE_URL = 'http://localhost:8080/api/carrito';

export const carritoApi = {
  getCart: async (cartId) => {
    const response = await fetch(`${API_BASE_URL}/${cartId}`, {
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Error al cargar el carrito');
    return response.json();
  },

  addItem: async (cartId, productoId, cantidad) => {
    const response = await fetch(`${API_BASE_URL}/${cartId}/productos`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productoId, cantidad }),
    });
    if (!response.ok) {
      const errorMsg = await response.text();
      throw new Error(`Error ${response.status}: ${errorMsg || 'No autorizado'}`);
    }
  },

  removeItem: async (cartId, productId) => {
    const response = await fetch(`${API_BASE_URL}/${cartId}/productos/${productId}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    if (!response.ok) throw new Error(`Error ${response.status} al eliminar producto del carrito`);
  },

  reduceItem: async (cartId, productId, cantidad) => {
    await fetch(`${API_BASE_URL}/${cartId}/productos/${productId}/reduce?cantidad=${cantidad}`, {
      method: 'PUT',
      credentials: 'include',
    });
  },

  addOrIncrement: async (cartId, productoId, cantidad) => {
    const response = await fetch(`${API_BASE_URL}/${cartId}/productos`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productoId, cantidad }),
    });
    if (!response.ok) throw new Error(`Error ${response.status}`);
  },

  checkout: async (carritoId) => {
    const response = await fetch(`${API_BASE_URL}/${carritoId}/checkout`, {
      method: 'POST',
      credentials: 'include',
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.mensaje || errorData.message || 'Error al finalizar la compra');
    }
    return response.json();
  },

  clear: async (cartId) => {
    const response = await fetch(`${API_BASE_URL}/${cartId}/productos`, {
      method: 'DELETE',
      credentials: 'include',
    });
    if (!response.ok) throw new Error(`Error ${response.status} al vaciar el carrito`);
  },
};
