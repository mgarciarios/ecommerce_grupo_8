const API_BASE_URL = 'http://localhost:8080/api';

export const favoritosApi = {
  getAll: async (userId) => {
    const response = await fetch(`${API_BASE_URL}/usuarios/${userId}/favoritos`, {
      credentials: 'include',
    });
    if (!response.ok) return [];
    return response.json();
  },

  add: async (userId, productId) => {
    const response = await fetch(`${API_BASE_URL}/usuarios/${userId}/favoritos/${productId}`, {
      method: 'POST',
      credentials: 'include',
    });
    if (!response.ok) {
      throw new Error(`Error ${response.status} al agregar favorito`);
    }
  },

  remove: async (userId, productId) => {
    const response = await fetch(`${API_BASE_URL}/usuarios/${userId}/favoritos/${productId}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    if (!response.ok) {
      throw new Error(`Error ${response.status} al quitar favorito`);
    }
  },
};
