const API_BASE_URL = 'http://localhost:8080/api';

export const usuarioApi = {
  getById: async (userId) => {
    const response = await fetch(`${API_BASE_URL}/usuarios/${userId}`, {
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!response.ok) {
      throw new Error(`Error ${response.status} al obtener usuario`);
    }
    return response.json();
  },
};
