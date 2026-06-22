const API_BASE_URL = 'http://localhost:8080/api';

export const pedidoApi = {
  getByUsuario: async (userId) => {
    const response = await fetch(`${API_BASE_URL}/pedidos/usuario/${userId}`, {
      credentials: 'include',
    });
    if (!response.ok) throw new Error(`Error ${response.status}`);
    return response.json();
  },
};
