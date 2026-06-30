const API_BASE_URL = 'http://localhost:8080/api';

const handleResponse = async (response) => {
  const text = await response.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    data = { message: text || 'Error del servidor' };
  }
  if (!response.ok) {
    throw new Error(data.message || `Error ${response.status}`);
  }
  return data;
};

export const authApi = {
  login: async (mail, password) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mail, password }),
    });
    return handleResponse(response);
  },

  register: async (data) => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  changePassword: async (oldPassword, newPassword, confirmPassword) => {
    const response = await fetch(`${API_BASE_URL}/auth/change-password`, {
      method: 'PUT',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ oldPassword, newPassword, confirmPassword }),
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Error al cambiar la contraseña');
    }
    return response.text();
  },

  logout: async () => {
    const response = await fetch(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
      credentials: 'include', // Esencial para que el navegador envíe la cookie que se va a invalidar
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Error al cerrar sesión');
    }
    return response.text();
  },
};
